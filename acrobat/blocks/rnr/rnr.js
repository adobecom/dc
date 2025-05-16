/* eslint-disable func-names */
/* eslint-disable compat/compat */
/* eslint-disable max-len */
import localeMap from '../../scripts/maps/localeMap.js';
import { loadPlaceholders, setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const isProd = [
  'www.adobe.com',
  'sign.ing',
  'edit.ing',
].includes(window.location.hostname);

const COMMENTS_MAX_LENGTH = 500;
const COMMENTS_MAX_LENGTH_ALLOWED = 10000;
const SHOW_COMMENTS_TRESHOLD = 5;
const ASSET_TYPE = 'ADOBE_COM';
const RNR_API_URL = isProd ? 'https://rnr.adobe.io/v1' : 'https://rnr-stage.adobe.io/v1';
const RNR_API_KEY = 'dc-general';

// Errors, Analytics & Logging
const lanaOptions = {
  sampleRate: 100,
  tags: 'DC_Milo, RnR Block',
};

// #endregion

// #region Snapshot

let snapshot = null;

function retrieveSnapshot(verb) {
  const localSnapshotValue = localStorage.getItem('rnr-snapshot');
  if (!localSnapshotValue) return;
  const localSnapshot = JSON.parse(localSnapshotValue);
  snapshot = localSnapshot[verb] || null;
}

function createSnapshot(verb, rating, currentAverage, currentVotes) {
  const newVotes = currentVotes + 1;
  const newAverage = (currentAverage * currentVotes + rating) / newVotes;

  const localSnapshotValue = localStorage.getItem('rnr-snapshot');
  let newSnapshot = {};
  if (localSnapshotValue) newSnapshot = JSON.parse(localSnapshotValue);
  newSnapshot[verb] = {
    rating,
    average: newAverage,
    votes: newVotes,
  };

  localStorage.setItem('rnr-snapshot', JSON.stringify(newSnapshot));
}

// #endregion

// #region Extract metadata from options

const metadata = JSON.parse('{}');

const getOptions = (el) => {
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  return [...keyDivs].reduce((options, div) => {
    const valueDivText = div.nextElementSibling.textContent;
    const keyValueText = div.textContent.toLowerCase().replace(/ /g, '');
    options[keyValueText] = valueDivText;
    return options;
  }, {});
};

const removeOptionElements = (el) => {
  const children = el.querySelectorAll(':scope > div');
  children.forEach((child) => {
    child.remove();
  });
};

function processNumberOption(value, minValue, maxValue, defaultValue) {
  const numberValue = parseInt(value, 10);
  if (Number.isNaN(numberValue)) return defaultValue;
  if (numberValue < minValue) return minValue;
  if (numberValue > maxValue) return maxValue;
  return numberValue;
}

function extractMetadata(options) {
  metadata.verb = options.verb;
  metadata.hideTitleOnUninteractive = options.hidetitle ? options.hidetitle === 'true' : true;
  metadata.initialValue = snapshot
    ? snapshot.rating
    : processNumberOption(options.initialvalue, 0, 5, 0);
  metadata.commentsMaxLength = processNumberOption(
    options.commentsmaxlength,
    1,
    COMMENTS_MAX_LENGTH_ALLOWED,
    COMMENTS_MAX_LENGTH,
  );
  metadata.showCommentsThreshold = processNumberOption(
    options.commentsthreshold,
    0,
    5,
    SHOW_COMMENTS_TRESHOLD,
  );
  metadata.interactive = snapshot ? false : !options.interactive || options.interactive === 'true';
}

// #endregion

// #region IMS Helpers

const getImsToken = async (operation) => {
  try {
    const token = window.adobeIMS.getAccessToken()?.token;
    if (!token) {
      throw new Error(`Cannot ${operation} token is missing`);
    }
    return token;
  } catch (error) {
    window.lana.log(
      `RnR: ${error.message} for verb ${metadata.verb}`,
      lanaOptions,
    );
    return null;
  }
};

const waitForIms = (timeout = 1000) => new Promise((resolve) => {
  if (window.adobeIMS) {
    resolve(true);
    return;
  }
  setTimeout(() => resolve(!!window.adobeIMS), timeout);
});

const getAndValidateImsToken = async (operation) => {
  await waitForIms();
  const token = await getImsToken(operation);
  return token;
};

// #endregion

// #region Data

let rnrData = null;

function initData() {
  rnrData = { average: 5, votes: 0 };
  if (snapshot) {
    rnrData.average = snapshot.average;
    rnrData.votes = snapshot.votes;
  }
}

// #region Linked data

function setJsonLdProductInfo() {
  const getMetadata = (name) => {
    const attr = name && name.includes(':') ? 'property' : 'name';
    const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
    return meta && meta.content;
  };

  const name = getMetadata('product-name');
  const description = getMetadata('product-description');
  if (!name) return;

  const linkedData = {
    name,
    description,
    '@type': 'Product',
    '@context': 'http://schema.org',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rnrData.average.toString(),
      ratingCount: rnrData.votes.toString(),
    },
  };

  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  const structuredDataText = JSON.stringify(linkedData);
  script.textContent = structuredDataText;
  document.head.appendChild(script);
}

