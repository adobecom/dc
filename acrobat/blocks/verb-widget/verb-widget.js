import LIMITS from './limits.js';
import { setLibs } from '../../scripts/utils.js';
import verbAnalytics from '../../scripts/alloy/verb-widget.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// const handleError = (err, errTxt, str, strTwo) => {
//   err.classList.add('verb-error');
//   err.classList.remove('hide');
//   errTxt.textContent = `${window.mph[str]} ${strTwo || ''}`;

//   setTimeout(() => {
//     err.classList.remove('verb-error');
//     err.classList.add('hide');
//   }, 5000);

//   // Add LANA Logs and AA
// };

// This function is no longer needed, I'll remove after we get error event from Unity team.
// handleError() is will need to be uncommented out too.

// const sendToUnity = async (file, verb, err, errTxt) => {
//   // Error Check: File Empty
//   if (file.size < 1) {
//     verbAnalytics('error:step01:empty-file', verb);
//     handleError(err, errTxt, 'verb-widget-error-empty');
//   }

//   // Error Check: Supported File Type
//   if (LIMITS[verb].acceptedFiles.indexOf(file.type) < 0) {
//     verbAnalytics('error:step01:unsupported-file-type', verb);
//     handleError(err, errTxt, 'verb-widget-error-unsupported');
//     return;
//   }

//   // Error Check: File Too Large
//   if (file.size > LIMITS[verb].maxFileSize) {
//     verbAnalytics('error:step01:file-too-large', verb);
//     handleError(err, errTxt, 'verb-widget-error-large', LIMITS[verb].maxFileSizeFriendly);
//   }
// };

const setDraggingClass = (widget, shouldToggle) => {
  shouldToggle ? widget.classList.add('dragging') : widget.classList.remove('dragging');
};

export default async function init(element) {
  const children = element.querySelectorAll(':scope > div');
  const VERB = element.classList[1];
  const widgetHeading = createTag('h1', { class: 'verb-heading' }, children[0].textContent);
  let mobileLink = null;
  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    mobileLink = window.mph[`verb-widget-apple-${VERB}`];
  } else if (/android/i.test(window?.browser?.ua)) {
    mobileLink = window.mph[`verb-widget-google-${VERB}`];
  }

  children.forEach((child) => {
    child.remove();
  });

  const widget = createTag('div', { id: 'drop-zone', class: 'verb-wrapper' });
  const widgetContainer = createTag('div', { class: 'verb-container' });
  const widgetRow = createTag('div', { class: 'verb-row' });
  const widgetLeft = createTag('div', { class: 'verb-col' });
  const widgetRight = createTag('div', { class: 'verb-col right' });
  const widgetHeader = createTag('div', { class: 'verb-header' });
  const widgetIcon = createTag('div', { class: 'verb-icon' });
  const widgetTitle = createTag('div', { class: 'verb-title' }, 'Acrobat');
  const widgetCopy = createTag('p', { class: 'verb-copy' }, window.mph[`verb-widget-description-${VERB}`]);
  const widgetButton = createTag('label', { for: 'file-upload', class: 'verb-cta' }, window.mph['verb-widget-cta']);
  const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph['verb-widget-cta-mobile']);
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const widgetImage = createTag('img', { class: 'verb-image', src: children[1].querySelector('img')?.src });
  // Since we're using placeholders we need a solution for the hyperlinks
  const legal = createTag('p', { class: 'verb-legal' }, window.mph['verb-widget-legal']);
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const footer = createTag('div', { class: 'verb-footer' });

  const errorState = createTag('div', { class: 'hide' });
  const errorStateText = createTag('p', { class: 'verb-errorText' });
  const errorIcon = createTag('div', { class: 'verb-errorIcon' });
  const errorCloseBtn = createTag('div', { class: 'verb-errorBtn' });

  widget.append(widgetContainer);
  widgetContainer.append(widgetRow);
  widgetRight.append(widgetImage);
  widgetRow.append(widgetLeft, widgetRight);
  widgetHeader.append(widgetIcon, widgetTitle);
  errorState.append(errorIcon, errorStateText, errorCloseBtn);
  if (mobileLink && LIMITS[VERB].mobileApp) {
    widgetLeft.append(widgetHeader, widgetHeading, widgetCopy, errorState, widgetMobileButton);
  } else {
    widgetLeft.append(widgetHeader, widgetHeading, widgetCopy, errorState, widgetButton, button);
  }
  footer.append(iconSecurity, legal);

  element.append(widget, footer);

  verbAnalytics('landing:shown', VERB);

  button.addEventListener('click', () => {
    verbAnalytics('dropzone:choose-file-clicked', VERB);
  });

  button.addEventListener('change', (e) => {
    verbAnalytics('choose-file:open', VERB);
    e.target.value = '';
  });

  button.addEventListener('cancel', () => {
    verbAnalytics('choose-file:close', VERB);
  });

  widget.addEventListener('dragover', (e) => {
    e.preventDefault();
    setDraggingClass(widget, true);
  });

  widget.addEventListener('dragleave', () => {
    setDraggingClass(widget, false);
  });

  widget.addEventListener('drop', (e) => {
    e.preventDefault();
    verbAnalytics('files-dropped', VERB);
    setDraggingClass(widget, false);
  });

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });
}
