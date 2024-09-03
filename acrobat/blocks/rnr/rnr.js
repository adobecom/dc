import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const COMMENTS_MAX_LENGTH = 500;
const SHOW_COMMENTS_TRESHOLD = 5;

// #endregion

const metadata = JSON.parse('{"labels":{}}');

// #region Extract metadata from options

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
  metadata.labels.commentFieldLabel = options.commentfieldlabel;
  metadata.labels.commentPlaceholder = options.commentplaceholder;
  metadata.labels.starLabels = (options.ratingnoun || ',').split(',').map((label) => label.trim());
  metadata.labels.voteLabels = (options.ratingverb || ',').split(',').map((label) => label.trim());
  metadata.labels.submitLabel = options.submittext;
  metadata.labels.thankYouLabel = options.thankyoutext;
  metadata.labels.title = options.title;
  metadata.labels.ratingLabels = (options.tooltips || ',,,,')
    .split(',')
    .map((label) => label.trim());
  metadata.maxRating = metadata.labels.ratingLabels.length;
  metadata.hideTitleOnUninteractive = options.hidetitle ? options.hidetitle === 'true' : true;
  metadata.initialValue = parseInt(options.initialvalue, 10) || 0;
  metadata.commentsMaxLength = parseInt(options.commentsmaxlength, 10) || COMMENTS_MAX_LENGTH;
  metadata.showCommentsThreshold = parseInt(options.commentsthreshold, 10)
    || SHOW_COMMENTS_TRESHOLD;
  metadata.interactive = options.interactive ? options.interactive === 'true' : true;
}

// #endregion

// #region Init controls

function initRatingFielset(fieldset, rnrForm, showComments) {
  // Create legend
  const legend = createTag('legend', {}, metadata.labels.title);
  fieldset.append(legend);

  // Create rating inputs
  const stars = [];

  metadata.labels.ratingLabels.forEach((label, index) => {
    const value = index + 1;
    const starLabel = `${label} ${value} ${value === 1 ? metadata.labels.starLabels[0] : metadata.labels.starLabels[1]}`;
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
    'aria-label': metadata.labels.commentFieldLabel,
    cols: 40,
    maxLength: metadata.commentsMaxLength,
    placeholder: metadata.labels.commentPlaceholder,
    readonly: '',
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
    value: metadata.labels.submitLabel,
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
    textarea.removeEventListener(onTextareaKeyup);
  }
  textarea.addEventListener('keyup', onTextareaKeyup);

  fieldset.append(textarea, footerContainer);
}

function initSummary(container) {
  const average = 4.2; // Get average
  const outOf = metadata.maxRating;
  const votes = 5130; // Get votes
  const votesLabel = votes === 1 ? metadata.labels.voteLabels[0] : metadata.labels.voteLabels[1];

  const averageTag = createTag('span', { class: 'rnr-summary-average' }, average);
  const scoreSeparator = createTag('span', {}, '/');
  const outOfTag = createTag('span', { class: 'rnr-summary-outOf' }, outOf);
  const votesSeparator = createTag('span', {}, '-');
  const votesTag = createTag('span', { class: 'rnr-summary-votes' }, votes);
  const votesLabelTag = createTag('span', {}, votesLabel);

  container.append(averageTag, scoreSeparator, outOfTag, votesSeparator, votesTag, votesLabelTag);
}

function initControls(element) {
  const container = createTag('div', { class: 'rnr-container' });
  const title = createTag('h3', { class: 'rnr-title' }, metadata.labels.title);
  const form = createTag('form', { class: 'rnr-form' });
  const ratingFieldset = createTag('fieldset', { class: 'rnr-rating-fieldset' });
  const commentsFieldset = createTag('fieldset', { class: 'rnr-comments-fieldset' });
  const summaryContainer = createTag('div', { class: 'rnr-summary-container ' });
  const thankYou = createTag('div', { class: 'rnr-thank-you' }, metadata.labels.thankYouLabel);

  // Submit
  const submit = (ev) => {
    ev.preventDefault();
    if (!metadata.interactive) return;
    const formData = new FormData(form);
    const input = {};
    formData.forEach((value, key) => {
      input[key] = value;
    });
    // TODO submit form
    // console.table(input);

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
  // console.log(metadata);
  initControls(element);
}