// #endregion

async function loadRnrData() {
  try {
    const token = await getAndValidateImsToken('load review data');
    if (!token) return;

    const headers = {
      Accept: 'application/vnd.adobe-review.review-overall-rating-v1+json',
      'x-api-key': RNR_API_KEY,
      Authorization: token,
    };

    const response = await fetch(
      `${RNR_API_URL}/ratings?assetType=${ASSET_TYPE}&assetId=${metadata.verb}`,
      { headers },
    );

    if (!response.ok) {
      const res = await response.json();
      throw new Error(`Error ${response.status}: ${res.message}`);
    }
    const result = await response.json();
    if (!result) throw new Error(`Received empty ratings data for asset '${metadata.verb}'.`);
    const { overallRating, ratingHistogram } = result;
    if (!overallRating || !ratingHistogram) {
      throw new Error(`Missing aggregated rating data in response for asset '${metadata.verb}'.`);
    }
    rnrData.average = overallRating;
    rnrData.votes = Object.keys(ratingHistogram).reduce(
      (total, key) => total + ratingHistogram[key],
      0,
    );

    setJsonLdProductInfo();
  } catch (error) {
    window.lana.log(
      `RnR: Could not load review data for verb '${metadata.verb}': ${error?.message}`,
      lanaOptions,
    );
  }
}

async function postReview(data) {
  try {
    const token = await getAndValidateImsToken('post review');
    if (!token) return;

    // Get locale
    const languageFromPath = window.location.pathname.split('/')[1];
    const locale = localeMap[languageFromPath] || 'en-us';

    const body = JSON.stringify({
      assetType: ASSET_TYPE,
      assetId: metadata.verb,
      rating: data.rating,
      text: data.comments,
      authorName: window.adobeIMS?.getUserProfile?.call()?.name || 'Anonymous',
      assetMetadata: { locale },
    });

    const headers = {
      Accept: 'application/vnd.adobe-review.review-data-v1+json',
      'Content-Type': 'application/vnd.adobe-review.review-request-v1+json',
      'x-api-key': RNR_API_KEY,
      Authorization: token,
    };

    const response = await fetch(`${RNR_API_URL}/reviews`, { method: 'POST', body, headers });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(`Error ${response.status}: ${res.message}`);
    }
  } catch (error) {
    window.lana.log(
      `RnR: Could not post review for verb '${metadata.verb}': ${error?.message}`,
      lanaOptions,
    );
  }
}

// #endregion

// #region Init controls

