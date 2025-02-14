import LIMITS from './limits.js';
import { setLibs, getEnv, isOldBrowser } from '../../scripts/utils.js';
import verbAnalytics, { reviewAnalytics } from '../../scripts/alloy/verb-widget.js';
import createSvgElement from './icons.js';

const miloLibs = setLibs('/libs');
const { createTag, getConfig, loadBlock } = await import(`${miloLibs}/utils/utils.js`);

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

function prefetchNextPage(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.crossOrigin = 'anonymous';
  link.as = 'document';

  document.head.appendChild(link);
}

function initiatePrefetch(url) {
  if (!window.prefetchInitiated) {
    prefetchNextPage(url);
    window.prefetchInitiated = true;
  }
}

function redDirLink(verb) {
  const hostname = window?.location?.hostname;
  const ENV = getEnv();
  const VERB = verb;
  let newLocation;
  if (hostname !== 'www.adobe.com' && hostname !== 'sign.ing' && hostname !== 'edit.ing') {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}-${ENV}`;
  } else {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}` || fallBack;
  }
  return newLocation;
}

function redDir(verb) {
  window.location.href = redDirLink(verb);
}

let exitFlag;
function handleExit(event) {
  if (exitFlag) { return; }
  event.preventDefault();
  event.returnValue = true;
}

function isMobileDevice() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|iphone|ipod|blackberry|windows phone/i.test(ua);
  return isMobileUA;
}

function isTabletDevice() {
  const ua = navigator.userAgent.toLowerCase();
  const isIPadOS = navigator.userAgent.includes('Mac') && 'ontouchend' in document && !/iphone|ipod/i.test(ua);
  const isTabletUA = /ipad|android(?!.*mobile)/i.test(ua);
  const largeTouchDevice = (navigator.maxTouchPoints || navigator.msMaxTouchPoints) > 1
    && window.innerWidth >= 768;
  return isIPadOS || isTabletUA || largeTouchDevice;
}

const getCTA = (verb) => {
  const verbConfig = LIMITS[verb];
  return window.mph[`verb-widget-cta-${verbConfig?.uploadType}`] || window.mph['verb-widget-cta'];
};

function getStoreType() {
  const { ua } = window.browser;
  if (/android/i.test(ua)) {
    return 'google';
  }
  if (/iphone|ipod/i.test(ua)) {
    return 'apple';
  }
  if (navigator.userAgent.includes('Mac') && 'ontouchend' in document && !/iphone|ipod/i.test(navigator.userAgent)) {
    return 'apple';
  }
  if (/ipad/i.test(ua)) {
    return 'apple';
  }
  return 'desktop';
}

function getPricingLink() {
  const { locale } = getConfig();
  const ENV = getEnv();
  const links = {
    dev: `https://www.stage.adobe.com${locale.prefix}/acrobat/pricing/pricing.html`,
    stage: `https://www.stage.adobe.com${locale.prefix}/acrobat/pricing/pricing.html`,
    prod: `https://www.adobe.com${locale.prefix}/acrobat/pricing/pricing.html`,
  };

  // If env is invalid or omitted, default to 'prod'
  return links[ENV] || links.prod;
}

