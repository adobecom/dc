/* eslint-disable func-names */
/* eslint-disable compat/compat */
/* eslint-disable max-len */
import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const COMMENTS_MAX_LENGTH = 500;
const SHOW_COMMENTS_TRESHOLD = 5;
const RNR_API_URL = 'https://rnr-stage.adobe.io/v1';

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

const metadata = JSON.parse('{"labels":{}}');

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

function extractMetadata(options) {
  metadata.hideTitleOnUninteractive = options.hidetitle ? options.hidetitle === 'true' : true;
  metadata.initialValue = snapshot ? snapshot.rating : parseInt(options.initialvalue, 10) || 0;
  metadata.commentsMaxLength = parseInt(options.commentsmaxlength, 10) || COMMENTS_MAX_LENGTH;
  metadata.showCommentsThreshold = parseInt(options.commentsthreshold, 10) || SHOW_COMMENTS_TRESHOLD;
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

function loadRnrData() {
  const headers = {
    Accept: 'application/vnd.adobe-review.review-data-detailed-v1+json',
    'x-api-key': 'ffc-addon-service',
  };

  return fetch(`${RNR_API_URL}/reviews?assetType=ACROBAT&assetId=${metadata.verb}`, { headers })
    .then(async (result) => {
      if (!result.ok) {
        const res = await result.json();
        throw new Error(res.message);
      }
      return result.json();
    })
    .then(({ aggregatedRating }) => {
      rnrData.average = aggregatedRating.overallRating;
      rnrData.votes = Object.keys(aggregatedRating.ratingHistogram).reduce(
        (total, key) => total + aggregatedRating.ratingHistogram[key],
        0,
      );
      setJsonLdProductInfo();
    })
    .catch((error) => {
      window.lana?.log(`Could not load review data: ${error?.message}`);
    });
}

function postReview(data) {
  const body = JSON.stringify({
    assetType: 'ACROBAT',
    assetId: metadata.verb,
    rating: data.rating,
    text: data.comments,
    authorName: 'guest',
    assetMetadata: { version: 1.1 },
  });
  const headers = {
    Accept: 'application/vnd.adobe-review.review-data-v1+json',
    'Content-Type': 'application/vnd.adobe-review.review-request-v1+json',
    'x-api-key': 'rnr-client',
    Authorization: window.adobeIMS.getAccessToken()?.token,
  };

  fetch(`${RNR_API_URL}/reviews`, { method: 'POST', body, headers })
    .then(async (result) => {
      if (result.ok) return;
      const res = await result.json();
      throw new Error(res.message);
    })
    .catch((error) => {
      window.lana?.log(`Could not post review: ${error?.message}`);
    });
}

// #endregion

// #region Init controls

function initRatingFielset(fieldset, rnrForm, showComments) {
  // Create legend
  const legend = createTag('legend', {}, window.mph['rnr-title']);
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
  const selectRating = (value, triggeredByKeyboard = false) => {
    const rating = parseInt(value, 10);
    selectedRating = rating;
    if (commentsShown) return;
    if (rating <= metadata.showCommentsThreshold) {
      showComments(triggeredByKeyboard);
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
      // Click is triggered on arrow key press so a check for a 'real' click is needed
      if (ev.clientX !== 0 && ev.clientY !== 0) {
        // Real click
        selectRating(ev.target.value);
      }
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
      if (ev.code !== 'Enter') return;
      selectRating(ev.target.value, true);
    });
  });

  // #endregion
}

function initCommentsFieldset(fieldset) {
  const textarea = createTag('textarea', {
    class: 'rnr-comments',
    name: 'comments',
    'aria-label': window.mph['rnr-comments-label'],
    cols: 40,
    maxLength: metadata.commentsMaxLength,
    placeholder: window.mph['rnr-comments-placeholder'],
    readonly: 'readonly',
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
    value: window.mph['rnr-submit-label'],
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

  /* This is needed because when the comments area is shown after a rating selection by
   * keyboard (Enter) that 'Enter' keypress still counts as input for the newly focused
   * textarea. To prevent this, the textarea is readonly by default, and 'readonly' is
   * removed after the first keypress, or when the selection was done by mouse (see below)
   */
  function onTextareaKeyup(ev) {
    if (ev.code !== 'Enter') return;
    textarea.removeAttribute('readonly');
    textarea.removeEventListener('keyup', onTextareaKeyup);
  }
  textarea.addEventListener('keyup', onTextareaKeyup);

  fieldset.append(textarea, footerContainer);
}

function initSummary(container) {
  const { average, votes } = rnrData;
  const outOf = 5;

  const voteLabels = (window.mph['rnr-rating-verb'] || ',').split(',').map((verb) => verb.trim());
  const votesLabel = votes === 1 ? voteLabels[0] : voteLabels[1];

  const averageTag = createTag('span', { class: 'rnr-summary-average' }, String(average));
  const scoreSeparator = createTag('span', {}, '/');
  const outOfTag = createTag('span', { class: 'rnr-summary-outOf' }, outOf);
  const votesSeparator = createTag('span', {}, '-');
  const votesTag = createTag('span', { class: 'rnr-summary-votes' }, String(votes));
  const votesLabelTag = createTag('span', {}, votesLabel);

  container.append(averageTag, scoreSeparator, outOfTag, votesSeparator, votesTag, votesLabelTag);
}

function initControls(element) {
  const container = createTag('div', { class: 'rnr-container' });
  const title = createTag('h3', { class: 'rnr-title' }, window.mph['rnr-title']);
  const form = createTag('form', { class: 'rnr-form' });
  const ratingFieldset = createTag('fieldset', { class: 'rnr-rating-fieldset' });
  const commentsFieldset = createTag('fieldset', { class: 'rnr-comments-fieldset' });
  const summaryContainer = createTag('div', { class: 'rnr-summary-container ' });
  const thankYou = createTag('div', { class: 'rnr-thank-you' }, window.mph['rnr-thank-you-label']);

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
  const showComments = (triggeredByKeyboard) => {
    form.insertBefore(commentsFieldset, null);
    const textarea = commentsFieldset.querySelector('textarea');
    textarea.focus();
    if (!triggeredByKeyboard) textarea.removeAttribute('readonly');
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

// initialization function
export default async function init(element) {
  const options = getOptions(element);
  removeOptionElements(element);
  extractMetadata(options);
  // Get verb from meta
  if (!metadata.verb) {
    window.lana?.log('Verb not configured for the rnr widget');
  }
  await loadRnrData();
  initControls(element);
}
