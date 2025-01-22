/* eslint-disable func-names */
/* eslint-disable compat/compat */
/* eslint-disable max-len */
import localeMap from '../../scripts/maps/localeMap.js';
import { loadPlaceholders, setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const COMMENTS_MAX_LENGTH = 500;
const COMMENTS_MAX_LENGTH_ALLOWED = 10000;
const SHOW_COMMENTS_TRESHOLD = 5;
const ASSET_TYPE = 'ADOBE_COM';
const RNR_API_URL = (function () {
  if (
    window.location.hostname === 'main--dc--adobecom.hlx.page'
    || window.location.hostname === 'main--dc--adobecom.hlx.live'
    || window.location.hostname === 'www.adobe.com'
  ) return 'https://rnr.adobe.io/v1';
  return 'https://rnr-stage.adobe.io/v1';
}());

// #endregion

// #region Snapshot

const snapshot = (function () {
  const localSnapshot = localStorage.getItem('rnr-snapshot');
  if (!localSnapshot) return null;
  return JSON.parse(localSnapshot);
}());

function createSnapshot(rating, currentAverage, currentVotes) {
  const newVotes = currentVotes + 1;
  const newAverage = (currentAverage * currentVotes + rating) / newVotes;
  localStorage.setItem(
    'rnr-snapshot',
    JSON.stringify({
      rating,
      average: newAverage,
      votes: newVotes,
    }),
  );
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
  metadata.verb = options.verb;
}

// #endregion

// #region Data

const rnrData = (function () {
  const data = { average: 5, votes: 0 };
  if (snapshot) {
    data.average = snapshot.average;
    data.votes = snapshot.votes;
  }
  return data;
}());

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
    const headers = {
      Accept: 'application/vnd.adobe-review.review-overall-rating-v1+json',
      'x-api-key': 'ffc-addon-service',
      Authorization: window.adobeIMS.getAccessToken()?.token,
    };

    const response = await fetch(
      `${RNR_API_URL}/ratings?assetType=${ASSET_TYPE}&assetId=${metadata.verb}`,
      { headers },
    );

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
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
    window.lana?.log(`Could not load review data: ${error?.message}`);
  }
}

async function postReview(data) {
  try {
    // Get locale
    const languageFromPath = window.location.pathname.split('/')[1];
    const locale = localeMap[languageFromPath] || 'en-us';

    const body = JSON.stringify({
      assetType: ASSET_TYPE,
      assetId: metadata.verb,
      rating: data.rating,
      text: data.comments,
      authorName: window.adobeIMS.getUserProfile?.call()?.name || 'Anonymous',
      assetMetadata: { locale },
    });
    const headers = {
      Accept: 'application/vnd.adobe-review.review-data-v1+json',
      'Content-Type': 'application/vnd.adobe-review.review-request-v1+json',
      'x-api-key': 'rnr-client',
      Authorization: window.adobeIMS.getAccessToken()?.token,
    };

    const response = await fetch(`${RNR_API_URL}/reviews`, { method: 'POST', body, headers });

    if (response.ok) return;

    const res = await response.json();
    throw new Error(res.message);
  } catch (error) {
    window.lana?.log(`Could not post review: ${error?.message}`);
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
      if (!['ArrowLeft', 'ArrowRight', 'Enter'].includes(ev.code)) return;
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
    });
  });

  // #endregion
}

function initCommentsFieldset(fieldset) {
  const textarea = createTag('textarea', {
    class: 'rnr-comments',
    name: 'comments',
    'aria-label': window.mph['rnr-comments-label'] || '',
    cols: 40,
    maxLength: metadata.commentsMaxLength,
    placeholder: window.mph['rnr-comments-placeholder'] || '',
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

  fieldset.append(textarea, footerContainer);
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
    { class: 'rnr-thank-you' },
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
      window.lana?.log(`Invalid rating ${formData.get('rating')}`);
      return;
    }

    createSnapshot(data.rating, rnrData.average, rnrData.votes);

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
  extractMetadata(options);
  // Get verb from meta
  if (!metadata.verb) {
    window.lana?.log('Verb not configured for the rnr widget');
  }
  preloadIcons();
  await loadPlaceholders();
  await loadRnrData();
  initControls(element);
}