async function showUpSell(verb, element) {
  const headline = window.mph[`verb-widget-upsell-headline-${verb}`] || window.mph['verb-widget-upsell-headline'];
  const headlineNopayment = window.mph['verb-widget-upsell-headline-nopayment'];
  const bulletsHeading = window.mph['verb-widget-upsell-bullets-heading'];
  const bullets = window.mph[`verb-widget-upsell-bullets-${verb}`] || window.mph['verb-widget-upsell-bullets'];

  const headlineEl = createTag('h1', { class: 'verb-upsell-heading' }, headline);
  const headingNopaymentEl = createTag('h1', { class: 'verb-upsell-heading verb-upsell-heading-nopayment' }, headlineNopayment);
  const upsellBulletsHeading = createTag('p', { class: 'verb-upsell-bullets-heading' }, bulletsHeading);
  const upsellBullets = createTag('ul', { class: 'verb-upsell-bullets' });
  bullets.split('\n').forEach((bullet) => upsellBullets.append(createTag('li', {}, bullet)));

  const upsell = createTag('div', { class: 'verb-upsell' });
  const upsellColumn = createTag('div', { class: 'verb-upsell-column' });

  const socialContainer = createTag('div', { class: 'verb-upsell-social-container' });
  const socialCta = createTag('div', { class: 'susi-light' });
  socialCta.innerHTML = `<div><div>${redDirLink(verb)}</div></div>`;
  socialContainer.append(socialCta);
  await loadBlock(socialCta);

  const upsellRow = createTag('div', { class: 'verb-row' });

  upsellRow.append(upsellColumn, socialContainer);

  upsell.append(upsellRow);

  upsellColumn.append(headlineEl, headingNopaymentEl, upsellBulletsHeading, upsellBullets);

  const widget = createTag('div', { class: 'verb-wrapper verb-upsell-active' });
  const widgetContainer = createTag('div', { class: 'verb-container' });
  widget.append(widgetContainer);
  widgetContainer.append(upsell);

  element.classList.add('upsell');
  element.append(widget);
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
  const storeType = getStoreType();
  let mobileLink = null;
  let noOfFiles = null;
  let totalFileSize = null;
  function mergeData(eventData = {}) {
    return { ...eventData, noOfFiles, totalFileSize };
  }
  if (storeType !== 'desktop') {
    mobileLink = window.mph[`verb-widget-${VERB}-${storeType}`];
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
  const widgetButtonLabel = createTag('span', { class: 'verb-cta-label' }, getCTA(VERB));
  widgetButton.append(widgetButtonLabel);
  const uploadIconSvg = createSvgElement('UPLOAD_ICON');
  if (uploadIconSvg) {
    uploadIconSvg.classList.add('upload-icon');
    widgetButton.prepend(uploadIconSvg);
  }

  const mobileCTA = LIMITS[VERB].level === 0 ? 'verb-widget-cta-mobile-start-trial' : 'verb-widget-cta-mobile';
  mobileLink = LIMITS[VERB].level === 0 ? getPricingLink() : mobileLink;
  const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph[mobileCTA]);
  const button = createTag('input', {
    type: 'file',
    accept: LIMITS[VERB]?.acceptedFiles,
    id: 'file-upload',
    class: 'hide',
    'aria-hidden': true,
    ...(LIMITS[VERB]?.multipleFiles && { multiple: '' }),
  });
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
  const isMobile = isMobileDevice();
  const isTablet = isTabletDevice();

  if (isMobile) {
    widget.classList.add('mobile');
  } else if (isTablet) {
    widget.classList.add('tablet');
  }

  if (mobileLink && LIMITS[VERB].mobileApp) {
    widget.classList.add('mobile-app');
    widgetLeft.append(widgetHeader, widgetHeading, widgetMobCopy, errorState, widgetMobileButton);
    element.append(widget);
  } else {
    if (isMobile || isTablet) {
      const ctaElement = (LIMITS[VERB].level === 0) ? widgetMobileButton : widgetButton;
      widgetLeft.append(
        widgetHeader,
        widgetHeading,
        widgetMobCopy,
        errorState,
        ctaElement,
        button,
      );
    } else {
      widgetLeft.append(
        widgetHeader,
        widgetHeading,
        widgetCopy,
        errorState,
        widgetButton,
        button,
      );
    }
    legalTwo.innerHTML = legalTwo.outerHTML.replace(window.mph['verb-widget-terms-of-use'], `<a class="verb-legal-url" target="_blank" href="${touURL}"> ${window.mph['verb-widget-terms-of-use']}</a>`);
    legalTwo.innerHTML = legalTwo.outerHTML.replace(window.mph['verb-widget-privacy-policy'], `<a class="verb-legal-url" target="_blank" href="${ppURL}"> ${window.mph['verb-widget-privacy-policy']}</a>`);
    legalWrapper.append(legal, legalTwo);
    footer.append(iconSecurity, legalWrapper, infoIcon);
    element.append(widget, footer);
    if (isMobile && !isTablet) {
      widgetImage.after(widgetImage);
      iconSecurity.remove(iconSecurity);
      footer.prepend(infoIcon);
    }
  }

  function checkSignedInUser() {
    if (window.adobeIMS?.isSignedInUser?.()) {
      element.classList.remove('upsell');
      element.classList.add('signed-in');
      if (window.adobeIMS.getAccountType() !== 'type1') {
        redDir(VERB);
      }
    }
  }

  if (LIMITS[VERB].trial) {
    const count = parseInt(localStorage.getItem(`${VERB}_trial`), 10);
    if (count >= LIMITS[VERB].trial) {
      await showUpSell(VERB, element);
      verbAnalytics('upsell:shown', VERB);
      verbAnalytics('upsell-wall:shown', VERB);
    }
  }

  // Race the condition
  checkSignedInUser();

  // Redirect after IMS:Ready
  window.addEventListener('IMS:Ready', checkSignedInUser);

  // Analytics
  verbAnalytics('landing:shown', VERB);
  reviewAnalytics(VERB);

  window.prefetchInitiated = false;

  widgetMobileButton.addEventListener('click', () => {
    verbAnalytics('goto-app:clicked', VERB);
  });

  widget.addEventListener('click', (e) => {
    if (e.srcElement.classList.value.includes('error')) { return; }
    if (!mobileLink) { button.click(); }
  });

  button.addEventListener('click', (data) => {
    verbAnalytics('filepicker:shown', VERB);
    verbAnalytics('dropzone:choose-file-clicked', VERB);
    verbAnalytics('files-selected', VERB);
    if (VERB === 'compress-pdf') {
      verbAnalytics('entry:clicked', VERB, data);
      verbAnalytics('discover:clicked', VERB, data);
    }
  });

  button.addEventListener('change', (data) => {
    const { target: { files } } = data;
    if (!files) return;
    noOfFiles = files.length;
    totalFileSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
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

  widget.addEventListener('drop', (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (!files) return;
    noOfFiles = files.length;
    totalFileSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  });

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });

  element.addEventListener('unity:track-analytics', (e) => {
    const cookieExp = new Date(Date.now() + 90 * 1000).toUTCString();

    const { event, data } = e.detail || {};

    if (!event) return;

    const analyticsMap = {
      change: () => {
        verbAnalytics('choose-file:open', VERB, mergeData(data));
        setUser();
      },
      drop: () => {
        verbAnalytics('files-dropped', VERB, mergeData(data));
        if (VERB === 'compress-pdf') {
          verbAnalytics('entry:clicked', VERB, mergeData(data));
          verbAnalytics('discover:clicked', VERB, mergeData(data));
        }
        setDraggingClass(widget, false);
        setUser();
      },
      cancel: () => {
        verbAnalytics('job:cancel', VERB, mergeData(data));
        setUser();
      },
      uploading: () => {
        if (LIMITS[VERB].trial) {
          if (!window.adobeIMS?.isSignedInUser?.()) {
            const key = `${VERB}_trial`;
            const stored = localStorage.getItem(key);
            const count = parseInt(stored, 10);
            localStorage.setItem(key, count + 1 || 1);
          }
        }
        verbAnalytics('job:uploading', VERB, data, false);
        if (VERB === 'compress-pdf') {
          verbAnalytics('job:multi-file-uploading', VERB, data, false);
        }
        setUser();
        document.cookie = `UTS_Uploading=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
        window.addEventListener('beforeunload', handleExit);
      },
      uploaded: () => {
        verbAnalytics('job:test-uploaded', VERB, data, false);
        if (VERB === 'compress-pdf') {
          verbAnalytics('job:test-multi-file-uploaded', VERB, data, false);
        }
        exitFlag = true;
        setUser();
        document.cookie = `UTS_Uploaded=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
      },
      redirectUrl: () => {
        if (data) initiatePrefetch(data);
      },
    };

    if (analyticsMap[event]) {
      analyticsMap[event]();
    }
  });

  window.addEventListener('beforeunload', () => {
    const cookieExp = new Date(Date.now() + 90 * 1000).toUTCString();
    if (exitFlag) {
      document.cookie = `UTS_Redirect=${Date.now()};domain=.adobe.com;path=/;expires=${cookieExp}`;
    }
  });

  // Errors, Analytics & Logging
  const lanaOptions = {
    sampleRate: 100,
    tags: 'DC_Milo,Project Unity (DC)',
  };

  const handleError = (detail, logToLana = false, logOptions = {}) => {
    const { code, message, status, info = 'No additional info provided', accountType = 'Unknown account type' } = detail;
    if (message) {
      setDraggingClass(widget, false);
      errorState.classList.add('verb-error');
      errorState.classList.remove('hide');
      errorStateText.textContent = message;
    }
    if (logToLana) {
      window.lana?.log(
        `Error Code: ${code}, Status: ${status}, Message: ${message}, Info: ${info}, Account Type: ${accountType}`,
        logOptions,
      );
    }

    setTimeout(() => {
      errorState.classList.remove('verb-error');
      errorState.classList.add('hide');
    }, 5000);
  };

  element.addEventListener('unity:show-error-toast', (e) => {
    if (e.detail?.code.includes('error_only_accept_one_file')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_unsupported_type')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error:unsupported_type', VERB);
    }

    if (e.detail?.code.includes('error_empty_file')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error:empty_file', VERB);
    }

    if (e.detail?.code.includes('error_file_too_large')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error', VERB);
    }

    if (e.detail?.code.includes('error_max_page_count')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error:max_page_count', VERB);
    }

    if (e.detail?.code.includes('cookie_not_set')) {
      handleError(e.detail, true, lanaOptions);
    }

    if (e.detail?.code.includes('error_generic')
      || e.detail?.code.includes('error_max_quota_exceeded')
      || e.detail?.code.includes('error_no_storage_provision')
      || e.detail?.code.includes('error_duplicate_asset')) {
      handleError(e.detail, true, lanaOptions);
      verbAnalytics('error', VERB);
    }
  });

  window.addEventListener('pageshow', (event) => {
    const historyTraversal = event.persisted
      || (typeof window.performance !== 'undefined'
        && window.performance.getEntriesByType('navigation')[0].type === 'back_forward');
    if (historyTraversal) {
      window.location.reload();
    }
  });
}
