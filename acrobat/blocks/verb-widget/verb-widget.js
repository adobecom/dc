import LIMITS from './limits.js';
import { setLibs, getEnv, isOldBrowser } from '../../scripts/utils.js';
import verbAnalytics from '../../scripts/alloy/verb-widget.js';
import createSvgElement from './icons.js';

const miloLibs = setLibs('/libs');
const { createTag, getConfig } = await import(`${miloLibs}/utils/utils.js`);

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

let exitFlag;
function handleExit(event) {
  if (exitFlag) { return; }
  event.preventDefault();
  event.returnValue = true;
}

export default async function init(element) {
  if (isOldBrowser()) {
    window.location.href = EOLBrowserPage;
    return;
  }

  const { locale } = getConfig();
  const ppURL = window.mph['verb-widget-privacy-policy-url'] || `https://www.adobe.com${locale.prefix}/privacy/policy.html`;
  const touURL = window.mph['verb-widget-terms-of-use-url'] || `https://www.adobe.com${locale.prefix}/legal/terms.html`;

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
  const widgetIconSvg = createSvgElement('WIDGET_ICON');
  if (widgetIconSvg) {
    widgetIconSvg.classList.add('icon-verb');
    widgetIcon.appendChild(widgetIconSvg);
  }
  const widgetTitle = createTag('div', { class: 'verb-title' }, 'Adobe Acrobat');
  const widgetCopy = createTag('p', { class: 'verb-copy' }, window.mph[`verb-widget-${VERB}-description`]);
  const widgetMobCopy = createTag('p', { class: 'verb-copy' }, window.mph[`verb-widget-${VERB}-mobile-description`]);
  const widgetButton = createTag('button', { for: 'file-upload', class: 'verb-cta', tabindex: 0 });
  const widgetButtonLabel = createTag('span', { class: 'verb-cta-label' }, window.mph['verb-widget-cta']);
  widgetButton.append(widgetButtonLabel);
  const uploadIconSvg = createSvgElement('UPLOAD_ICON');
  if (uploadIconSvg) {
    uploadIconSvg.classList.add('upload-icon');
    widgetButton.prepend(uploadIconSvg);
  }

  const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph['verb-widget-cta-mobile']);
  const button = createTag('input', { type: 'file', accept: LIMITS[VERB].acceptedFiles, id: 'file-upload', class: 'hide', 'aria-hidden': true });
  const widgetImage = createTag('div', { class: 'verb-image' });
  const verbIconName = `${VERB}`;
  const verbImageSvg = createSvgElement(verbIconName);
  if (verbImageSvg) {
    verbImageSvg.classList.add('icon-verb-image');
    widgetImage.appendChild(verbImageSvg);
  }

  // Since we're using placeholders we need a solution for the hyperlinks
  const legalWrapper = createTag('div', { class: 'verb-legal-wrapper' });
  const legal = createTag('p', { class: 'verb-legal' }, `${window.mph['verb-widget-legal']} `);
  const legalTwo = createTag('p', { class: 'verb-legal verb-legal-two' }, `${window.mph['verb-widget-legal-2']} `);
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const infoIcon = createTag('div', { class: 'info-icon milo-tooltip right', 'data-tooltip': `${window.mph['verb-widget-tool-tip']}` });
  const securityIconSvg = createSvgElement('SECURITY_ICON');
  const infoIconSvg = createSvgElement('INFO_ICON');
  if (securityIconSvg) {
    iconSecurity.appendChild(securityIconSvg);
    infoIcon.appendChild(infoIconSvg);
  }
  const footer = createTag('div', { class: 'verb-footer' });

  const errorState = createTag('div', { class: 'error hide' });
  const errorStateText = createTag('p', { class: 'verb-errorText' });
  const errorIcon = createTag('div', { class: 'verb-errorIcon' });
  const errorCloseBtn = createTag('div', { class: 'verb-errorBtn' });
  const closeIconSvg = createSvgElement('CLOSE_ICON');
  if (closeIconSvg) {
    closeIconSvg.classList.add('close-icon', 'error');
    errorCloseBtn.prepend(closeIconSvg);
  }

  widget.append(widgetContainer);
  widgetContainer.append(widgetRow);
  widgetRight.append(widgetImage);
  widgetRow.append(widgetLeft, widgetRight);
  widgetHeader.append(widgetIcon, widgetTitle);
  errorState.append(errorIcon, errorStateText, errorCloseBtn);
  if (mobileLink && LIMITS[VERB].mobileApp) {
    widgetLeft.append(widgetHeader, widgetHeading, widgetMobCopy, errorState, widgetMobileButton);
    element.append(widget);
  } else {
    widgetLeft.append(widgetHeader, widgetHeading, widgetCopy, errorState, widgetButton, button);
    legalTwo.innerHTML = legalTwo.outerHTML.replace(window.mph['verb-widget-terms-of-use'], `<a class="verb-legal-url" target="_blank" href="${touURL}"> ${window.mph['verb-widget-terms-of-use']}</a>`);
    legalTwo.innerHTML = legalTwo.outerHTML.replace(window.mph['verb-widget-privacy-policy'], `<a class="verb-legal-url" target="_blank" href="${ppURL}"> ${window.mph['verb-widget-privacy-policy']}</a>`);

    legalWrapper.append(legal, legalTwo);
    footer.append(iconSecurity, legalWrapper, infoIcon);

    element.append(widget, footer);
  }

  // Redirect after IMS:Ready
  window.addEventListener('IMS:Ready', () => {
    if (window.adobeIMS.isSignedInUser()
      && window.adobeIMS.getAccountType() !== 'type1') {
      redDir(VERB);
    }
  });
  // Race Condition
  if (window.adobeIMS?.isSignedInUser()
    && window.adobeIMS?.getAccountType() !== 'type1') {
    redDir(VERB);
  }

  // Analytics
  verbAnalytics('landing:shown', VERB);

  window.prefetchInitiated = false;

  widgetMobileButton.addEventListener('click', () => {
    verbAnalytics('goto-app:clicked', VERB);
  });

  widget.addEventListener('click', (e) => {
    if (e.srcElement.classList.value.includes('error')) { return; }
    if (!mobileLink) { button.click(); }
  });

  button.addEventListener('click', () => {
    verbAnalytics('filepicker:shown', VERB);
    verbAnalytics('dropzone:choose-file-clicked', VERB);
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

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });

  element.addEventListener('unity:track-analytics', (e) => {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 60 * 1000);
    const cookieExp = `expires=${date.toUTCString()}`;

    if (e.detail?.event === 'change') {
      verbAnalytics('choose-file:open', VERB, e.detail?.data);
      setUser();
    }
    // maybe new event name files-dropped?
    if (e.detail?.event === 'drop') {
      initiatePrefetch(VERB);
      verbAnalytics('files-dropped', VERB, e.detail?.data);
      setDraggingClass(widget, false);
      setUser();
    }

    if (e.detail?.event === 'uploading') {
      verbAnalytics('job:uploading', VERB, e.detail?.data);
      setUser();
      document.cookie = `UTS_Uploading=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
      window.addEventListener('beforeunload', (w) => {
        handleExit(w);
      });
    }

    if (e.detail?.event === 'uploaded') {
      exitFlag = true;
      setUser();
      document.cookie = `UTS_Uploaded=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
    }
  });

  window.addEventListener('beforeunload', () => {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 60 * 1000);
    const cookieExp = `expires=${date.toUTCString()}`;
    if (exitFlag) {
      document.cookie = `UTS_Redirect=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
    }
  });

  // Errors, Analytics & Logging
  const lanaOptions = {
    sampleRate: 100,
    tags: 'DC_Milo,Project Unity (DC)',
  };

  const handleError = (str, logToLana = false, logOptions = {}, e = null) => {
    setDraggingClass(widget, false);
    errorState.classList.add('verb-error');
    errorState.classList.remove('hide');
    errorStateText.textContent = str;

    if (logToLana && e) {
      const status = e.detail?.status || 'Unknown status';
      const message = e.detail?.message || 'Unknown message';
      window.lana?.log(`Error Status: ${status}, Error Message: ${message}`, logOptions);
    }

    setTimeout(() => {
      errorState.classList.remove('verb-error');
      errorState.classList.add('hide');
    }, 5000);
  };

  element.addEventListener('unity:show-error-toast', (e) => {
    if (e.detail?.code.includes('error_only_accept_one_file')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_unsupported_type')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error:unsupported_type', VERB);
    }

    if (e.detail?.code.includes('error_empty_file')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error:empty_file', VERB);
    }

    if (e.detail?.code.includes('error_file_too_large')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_max_page_count')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error:max_page_count', VERB);
    }

    if (e.detail?.code.includes('error_generic')
      || e.detail?.code.includes('error_max_quota_exceeded')
      || e.detail?.code.includes('error_no_storage_provision')
      || e.detail?.code.includes('error_duplicate_asset')) {
      handleError(e.detail?.message, true, lanaOptions, e);
      verbAnalytics('error', VERB);
    }

    // acrobat:verb-fillsign:error:page_count_missing_from_metadata_api
    // acrobat:verb-fillsign:error:403
    // LANA for 403
  });
}