function initRatingFielset(fieldset, rnrForm, showComments) {
  // Create legend
  const legend = createTag('legend', {}, window.mph['rnr-title'] || '');
  fieldset.append(legend);

  // Create rating inputs
  const stars = [];

  const ratingLabels = (window.mph['rnr-rating-tooltips'] || ',,,,')
    .split(',')
    .map((tooltip) => tooltip.trim());
  ratingLabels.forEach((label, index) => {
    const value = index + 1;

    const starLabels = (window.mph['rnr-rating-noun'] || ',').split(',').map((noun) => noun.trim());
    const starLabel = `${label} ${value} ${value === 1 ? starLabels[0] : starLabels[1]}`;
    const star = createTag('input', {
      'data-tooltip': label,
      name: 'rating',
      'aria-label': starLabel,
      type: 'radio',
      class: `tooltip${value <= metadata.initialValue ? ' is-active' : ''}`,
      'aria-checked': value <= metadata.initialValue ? 'true' : 'false',
      value: String(value),
    });
    if (!metadata.interactive) star.setAttribute('disabled', 'disabled');
    fieldset.appendChild(star);
    stars.push(star);
  });

  if (!metadata.interactive) return;

  let focusedRating = 0;
  let selectedRating = 0;

  const updateActiveStars = (currentActive) => {
    const target = currentActive || metadata.initialValue;
    stars.forEach((star) => {
      if (star.value <= target) star.classList.add('is-active');
      else star.classList.remove('is-active');
    });
  };

  let commentsShown = false;
  const selectRating = (value) => {
    const rating = parseInt(value, 10);
    selectedRating = rating;
    if (commentsShown) return;
    if (rating <= metadata.showCommentsThreshold) {
      showComments();
      commentsShown = true;
    } else {
      // form.submit() will not trigger the even handler
      rnrForm.dispatchEvent(new Event('submit'));
    }
  };

  // #region Fieldset event handlers

  fieldset.addEventListener('click', (ev) => {
    stars.forEach((star) => {
      if (star === ev.target) return;
      star.setAttribute('aria-checked', 'false');
    });
  });

  fieldset.addEventListener('mouseleave', () => {
    stars.forEach((star) => {
      star.classList.remove('is-hovering');
    });
    updateActiveStars(selectedRating || focusedRating);
  });

  fieldset.addEventListener('mousedown', () => {
    fieldset.setAttribute('data-is-mouse-down', true);
  });

  const handleEscapeKey = (ev) => {
    if (ev.code !== 'Escape') return;
    stars.forEach((star) => {
      star.classList.remove('is-hovering');
    });
  };
  document.addEventListener('keydown', handleEscapeKey);

  // #endregion

  // #region Individual input event handlers for selection, focus and hover

  stars.forEach((star) => {
    star.addEventListener('click', (ev) => {
      star.setAttribute('aria-checked', 'true');
      selectRating(ev.target.value);
    });

    star.addEventListener('focus', (ev) => {
      const isMouseDown = JSON.parse(fieldset.getAttribute('data-is-mouse-down'));
      const rating = parseInt(ev.target.value, 10);
      if (!isMouseDown) {
        star.classList.add('has-keyboard-focus');
      } else {
        fieldset.setAttribute('data-is-mouse-down', false);
      }
      star.classList.add('is-active');
      focusedRating = rating;
      updateActiveStars(rating);
    });

    star.addEventListener('blur', () => {
      star.classList.remove('has-keyboard-focus');
      focusedRating = 0;
      updateActiveStars(selectedRating);
    });

    star.addEventListener('mouseover', (ev) => {
      stars.forEach((s) => {
        s.classList.remove('is-hovering', 'has-keyboard-focus');
      });
      star.classList.add('is-hovering');
      const rating = parseInt(ev.target.value, 10);
      updateActiveStars(rating);
    });

    star.addEventListener('keydown', (ev) => {
      if (!['ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(ev.code)) return;
      ev.preventDefault();
      if (ev.code === 'ArrowLeft' && ev.target.value > 1) {
        stars[ev.target.value - 2].focus();
      }
      if (ev.code === 'ArrowRight' && ev.target.value < 5) {
        stars[ev.target.value].focus();
      }
      if (ev.code === 'Enter') {
        ev.target.click();
      }
      if (ev.code === 'Escape') {
        star.classList.remove('is-hovering', 'has-keyboard-focus');
      }
    });
  });

  // #endregion
}

function initCommentsFieldset(fieldset) {
  const labelText = window.mph['rnr-comments-placeholder'] || '';
  const label = createTag('label', {
    class: 'rnr-comments-label',
    for: 'rnr-comments-textarea',
  }, labelText);

  const textarea = createTag('textarea', {
    id: 'rnr-comments-textarea',
    class: 'rnr-comments',
    name: 'comments',
    'aria-label': labelText,
    cols: 40,
    maxLength: metadata.commentsMaxLength,
  });
  if (!metadata.interactive) textarea.setAttribute('disabled', 'disabled');

  const footerContainer = createTag('div', { class: 'rnr-comments-footer' });
  const characterCounter = createTag(
    'span',
    { class: 'rnr-comments-character-counter' },
    `${metadata.commentsMaxLength} / ${metadata.commentsMaxLength}`,
  );
  const submitTag = createTag('input', {
    class: 'rnr-comments-submit',
    type: 'submit',
    disabled: 'disabled',
    value: window.mph['rnr-submit-label'] || '',
  });

  footerContainer.append(characterCounter, submitTag);

  // Events
  footerContainer.addEventListener('click', () => {
    textarea.focus();
  });

  textarea.addEventListener('input', () => {
    const commentsLength = textarea.value.length;
    const newCounter = metadata.commentsMaxLength - commentsLength;
    characterCounter.textContent = `${newCounter} / ${metadata.commentsMaxLength}`;
    if (commentsLength > 0) submitTag.removeAttribute('disabled');
    else submitTag.setAttribute('disabled', 'disabled');
  });

  fieldset.append(label, textarea, footerContainer);
}

function initSummary(container) {
  const { average, votes } = rnrData;
  const outOf = 5;

  const voteLabels = (window.mph['rnr-rating-verb'] || ',').split(',').map((verb) => verb.trim());
  const votesLabel = votes === 1 ? voteLabels[0] : voteLabels[1];

  const averageTag = createTag(
    'span',
    { class: 'rnr-summary-average' },
    average.toFixed(1).replace('.0', ''),
  );
  const scoreSeparator = createTag('span', {}, '/');
  const outOfTag = createTag('span', { class: 'rnr-summary-outOf' }, outOf);
  const votesSeparator = createTag('span', {}, '-');
  const votesTag = createTag('span', { class: 'rnr-summary-votes' }, String(votes));
  const votesLabelTag = createTag('span', {}, votesLabel);

  container.append(averageTag, scoreSeparator, outOfTag, votesSeparator, votesTag, votesLabelTag);
}

function initControls(element) {
  const container = createTag('div', { class: 'rnr-container' });
  const title = createTag('h3', { class: 'rnr-title' }, window.mph['rnr-title'] || '');
  const form = createTag('form', { class: 'rnr-form' });
  const ratingFieldset = createTag('fieldset', { class: 'rnr-rating-fieldset' });
  const commentsFieldset = createTag('fieldset', { class: 'rnr-comments-fieldset' });
  const summaryContainer = createTag('div', { class: 'rnr-summary-container ' });
  const thankYou = createTag(
    'div',
    { class: 'rnr-thank-you', 'aria-live': 'assertive' },
    window.mph['rnr-thank-you-label'] || '',
  );

  // Submit
  const submit = (ev) => {
    ev.preventDefault();
    if (!metadata.interactive) return;

    const formData = new FormData(form);
    const data = {
      rating: parseInt(formData.get('rating'), 10),
      comments: formData.get('comments'),
    };

    if (!data.rating) {
      window.lana.log(`RnR: Invalid rating ${formData.get('rating')}`);
      return;
    }

    createSnapshot(metadata.verb, data.rating, rnrData.average, rnrData.votes);

    postReview(data);

    // Replace rnr with 'Thank you' message
    title.remove();
    form.remove();
    summaryContainer.remove();
    container.append(thankYou);
  };
  form.addEventListener('submit', submit);

  // Show comments
  const showComments = () => {
    form.insertBefore(commentsFieldset, null);
    const textarea = commentsFieldset.querySelector('textarea');
    textarea.focus();
  };

  // Init rating
  initRatingFielset(ratingFieldset, form, showComments);

  // Init comments
  initCommentsFieldset(commentsFieldset);

  // Init summary
  initSummary(summaryContainer);

  // Attach all elements
  form.append(ratingFieldset);
  // Show title if rnr is interactive or if explicitly configured as visible
  if (metadata.interactive || !metadata.hideTitleOnUninteractive) container.append(title);
  container.append(form, summaryContainer);
  element.append(container);
}

// #endregion

// Preload icons
function preloadIcons() {
  const icons = ['/acrobat/img/icons/star-outline.svg', '/acrobat/img/icons/star-filled.svg'];
  for (const iconPath of icons) {
    const img = new Image();
    img.src = iconPath;
  }
}

// Initialization function
export default async function init(element) {
  const options = getOptions(element);
  removeOptionElements(element);
  retrieveSnapshot(options.verb);
  extractMetadata(options);
  initData();
  // Get verb from meta
  if (!metadata.verb) {
    window.lana.log('RnR: Verb not configured for the rnr widget');
  }
  preloadIcons();
  await loadPlaceholders('rnr');
  await loadRnrData();
  initControls(element);
}
