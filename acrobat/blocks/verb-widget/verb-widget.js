import LIMITS from './limits.js';
import { setLibs, getEnv, isOldBrowser } from '../../scripts/utils.js';
import verbAnalytics from '../../scripts/alloy/verb-widget.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const fallBack = 'https://www.adobe.com/go/acrobat-overview';
const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';

const verbRedirMap = {
  createpdf: 'createpdf',
  'crop-pages': 'crop',
  'delete-pages': 'deletepages',
  'extract-pages': 'extract',
  'combine-pdf': 'combine',
  'protect-pdf': 'protect',
  'add-comment': 'addcomment',
  'pdf-to-image': 'pdftoimage',
  'reorder-pages': 'reorderpages',
  sendforsignature: 'sendforsignature',
  'rotate-pages': 'rotatepages',
  fillsign: 'fillsign',
  'split-pdf': 'split',
  'insert-pdf': 'insert',
  'compress-pdf': 'compress',
  'png-to-pdf': 'jpgtopdf',
  'number-pages': 'number',
  'ocr-pdf': 'ocr',
  'chat-pdf': 'chat',
  'chat-pdf-student': 'study',
};

const setUser = () => {
  localStorage.setItem('unity.user', 'true');
};

const setDraggingClass = (widget, shouldToggle) => {
  // eslint-disable-next-line chai-friendly/no-unused-expressions
  shouldToggle ? widget.classList.add('dragging') : widget.classList.remove('dragging');
};

function prefetchNextPage(verb) {
  const ENV = getEnv();
  const isProd = ENV === 'prod';
  const nextPageHost = isProd ? 'acrobat.adobe.com' : 'stage.acrobat.adobe.com';
  const nextPageUrl = `https://${nextPageHost}/us/en/discover/${verb}`;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = nextPageUrl;
  link.crossOrigin = 'anonymous';
  link.as = 'document';
  document.head.appendChild(link);
}

function initiatePrefetch(verb) {
  if (!window.prefetchInitiated) {
    prefetchNextPage(verb);
    window.prefetchInitiated = true;
  }
}

function redDir(verb) {
  const hostname = window?.location?.hostname;
  const ENV = getEnv();
  const VERB = verb;
  let newLocation;
  if (hostname !== 'www.adobe.com' && hostname !== 'sign.ing' && hostname !== 'edit.ing') {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}-${ENV}`;
  } else {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}` || fallBack;
  }
  window.location.href = newLocation;
}

export default async function init(element) {
  if (isOldBrowser()) {
    window.location.href = EOLBrowserPage;
    return;
  }
  const children = element.querySelectorAll(':scope > div');
  const VERB = element.classList[1];
  const widgetHeading = createTag('h1', { class: 'verb-heading' }, children[0].textContent);
  let mobileLink = null;
  if (/iPad|iPhone|iPod/.test(window.browser?.ua) && !window.MSStream) {
    mobileLink = window.mph[`verb-widget-${VERB}-apple`];
  } else if (/android/i.test(window.browser?.ua)) {
    mobileLink = window.mph[`verb-widget-${VERB}-google`];
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
  const widgetCopy = createTag('p', { class: 'verb-copy' }, window.mph[`verb-widget-${VERB}-description`]);
  const widgetButton = createTag('label', { for: 'file-upload', class: 'verb-cta' }, window.mph['verb-widget-cta']);
  const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph['verb-widget-cta-mobile']);
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const widgetImage = createTag('img', { class: 'verb-image', src: `/acrobat/img/verb-widget/${VERB}.png` });
  // Since we're using placeholders we need a solution for the hyperlinks
  const legal = createTag('p', { class: 'verb-legal' }, `${window.mph['verb-widget-legal']} `);
  const terms = createTag('a', { class: 'verb-legal-url', target: '_blank', href: 'https://www.adobe.com/legal/terms.html' }, window.mph.tou);
  const and = createTag('span', { class: 'verb-legal-url' }, ` ${window.mph.and} `);
  const privacy = createTag('a', { class: 'verb-legal-url', target: '_blank', href: 'https://www.adobe.com/privacy/policy.html' }, `${window.mph.pp}.`);
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

  legal.append(terms, and, privacy);

  footer.append(iconSecurity, legal);

  element.append(widget, footer);

  // Redirect after IMS:Ready
  window.addEventListener('IMS:Ready', () => {
    console.log('IMS:Ready 😎');
    if (window.adobeIMS.isSignedInUser()
      && window.adobeIMS.getAccountType() !== 'type1') {
      redDir(VERB);
    }
  });
  // Race Condition
  if (window.adobeIMS?.isSignedInUser()
    && window.adobeIMS?.getAccountType() !== 'type1') {
    console.log('Race Con ⏩');
    redDir(VERB);
  }

  // Analytics
  verbAnalytics('landing:shown', VERB);

  window.prefetchInitiated = false;

  widgetMobileButton.addEventListener('click', () => {
    verbAnalytics('goto-app:clicked', VERB);
  });

  button.addEventListener('click', () => {
    verbAnalytics('filepicker:shown', VERB);
    initiatePrefetch(VERB);
  });

  button.addEventListener('cancel', () => {
    verbAnalytics('choose-file:close', VERB);
  });

  widget.addEventListener('dragover', (e) => {
    e.preventDefault();
    setDraggingClass(widget, true);
    initiatePrefetch(VERB);
  });

  widget.addEventListener('dragleave', () => {
    setDraggingClass(widget, false);
  });

  widget.addEventListener('drop', (e) => {
    e.preventDefault();
    initiatePrefetch(VERB);
  });

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });

  window.addEventListener('unity:track-analytics', (e) => {
    if (e.detail?.event === 'change') {
      verbAnalytics('choose-file:open', VERB);
      setUser();
    }
    // maybe new event name files-dropped?
    if (e.detail?.event === 'drop') {
      verbAnalytics('files-dropped', VERB, e.detail?.data);
      setDraggingClass(widget, false);
      setUser();
    }
    if (e.detail?.event === 'choose-file-clicked') {
      verbAnalytics('dropzone:choose-file-clicked', VERB, e.detail?.data);
      setUser();
    }

    if (e.detail?.event === 'uploading') {
      verbAnalytics('job:uploading', VERB, e.detail?.data);
      setUser();
    }

    if (e.detail?.event === 'uploaded') {
      verbAnalytics('job:uploaded', VERB, e.detail?.data);
      setUser();
    }
  });

  // Errors, Analytics & Logging
  const handleError = (str) => {
    errorState.classList.add('verb-error');
    errorState.classList.remove('hide');
    errorStateText.textContent = str;

    setTimeout(() => {
      errorState.classList.remove('verb-error');
      errorState.classList.add('hide');
    }, 5000);
  };

  window.addEventListener('unity:show-error-toast', (e) => {
    // eslint-disable-next-line no-console
    console.log(`⛔️ Error Code - ${e.detail?.code}`);

    if (e.detail?.code.includes('error_only_accept_one_file')) {
      handleError(e.detail?.message);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_unsupported_type')) {
      handleError(e.detail?.message);
      verbAnalytics('error:unsupported_type', VERB);
    }

    if (e.detail?.code.includes('error_empty_file')) {
      handleError(e.detail?.message);
      verbAnalytics('error:empty_file', VERB);
    }

    if (e.detail?.code.includes('error_file_too_large')) {
      handleError(e.detail?.message);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_max_page_count')) {
      handleError(e.detail?.message);
      verbAnalytics('error:max_page_count', VERB);
    }

    if (e.detail?.code.includes('error_generic')
      || e.detail?.code.includes('error_max_quota_exceeded')
      || e.detail?.code.includes('error_no_storage_provision')
      || e.detail?.code.includes('error_duplicate_asset')) {
      handleError(e.detail?.message);
      verbAnalytics('error', VERB);
    }

    // acrobat:verb-fillsign:error:page_count_missing_from_metadata_api
    // acrobat:verb-fillsign:error:403
    // LANA for 403
  });
}

// const ce = (
//   new CustomEvent(
//     'unity:show-error-toast',
//     { detail: { code: 'only_accept_one_file', message: 'Error message' } },
//   )
// );
// dispatchEvent(ce)
