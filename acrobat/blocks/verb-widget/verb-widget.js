/* eslint-disable compat/compat */
import { setLibs, getEnv, isOldBrowser } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const {
  createTag, getConfig, loadBlock, getMetadata, loadIms, loadScript,
} = await import(`${miloLibs}/utils/utils.js`);

const fallBack = 'https://www.adobe.com/go/acrobat-overview';
const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
const demoPath = 'blob/JTdCJTIyc291cmNlJTIyJTNBJTIyY2RuJTIyJTJDJTIyZmlsZVBhdGglMjIlM0ElMjIlMkZkYy1maWxlczItZHJvcGluJTJGZGVtby1maWxlcyUyRmVuLVVTJTJGY2hhdC1wZGYtZGVtby12NCUyRmNoYXQtcGRmLWRlbW8tdjQucGRmJTIyJTJDJTIyaXRlbU5hbWUlMjIlM0ElMjJBSSUyMEFzc2lzdGFudCUyMGRlbW8lMjBmaWxlLnBkZiUyMiUyQyUyMm5hbWUlMjIlM0ElMjJjaGF0LXBkZi1kZW1vLXY0JTIyJTJDJTIyaXRlbVR5cGUlMjIlM0ElMjJhcHBsaWNhdGlvbiUyRnBkZiUyMiU3RA/?defaultRHPFeature=verb-qanda&x_api_client_id=ChatPDFTryDemoFile&x_api_client_location=chat_pdf_student&try-ai-demo=true&demo-mode=true&promoid=HHJ4X8CS&mv=product&mv2=acrobat-web';

const redirectReady = new CustomEvent('DCUnity:RedirectReady');

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

const exhLimitCookieMap = {
  'to-pdf': 'cr_p_c',
  'pdf-to': 'ex_p_c',
  'compress-pdf': 'cm_p_ops',
  'rotate-pages': 'or_p_c',
  createpdf: 'cr_p_c',
  'ocr-pdf': 'ocr_p_c',
};

const appEnvCookieMap = {
  stage: 's_ta_',
  prod: 'p_ac_',
};

export const LIMITS = {
  fillsign: {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB', // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    multipleFiles: false,
    mobileApp: true,
  },
  'number-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    level: 0,
  },
  'split-pdf': {
    maxFileSize: 104857600, // 1 GB
    maxFileSizeFriendly: '1 GB',
    acceptedFiles: ['application/pdf'],
    signedInAcceptedFiles: [
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    maxNumFiles: 1,
  },
  'crop-pages': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '1 MB',
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    level: 0,
  },
  'add-comment': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '1 MB',
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    mobileApp: true,
  },
  'compress-pdf': {
    maxFileSize: 2147483648,
    maxFileSizeFriendly: '2 GB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'delete-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'insert-pdf': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'extract-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'reorder-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  sendforsignature: {
    maxFileSize: 5242880, // 5 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    mobileApp: true,
  },
  'merge-pdf': {
    // multifile-only or single-hybrid
    uploadType: 'multifile-only',
    multipleFiles: true,
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
  },
  'pdf-to-word': {
    maxFileSize: 262144000, // 250 MB
    maxFileSizeFriendly: '250 MB',
    acceptedFiles: ['application/pdf'],
    multipleFiles: true,
  },
  'pdf-to-excel': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: ['application/pdf'],
    multipleFiles: true,
  },
  'pdf-to-image': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: ['application/pdf'],
    multipleFiles: true,
  },
  'pdf-to-ppt': {
    maxFileSize: 262144000, // 250 MB
    maxFileSizeFriendly: '250 MB',
    acceptedFiles: ['application/pdf'],
    multipleFiles: true,
  },
  createpdf: {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'word-to-pdf': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'jpg-to-pdf': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'png-to-pdf': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'excel-to-pdf': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
  'ppt-to-pdf': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
  },
};

const DC_ENV = ['www.adobe.com', 'sign.ing', 'edit.ing'].includes(window.location.hostname) ? 'prod' : 'stage';

const setUser = () => {
  localStorage.setItem('unity.user', 'true');
};

const setDraggingClass = (widget, shouldToggle) => {
  // eslint-disable-next-line chai-friendly/no-unused-expressions
  shouldToggle ? widget.classList.add('dragging') : widget.classList.remove('dragging');
};

function prefetchTarget() {
  const iframe = document.createElement('iframe');
  iframe.src = window.prefetchTargetUrl;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
}

function prefetchNextPage(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.crossOrigin = 'anonymous';
  link.as = 'document';

  document.head.appendChild(link);
}

function initiatePrefetch(url) {
  if (!window.prefetchTargetUrl) {
    prefetchNextPage(url);
    window.prefetchTargetUrl = url;
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

function getSplunkEndpoint() {
  return (getEnv() === 'prod') ? 'https://unity.adobe.io/api/v1/log' : 'https://unity-stage.adobe.io/api/v1/log';
}

function getDemoEndpoint() {
  return (getEnv() === 'prod') ? `https://acrobat.adobe.com/${demoPath}` : `https://stage.acrobat.adobe.com/${demoPath}`;
}

let exitFlag;
function handleExit(event, verb, userObj, unloadFlag) {
  if (exitFlag) { return; }
  window.analytics.verbAnalytics('job:browser-tab-closure', verb, userObj, unloadFlag);
  window.analytics.sendAnalyticsToSplunk('job:browser-tab-closure', verb, userObj, getSplunkEndpoint(), true);
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
  const isIPadOS = navigator.userAgent.includes('Mac')
    && 'ontouchend' in document
    && !/iphone|ipod/i.test(ua);
  const isTabletUA = /ipad|android(?!.*mobile)/i.test(ua);
  return isIPadOS || isTabletUA;
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

async function loadGoogleLogin() {
  if (window.adobeIMS?.isSignedInUser()) return;

  const { default: initGoogleLogin } = await import(`${miloLibs}/features/google-login.js`);
  initGoogleLogin(loadIms, getMetadata, loadScript, getConfig);
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function uploadedTime() {
  const uploadingUTS = parseInt(getCookie('UTS_Uploading'), 10);
  const uploadedUTS = parseInt(getCookie('UTS_Uploaded'), 10);
  if (Number.isNaN(uploadingUTS) || Number.isNaN(uploadedUTS)) return 'N/A';
  return ((uploadedUTS - uploadingUTS) / 1000).toFixed(1);
}

function incrementVerbKey(verbKey) {
  let count = parseInt(localStorage.getItem(verbKey), 10) || 0;
  count += 1;
  localStorage.setItem(verbKey, count);
  return count;
}

function getVerbKey(verbKey) {
  const count = parseInt(localStorage.getItem(verbKey), 10) || 0;
  const trialMapping = {
    0: '1st',
    1: '2nd',
  };
  return trialMapping[count] || '2+';
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

  loadGoogleLogin();
}

// Errors, Analytics & Logging
const lanaOptions = {
  sampleRate: 100,
  tags: 'DC_Milo,Project Unity (DC)',
};

/// icons.js
const svgCache = new Map();

const ICONS = {
  WIDGET_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0.3 24 23.4"><g id="Surfaces"><path fill="#b30b00" d="M4.25.3h15.5A4.24643,4.24643,0,0,1,24,4.55v14.9a4.24643,4.24643,0,0,1-4.25,4.25H4.25A4.24643,4.24643,0,0,1,0,19.45V4.55A4.24643,4.24643,0,0,1,4.25.3Z"/></g><g id="Outlined_Mnemonics_Logos" data-name="Outlined Mnemonics Logos"><path id="_256" data-name=" 256" fill="#fff" d="M19.3,13.85a1.78946,1.78946,0,0,0-.44031-.33547,2.83828,2.83828,0,0,0-.59969-.24078,4.79788,4.79788,0,0,0-.75719-.14516A7.94332,7.94332,0,0,0,16.59,13.08q-.27375.00375-.54891.017-.27492.01337-.54984.03672-.2747.02345-.548.05734-.273.034-.54328.07891-.1725-.16875-.33891-.345-.16617-.17625-.32484-.36-.15844-.18375-.308-.375-.1493-.19125-.28828-.39-.10875-.14625-.212-.29625-.10337-.15-.20172-.30375-.09845-.15375-.19234-.31125-.094-.1575-.18391-.31875.17625-.55125.30766-1.04813.13148-.49688.21859-.93937.08718-.4425.13047-.83063A6.52908,6.52908,0,0,0,13.05,7.03a3.675,3.675,0,0,0-.08594-.80563A2.42373,2.42373,0,0,0,12.685,5.505a1.4927,1.4927,0,0,0-.50406-.51688A1.44959,1.44959,0,0,0,11.42,4.79a1.19728,1.19728,0,0,0-.30547.04719A1.22057,1.22057,0,0,0,10.41,5.38a2.17839,2.17839,0,0,0-.25078.82187,4.69881,4.69881,0,0,0,.007,1.08813,7.85466,7.85466,0,0,0,.25641,1.26812A10.26146,10.26146,0,0,0,10.92,9.92c-.0725.2125-.14625.42312-.222.63391s-.1536.42171-.23422.63484-.16406.42844-.25109.648S10.035,12.28,9.94,12.51q-.12375.2925-.25344.58281Q9.55672,13.383,9.42,13.67q-.13688.28688-.28156.56969Q8.99359,14.52235,8.84,14.8c-.3075.1225-.70125.28937-1.12281.49156A12.99444,12.99444,0,0,0,6.4275,15.995a6.08618,6.08618,0,0,0-1.10594.86094A1.9673,1.9673,0,0,0,4.75,17.82a1.08624,1.08624,0,0,0-.01969.29219,1.10366,1.10366,0,0,0,.05719.28281,1.13932,1.13932,0,0,0,.12844.26031A1.17812,1.17812,0,0,0,5.11,18.88a1.45543,1.45543,0,0,0,.23312.17047,1.49272,1.49272,0,0,0,.25938.12078,1.5496,1.5496,0,0,0,.27812.07016A1.60815,1.60815,0,0,0,6.17,19.26a2.26684,2.26684,0,0,0,1.16953-.36984,5.403,5.403,0,0,0,1.12172-.95391,11.55912,11.55912,0,0,0,1.02609-1.30453c.32078-.46734.61766-.95422.88266-1.42172q.225-.075.45172-.14781.22664-.07266.45453-.14219.22781-.06938.45641-.13469.22851-.06515.45734-.12531.25125-.0675.49687-.12766.24562-.06022.48563-.11359.24-.05343.47437-.10047.23438-.0471.46313-.08828a7.87389,7.87389,0,0,0,1.20266.87266,6.26924,6.26924,0,0,0,1.08359.50609,5.254,5.254,0,0,0,.913.23422A4.37649,4.37649,0,0,0,18,15.9a2.59368,2.59368,0,0,0,.65125-.07453A1.51031,1.51031,0,0,0,19.1,15.63375a1.1277,1.1277,0,0,0,.28375-.26109A1.11325,1.11325,0,0,0,19.54,15.09a1.22521,1.22521,0,0,0,.068-.32313,1.25587,1.25587,0,0,0-.12281-.63875A1.23791,1.23791,0,0,0,19.3,13.85Zm-1.09.76a.5154.5154,0,0,1-.08641.19734.58489.58489,0,0,1-.16234.15141.79481.79481,0,0,1-.228.097A1.1248,1.1248,0,0,1,17.45,15.09c-.03,0-.05937-.00062-.08828-.002s-.05734-.00359-.08547-.00672-.05594-.00719-.08359-.01234S17.1375,15.0575,17.11,15.05a4.95589,4.95589,0,0,1-.55719-.16906,5.26538,5.26538,0,0,1-.54781-.23844,5.88716,5.88716,0,0,1-.54031-.30969q-.26859-.173-.53469-.38281.19875-.03.39938-.0525t.40312-.0375q.2025-.015.40688-.0225T16.55,13.83q.135-.00375.27-.00015.135.00351.27.0139.135.01032.27.027.135.01665.27.03922a1.06557,1.06557,0,0,1,.23406.06438.67592.67592,0,0,1,.20594.12812.47151.47151,0,0,1,.13094.20688A.61536.61536,0,0,1,18.21,14.61ZM11.05,5.76a.44669.44669,0,0,1,.06312-.08922.418.418,0,0,1,.08188-.06953.38563.38563,0,0,1,.09687-.04516A.37033.37033,0,0,1,11.4,5.54a.3585.3585,0,0,1,.23219.07781.49431.49431,0,0,1,.14031.19969,1.11421,1.11421,0,0,1,.06906.27094A2.13908,2.13908,0,0,1,11.86,6.38a4.75269,4.75269,0,0,1-.03313.52266c-.02187.19453-.05437.408-.09687.63609s-.095.47094-.15688.72422S11.44,8.78,11.36,9.05a8.57492,8.57492,0,0,1-.34656-1.17359,5.96418,5.96418,0,0,1-.13094-.95516,3.50469,3.50469,0,0,1,.03031-.71328A1.38226,1.38226,0,0,1,11.05,5.76Zm.91,8.03q-.12375.03375-.2475.06766-.12375.034-.2475.06859-.12375.03468-.2475.07047-.12375.03585-.2475.07328.0675-.135.13125-.26813t.12375-.26437q.06-.13125.11625-.26063T11.45,13.02q.0675-.16875.13469-.33578.067-.16711.13281-.333.06563-.16595.12906-.33109.06329-.16524.12344-.33016.0525.0825.10516.16328.05272.08087.10609.16047.05343.07968.108.15859.0546.079.11078.15766.10875.15.21969.29625.11109.14625.22531.28875.11438.1425.23281.28125.11859.13875.24219.27375a1.28474,1.28474,0,0,0-.14922.02891c-.09234.02015-.22016.04922-.362.08234s-.29781.07031-.44641.10672S12.0725,13.76,11.96,13.79Zm-3.51,2c-.2525.405-.50375.7725-.74766,1.09594a8.70907,8.70907,0,0,1-.70359.83156,3.63,3.63,0,0,1-.623.52781A.99041.99041,0,0,1,5.87,18.43a.43094.43094,0,0,1-.06875-.00563.4412.4412,0,0,1-.06875-.01687.4004.4004,0,0,1-.065-.02813A.33419.33419,0,0,1,5.61,18.34a.384.384,0,0,1-.07094-.07609.36982.36982,0,0,1-.06687-.18969A.38084.38084,0,0,1,5.48,17.97a1.11708,1.11708,0,0,1,.27422-.47844,3.84739,3.84739,0,0,1,.61453-.54406,8.74359,8.74359,0,0,1,.91266-.57781C7.63063,16.175,8.0225,15.98,8.45,15.79Z"/></g></svg>',
  fillsign: '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M124.081 219.093C131.526 218.865 146.339 208.496 149.338 204.648C149.454 205.761 146.215 211.003 147.55 213.968C148.114 215.056 148.989 215.951 150.064 216.54C151.138 217.128 152.364 217.384 153.584 217.274C163.981 215.025 173.828 210.733 182.554 204.648C182.358 205.789 176.957 211.487 177.618 214.592C177.78 215.559 178.172 216.473 178.762 217.256C179.352 218.04 180.121 218.67 181.006 219.093C190.653 223.904 208.999 208.27 212.625 202.77C213.249 201.825 213.474 200.671 213.251 199.561C213.028 198.45 212.374 197.473 211.433 196.843C210.97 196.533 210.451 196.318 209.905 196.209C209.358 196.1 208.796 196.1 208.25 196.208C207.703 196.317 207.184 196.532 206.72 196.841C206.257 197.151 205.86 197.549 205.55 198.012C200.836 203.604 194.567 207.67 187.538 209.695C187.991 208.755 191.948 202.174 192.432 201.403C193.215 200.323 193.922 199.19 194.548 198.012C195.05 197.093 195.313 196.064 195.313 195.017C195.313 193.97 195.05 192.94 194.548 192.022C193.756 190.686 192.31 189.648 188.576 189.648C182.474 191.324 176.753 194.164 171.728 198.012C167.572 200.965 163.177 203.566 158.588 205.789C159.321 203.028 160.199 200.307 161.22 197.639C163.397 193.082 165.097 189.496 163.198 186.388C162.709 185.61 162.028 184.971 161.221 184.532C160.414 184.093 159.507 183.869 158.588 183.881C155.711 184.167 152.982 185.295 150.742 187.124C148.502 188.953 146.851 191.402 145.995 194.164C140.799 200.951 133.618 205.951 125.45 208.47C124.17 208.799 122.828 208.799 121.548 208.47C125.515 204.752 129.28 200.823 132.825 196.701C136.194 192.398 143.694 181.63 140.325 174.449C139.573 172.934 138.383 171.679 136.91 170.846C135.437 170.013 133.749 169.641 132.062 169.777C125.3 169.975 117.489 178.124 113.273 186.073C109.293 193.458 106.522 201.433 105.065 209.695C104.15 211.487 104.657 210.518 96.2803 211.002H30.0585L54.5536 155.702L178.614 24.1176C179.251 23.4308 180.021 22.8797 180.877 22.4973C181.732 22.1149 182.657 21.909 183.594 21.892C184.519 21.8198 185.449 21.9597 186.312 22.3011C187.176 22.6424 187.95 23.1762 188.576 23.8618L202.235 37.6442C203.615 39.0764 204.401 40.979 204.432 42.9677C204.464 44.9563 203.74 46.883 202.407 48.3588L80.098 178.067C79.3247 178.893 78.9087 179.991 78.9405 181.121C78.9723 182.252 79.4493 183.324 80.2678 184.105C80.672 184.491 81.1493 184.793 81.6716 184.992C82.1939 185.191 82.7507 185.284 83.3094 185.266C83.8681 185.247 84.4175 185.117 84.9254 184.884C85.4332 184.65 85.8894 184.317 86.267 183.905L208.603 54.1959C211.424 51.0884 212.955 47.0233 212.887 42.8268C212.818 38.6304 211.154 34.6176 208.232 31.6042L194.548 17.7882C193.113 16.3046 191.381 15.1415 189.464 14.3757C187.547 13.6098 185.49 13.2585 183.428 13.3449C181.361 13.3753 179.322 13.8253 177.434 14.6674C175.546 15.5096 173.849 16.7264 172.445 18.2441L47.761 150.519C47.3392 150.939 47.0283 151.457 46.856 152.026L20.2395 213.968C20.0165 214.61 19.949 215.296 20.0424 215.97C20.1359 216.643 20.3877 217.284 20.7772 217.842C21.2031 218.392 21.7533 218.834 22.3828 219.131C23.0123 219.428 23.7032 219.571 24.3988 219.55H101.727C105.33 220.014 108.982 219.209 112.056 217.274C115.845 218.89 119.983 219.516 124.081 219.093Z" fill="#864CCC"/><path d="M132.062 178.715C136.11 183.257 119.178 204.648 114.642 204.648C117.711 189.058 128.014 174.172 132.062 178.715Z" fill="#864CCC"/><path opacity="0.1" d="M54.5532 155.702L178.613 24.1177C179.251 23.4309 180.021 22.8798 180.876 22.4974C181.732 22.1149 182.656 21.9091 183.593 21.8921C184.519 21.8199 185.449 21.9598 186.312 22.3011C187.175 22.6425 187.95 23.1763 188.576 23.8619L202.235 37.6443C203.615 39.0765 204.4 40.979 204.432 42.9677C204.464 44.9564 203.74 46.8831 202.407 48.3589L80.0976 178.068L54.5532 155.702Z" fill="#864CCC"/></svg>',
  'compress-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 148.786V206.666C40 210.203 41.4048 213.594 43.9053 216.095C46.4058 218.595 49.7972 220 53.3334 220H186.667C190.203 220 193.594 218.595 196.095 216.095C198.595 213.594 200 210.203 200 206.666V148.806L206.667 155.433V206.666C206.667 211.767 204.718 216.675 201.218 220.387C197.719 224.098 192.934 226.333 187.842 226.632L186.667 226.666H53.3334C48.029 226.666 42.942 224.559 39.1912 220.809C35.4405 217.058 33.3334 211.971 33.3334 206.666V155.413L40 148.786ZM155.867 13.3331C158.047 13.327 160.207 13.754 162.222 14.5895C164.236 15.4249 166.064 16.6521 167.6 18.1997L201.733 52.1997C204.869 55.3288 206.642 59.5698 206.667 63.9997V80.5664L200 87.1931V63.9997C199.998 61.6898 199.196 59.4518 197.731 57.6659L197.067 56.9331L162.933 22.9331C161.06 21.0572 158.518 20.0021 155.867 19.9997H53.3334C49.7972 19.9997 46.4058 21.4045 43.9053 23.905C41.4048 26.4055 40 29.7969 40 33.3331V87.1997L33.3334 80.5731V33.3331C33.3335 28.2322 35.2825 23.324 38.7818 19.6126C42.2811 15.9012 47.0661 13.667 52.1582 13.3671L53.3334 13.3331H155.867Z" fill="#19B3B8"/><path opacity="0.1" d="M155.867 20C158.518 20.0023 161.06 21.0574 162.933 22.9333L197.067 56.9333C198.943 58.8069 199.998 61.3487 200 64V87.1933L180.397 106.682C178.893 108.166 177.701 109.936 176.888 111.886C176.076 113.837 175.661 115.93 175.667 118.043C175.673 120.156 176.099 122.247 176.922 124.193C177.745 126.14 178.947 127.903 180.459 129.379L200 148.807V206.667C200 210.203 198.595 213.594 196.095 216.095C193.594 218.595 190.203 220 186.667 220H53.3333C49.7971 220 46.4057 218.595 43.9052 216.095C41.4048 213.594 40 210.203 40 206.667V148.787L59.5835 129.317L60.5243 128.291L60.9569 127.773C63.3607 124.69 64.5448 120.829 64.283 116.929C64.0212 113.028 62.3319 109.361 59.5377 106.627L40 87.2V33.3333C40 29.7971 41.4048 26.4057 43.9052 23.9052C46.4057 21.4048 49.7971 20 53.3333 20H155.867Z" fill="#19B3B8"/><path d="M16.0666 80C15.2705 80.0001 14.4822 80.157 13.7468 80.4618C13.0113 80.7666 12.3432 81.2133 11.7805 81.7764C11.2165 82.3273 10.7686 82.9854 10.4631 83.7121C10.1576 84.4388 10.0007 85.2193 10.0016 86.0076C10.0025 86.796 10.1613 87.5761 10.4685 88.3021C10.7757 89.0281 11.2251 89.6852 11.7903 90.2347L39.7185 117.991L11.7799 145.765C10.9432 146.608 10.3757 147.681 10.1495 148.848C9.92332 150.014 10.0485 151.222 10.5093 152.317C10.97 153.412 11.7456 154.346 12.7377 155C13.7297 155.654 14.8936 155.999 16.0818 155.99C16.8739 155.996 17.6592 155.843 18.3911 155.54C19.123 155.237 19.7866 154.79 20.3427 154.226L52.5333 122.226L53.0689 121.626C53.9637 120.48 54.404 119.044 54.3051 117.593C54.2063 116.142 53.5753 114.778 52.5333 113.764L20.3399 81.7638C19.2052 80.6333 17.6684 79.999 16.0666 80Z" fill="#19B3B8"/><path d="M223.924 80C222.321 79.9992 220.783 80.6346 219.648 81.7667L187.447 113.774C186.882 114.325 186.434 114.983 186.128 115.71C185.823 116.437 185.666 117.218 185.667 118.007C185.667 118.796 185.826 119.576 186.134 120.302C186.441 121.029 186.891 121.686 187.457 122.235L219.649 154.238C220.788 155.368 222.328 156.002 223.932 156C225.537 155.997 227.075 155.36 228.21 154.226C228.774 153.676 229.222 153.018 229.527 152.293C229.833 151.567 229.99 150.788 229.99 150C229.99 149.213 229.833 148.433 229.527 147.708C229.222 146.982 228.774 146.325 228.21 145.775L200.272 118.001L228.21 90.2249C228.774 89.6738 229.222 89.0153 229.528 88.2882C229.833 87.5611 229.99 86.7802 229.989 85.9915C229.987 85.2029 229.828 84.4224 229.521 83.6963C229.213 82.9701 228.763 82.313 228.197 81.7636C227.062 80.6332 225.525 79.9989 223.924 80Z" fill="#19B3B8"/><path d="M81.3157 140C79.1628 139.994 77.0848 139.209 75.4651 137.791C74.6339 137.023 74.0126 136.055 73.6602 134.979C73.3079 133.904 73.2361 132.756 73.4518 131.645C74.5518 125.701 83.9851 118.672 99.3451 112.352C102.04 107.337 104.461 102.181 106.597 96.9049C108.97 91.0341 110.996 85.4928 112.979 79.4782C107.81 67.6975 106.376 55.6421 109.496 50.1087C110.064 49.0987 110.881 48.2516 111.871 47.6488C112.86 47.0461 113.988 46.708 115.146 46.667C122.192 46.667 124.708 53.8008 124.708 60.4796C124.308 68.4387 122.778 76.3005 120.166 83.8293C121.773 86.7494 123.537 89.5803 125.45 92.3099C127.965 95.9389 130.815 99.3245 133.961 102.422C138.686 101.608 143.467 101.171 148.261 101.115C154.234 100.427 160.236 102.138 164.947 105.874C166.074 107.229 166.683 108.94 166.666 110.701C166.674 111.536 166.533 112.364 166.251 113.149C165.453 115.314 163.251 117.898 157.265 117.903C147.967 117.435 139.185 113.485 132.665 106.839C128.702 107.553 124.399 108.536 119.867 109.765C115.778 110.882 111.734 112.148 107.848 113.52C102.4 123.486 91.8418 139.982 81.6404 139.987L81.3157 140ZM77.3801 132.425C77.352 132.582 77.3401 132.741 77.3449 132.901C77.3481 133.528 77.5956 134.129 78.0349 134.577C78.4742 135.024 79.0706 135.283 79.6977 135.298C83.4144 135.296 89.5367 128.839 95.911 118.343C85.1205 123.332 78.0696 128.669 77.3801 132.425ZM151.621 113C152.331 113.173 153.059 113.26 153.79 113.262C156.344 113.262 158.211 112.075 158.546 110.244C159.104 107.279 156.82 106.141 154.809 105.707C149.185 104.907 143.472 104.981 137.871 105.927C141.886 109.255 146.578 111.669 151.621 113ZM114.527 99.4623C113.402 102.26 112.048 105.276 110.581 108.251C113.387 107.336 116.117 106.525 118.858 105.783C122.328 104.826 125.765 103.997 129.082 103.322L128.719 102.891C126.372 100.322 124.195 97.6024 122.202 94.75C120.908 92.9037 119.675 91.0157 118.46 88.9681C117.363 92.1817 116.069 95.6286 114.527 99.4623ZM112.944 52.2111C111.074 59.2813 111.746 66.7837 114.844 73.4087C116.551 67.8068 117.578 62.02 117.904 56.1729C117.904 53.7409 117.401 50.8069 115.068 50.799C114.684 50.8174 114.308 50.9239 113.972 51.1103C113.635 51.2966 113.345 51.5578 113.125 51.8738L112.944 52.2111Z" fill="#19B3B8"/><path d="M170 160C170.884 160 171.732 160.351 172.357 160.976C172.982 161.601 173.333 162.449 173.333 163.333C173.333 164.217 172.982 165.065 172.357 165.69C171.732 166.315 170.884 166.667 170 166.667H76.6666C75.7826 166.667 74.9347 166.315 74.3096 165.69C73.6845 165.065 73.3333 164.217 73.3333 163.333C73.3333 162.449 73.6845 161.601 74.3096 160.976C74.9347 160.351 75.7826 160 76.6666 160H170Z" fill="#19B3B8"/><path d="M170 180C170.884 180 171.732 180.351 172.357 180.976C172.982 181.601 173.333 182.449 173.333 183.333C173.333 184.217 172.982 185.065 172.357 185.69C171.732 186.315 170.884 186.667 170 186.667H76.6666C75.7826 186.667 74.9347 186.315 74.3096 185.69C73.6845 185.065 73.3333 184.217 73.3333 183.333C73.3333 182.449 73.6845 181.601 74.3096 180.976C74.9347 180.351 75.7826 180 76.6666 180H170Z" fill="#19B3B8"/></svg>',
  'number-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M160 22.8007L196.6 60.0006H163.267C162.366 60.0602 161.483 59.7282 160.844 59.0898C160.206 58.4512 159.874 57.5683 159.933 56.6673L160 22.8007ZM200 206.667C200 214.031 194.031 220.001 186.667 220.001H53.3335C45.9697 220.001 40.0002 214.031 40.0002 206.667V33.334C40.0002 25.9702 45.9697 20.0007 53.3335 20.0007H153.333V56.6673C153.474 62.131 157.87 66.5272 163.333 66.6673H200V206.667ZM201.933 55.334L165.333 18.0007C161.928 15.2151 157.726 13.5812 153.333 13.334H53.3335C42.2878 13.334 33.3335 22.2883 33.3335 33.334V206.667C33.3335 217.713 42.2878 226.667 53.3335 226.667H186.667C197.712 226.667 206.667 217.713 206.667 206.667V67.334C206.526 62.9067 204.853 58.6655 201.933 55.334Z" fill="#DA7B11"/><path opacity="0.1" d="M155.867 20C158.518 20.0023 161.06 21.0575 162.933 22.9333L197.067 56.9333C198.943 58.8069 199.998 61.3487 200 64V206.667C200 214.03 194.03 220 186.667 220H53.3333C45.9695 220 40 214.03 40 206.667V33.3333C40 25.9695 45.9695 20 53.3333 20H155.867Z" fill="#DA7B11"/><path d="M125.599 136.191H109.173L113.279 117.858H129.706L125.599 136.191ZM100.813 170.805C101.106 170.805 101.277 170.731 101.326 170.585C101.375 170.438 101.448 170.267 101.546 170.071L107.413 145.285H123.693L118.119 169.925C117.924 170.511 118.168 170.805 118.853 170.805H125.453C125.844 170.805 126.064 170.731 126.113 170.585C126.162 170.438 126.284 170.267 126.479 170.071L132.053 145.285H144.373C144.862 145.285 145.106 145.04 145.106 144.551V136.925C145.106 136.436 144.862 136.191 144.373 136.191H133.813L137.919 117.858H151.999C152.488 117.858 152.733 117.663 152.733 117.271V109.645C152.733 109.156 152.439 108.911 151.853 108.911H139.826L144.959 86.7648C145.057 86.1781 144.813 85.8848 144.226 85.8848H137.333C136.942 85.8848 136.746 86.1292 136.746 86.6181L131.759 108.911H115.479L120.466 86.9114C120.564 86.227 120.368 85.8848 119.879 85.8848H113.133C112.742 85.8848 112.399 86.1781 112.106 86.7648L107.119 108.911H94.2127C93.7238 108.911 93.4793 109.107 93.4793 109.498V117.271C93.4793 117.663 93.6749 117.858 94.066 117.858H105.066L100.959 136.191H86.8793C86.3905 136.191 86.146 136.436 86.146 136.925V144.405C86.146 144.991 86.3905 145.285 86.8793 145.285H99.0527L93.4793 169.925C93.2838 170.511 93.4793 170.805 94.066 170.805H100.813Z" fill="#DA7B11"/></svg>',
  'add-comment': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M106.119 160.204L60.023 204.09V160.204H22.5456C18.3289 160.09 14.2984 158.443 11.209 155.571C8.29859 152.383 6.66104 148.237 6.60764 143.921V49.9708C6.65489 45.6534 8.29328 41.5053 11.209 38.321C14.3362 35.4159 18.4123 33.7458 22.6789 33.6214H163.653C165.819 33.5555 167.975 33.9321 169.991 34.7282C172.006 35.5242 173.838 36.723 175.374 38.2512C176.903 39.772 178.102 41.5918 178.897 43.5968C179.691 45.6019 180.063 47.7491 179.991 49.9045V119.935C182.204 119.669 184.43 119.537 186.659 119.538V49.5736C186.73 46.5478 186.184 43.5392 185.054 40.7314C183.924 37.9236 182.234 35.3753 180.087 33.2421C177.93 31.0987 175.363 29.4122 172.539 28.2832C169.715 27.1542 166.693 26.606 163.653 26.6712H22.7456C19.7277 26.6419 16.7343 27.2167 13.9418 28.3618C11.1494 29.5068 8.61422 31.199 6.48564 33.3387C4.36713 35.4684 2.70106 38.0044 1.58755 40.7943C0.474048 43.5842 -0.0638985 46.5705 0.00604132 49.5736V143.921C0.0705659 150.02 2.45496 155.866 6.67464 160.271C10.9869 164.412 16.7017 166.775 22.6792 166.89H53.3544V210.841C53.3459 211.329 53.434 211.813 53.6137 212.266C53.7933 212.719 54.0609 213.133 54.4011 213.482C55.0915 214.19 56.0334 214.598 57.0224 214.616C57.9736 214.634 58.8987 214.304 59.6231 213.687L108.742 166.673H128.748C129.131 164.472 129.704 162.308 130.459 160.205L106.119 160.204Z" fill="#E8C600"/><path opacity="0.1" d="M179.991 50.0222C180.067 47.8237 179.698 45.6325 178.905 43.5807C178.112 41.5288 176.911 39.6589 175.376 38.0837C173.857 36.5254 172.031 35.2992 170.015 34.4828C167.998 33.6664 165.833 33.2775 163.658 33.3406H22.7323C18.4474 33.4764 14.3638 35.1911 11.2665 38.1552C8.34058 41.4464 6.70637 45.6864 6.6665 50.09V143.523C6.71259 147.926 8.34598 152.164 11.2665 155.458C14.3264 158.388 18.3644 160.08 22.5992 160.205H59.9972V204.09L106.119 160.205H130.374C134.002 149.495 140.586 140.03 149.366 132.904C158.146 125.778 168.763 121.282 179.991 119.936L179.991 50.0222Z" fill="#E8C600"/><path fill-rule="evenodd" clip-rule="evenodd" d="M43.3333 80H150C150.884 80 151.732 80.3512 152.357 80.9763C152.982 81.6014 153.333 82.4493 153.333 83.3333C153.333 84.2174 152.982 85.0652 152.357 85.6904C151.732 86.3155 150.884 86.6667 150 86.6667H43.3333C42.4493 86.6667 41.6014 86.3155 40.9763 85.6904C40.3512 85.0652 40 84.2174 40 83.3333C40 82.4493 40.3512 81.6014 40.9763 80.9763C41.6014 80.3512 42.4493 80 43.3333 80Z" fill="#E8C600"/><path fill-rule="evenodd" clip-rule="evenodd" d="M43.3333 106.666H130C130.884 106.666 131.732 107.017 132.357 107.642C132.982 108.267 133.333 109.115 133.333 109.999C133.333 110.883 132.982 111.731 132.357 112.356C131.732 112.981 130.884 113.333 130 113.333H43.3333C42.4493 113.333 41.6014 112.981 40.9763 112.356C40.3512 111.731 40 110.883 40 109.999C40 109.115 40.3512 108.267 40.9763 107.642C41.6014 107.017 42.4493 106.666 43.3333 106.666Z" fill="#E8C600"/><path d="M186.667 130C196.556 130 206.223 132.932 214.445 138.427C222.667 143.921 229.076 151.73 232.86 160.866C236.645 170.002 237.635 180.055 235.706 189.755C233.777 199.454 229.014 208.363 222.022 215.355C215.029 222.348 206.12 227.11 196.421 229.039C186.722 230.969 176.669 229.978 167.532 226.194C158.396 222.41 150.587 216.001 145.093 207.779C139.599 199.556 136.667 189.889 136.667 180C136.667 166.739 141.934 154.021 151.311 144.645C160.688 135.268 173.406 130 186.667 130ZM190 153.333H183.333C182.449 153.333 181.601 153.685 180.976 154.31C180.351 154.935 180 155.783 180 156.667V173.333H163.333C162.449 173.333 161.601 173.685 160.976 174.31C160.351 174.935 160 175.783 160 176.667V183.333C160 184.217 160.351 185.065 160.976 185.69C161.601 186.315 162.449 186.667 163.333 186.667H180V203.333C180 204.217 180.351 205.065 180.976 205.69C181.601 206.315 182.449 206.667 183.333 206.667H190C190.884 206.667 191.732 206.315 192.357 205.69C192.982 205.065 193.333 204.217 193.333 203.333V186.667H210C210.884 186.667 211.732 186.315 212.357 185.69C212.982 185.065 213.333 184.217 213.333 183.333V176.667C213.333 175.783 212.982 174.935 212.357 174.31C211.732 173.685 210.884 173.333 210 173.333L193.333 173.327V156.667C193.333 155.783 192.982 154.935 192.357 154.31C191.732 153.685 190.884 153.333 190 153.333Z" fill="#E8C600"/></svg>',
  'crop-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M153.333 0.003305C157.727 0.248302 161.929 1.88242 165.333 4.66997L201.957 42.0033C204.85 45.3455 206.498 49.5849 206.623 54.0033L206.64 126.67L199.979 126.574L199.974 108.587L199.973 106.354L199.967 86.5648L199.967 84.839L199.96 64.474V63.4846L199.957 53.3366H163.333C160.701 53.2724 158.195 52.1982 156.333 50.3366C154.472 48.4749 153.398 45.9686 153.333 43.3366V6.66997H53.3334C49.8003 6.68031 46.415 8.08839 43.9167 10.5866C41.4185 13.0849 40.0104 16.4703 40 20.0033V193.337C40.0104 196.87 41.4185 200.255 43.9167 202.753C46.415 205.252 49.8003 206.66 53.3334 206.67H126.667V213.337H53.3334C48.2091 213.434 43.2504 211.521 39.5186 208.008C35.7868 204.496 33.5784 199.661 33.3662 194.54L33.3334 193.337V20.0033C33.285 17.3635 33.7692 14.7411 34.7571 12.2927C35.7451 9.84432 37.2165 7.62021 39.0834 5.7533C40.9503 3.88639 43.1744 2.415 45.6228 1.42705C48.0712 0.439105 50.6936 -0.0451234 53.3334 0.003305H153.333ZM160 9.46584V43.3366C159.973 43.7814 160.041 44.2268 160.199 44.6433C160.357 45.0599 160.602 45.4382 160.917 45.7533C161.232 46.0684 161.61 46.313 162.027 46.471C162.443 46.629 162.889 46.6968 163.333 46.67H196.623L160 9.46584Z" fill="#0265DC"/><path opacity="0.1" d="M155.867 6.66602C158.513 6.66608 161.051 7.71491 162.925 9.58275L197.059 43.5961C197.991 44.5251 198.731 45.629 199.235 46.8445C199.74 48.06 200 49.3632 200 50.6793V126.666H166.667V123.333L166.631 122.237C166.353 118.015 164.48 114.058 161.391 111.166C158.303 108.275 154.231 106.666 150 106.666H143.333L142.237 106.701C138.016 106.98 134.058 108.853 131.167 111.941C128.276 115.03 126.667 119.102 126.667 123.333V126.666H123.333L122.237 126.701C118.016 126.98 114.058 128.853 111.167 131.941C108.276 135.03 106.667 139.102 106.667 143.333V149.999L106.702 151.095C106.981 155.317 108.854 159.274 111.942 162.166C115.03 165.057 119.103 166.666 123.333 166.666H126.667V206.666H53.3333C49.7971 206.666 46.4057 205.261 43.9052 202.761C41.4048 200.26 40 196.869 40 193.333V19.9993C40 16.4631 41.4048 13.0717 43.9052 10.5713C46.4057 8.07077 49.7971 6.66602 53.3333 6.66602H155.867ZM193.333 166.666V193.333H166.667V166.666H193.333Z" fill="#0265DC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M153.333 206.667V123.333C153.333 122.449 152.982 121.601 152.357 120.976C151.732 120.351 150.884 120 150 120H143.333C142.449 120 141.601 120.351 140.976 120.976C140.351 121.601 140 122.449 140 123.333V140H123.333C122.449 140 121.601 140.351 120.976 140.976C120.351 141.601 120 142.449 120 143.333V150C120 150.884 120.351 151.732 120.976 152.357C121.601 152.982 122.449 153.333 123.333 153.333H140V216.667C140 217.551 140.351 218.399 140.976 219.024C141.601 219.649 142.449 220 143.333 220H206.667V236.667C206.667 237.551 207.018 238.399 207.643 239.024C208.268 239.649 209.116 240 210 240H216.667C217.551 240 218.399 239.649 219.024 239.024C219.649 238.399 220 237.551 220 236.667V220H236.667C237.551 220 238.399 219.649 239.024 219.024C239.649 218.399 240 217.551 240 216.667V210C240 209.116 239.649 208.268 239.024 207.643C238.399 207.018 237.551 206.667 236.667 206.667H153.333Z" fill="#0265DC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M206.667 200H220V143.333C220 142.449 219.649 141.601 219.024 140.976C218.399 140.351 217.551 140 216.667 140H160V153.333H206.667V200Z" fill="#0265DC"/></svg>',
  'split-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_17182_28568)"><path d="M153.337 -0.00353093C157.731 0.241466 161.933 1.87558 165.337 4.66314L201.961 41.9965C204.853 45.3387 206.502 49.578 206.627 53.9965L206.644 121.776L206.049 122.595L204.731 124.492L199.984 130.518L199.984 128.093L199.978 108.58L199.977 106.348L199.971 86.5581L199.971 84.8323L199.964 64.4672V63.4777L199.961 53.3298H163.337C160.705 53.2655 158.199 52.1913 156.337 50.3297C154.476 48.4681 153.402 45.9617 153.337 43.3298V6.66314H53.3373C49.8042 6.67348 46.4189 8.08156 43.9206 10.5798C41.4224 13.0781 40.0143 16.4634 40.004 19.9965V193.33C40.0143 196.863 41.4224 200.248 43.9206 202.746C46.4189 205.245 49.8042 206.653 53.3373 206.663L121.721 206.667C121.023 208.838 120.535 211.071 120.263 213.335L53.3373 213.33C50.6975 213.378 48.0751 212.894 45.6267 211.906C43.1783 210.918 40.9542 209.447 39.0873 207.58C37.2204 205.713 35.749 203.489 34.761 201.04C33.7731 198.592 33.2889 195.97 33.3373 193.33V19.9965C33.2889 17.3567 33.7731 14.7343 34.761 12.2859C35.749 9.83748 37.2204 7.61337 39.0873 5.74647C40.9542 3.87956 43.1783 2.40817 45.6267 1.42022C48.0751 0.432269 50.6975 -0.0519593 53.3373 -0.00353093H153.337ZM160.004 9.459V43.3298C159.977 43.7745 160.045 44.2199 160.203 44.6365C160.361 45.0531 160.606 45.4314 160.921 45.7465C161.236 46.0615 161.614 46.3061 162.031 46.4641C162.447 46.6222 162.893 46.69 163.337 46.6631H196.627L160.004 9.459Z" fill="#D31510"/><path opacity="0.1" d="M155.867 6.66699C158.513 6.66706 161.051 7.71589 162.925 9.58373L197.059 43.5971C197.991 44.5261 198.731 45.63 199.235 46.8455C199.74 48.061 200 49.3642 200 50.6803V130.494L186.733 147.357L169.091 124.116L167.806 122.351C166.54 120.213 164.861 118.349 162.868 116.866C160.875 115.383 158.607 114.312 156.196 113.714C153.784 113.116 151.278 113.004 148.823 113.384C146.368 113.764 144.014 114.629 141.896 115.928L141.014 116.419L140.216 117.038L139.133 117.924C135.582 120.762 133.196 124.806 132.431 129.287C131.665 133.768 132.572 138.375 134.979 142.231L135.742 143.584L137.797 146.995C139.405 149.618 141.286 152.471 143.485 155.645L146.278 159.615L159.603 177.889L158.468 179.984L157.316 182.027C156.694 181.994 156.07 181.977 155.444 181.977C147.932 181.99 140.617 184.389 134.556 188.827C128.494 193.265 123.998 199.513 121.717 206.671L53.3333 206.667C49.7971 206.667 46.4057 205.262 43.9052 202.762C41.4048 200.261 40 196.87 40 193.334V20.0003C40 16.4641 41.4048 13.0727 43.9052 10.5722C46.4057 8.07175 49.7971 6.66699 53.3333 6.66699H155.867Z" fill="#D31510"/><path d="M179.95 160.458L158.839 132.689C156.784 129.934 153.839 124.538 148.395 127.573C143.395 131.452 146.173 134.993 148.339 138.648C154.728 149.441 166.395 164.168 172.006 172.319C173.028 173.972 173.556 175.882 173.527 177.825C173.497 179.767 172.911 181.661 171.839 183.281C169.404 188 166.677 192.562 163.672 196.941C161.067 195.857 158.272 195.303 155.45 195.311C150.532 195.267 145.737 196.853 141.815 199.822C137.894 202.792 135.066 206.976 133.775 211.723C132.483 216.469 132.801 221.51 134.677 226.056C136.554 230.603 139.884 234.4 144.147 236.854C148.41 239.308 153.366 240.281 158.24 239.62C163.114 238.959 167.632 236.703 171.088 233.202C174.544 229.702 176.743 225.155 177.341 220.273C177.939 215.39 176.903 210.447 174.395 206.216C175.706 201.239 177.628 196.443 180.117 191.938C183.545 184.237 189.784 184.237 193.228 191.938C195.506 196.491 196.561 200.033 198.95 206.216C196.495 210.411 195.495 215.299 196.107 220.121C196.718 224.943 198.906 229.427 202.33 232.876C205.754 236.325 210.223 238.546 215.04 239.192C219.857 239.838 224.753 238.874 228.965 236.449C233.177 234.024 236.47 230.275 238.33 225.785C240.19 221.295 240.514 216.316 239.251 211.622C237.988 206.929 235.209 202.785 231.347 199.835C227.484 196.885 222.755 195.294 217.895 195.311C215.073 195.303 212.278 195.857 209.673 196.941C207.173 192.107 204.728 188.453 202.45 183.674C200.839 180.302 199.228 175.411 201.339 172.319C206.95 164.168 219.45 149.328 225.839 138.535C228.006 134.881 230.228 131.452 225.228 127.573C219.784 124.538 217.395 129.878 215.339 132.576L193.395 160.458C186.839 169.621 186.173 169.284 179.95 160.458ZM155.45 205.598C156.949 205.539 158.444 205.79 159.84 206.338C161.237 206.885 162.505 207.715 163.564 208.777C164.624 209.838 165.452 211.108 165.997 212.505C166.541 213.903 166.79 215.398 166.728 216.897C166.905 220.091 165.823 223.227 163.715 225.634C161.607 228.04 158.64 229.525 155.45 229.77C152.268 229.734 149.229 228.445 146.992 226.182C144.755 223.919 143.5 220.866 143.5 217.684C143.5 214.502 144.755 211.448 146.992 209.185C149.229 206.923 152.268 205.634 155.45 205.598ZM217.895 205.598C221.077 205.634 224.116 206.923 226.353 209.185C228.59 211.448 229.845 214.502 229.845 217.684C229.845 220.866 228.59 223.919 226.353 226.182C224.116 228.445 221.077 229.734 217.895 229.77C214.705 229.525 211.738 228.04 209.63 225.634C207.522 223.227 206.44 220.091 206.617 216.897C206.555 215.398 206.804 213.903 207.348 212.505C207.893 211.108 208.721 209.838 209.781 208.777C210.84 207.715 212.108 206.885 213.505 206.338C214.901 205.79 216.396 205.539 217.895 205.598Z" fill="#D31510"/></g><defs><clipPath id="clip0_17182_28568"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'delete-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.1" d="M127.467 153.733H120V120.399H146.667C147.971 116.445 150.477 112.996 153.835 110.534C157.193 108.073 161.236 106.72 165.4 106.666H186.667V50.666C186.664 48.0147 185.609 45.4729 183.733 43.5993L149.6 9.59935C147.726 7.72345 145.184 6.66835 142.533 6.66602H39.9998C36.4636 6.66602 33.0722 8.07077 30.5717 10.5713C28.0713 13.0717 26.6665 16.4631 26.6665 19.9993V193.333C26.6665 196.869 28.0713 200.26 30.5717 202.761C33.0722 205.261 36.4636 206.666 39.9998 206.666H132.066L127.467 153.733Z" fill="#864CCC"/><path opacity="0.1" d="M166.267 123.125H162.534C161.804 123.123 161.08 123.259 160.4 123.525H165.867L166.267 123.125Z" fill="#864CCC"/><path d="M132.067 206.667H40C36.4638 206.667 33.0724 205.262 30.5719 202.761C28.0714 200.261 26.6667 196.87 26.6667 193.333V20C26.6667 16.4638 28.0714 13.0724 30.5719 10.5719C33.0724 8.07142 36.4638 6.66667 40 6.66667H140V43.3333C140.067 45.9642 141.143 48.4687 143.004 50.3297C144.865 52.1906 147.369 53.2658 150 53.3333H186.667V106.667H193.333V54C193.211 49.581 191.562 45.3408 188.667 42L152.067 4.66667C148.661 1.88108 144.46 0.247217 140.067 0L40 0C34.6957 0 29.6086 2.10714 25.8579 5.85786C22.1071 9.60859 20 14.6957 20 20V193.333C20 198.638 22.1071 203.725 25.8579 207.475C29.6086 211.226 34.6957 213.333 40 213.333H132.667L132.067 206.667ZM146.667 9.46667L183.267 46.6667H149.933C149.488 46.6961 149.041 46.6301 148.624 46.473C148.206 46.3159 147.826 46.0714 147.511 45.7558C147.195 45.4402 146.951 45.0608 146.794 44.643C146.637 44.2252 146.571 43.7787 146.6 43.3333L146.667 9.46667Z" fill="#864CCC"/><path d="M200.251 119.662C201.897 119.658 203.49 120.234 204.752 121.291C206.013 122.347 206.861 123.815 207.145 125.435L207.239 126.253L206.905 132.664L236.262 132.997L235.928 140.646L225.938 140.341L218.087 230.524C218.008 231.381 217.654 232.19 217.078 232.829C216.501 233.468 215.733 233.904 214.889 234.071L214.229 234.146H152.145C151.286 234.119 150.458 233.815 149.785 233.279C149.112 232.743 148.63 232.004 148.411 231.172L148.298 230.521L141.174 140.646L129.984 140.309L130.388 132.797L159.789 133.131L159.789 126.367C159.885 124.728 160.556 123.175 161.684 121.982C162.812 120.788 164.324 120.031 165.956 119.842L166.775 119.796L200.251 119.662ZM147.9 139.647L147.566 140.009L155.084 226.804L211.208 227.109L219.085 140.474L147.9 139.647ZM200.252 126.515H166.377L166.044 133.329L200.252 133.663L200.585 126.848L200.252 126.515Z" fill="#864CCC"/><path d="M186.668 152.994H180.001L179.668 213.327L186.668 213.661L187.001 153.327L186.668 152.994Z" fill="#864CCC"/><path d="M167.274 152.812L159.974 153.446L164.954 214.246L172.621 213.912L167.641 153.113L167.274 152.812Z" fill="#864CCC"/><path d="M198.952 153.113L193.666 213.546L201.272 214.546L206.926 153.812L199.312 152.812L198.952 153.113Z" fill="#864CCC"/></svg>',
  'insert-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_16721_72733)"><path d="M186.608 140C196.497 140 206.164 142.932 214.386 148.427C222.609 153.921 229.018 161.73 232.802 170.866C236.586 180.002 237.576 190.055 235.647 199.755C233.718 209.454 228.956 218.363 221.963 225.355C214.971 232.348 206.061 237.11 196.362 239.039C186.663 240.969 176.61 239.978 167.474 236.194C158.337 232.41 150.529 226.001 145.034 217.779C139.54 209.556 136.608 199.889 136.608 190C136.608 176.739 141.876 164.021 151.253 154.645C160.629 145.268 173.347 140 186.608 140ZM190 163.333H183.333C182.449 163.333 181.601 163.685 180.976 164.31C180.351 164.935 180 165.783 180 166.667V183.333H163.333C162.449 183.333 161.601 183.685 160.976 184.31C160.351 184.935 160 185.783 160 186.667V193.333C160 194.217 160.351 195.065 160.976 195.69C161.601 196.315 162.449 196.667 163.333 196.667H180V213.333C180 214.217 180.351 215.065 180.976 215.69C181.601 216.315 182.449 216.667 183.333 216.667H190C190.884 216.667 191.732 216.315 192.357 215.69C192.982 215.065 193.333 214.217 193.333 213.333V196.667H210C210.884 196.667 211.732 196.315 212.357 195.69C212.982 195.065 213.333 194.217 213.333 193.333V186.667C213.333 185.783 212.982 184.935 212.357 184.31C211.732 183.685 210.884 183.333 210 183.333L193.333 183.327V166.667C193.333 165.783 192.982 164.935 192.357 164.31C191.732 163.685 190.884 163.333 190 163.333Z" fill="#DA7B11"/><path d="M135.867 6.30045e-05C138.047 -0.00596858 140.207 0.421122 142.222 1.25655C144.236 2.09198 146.064 3.31911 147.6 4.86673L181.733 38.8667C184.869 41.9958 186.642 46.2368 186.667 50.6667V130.267C184.439 130.265 182.212 130.399 180 130.667V53.4534L146.667 53.4563C143.303 53.4562 140.063 52.1846 137.597 49.8965C135.131 47.6083 133.621 44.4727 133.37 41.1181L133.333 40.1231V6.66673H33.3335C29.9695 6.66685 26.7298 7.93846 24.2639 10.2267C21.798 12.5149 20.288 15.6506 20.0368 19.0052L20.0002 20.0001V193.333C20.0002 196.87 21.4049 200.261 23.9054 202.761C26.4059 205.262 29.7973 206.667 33.3335 206.667H129.067C129.704 208.936 130.483 211.162 131.4 213.333H33.3335C28.0292 213.333 22.9421 211.226 19.1914 207.476C15.4406 203.725 13.3335 198.638 13.3335 193.333V20.0001C13.3335 14.6957 15.4406 9.60865 19.1914 5.85793C22.9421 2.1072 28.0292 6.30045e-05 33.3335 6.30045e-05H135.867ZM142.934 9.60006C142.088 8.75377 141.098 8.066 140.01 7.56946L140 40.1231C140 41.7566 140.6 43.3333 141.686 44.5539C142.771 45.7745 144.267 46.5542 145.889 46.7449L146.667 46.7897L179.213 46.7875C178.711 45.5963 177.982 44.514 177.067 43.6004L142.934 9.60006Z" fill="#DA7B11"/><path opacity="0.1" d="M126.667 190.266C126.674 175.512 132.116 161.278 141.955 150.284C151.793 139.289 165.338 132.305 180 130.666V50.666C179.998 48.0147 178.943 45.4729 177.067 43.5993L142.933 9.59935C141.06 7.72345 138.518 6.66835 135.867 6.66602H33.3333C29.7971 6.66602 26.4057 8.07077 23.9052 10.5713C21.4048 13.0717 20 16.4631 20 19.9993V193.333C20 196.869 21.4048 200.26 23.9052 202.761C26.4057 205.261 29.7971 206.666 33.3333 206.666H129.067C127.507 201.338 126.699 195.818 126.667 190.266Z" fill="#DA7B11"/><path d="M49.9998 100.001H156.667C157.551 100.001 158.398 100.352 159.024 100.977C159.649 101.602 160 102.45 160 103.334C160 104.218 159.649 105.066 159.024 105.691C158.398 106.316 157.551 106.667 156.667 106.667H49.9998C49.1158 106.667 48.2679 106.316 47.6428 105.691C47.0177 105.066 46.6665 104.218 46.6665 103.334C46.6665 102.45 47.0177 101.602 47.6428 100.977C48.2679 100.352 49.1158 100.001 49.9998 100.001ZM49.9998 126.667H136.667C137.551 126.667 138.398 127.019 139.024 127.644C139.649 128.269 140 129.117 140 130.001C140 130.885 139.649 131.733 139.024 132.358C138.398 132.983 137.551 133.334 136.667 133.334H49.9998C49.1158 133.334 48.2679 132.983 47.6428 132.358C47.0177 131.733 46.6665 130.885 46.6665 130.001C46.6665 129.117 47.0177 128.269 47.6428 127.644C48.2679 127.019 49.1158 126.667 49.9998 126.667ZM49.9998 73.334H116.667C117.551 73.334 118.398 73.6852 119.024 74.3103C119.649 74.9354 120 75.7833 120 76.6673C120 77.5514 119.649 78.3992 119.024 79.0243C118.398 79.6495 117.551 80.0007 116.667 80.0007H49.9998C49.1158 80.0007 48.2679 79.6495 47.6428 79.0243C47.0177 78.3992 46.6665 77.5514 46.6665 76.6673C46.6665 75.7833 47.0177 74.9354 47.6428 74.3103C48.2679 73.6852 49.1158 73.334 49.9998 73.334Z" fill="#DA7B11"/></g><defs><clipPath id="clip0_16721_72733"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'reorder-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M171.196 45.0067L189.532 25.0119C189.851 24.6998 190.256 24.489 190.695 24.406C191.134 24.3229 191.588 24.3714 191.999 24.5452C192.402 24.7176 192.744 25.0064 192.982 25.3745C193.219 25.7426 193.342 26.1733 193.333 26.6114V77.7981C193.315 78.3876 193.069 78.9471 192.645 79.3578C192.222 79.7685 191.655 79.9982 191.066 79.9981H141.392C140.954 80.0067 140.523 79.8845 140.155 79.6469C139.787 79.4094 139.498 79.0674 139.326 78.6647C139.133 78.2572 139.074 77.7989 139.158 77.3558C139.241 76.9127 139.464 76.5076 139.792 76.1987L161.328 55.2041C156.062 46.8235 148.837 39.8484 140.277 34.8791C131.717 29.9099 122.077 27.0955 112.188 26.6781C98.0785 26.3533 84.3361 31.1929 73.5436 40.2874C62.7512 49.3818 55.6519 62.1049 53.58 76.0653C53.3952 77.1438 52.8425 78.1249 52.016 78.8419C51.1894 79.5589 50.14 79.9675 49.0463 79.9981H44.5123C43.8535 79.995 43.2031 79.8506 42.605 79.5745C42.0068 79.2985 41.4749 78.8973 41.0451 78.3981C40.6412 77.9117 40.3435 77.3461 40.1713 76.7377C39.9991 76.1293 39.9561 75.4917 40.0451 74.8657C42.16 60.4959 48.5703 47.1015 58.4347 36.4406C68.2991 25.7796 81.1565 18.3505 95.3192 15.1284C109.482 11.9063 124.288 13.0419 137.793 18.386C151.299 23.7301 162.873 33.0329 170.996 45.0734L171.196 45.0067Z" fill="#B130BD"/><path d="M68.6 128.666L52 111.333C48.5942 108.547 44.3929 106.913 40 106.666H20C14.6957 106.666 9.60859 108.773 5.85786 112.524C2.10714 116.275 0 121.362 0 126.666L0 186.666C0 191.97 2.10714 197.057 5.85786 200.808C9.60859 204.559 14.6957 206.666 20 206.666H53.3333C58.6377 206.666 63.7247 204.559 67.4755 200.808C71.2262 197.057 73.3333 191.97 73.3333 186.666V140.666C73.1922 136.239 71.5193 131.998 68.6 128.666ZM66.6667 186.666C66.6667 190.202 65.2619 193.594 62.7614 196.094C60.2609 198.595 56.8695 199.999 53.3333 199.999H20C16.4638 199.999 13.0724 198.595 10.5719 196.094C8.07142 193.594 6.66667 190.202 6.66667 186.666V126.666C6.66667 123.13 8.07142 119.738 10.5719 117.238C13.0724 114.737 16.4638 113.333 20 113.333H40V129.999C40.0675 132.63 41.1427 135.135 43.0037 136.996C44.8646 138.857 47.3691 139.932 50 139.999H66.6667V186.666ZM46.6667 116.133L63.2667 133.333H49.9333C49.488 133.362 49.0414 133.296 48.6237 133.139C48.2059 132.982 47.8265 132.737 47.5109 132.422C47.1953 132.106 46.9507 131.727 46.7937 131.309C46.6366 130.891 46.5705 130.445 46.6 129.999L46.6667 116.133Z" fill="#B130BD"/><path opacity="0.1" d="M66.6665 186.667C66.6665 190.204 65.2617 193.595 62.7613 196.095C60.2608 198.596 56.8694 200.001 53.3332 200.001H19.9998C16.4636 200.001 13.0722 198.596 10.5717 196.095C8.07126 193.595 6.6665 190.204 6.6665 186.667V126.667C6.6665 123.131 8.07126 119.74 10.5717 117.239C13.0722 114.739 16.4636 113.334 19.9998 113.334H39.9998V130.001C40.0673 132.632 41.1426 135.136 43.0035 136.997C44.8644 138.858 47.3689 139.933 49.9998 140.001H66.6665V186.667ZM146.667 186.667C146.667 190.204 145.262 193.595 142.761 196.095C140.261 198.596 136.869 200.001 133.333 200.001H99.9998C96.4636 200.001 93.0722 198.596 90.5717 196.095C88.0713 193.595 86.6665 190.204 86.6665 186.667V126.667C86.6665 123.131 88.0713 119.74 90.5717 117.239C93.0722 114.739 96.4636 113.334 99.9998 113.334H120V130.001C120.067 132.632 121.143 135.136 123.003 136.997C124.864 138.858 127.369 139.933 130 140.001H146.667V186.667Z" fill="#B130BD"/><path opacity="0.1" d="M46.6665 113.334L66.6665 133.341L49.3332 133.334C47.7332 133.334 46.6665 131.801 46.6665 129.467V113.334Z" fill="#B130BD"/><path opacity="0.1" d="M126.667 113.334L146.667 133.341L129.333 133.334C127.733 133.334 126.667 131.801 126.667 129.467V113.334Z" fill="#B130BD"/><path d="M148.6 128.666L132 111.333C128.594 108.547 124.393 106.913 120 106.666H100C94.6957 106.666 89.6086 108.773 85.8579 112.524C82.1071 116.275 80 121.362 80 126.666V186.666C80 191.97 82.1071 197.057 85.8579 200.808C89.6086 204.559 94.6957 206.666 100 206.666H133.333C138.638 206.666 143.725 204.559 147.475 200.808C151.226 197.057 153.333 191.97 153.333 186.666V140.666C153.192 136.239 151.519 131.998 148.6 128.666ZM146.667 186.666C146.667 190.202 145.262 193.594 142.761 196.094C140.261 198.595 136.87 199.999 133.333 199.999H100C96.4638 199.999 93.0724 198.595 90.5719 196.094C88.0714 193.594 86.6667 190.202 86.6667 186.666V126.666C86.6667 123.13 88.0714 119.738 90.5719 117.238C93.0724 114.737 96.4638 113.333 100 113.333H120V129.999C120.067 132.63 121.143 135.135 123.004 136.996C124.865 138.857 127.369 139.932 130 139.999H146.667V186.666ZM126.667 116.133L143.267 133.333H129.933C129.488 133.362 129.041 133.296 128.624 133.139C128.206 132.982 127.827 132.737 127.511 132.422C127.195 132.106 126.951 131.727 126.794 131.309C126.637 130.891 126.571 130.445 126.6 129.999L126.667 116.133ZM233.333 193.333C233.333 196.869 231.929 200.26 229.428 202.761C226.928 205.261 223.536 206.666 220 206.666H173.333C169.797 206.666 166.406 205.261 163.905 202.761C161.405 200.26 160 196.869 160 193.333V119.999C160 116.463 161.405 113.072 163.905 110.571C166.406 108.071 169.797 106.666 173.333 106.666H200V129.999C200.067 132.63 201.143 135.135 203.004 136.996C204.865 138.857 207.369 139.932 210 139.999H233.333V193.333ZM206.667 106.666L233.333 133.333L210 132.866C209.555 132.895 209.108 132.829 208.69 132.672C208.273 132.515 207.893 132.271 207.578 131.955C207.262 131.64 207.017 131.26 206.86 130.842C206.703 130.425 206.637 129.978 206.667 129.533V106.666Z" fill="#B130BD"/></svg>',
  'extract-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_16721_72947)"><path d="M142.533 13.334C146.483 13.3231 150.306 14.7323 153.303 17.3046L154.267 18.2007L188.4 52.2007C191.212 55.007 192.939 58.7193 193.274 62.6783L193.333 64.0007V127.587L193.274 127.589C191.074 127.74 188.873 127.97 186.672 128.279L186.667 66.7874L153.333 66.7902C149.969 66.7901 146.73 65.5186 144.264 63.2304C141.798 60.9422 140.288 57.8066 140.037 54.452L140 53.457V20.0007H40C36.636 20.0008 33.3962 21.2724 30.9303 23.5606C28.4644 25.8489 26.9545 28.9846 26.7033 32.3392L26.6667 33.334V206.667C26.6668 210.031 27.9383 213.271 30.2265 215.737C32.5147 218.203 35.6503 219.713 39.0049 219.964L40 220.001H173.333C176.697 220.001 179.937 218.729 182.403 216.441C184.869 214.153 186.379 211.017 186.63 207.662L186.667 206.667L186.663 186.657C188.53 188.624 190.807 190.156 193.333 191.144V206.667C193.333 211.768 191.384 216.677 187.885 220.388C184.386 224.099 179.601 226.334 174.508 226.634L173.333 226.667H40C34.8991 226.667 29.9909 224.718 26.2795 221.219C22.5681 217.72 20.3339 212.935 20.0339 207.843L20 206.667V33.334C20.0001 28.2332 21.9492 23.325 25.4485 19.6137C28.9477 15.9023 33.7328 13.6681 38.8249 13.3682L40 13.334H142.533ZM146.677 20.9036L146.667 53.457C146.667 55.0905 147.266 56.6672 148.352 57.8878C149.438 59.1084 150.934 59.8881 152.556 60.0788L153.333 60.1237L185.88 60.1215C185.505 59.2318 185.002 58.4012 184.389 57.6556L183.733 56.9341L149.6 22.934C148.755 22.0878 147.765 21.4001 146.677 20.9036Z" fill="#0265DC"/><path opacity="0.1" d="M142.534 20C145.185 20.0023 147.727 21.0574 149.6 22.9333L183.734 56.9333C185.61 58.8069 186.665 61.3487 186.667 64L186.672 128.279C179.06 129.37 171.597 131.324 164.427 134.104C152.474 138.522 141.545 145.326 132.304 154.1C123.063 162.875 115.703 173.437 110.672 185.145L110.335 185.975L109.782 187.482L109.439 189.034L109.276 189.911C108.605 194.348 109.565 198.878 111.979 202.661C114.393 206.444 118.097 209.223 122.404 210.483C126.711 211.742 131.329 211.398 135.401 209.512C139.473 207.626 142.724 204.328 144.549 200.229C147.599 192.97 152.121 186.422 157.83 181C163.539 175.577 170.31 171.397 177.716 168.724L180.032 167.88C180.802 167.614 181.57 167.363 182.337 167.128L182.9 166.967L182.842 167.11C181.557 170.395 181.234 173.977 181.911 177.439C182.587 180.9 184.236 184.098 186.663 186.656L186.667 206.667C186.667 210.203 185.262 213.594 182.762 216.095C180.261 218.595 176.87 220 173.334 220H40.0003C36.4641 220 33.0727 218.595 30.5722 216.095C28.0717 213.594 26.667 210.203 26.667 206.667V33.3333C26.667 29.7971 28.0717 26.4057 30.5722 23.9052C33.0727 21.4048 36.4641 20 40.0003 20H142.534Z" fill="#0265DC"/><path d="M125.018 188.934C129.337 178.826 135.677 169.707 143.648 162.137C151.619 154.568 161.053 148.708 171.371 144.917C187.858 138.285 206.075 137.282 223.19 142.065L208.583 120.556L208.305 120.1C207.672 118.924 207.515 117.551 207.866 116.263C208.216 114.974 209.048 113.87 210.19 113.177C211.331 112.485 212.695 112.257 213.999 112.541C215.304 112.825 216.45 113.599 217.2 114.704L239.2 147.101L239.477 147.557C240.078 148.743 240.234 150.105 239.917 151.397C239.601 152.688 238.832 153.824 237.751 154.598L236.518 155.441C236.381 155.544 236.239 155.64 236.093 155.729L205.183 176.565L204.727 176.841C203.549 177.47 202.175 177.624 200.888 177.269C199.6 176.915 198.498 176.079 197.809 174.935C197.12 173.792 196.897 172.427 197.185 171.123C197.473 169.819 198.251 168.676 199.358 167.929L222.094 152.597C206.661 147.856 190.066 148.578 175.104 154.642C166.063 157.943 157.796 163.066 150.818 169.693C143.839 176.321 138.296 184.312 134.534 193.171C133.972 194.433 132.932 195.42 131.642 195.915C130.353 196.41 128.919 196.372 127.657 195.811C126.395 195.249 125.408 194.209 124.913 192.919C124.418 191.629 124.456 190.196 125.018 188.934Z" fill="#0265DC"/><path d="M56.6663 113.673H163.333C164.217 113.673 165.065 114.024 165.69 114.649C166.315 115.274 166.666 116.122 166.666 117.006C166.666 117.89 166.315 118.738 165.69 119.363C165.065 119.988 164.217 120.339 163.333 120.339H56.6663C55.7823 120.339 54.9344 119.988 54.3093 119.363C53.6842 118.738 53.333 117.89 53.333 117.006C53.333 116.122 53.6842 115.274 54.3093 114.649C54.9344 114.024 55.7823 113.673 56.6663 113.673ZM56.6663 140.339H136.666C137.55 140.339 138.398 140.69 139.023 141.316C139.648 141.941 140 142.788 140 143.673C140 144.557 139.648 145.404 139.023 146.03C138.398 146.655 137.55 147.006 136.666 147.006H56.6663C55.7823 147.006 54.9344 146.655 54.3093 146.03C53.6842 145.404 53.333 144.557 53.333 143.673C53.333 142.788 53.6842 141.941 54.3093 141.316C54.9344 140.69 55.7823 140.339 56.6663 140.339ZM56.6663 87.0059H123.333C124.217 87.0059 125.065 87.357 125.69 87.9822C126.315 88.6073 126.666 89.4551 126.666 90.3392C126.666 91.2232 126.315 92.0711 125.69 92.6962C125.065 93.3213 124.217 93.6725 123.333 93.6725H56.6663C55.7823 93.6725 54.9344 93.3213 54.3093 92.6962C53.6842 92.0711 53.333 91.2232 53.333 90.3392C53.333 89.4551 53.6842 88.6073 54.3093 87.9822C54.9344 87.357 55.7823 87.0059 56.6663 87.0059Z" fill="#0265DC"/></g><defs><clipPath id="clip0_16721_72947"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  sendforsignature: '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M100.046 136.854C99.9814 133.005 96.8082 129.936 92.9586 130.001L77.0917 130.001C73.2421 129.935 70.0676 133.001 70.0011 136.851C70.0011 136.852 70.0012 136.85 70.0011 136.851L69.9561 170L84.0006 188.671C84.4161 189.222 85.1993 189.332 85.7509 188.917C85.8453 188.846 85.929 188.763 85.9995 188.668L100.001 170L100.046 136.854Z" fill="#B130BD"/><path opacity="0.1" d="M61.0001 220C52.1321 219.954 44.9745 212.739 45.0001 203.871V36.1292C44.9745 27.2611 52.1321 20.0457 61.0001 20H159.432C162.827 19.9942 166.082 21.3504 168.469 23.7647L201.234 56.6809C203.658 59.1027 205.014 62.3926 205 65.8191V203.871C205.026 212.739 197.868 219.954 189 220H61.0001Z" fill="#B130BD"/><path d="M188.999 223.75H61.001C50.0631 223.702 41.2278 214.81 41.25 203.872V36.128C41.2278 25.19 50.0631 16.2978 61.001 16.25H159.434C163.828 16.2392 168.042 17.9952 171.128 21.1231L203.892 54.0331C207.017 57.1577 208.766 61.4008 208.75 65.8203V203.872C208.772 214.81 199.937 223.702 188.999 223.75ZM61.001 23.75C54.2035 23.7935 48.7234 29.3303 48.75 36.128V203.872C48.7235 210.67 54.2035 216.207 61.001 216.25H188.999C195.797 216.207 201.277 210.67 201.25 203.872V65.8203C201.262 63.3873 200.3 61.0506 198.579 59.3311L165.811 26.4111C164.128 24.704 161.83 23.7451 159.434 23.75H61.001Z" fill="#B130BD"/><path d="M180 188.75H140C137.929 188.75 136.25 187.071 136.25 185C136.25 182.929 137.929 181.25 140 181.25H180C182.071 181.25 183.75 182.929 183.75 185C183.75 187.071 182.071 188.75 180 188.75Z" fill="#B130BD"/><path d="M125 188.75H102.5C100.429 188.75 98.75 187.071 98.75 185C98.75 182.929 100.429 181.25 102.5 181.25H125C127.071 181.25 128.75 182.929 128.75 185C128.75 187.071 127.071 188.75 125 188.75Z" fill="#B130BD"/><path d="M110 68.75H75C72.929 68.75 71.25 67.0711 71.25 65C71.25 62.929 72.929 61.25 75 61.25H110C112.071 61.25 113.75 62.929 113.75 65C113.75 67.0711 112.071 68.75 110 68.75Z" fill="#B130BD"/><path d="M170 88.75H75C72.929 88.75 71.25 87.0711 71.25 85C71.25 82.929 72.929 81.25 75 81.25H170C172.071 81.25 173.75 82.929 173.75 85C173.75 87.0711 172.071 88.75 170 88.75Z" fill="#B130BD"/><path d="M170 108.75H75C72.929 108.75 71.25 107.071 71.25 105C71.25 102.929 72.929 101.25 75 101.25H170C172.071 101.25 173.75 102.929 173.75 105C173.75 107.071 172.071 108.75 170 108.75Z" fill="#B130BD"/><path d="M155.488 157.695L163.442 149.741C164.906 148.277 164.906 145.902 163.442 144.438C161.978 142.974 159.604 142.974 158.139 144.438L150.185 152.392L142.231 144.438C140.767 142.974 138.393 142.974 136.928 144.438C135.464 145.902 135.464 148.277 136.928 149.741L144.882 157.695L136.928 165.649C135.464 167.113 135.464 169.487 136.928 170.952C138.393 172.416 140.767 172.416 142.231 170.952L150.185 162.998L158.139 170.952C159.604 172.416 161.978 172.416 163.442 170.952C164.906 169.487 164.906 167.113 163.442 165.649L155.488 157.695Z" fill="#B130BD"/></svg>',
  'pdf-to-word': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_20447_96392)"><path d="M208.4 38.8667L174.267 4.86673C172.731 3.31906 170.902 2.09189 168.888 1.25646C166.874 0.421027 164.714 -0.00603365 162.533 6.43952e-05H60C54.6957 6.43952e-05 49.6086 2.1072 45.8579 5.85793C42.1071 9.60866 40 14.6957 40 20.0001V131.533C42.2 131.067 44.4 130.667 46.6667 130.4V20.0001C46.6667 16.4638 48.0714 13.0725 50.5719 10.572C53.0724 8.07149 56.4638 6.66673 60 6.66673H162.533C165.185 6.66906 167.726 7.72416 169.6 9.60006L203.733 43.6001C205.609 45.4736 206.664 48.0155 206.667 50.6667V193.333C206.667 196.87 205.262 200.261 202.761 202.761C200.261 205.262 196.87 206.667 193.333 206.667H110.933C110.296 208.936 109.517 211.162 108.6 213.333H193.333C198.638 213.333 203.725 211.226 207.475 207.476C211.226 203.725 213.333 198.638 213.333 193.333V50.6667C213.309 46.2368 211.536 41.9958 208.4 38.8667Z" fill="#0265DC"/><path opacity="0.1" d="M203.733 43.6003L169.6 9.60033C167.726 7.72443 165.184 6.66933 162.533 6.66699H59.9998C56.4636 6.66699 53.0722 8.07175 50.5717 10.5722C48.0713 13.0727 46.6665 16.4641 46.6665 20.0003V130.4C48.8786 130.132 51.1049 129.999 53.3332 130C62.6329 130.006 71.8039 132.174 80.1222 136.332C88.4405 140.49 95.6784 146.525 101.264 153.96C106.85 161.395 110.632 170.027 112.31 179.174C113.988 188.321 113.516 197.733 110.933 206.667H193.333C196.869 206.667 200.261 205.262 202.761 202.762C205.262 200.261 206.667 196.87 206.667 193.334V50.667C206.664 48.0157 205.609 45.4739 203.733 43.6003Z" fill="#0265DC"/><path d="M53.3673 199.985H29.9772C29.1214 199.985 28.3007 199.645 27.6956 199.04C27.0905 198.435 26.7505 197.614 26.7505 196.758V183.25C26.7505 182.394 27.0905 181.573 27.6956 180.968C28.3007 180.363 29.1214 180.023 29.9772 180.023H53.3673V164.414C53.4081 164.045 53.5901 163.707 53.8751 163.469C54.16 163.232 54.5258 163.114 54.8957 163.141C55.2662 163.12 55.6304 163.242 55.9146 163.48L83.6973 189.225C83.942 189.475 84.079 189.81 84.079 190.159C84.079 190.509 83.942 190.844 83.6973 191.093L55.9146 216.652C55.6134 216.893 55.2391 217.024 54.8532 217.024C54.4674 217.024 54.093 216.893 53.7919 216.652C53.5359 216.406 53.384 216.072 53.3673 215.718V199.985ZM53.3335 140C43.4445 140 33.7775 142.932 25.555 148.427C17.3325 153.921 10.9239 161.73 7.13954 170.866C3.35516 180.002 2.36499 190.055 4.29425 199.755C6.22352 209.454 10.9856 218.363 17.9782 225.355C24.9708 232.348 33.88 237.11 43.579 239.039C53.2781 240.969 63.3314 239.978 72.4677 236.194C81.604 232.41 89.4129 226.001 94.907 217.779C100.401 209.556 103.334 199.889 103.334 190C103.334 176.739 98.0657 164.021 88.6889 154.645C79.312 145.268 66.5943 140 53.3335 140Z" fill="#0265DC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M75.4722 46.667C74.9274 46.6659 74.4027 46.8728 74.0053 47.2454C73.6078 47.618 73.3675 48.1283 73.3335 48.672V64.3779C73.3335 64.6404 73.3868 64.9002 73.4902 65.1414C73.5936 65.3827 73.7449 65.6004 73.935 65.7815C74.1242 65.9752 74.3546 66.1239 74.6092 66.2164C74.8637 66.309 75.1358 66.343 75.4053 66.3161H77.8113C78.0797 66.3301 78.3481 66.2899 78.6007 66.1981C78.8533 66.1063 79.0848 65.9646 79.2816 65.7815C79.6233 65.3672 79.8121 64.848 79.8162 64.3111V52.8825H96.5912V93.4506H88.9723C88.3919 93.4983 87.8486 93.7549 87.443 94.1728C87.0374 94.5906 86.7972 95.1414 86.7668 95.7229V97.9953C86.8326 98.5505 87.1007 99.062 87.5199 99.4319C87.9391 99.8018 88.48 100.004 89.0391 100H111.161C111.441 100 111.72 99.945 111.979 99.8375C112.239 99.73 112.474 99.5725 112.673 99.3739C112.871 99.1753 113.029 98.9395 113.136 98.68C113.244 98.4206 113.299 98.1424 113.299 97.8616V95.2549C113.274 94.9911 113.197 94.7349 113.072 94.5011C112.948 94.2673 112.778 94.0605 112.573 93.8927C112.368 93.7249 112.131 93.5994 111.878 93.5235C111.624 93.4476 111.357 93.4228 111.094 93.4505H103.14V53.3505H120.116V64.6453C120.089 64.9093 120.117 65.1761 120.197 65.429C120.278 65.6819 120.409 65.9156 120.584 66.1156C120.768 66.2968 120.988 66.4379 121.23 66.5299C121.471 66.6219 121.729 66.6629 121.987 66.6503H124.794C125.042 66.6618 125.29 66.6201 125.521 66.5279C125.751 66.4356 125.959 66.295 126.131 66.1156C126.309 65.929 126.448 65.7087 126.54 65.4677C126.632 65.2267 126.674 64.9698 126.666 64.7121V48.6721C126.649 48.1456 126.432 47.6453 126.06 47.2728C125.688 46.9004 125.187 46.6837 124.661 46.667H75.4722Z" fill="#0265DC"/><path d="M176.867 80H129.8C128.069 80 126.667 81.4028 126.667 83.1333V83.5333C126.667 85.2638 128.069 86.6667 129.8 86.6667H176.867C178.597 86.6667 180 85.2638 180 83.5333V83.1333C180 81.4028 178.597 80 176.867 80Z" fill="#0265DC"/><path d="M176.867 93.333H129.8C128.069 93.333 126.667 94.7359 126.667 96.4663V96.8663C126.667 98.5968 128.069 99.9997 129.8 99.9997H176.867C178.597 99.9997 180 98.5968 180 96.8663V96.4663C180 94.7359 178.597 93.333 176.867 93.333Z" fill="#0265DC"/><path d="M176.867 106.667H89.7998C88.0693 106.667 86.6665 108.07 86.6665 109.8V110.2C86.6665 111.931 88.0693 113.334 89.7998 113.334H176.867C178.597 113.334 180 111.931 180 110.2V109.8C180 108.07 178.597 106.667 176.867 106.667Z" fill="#0265DC"/></g><defs><clipPath id="clip0_20447_96392"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'pdf-to-ppt': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_20447_96556)"><path d="M208.4 38.8667L174.267 4.86673C172.731 3.31906 170.902 2.09189 168.888 1.25646C166.874 0.421027 164.714 -0.00603365 162.533 6.43952e-05H60C54.6957 6.43952e-05 49.6086 2.1072 45.8579 5.85793C42.1071 9.60866 40 14.6957 40 20.0001V131.533C42.2 131.067 44.4 130.667 46.6667 130.4V20.0001C46.6667 16.4638 48.0714 13.0725 50.5719 10.572C53.0724 8.07149 56.4638 6.66673 60 6.66673H162.533C165.185 6.66906 167.726 7.72416 169.6 9.60006L203.733 43.6001C205.609 45.4736 206.664 48.0155 206.667 50.6667V193.333C206.667 196.87 205.262 200.261 202.761 202.761C200.261 205.262 196.87 206.667 193.333 206.667H110.933C110.296 208.936 109.517 211.162 108.6 213.333H193.333C198.638 213.333 203.725 211.226 207.475 207.476C211.226 203.725 213.333 198.638 213.333 193.333V50.6667C213.309 46.2368 211.536 41.9958 208.4 38.8667Z" fill="#DA7B11"/><path opacity="0.1" d="M203.733 43.6003L169.6 9.60033C167.726 7.72443 165.184 6.66933 162.533 6.66699H59.9998C56.4636 6.66699 53.0722 8.07175 50.5717 10.5722C48.0713 13.0727 46.6665 16.4641 46.6665 20.0003V130.4C48.8786 130.132 51.1049 129.999 53.3332 130C62.6329 130.006 71.8039 132.174 80.1222 136.332C88.4405 140.49 95.6784 146.525 101.264 153.96C106.85 161.395 110.632 170.027 112.31 179.174C113.988 188.321 113.516 197.733 110.933 206.667H193.333C196.869 206.667 200.261 205.262 202.761 202.762C205.262 200.261 206.667 196.87 206.667 193.334V50.667C206.664 48.0157 205.609 45.4739 203.733 43.6003Z" fill="#DA7B11"/><path d="M93.9949 46.667C92.078 46.6863 90.2463 47.4618 88.8983 48.8248C87.5503 50.1877 86.795 52.0279 86.7968 53.9449V60.2212H80.5317C78.6203 60.2576 76.7985 61.0386 75.4541 62.3978C74.1097 63.7571 73.3489 65.5873 73.3335 67.4991V126.056C73.3489 127.968 74.1097 129.798 75.4541 131.157C76.7985 132.516 78.6203 133.297 80.5317 133.334H159.578C161.49 133.297 163.312 132.516 164.656 131.157C166 129.798 166.761 127.968 166.776 126.056L166.667 120H172.665C174.577 119.993 176.41 119.241 177.775 117.903C179.14 116.564 179.928 114.746 179.973 112.835V54.0784C180.057 53.1532 179.948 52.2206 179.651 51.3403C179.354 50.46 178.877 49.6514 178.249 48.9663C177.622 48.2812 176.858 47.7346 176.007 47.3617C175.156 46.9887 174.237 46.7975 173.308 46.8003L93.9949 46.667ZM160.111 126.79H80.1315V66.6978H160.111V126.79ZM166.667 113.334L166.776 67.6326C166.761 65.7209 166 63.8906 164.656 62.5314C163.311 61.1721 161.49 60.3912 159.578 60.3547L93.3335 60.2212V53.3337H173.333V113.334H166.667Z" fill="#DA7B11"/><path fill-rule="evenodd" clip-rule="evenodd" d="M109.067 106.513C107.867 107.113 106.667 105.847 106.667 104.647V81.3948C106.698 81.138 106.794 80.8934 106.945 80.6837C107.097 80.474 107.299 80.306 107.533 80.1956C107.768 80.0672 108.032 80 108.3 80C108.568 80 108.831 80.0672 109.067 80.1956L132.465 91.7885C132.725 91.9528 132.939 92.1787 133.091 92.446C133.242 92.7133 133.325 93.0139 133.332 93.3209C133.345 93.6318 133.271 93.9401 133.118 94.211C132.964 94.4818 132.738 94.7043 132.465 94.8533L109.067 106.513Z" fill="#DA7B11"/><path d="M53.3673 199.985H29.9772C29.1214 199.985 28.3007 199.645 27.6956 199.04C27.0905 198.435 26.7505 197.614 26.7505 196.758V183.25C26.7505 182.394 27.0905 181.573 27.6956 180.968C28.3007 180.363 29.1214 180.023 29.9772 180.023H53.3673V164.414C53.4081 164.045 53.5901 163.707 53.8751 163.469C54.16 163.232 54.5258 163.114 54.8957 163.141C55.2662 163.12 55.6304 163.242 55.9146 163.48L83.6973 189.225C83.942 189.475 84.079 189.81 84.079 190.159C84.079 190.509 83.942 190.844 83.6973 191.093L55.9146 216.652C55.6134 216.893 55.2391 217.024 54.8532 217.024C54.4674 217.024 54.093 216.893 53.7919 216.652C53.5359 216.406 53.384 216.072 53.3673 215.718V199.985ZM53.3335 140C43.4445 140 33.7775 142.932 25.555 148.427C17.3325 153.921 10.9239 161.73 7.13954 170.866C3.35516 180.002 2.36499 190.055 4.29425 199.755C6.22352 209.454 10.9856 218.363 17.9782 225.355C24.9708 232.348 33.88 237.11 43.579 239.039C53.2781 240.969 63.3314 239.978 72.4677 236.194C81.604 232.41 89.4129 226.001 94.907 217.779C100.401 209.556 103.334 199.889 103.334 190C103.334 176.739 98.0657 164.021 88.6889 154.645C79.312 145.268 66.5943 140 53.3335 140Z" fill="#DA7B11"/></g><defs><clipPath id="clip0_20447_96556"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'pdf-to-excel': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_20447_96474)"><path d="M208.4 38.8667L174.267 4.86673C172.731 3.31906 170.902 2.09189 168.888 1.25646C166.874 0.421027 164.714 -0.00603364 162.533 6.43952e-05H60C54.6957 6.43952e-05 49.6086 2.1072 45.8579 5.85793C42.1071 9.60866 40 14.6957 40 20.0001V131.533C42.2 131.067 44.4 130.667 46.6667 130.4V20.0001C46.6667 16.4638 48.0714 13.0725 50.5719 10.572C53.0724 8.07149 56.4638 6.66673 60 6.66673H162.533C165.185 6.66906 167.726 7.72416 169.6 9.60006L203.733 43.6001C205.609 45.4736 206.664 48.0155 206.667 50.6667V193.333C206.667 196.87 205.262 200.261 202.761 202.761C200.261 205.262 196.87 206.667 193.333 206.667H110.933C110.296 208.936 109.517 211.162 108.6 213.333H193.333C198.638 213.333 203.725 211.226 207.475 207.476C211.226 203.725 213.333 198.638 213.333 193.333V50.6667C213.309 46.2368 211.536 41.9958 208.4 38.8667Z" fill="#3DA74E"/><path opacity="0.1" d="M203.733 43.6003L169.6 9.60033C167.726 7.72443 165.184 6.66933 162.533 6.66699H59.9998C56.4636 6.66699 53.0722 8.07175 50.5717 10.5722C48.0713 13.0727 46.6665 16.4641 46.6665 20.0003V130.4C48.8786 130.132 51.1049 129.999 53.3332 130C62.6329 130.006 71.8039 132.174 80.1222 136.332C88.4405 140.49 95.6784 146.525 101.264 153.96C106.85 161.395 110.632 170.027 112.31 179.174C113.988 188.321 113.516 197.733 110.933 206.667H193.333C196.869 206.667 200.261 205.262 202.761 202.762C205.262 200.261 206.667 196.87 206.667 193.334V50.667C206.664 48.0157 205.609 45.4739 203.733 43.6003Z" fill="#3DA74E"/><path d="M179.654 40.0175H73.7994C72.9237 39.9539 72.0441 40.0639 71.211 40.3413C70.378 40.6186 69.608 41.0578 68.9452 41.6336C68.2824 42.2094 67.7399 42.9105 67.3488 43.6966C66.9578 44.4827 66.7259 45.3383 66.6665 46.2143V109.514C66.6665 116.777 69.7332 119.975 76.3992 119.975H176.855C178.224 120.031 179.59 119.798 180.865 119.293C182.139 118.788 183.294 118.022 184.254 117.044C185.985 114.932 186.843 112.238 186.654 109.514V46.2143C186.345 44.549 185.488 43.0347 184.22 41.912C182.952 40.7893 181.345 40.1225 179.654 40.0175ZM133.333 60.0071L180 60.0001V73.3334L133.333 73.3401V60.0071ZM133.333 80.007L180 80V93.3334L133.333 93.3401V80.007ZM99.9998 113.333H76.3992C75.9616 113.334 75.5282 113.247 75.1239 113.08C74.7195 112.913 74.3521 112.667 74.0425 112.358C73.733 112.049 73.4874 111.681 73.3199 111.277C73.1523 110.873 73.066 110.439 73.0659 110.002L73.125 99.9141L100 100.028L99.9998 113.333ZM100 93.3439L73.1252 93.2299V79.9036L100 80.0176V93.3439ZM100 73.3545L73.1252 73.2405V59.9138L100 60.0278V73.3545ZM126.666 113.34L106.666 113.334L106.667 100.028L126.667 100.007L126.666 113.34ZM126.667 93.3404L106.667 93.3439V80.0172L126.667 79.9962V93.3404ZM126.667 73.3334L106.667 73.3545V60.0281L126.667 60.0071V73.3334ZM179.955 110.332C179.955 110.769 179.868 111.203 179.701 111.607C179.533 112.011 179.288 112.378 178.978 112.688C178.669 112.997 178.301 113.243 177.897 113.41C177.492 113.577 177.059 113.663 176.621 113.663L133.333 113.333V100.007L180 100L179.955 110.332Z" fill="#3DA74E"/><path d="M53.3673 199.985H29.9772C29.1214 199.985 28.3007 199.645 27.6956 199.04C27.0905 198.435 26.7505 197.614 26.7505 196.758V183.25C26.7505 182.394 27.0905 181.573 27.6956 180.968C28.3007 180.363 29.1214 180.023 29.9772 180.023H53.3673V164.414C53.4081 164.045 53.5901 163.707 53.8751 163.469C54.16 163.232 54.5258 163.114 54.8957 163.141C55.2662 163.12 55.6304 163.242 55.9146 163.48L83.6973 189.225C83.942 189.475 84.0791 189.81 84.0791 190.159C84.0791 190.509 83.942 190.844 83.6973 191.093L55.9146 216.652C55.6134 216.893 55.2391 217.024 54.8532 217.024C54.4674 217.024 54.093 216.893 53.7919 216.652C53.5359 216.406 53.384 216.072 53.3673 215.718V199.985ZM53.3335 140C43.4445 140 33.7775 142.932 25.555 148.427C17.3325 153.921 10.9239 161.73 7.13954 170.866C3.35516 180.002 2.36499 190.055 4.29425 199.755C6.22352 209.454 10.9856 218.363 17.9782 225.355C24.9708 232.348 33.88 237.11 43.579 239.039C53.2781 240.969 63.3314 239.978 72.4677 236.194C81.604 232.41 89.4129 226.001 94.907 217.779C100.401 209.556 103.334 199.889 103.334 190C103.334 176.739 98.0657 164.021 88.6889 154.645C79.312 145.268 66.5943 140 53.3335 140Z" fill="#3DA74E"/></g><defs><clipPath id="clip0_20447_96474"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'pdf-to-image': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_20447_96638)"><path opacity="0.1" d="M46.667 53.333V130.4C48.8791 130.132 51.1054 129.998 53.3337 130C68.6856 129.976 83.4627 135.838 94.6237 146.379C105.785 156.92 112.481 171.338 113.334 186.666H233.334V53.333H46.667Z" fill="#CE2783"/><path d="M184.976 190.802L118.977 122.82C117.116 120.969 114.598 119.93 111.974 119.93C109.349 119.93 106.831 120.969 104.971 122.82L87.5239 140.586L81.6338 137.096L100.302 118.065C103.416 115.031 107.593 113.333 111.941 113.333C116.289 113.333 120.466 115.031 123.581 118.065L158.104 153.623L171.256 140.23C174.371 137.196 178.547 135.498 182.896 135.498C187.244 135.498 191.42 137.196 194.535 140.23L233.333 179.739L235.908 182.043L232.81 188.712L189.866 144.985C188.963 144.047 187.881 143.301 186.683 142.791C185.485 142.282 184.197 142.019 182.896 142.019C181.594 142.019 180.306 142.282 179.108 142.791C177.91 143.301 176.828 144.047 175.925 144.985L162.773 158.378L192.233 188.712C187.941 190.668 185.522 191.365 184.976 190.802Z" fill="#CE2783"/><path fill-rule="evenodd" clip-rule="evenodd" d="M208.665 20.0019H18.0017C17.3828 19.9838 16.7667 20.0933 16.1919 20.3237C15.6171 20.5541 15.0959 20.9004 14.6609 21.3411C14.223 21.7846 13.8797 22.3123 13.6518 22.8924C13.4239 23.4724 13.3162 24.0927 13.3351 24.7157V146.667C15.4165 144.724 17.6454 142.945 20.0018 141.347V26.7358H206.665V33.4697H213.331V24.7157C213.35 24.0927 213.242 23.4724 213.015 22.8924C212.787 22.3123 212.443 21.7846 212.006 21.3411C211.57 20.9004 211.049 20.5541 210.474 20.3237C209.9 20.0933 209.284 19.9838 208.665 20.0019Z" fill="#CE2783"/><path d="M235.331 46.6691H44.6687C44.0508 46.6507 43.4358 46.7588 42.8612 46.9868C42.2867 47.2148 41.7649 47.5578 41.3278 47.9949C40.8907 48.432 40.5476 48.9538 40.3196 49.5284C40.0917 50.1029 39.9836 50.718 40.002 51.3358V131.334C42.202 130.867 44.402 130.467 46.6687 130.2V53.3357H233.332V186.665H113.334V193.332H235.331C235.949 193.35 236.564 193.242 237.139 193.014C237.713 192.786 238.235 192.443 238.672 192.006C239.109 191.569 239.453 191.047 239.681 190.473C239.909 189.898 240.017 189.283 239.998 188.665V51.3357C240.017 50.7178 239.909 50.1028 239.681 49.5282C239.453 48.9537 239.109 48.4319 238.672 47.9948C238.235 47.5577 237.713 47.2146 237.139 46.9866C236.564 46.7586 235.949 46.6507 235.331 46.6691Z" fill="#CE2783"/><path d="M196.632 109.835C191.341 109.777 186.289 107.626 182.581 103.852C178.873 100.077 176.812 94.9878 176.849 89.6972C176.886 84.4065 179.018 79.346 182.778 75.6237C186.537 71.9014 191.619 69.8206 196.91 69.837C202.247 69.9111 207.346 72.0628 211.123 75.8351C213.894 78.6599 215.765 82.2434 216.499 86.1319C217.232 90.0205 216.796 94.0393 215.244 97.6796C213.692 101.32 211.096 104.418 207.782 106.582C204.469 108.745 200.589 109.877 196.632 109.835ZM196.665 109.836V106.503L196.698 103.169C199.333 103.199 201.918 102.447 204.126 101.008C206.333 99.5694 208.065 97.5087 209.103 95.0863C210.14 92.6639 210.436 89.9884 209.953 87.3978C209.471 84.8072 208.231 82.4178 206.392 80.5312C203.858 78.0044 200.443 76.5602 196.865 76.5032C195.112 76.4993 193.375 76.8413 191.754 77.5095C190.132 78.1778 188.659 79.1593 187.418 80.3978C186.177 81.6362 185.192 83.1074 184.52 84.7269C183.848 86.3465 183.502 88.0827 183.502 89.8361C183.502 91.5895 183.848 93.3257 184.52 94.9453C185.192 96.5649 186.177 98.036 187.418 99.2744C188.659 100.513 190.132 101.494 191.754 102.163C193.375 102.831 195.112 103.173 196.865 103.169V109.836L196.665 109.836Z" fill="#CE2783"/><path d="M53.3668 199.985H29.9767C29.1209 199.985 28.3002 199.645 27.6951 199.04C27.09 198.435 26.75 197.614 26.75 196.758V183.25C26.75 182.394 27.09 181.573 27.6951 180.968C28.3002 180.363 29.1209 180.023 29.9767 180.023H53.3668V164.414C53.4077 164.045 53.5896 163.707 53.8746 163.469C54.1595 163.232 54.5253 163.114 54.8952 163.141C55.2657 163.12 55.63 163.242 55.9141 163.48L83.6968 189.225C83.9415 189.475 84.0786 189.81 84.0786 190.159C84.0786 190.509 83.9415 190.844 83.6968 191.093L55.9141 216.652C55.6129 216.893 55.2386 217.024 54.8527 217.024C54.4669 217.024 54.0926 216.893 53.7914 216.652C53.5354 216.406 53.3835 216.072 53.3668 215.718V199.985ZM53.333 140C43.444 140 33.777 142.932 25.5545 148.427C17.3321 153.921 10.9234 161.73 7.13905 170.866C3.35467 180.002 2.36451 190.055 4.29377 199.755C6.22303 209.454 10.9851 218.363 17.9777 225.355C24.9703 232.348 33.8795 237.11 43.5785 239.039C53.2776 240.969 63.3309 239.978 72.4672 236.194C81.6035 232.41 89.4124 226.001 94.9065 217.779C100.401 209.556 103.333 199.889 103.333 190C103.333 176.739 98.0652 164.021 88.6884 154.645C79.3116 145.268 66.5939 140 53.333 140Z" fill="#CE2783"/></g><defs><clipPath id="clip0_20447_96638"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  createpdf: '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_20447_97130)"><path d="M125.68 60C132.663 60 135.157 67.07 135.157 73.6893C134.76 81.5771 133.245 89.3686 130.656 96.83C132.249 99.724 133.997 102.53 135.893 105.235C138.385 108.831 141.209 112.187 144.327 115.257C149.01 114.45 153.749 114.017 158.5 113.961C164.42 113.279 170.368 114.976 175.037 118.678C176.153 120.021 176.757 121.716 176.741 123.462C176.748 124.289 176.609 125.11 176.329 125.888C175.538 128.034 173.356 130.594 167.423 130.6C158.208 130.135 149.505 126.221 143.043 119.634C139.115 120.342 134.851 121.316 130.359 122.534C126.307 123.641 122.299 124.895 118.448 126.256C113.049 136.133 102.585 152.481 92.4745 152.486L92.1524 152.5C90.0186 152.493 87.9592 151.716 86.354 150.31C85.5303 149.549 84.9146 148.59 84.5655 147.524C84.2163 146.458 84.1452 145.321 84.3589 144.22C85.4489 138.329 94.7989 131.363 110.021 125.099C112.692 120.129 115.091 115.019 117.209 109.789C119.56 103.971 121.568 98.4795 123.533 92.5185C118.617 83.642 117.377 73.1915 120.081 63.4114C120.644 62.4103 121.454 61.5708 122.435 60.9733C123.415 60.3759 124.533 60.0407 125.68 60ZM106.617 131.035C95.9231 135.98 88.9352 141.27 88.2519 144.992C88.224 145.147 88.2123 145.305 88.217 145.463C88.2201 146.085 88.4654 146.681 88.9008 147.125C89.3361 147.568 89.9273 147.825 90.5488 147.84C94.2323 147.837 100.3 141.438 106.617 131.035ZM148.203 118.73C152.182 122.028 156.832 124.421 161.829 125.74C162.533 125.911 163.255 125.998 163.979 125.999C166.511 125.999 168.361 124.823 168.693 123.008C169.246 120.069 166.982 118.942 164.989 118.512C159.416 117.719 153.754 117.793 148.203 118.73ZM128.965 101.923C127.877 105.108 126.596 108.524 125.067 112.323C123.952 115.096 122.61 118.084 121.157 121.034C123.937 120.126 126.643 119.323 129.359 118.587C132.798 117.638 136.205 116.817 139.492 116.148L139.133 115.721C136.807 113.175 134.649 110.48 132.674 107.653C131.391 105.823 130.169 103.952 128.965 101.923ZM125.603 64.0949C125.222 64.1132 124.85 64.2187 124.516 64.4034C124.183 64.588 123.896 64.8469 123.678 65.16L123.498 65.4944C121.645 72.5014 122.311 79.9368 125.381 86.5025C127.073 80.9507 128.091 75.2157 128.414 69.4208C128.414 67.0105 127.915 64.1026 125.603 64.0949Z" fill="#D7373F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M50 150C41.0999 150 32.3996 152.639 24.9994 157.584C17.5991 162.529 11.8314 169.557 8.42544 177.779C5.0195 186.002 4.12835 195.05 5.86468 203.779C7.60102 212.508 11.8869 220.526 18.1802 226.82C24.4736 233.113 32.4918 237.399 41.221 239.135C49.9501 240.872 58.9981 239.981 67.2208 236.575C75.4435 233.169 82.4715 227.401 87.4162 220.001C92.3608 212.6 95 203.9 95 195C94.987 183.069 90.2418 171.631 81.8055 163.195C73.3691 154.758 61.9308 150.013 50 150ZM80.1324 198.547L59.7124 218.876C58.7729 219.811 57.5004 220.335 56.1746 220.333C54.8489 220.33 53.5784 219.801 52.6424 218.862L49.1158 215.322C48.6522 214.857 48.2848 214.305 48.0346 213.697C47.7844 213.09 47.6563 212.439 47.6576 211.782C47.659 211.125 47.7898 210.475 48.0425 209.869C48.2952 209.262 48.6649 208.712 49.1305 208.248L54.9078 202.5H23.5C22.1739 202.5 20.9022 201.973 19.9645 201.036C19.0268 200.098 18.5 198.826 18.5 197.5V192.5C18.5 191.174 19.0268 189.902 19.9645 188.964C20.9022 188.027 22.1739 187.5 23.5 187.5H55.0165L49.1913 181.649C48.728 181.184 48.3609 180.632 48.1109 180.025C47.8609 179.417 47.7331 178.767 47.7345 178.11C47.736 177.453 47.8668 176.803 48.1195 176.197C48.3722 175.591 48.7418 175.041 49.2072 174.578L52.7545 171.048C53.6941 170.112 54.9667 169.588 56.2925 169.591C57.6184 169.594 58.8888 170.123 59.8245 171.062L80.1474 191.476C81.083 192.416 81.607 193.689 81.6042 195.015C81.6014 196.341 81.072 197.612 80.1324 198.547Z" fill="#D7373F"/><path d="M211.553 51.3868L178.779 18.4668C176.903 16.5707 174.669 15.0667 172.206 14.0423C169.743 13.018 167.101 12.4937 164.434 12.5001H66.001C59.7531 12.5252 53.7702 15.0274 49.3645 19.4577C44.9589 23.888 42.4902 29.8849 42.5 36.1329V135.52C44.9868 135.191 47.4917 135.017 50 135C52.5084 135.017 55.0133 135.191 57.5 135.52V36.1329C57.486 33.8618 58.3729 31.6778 59.9664 30.0596C61.5599 28.4413 63.73 27.5209 66.001 27.5001H164.434C165.126 27.495 165.812 27.63 166.45 27.8968C167.089 28.1636 167.667 28.5568 168.149 29.0528L200.928 61.9828C201.434 62.4837 201.835 63.0818 202.105 63.7411C202.375 64.4005 202.51 65.1076 202.5 65.8201V203.867C202.514 206.138 201.627 208.322 200.034 209.941C198.44 211.559 196.27 212.479 193.999 212.5H107.381C105.75 217.802 103.387 222.851 100.362 227.5H193.999C200.247 227.475 206.23 224.973 210.636 220.542C215.041 216.112 217.51 210.115 217.5 203.867V65.8201C217.509 63.141 216.989 60.4865 215.968 58.0094C214.947 55.5323 213.447 53.2816 211.553 51.3868Z" fill="#D7373F"/><path opacity="0.1" d="M206.234 56.68L173.469 23.7646C172.287 22.5692 170.88 21.6207 169.329 20.9744C167.777 20.3281 166.113 19.9968 164.432 20H66.0001C61.741 20.022 57.6645 21.7325 54.665 24.7562C51.6654 27.78 49.9878 31.8701 50.0001 36.1292V135C65.9077 135.017 81.1588 141.344 92.4073 152.593C103.656 163.841 109.983 179.092 110 195C109.992 203.635 108.106 212.166 104.473 220H194C198.259 219.978 202.335 218.267 205.335 215.244C208.334 212.22 210.012 208.13 210 203.871V65.8191C210.007 64.1226 209.677 62.4415 209.031 60.8729C208.384 59.3043 207.434 57.8793 206.234 56.68Z" fill="#D7373F"/></g><defs><clipPath id="clip0_20447_97130"><rect width="240" height="240" fill="white"/></clipPath></defs></svg>',
  'word-to-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M155.866 19.9997C158.518 20.0021 161.059 21.0572 162.933 22.9331L197.066 56.9331C198.942 58.8066 199.997 61.3485 200 63.9997V206.666C200 210.203 198.595 213.594 196.094 216.094C193.594 218.595 190.203 220 186.666 220H53.333C49.7968 220 46.4054 218.595 43.9049 216.094C41.4044 213.594 39.9997 210.203 39.9997 206.666V33.3331C39.9997 29.7969 41.4044 26.4055 43.9049 23.905C46.4054 21.4045 49.7968 19.9997 53.333 19.9997H155.866ZM155.866 13.3331H53.333C48.0287 13.3331 42.9416 15.4402 39.1909 19.1909C35.4401 22.9417 33.333 28.0287 33.333 33.3331V206.666C33.333 211.971 35.4401 217.058 39.1909 220.809C42.9416 224.559 48.0287 226.666 53.333 226.666H186.666C191.971 226.666 197.058 224.559 200.808 220.809C204.559 217.058 206.666 211.971 206.666 206.666V63.9997C206.642 59.5698 204.869 55.3288 201.733 52.1997L167.6 18.1997C166.064 16.6521 164.235 15.4249 162.221 14.5895C160.207 13.754 158.047 13.327 155.866 13.3331Z" fill="#0265DC"/><path opacity="0.1" d="M155.867 20C158.518 20.0023 161.06 21.0574 162.933 22.9333L197.067 56.9333C198.943 58.8069 199.998 61.3487 200 64V206.667C200 210.203 198.595 213.594 196.095 216.095C193.594 218.595 190.203 220 186.667 220H53.3333C49.7971 220 46.4057 218.595 43.9052 216.095C41.4048 213.594 40 210.203 40 206.667V33.3333C40 29.7971 41.4048 26.4057 43.9052 23.9052C46.4057 21.4048 49.7971 20 53.3333 20H155.867Z" fill="#0265DC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M68.8057 60C68.2609 59.9989 67.7362 60.2058 67.3388 60.5784C66.9413 60.951 66.701 61.4613 66.667 62.005V77.7109C66.667 77.9734 66.7203 78.2332 66.8237 78.4744C66.9271 78.7157 67.0784 78.9334 67.2685 79.1145C67.4577 79.3082 67.6881 79.4569 67.9427 79.5494C68.1972 79.642 68.4693 79.6761 68.7388 79.6491H71.1448C71.4132 79.6631 71.6816 79.623 71.9342 79.5311C72.1868 79.4393 72.4183 79.2976 72.6151 79.1145C72.9568 78.7002 73.1456 78.181 73.1497 77.6441V66.2155H89.9247V106.784H82.3058C81.7254 106.831 81.1821 107.088 80.7765 107.506C80.3709 107.924 80.1307 108.474 80.1003 109.056V111.328C80.1661 111.883 80.4342 112.395 80.8534 112.765C81.2726 113.135 81.8135 113.337 82.3726 113.333H104.494C104.775 113.333 105.053 113.278 105.313 113.171C105.572 113.063 105.808 112.905 106.006 112.707C106.205 112.508 106.362 112.273 106.47 112.013C106.577 111.754 106.633 111.475 106.633 111.195V108.588C106.608 108.324 106.531 108.068 106.406 107.834C106.281 107.6 106.111 107.393 105.906 107.226C105.701 107.058 105.465 106.932 105.211 106.856C104.957 106.781 104.691 106.756 104.427 106.783H96.4739V66.6835H113.45V77.9783C113.423 78.2424 113.45 78.5091 113.531 78.7621C113.611 79.015 113.743 79.2487 113.917 79.4487C114.102 79.6299 114.322 79.771 114.563 79.863C114.805 79.955 115.063 79.996 115.321 79.9833H118.128C118.376 79.9949 118.624 79.9532 118.854 79.8609C119.085 79.7687 119.293 79.6281 119.465 79.4487C119.643 79.2621 119.782 79.0418 119.873 78.8008C119.965 78.5598 120.008 78.3029 119.999 78.0451V62.0051C119.983 61.4787 119.766 60.9783 119.393 60.6058C119.021 60.2334 118.521 60.0167 117.994 60H68.8057Z" fill="#0265DC"/><path d="M170.2 93.333H123.133C121.403 93.333 120 94.7359 120 96.4663V96.8663C120 98.5968 121.403 99.9997 123.133 99.9997H170.2C171.93 99.9997 173.333 98.5968 173.333 96.8663V96.4663C173.333 94.7359 171.93 93.333 170.2 93.333Z" fill="#0265DC"/><path d="M170.2 106.667H123.133C121.403 106.667 120 108.07 120 109.8V110.2C120 111.931 121.403 113.334 123.133 113.334H170.2C171.93 113.334 173.333 111.931 173.333 110.2V109.8C173.333 108.07 171.93 106.667 170.2 106.667Z" fill="#0265DC"/><path d="M170.2 120H83.1333C81.4028 120 80 121.403 80 123.133V123.533C80 125.264 81.4028 126.667 83.1333 126.667H170.2C171.93 126.667 173.333 125.264 173.333 123.533V123.133C173.333 121.403 171.93 120 170.2 120Z" fill="#0265DC"/></svg>',
  'excel-to-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M155.866 19.9997C158.518 20.0021 161.059 21.0572 162.933 22.9331L197.066 56.9331C198.942 58.8066 199.997 61.3485 200 63.9997V206.666C200 210.203 198.595 213.594 196.094 216.094C193.594 218.595 190.203 220 186.666 220H53.333C49.7968 220 46.4054 218.595 43.9049 216.094C41.4044 213.594 39.9997 210.203 39.9997 206.666V33.3331C39.9997 29.7969 41.4044 26.4055 43.9049 23.905C46.4054 21.4045 49.7968 19.9997 53.333 19.9997H155.866ZM155.866 13.3331H53.333C48.0287 13.3331 42.9416 15.4402 39.1909 19.1909C35.4401 22.9417 33.333 28.0287 33.333 33.3331V206.666C33.333 211.971 35.4401 217.058 39.1909 220.809C42.9416 224.559 48.0287 226.666 53.333 226.666H186.666C191.971 226.666 197.058 224.559 200.808 220.809C204.559 217.058 206.666 211.971 206.666 206.666V63.9997C206.642 59.5698 204.869 55.3288 201.733 52.1997L167.6 18.1997C166.064 16.6521 164.235 15.4249 162.221 14.5895C160.207 13.754 158.047 13.327 155.866 13.3331Z" fill="#3DA74E"/><path opacity="0.1" d="M155.867 20C158.518 20.0023 161.06 21.0574 162.933 22.9333L197.067 56.9333C198.943 58.8069 199.998 61.3487 200 64V206.667C200 210.203 198.595 213.594 196.095 216.095C193.594 218.595 190.203 220 186.667 220H53.3333C49.7971 220 46.4057 218.595 43.9052 216.095C41.4048 213.594 40 210.203 40 206.667V33.3333C40 29.7971 41.4048 26.4057 43.9052 23.9052C46.4057 21.4048 49.7971 20 53.3333 20H155.867Z" fill="#3DA74E"/><path d="M172.988 53.3505H67.1329C66.2572 53.2869 65.3776 53.3969 64.5445 53.6743C63.7115 53.9516 62.9415 54.3908 62.2787 54.9666C61.6159 55.5424 61.0734 56.2435 60.6823 57.0296C60.2913 57.8157 60.0594 58.6713 60 59.5473V122.847C60 130.11 63.0667 133.308 69.7327 133.308H170.188C171.558 133.364 172.924 133.131 174.198 132.626C175.473 132.121 176.627 131.355 177.588 130.377C179.318 128.265 180.177 125.571 179.988 122.847V59.5473C179.678 57.882 178.822 56.3677 177.554 55.245C176.285 54.1223 174.678 53.4555 172.988 53.3505ZM126.667 73.3401L173.333 73.3331V86.6664L126.667 86.6731V73.3401ZM126.667 93.3401L173.333 93.3331V106.666L126.667 106.673V93.3401ZM93.3333 126.666H69.7327C69.2951 126.667 68.8617 126.58 68.4574 126.413C68.053 126.246 67.6856 126 67.376 125.691C67.0665 125.382 66.8209 125.014 66.6534 124.61C66.4858 124.206 66.3995 123.772 66.3994 123.335L66.4585 113.247L93.3335 113.361L93.3333 126.666ZM93.3337 106.677L66.4587 106.563V93.2366L93.3337 93.3506V106.677ZM93.3337 86.6875L66.4587 86.5735V73.2468L93.3337 73.3608V86.6875ZM120 126.673L99.9996 126.667L100 113.361L120 113.34L120 126.673ZM120 106.673L100 106.677V93.3503L120 93.3292V106.673ZM120 86.6664L100 86.6875V73.3611L120 73.3401V86.6664ZM173.288 123.665C173.288 124.102 173.202 124.536 173.034 124.94C172.867 125.344 172.621 125.711 172.312 126.021C172.002 126.33 171.635 126.576 171.23 126.743C170.826 126.91 170.393 126.996 169.955 126.996L126.667 126.666V113.34L173.333 113.333L173.288 123.665Z" fill="#3DA74E"/></svg>',
  'ppt-to-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M155.866 19.9997C158.518 20.0021 161.059 21.0572 162.933 22.9331L197.066 56.9331C198.942 58.8066 199.997 61.3485 200 63.9997V206.666C200 210.203 198.595 213.594 196.094 216.094C193.594 218.595 190.203 220 186.666 220H53.333C49.7968 220 46.4054 218.595 43.9049 216.094C41.4044 213.594 39.9997 210.203 39.9997 206.666V33.3331C39.9997 29.7969 41.4044 26.4055 43.9049 23.905C46.4054 21.4045 49.7968 19.9997 53.333 19.9997H155.866ZM155.866 13.3331H53.333C48.0287 13.3331 42.9416 15.4402 39.1909 19.1909C35.4401 22.9417 33.333 28.0287 33.333 33.3331V206.666C33.333 211.971 35.4401 217.058 39.1909 220.809C42.9416 224.559 48.0287 226.666 53.333 226.666H186.666C191.971 226.666 197.058 224.559 200.808 220.809C204.559 217.058 206.666 211.971 206.666 206.666V63.9997C206.642 59.5698 204.869 55.3288 201.733 52.1997L167.6 18.1997C166.064 16.6521 164.235 15.4249 162.221 14.5895C160.207 13.754 158.047 13.327 155.866 13.3331Z" fill="#DA7B11"/><path opacity="0.1" d="M155.867 20C158.518 20.0023 161.06 21.0574 162.933 22.9333L197.067 56.9333C198.943 58.8069 199.998 61.3487 200 64V206.667C200 210.203 198.595 213.594 196.095 216.095C193.594 218.595 190.203 220 186.667 220H53.3333C49.7971 220 46.4057 218.595 43.9052 216.095C41.4048 213.594 40 210.203 40 206.667V33.3333C40 29.7971 41.4048 26.4057 43.9052 23.9052C46.4057 21.4048 49.7971 20 53.3333 20H155.867Z" fill="#DA7B11"/><path d="M87.3284 60C85.4115 60.0193 83.5798 60.7948 82.2318 62.1578C80.8838 63.5207 80.1285 65.3609 80.1303 67.2779V73.5542H73.8652C71.9537 73.5906 70.132 74.3716 68.7876 75.7308C67.4432 77.0901 66.6824 78.9203 66.667 80.8321V139.389C66.6824 141.301 67.4432 143.131 68.7876 144.49C70.132 145.849 71.9537 146.63 73.8652 146.667H152.912C154.823 146.63 156.645 145.849 157.989 144.49C159.334 143.131 160.095 141.301 160.11 139.389L160 133.333H165.999C167.91 133.326 169.744 132.574 171.108 131.236C172.473 129.897 173.262 128.079 173.307 126.168V67.4114C173.391 66.4862 173.281 65.5536 172.984 64.6733C172.687 63.7931 172.21 62.9844 171.583 62.2993C170.955 61.6142 170.192 61.0676 169.341 60.6947C168.49 60.3217 167.571 60.1305 166.642 60.1333L87.3284 60ZM153.445 140.123H73.465V80.0308H153.445V140.123ZM160 126.667L160.11 80.9656C160.095 79.0539 159.334 77.2236 157.989 75.8644C156.645 74.5051 154.823 73.7242 152.912 73.6877L86.667 73.5542V66.6667H166.667V126.667H160Z" fill="#DA7B11"/><path fill-rule="evenodd" clip-rule="evenodd" d="M102.4 119.846C101.2 120.446 100 119.18 100 117.98V94.7278C100.031 94.471 100.127 94.2264 100.279 94.0167C100.431 93.807 100.633 93.639 100.867 93.5286C101.102 93.4003 101.365 93.333 101.633 93.333C101.901 93.333 102.165 93.4003 102.4 93.5286L125.799 105.122C126.058 105.286 126.273 105.512 126.424 105.779C126.575 106.046 126.658 106.347 126.665 106.654C126.678 106.965 126.604 107.273 126.451 107.544C126.298 107.815 126.072 108.037 125.799 108.186L102.4 119.846Z" fill="#DA7B11"/></svg>',
  'jpg-to-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.1" d="M226.667 53.333H40V186.666H226.667V53.333Z" fill="#CE2783"/><path d="M189.966 109.835C184.675 109.777 179.623 107.626 175.915 103.852C172.207 100.077 170.146 94.9878 170.183 89.6972C170.22 84.4065 172.352 79.346 176.112 75.6237C179.871 71.9014 184.953 69.8206 190.244 69.837C195.581 69.9111 200.68 72.0628 204.457 75.8351C207.228 78.6599 209.099 82.2434 209.833 86.1319C210.566 90.0205 210.13 94.0393 208.578 97.6796C207.026 101.32 204.43 104.418 201.116 106.582C197.803 108.745 193.923 109.877 189.966 109.835ZM189.999 109.836V106.503L190.032 103.169C192.667 103.199 195.252 102.447 197.46 101.008C199.667 99.5694 201.399 97.5087 202.437 95.0863C203.474 92.6639 203.77 89.9884 203.287 87.3978C202.805 84.8072 201.565 82.4178 199.726 80.5312C197.192 78.0044 193.777 76.5602 190.199 76.5032C188.446 76.4993 186.709 76.8413 185.087 77.5095C183.466 78.1778 181.993 79.1593 180.752 80.3978C179.511 81.6362 178.526 83.1074 177.854 84.7269C177.182 86.3465 176.836 88.0827 176.836 89.8361C176.836 91.5895 177.182 93.3257 177.854 94.9453C178.526 96.5649 179.511 98.036 180.752 99.2744C181.993 100.513 183.466 101.494 185.087 102.163C186.709 102.831 188.446 103.173 190.199 103.169V109.836L189.999 109.836Z" fill="#CE2783"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.3357 166.665H11.3357C10.7178 166.683 10.1028 166.575 9.52822 166.347C8.95369 166.119 8.43185 165.776 7.99478 165.339C7.5577 164.902 7.21463 164.38 6.98664 163.806C6.75865 163.231 6.65056 162.616 6.66901 161.998V24.6687C6.65056 24.0508 6.75865 23.4358 6.98664 22.8612C7.21463 22.2867 7.5577 21.7649 7.99478 21.3278C8.43185 20.8907 8.95369 20.5476 9.52822 20.3196C10.1028 20.0917 10.7178 19.9836 11.3357 20.002H201.999C202.616 19.9836 203.231 20.0917 203.806 20.3196C204.381 20.5476 204.902 20.8907 205.339 21.3278C205.777 21.7649 206.12 22.2867 206.348 22.8612C206.576 23.4358 206.684 24.0508 206.665 24.6687V33.3354H199.999V26.6687H13.3357V166.665Z" fill="#CE2783"/><path d="M228.664 46.6691C229.282 46.6507 229.897 46.7588 230.472 46.9868C231.046 47.2148 231.568 47.5578 232.005 47.9949C232.442 48.432 232.786 48.9538 233.014 49.5284C233.242 50.1029 233.35 50.718 233.331 51.3358V188.665C233.35 189.283 233.242 189.898 233.014 190.473C232.786 191.047 232.442 191.569 232.005 192.006C231.568 192.443 231.046 192.786 230.472 193.014C229.897 193.242 229.282 193.35 228.664 193.332H38.0017C37.3839 193.35 36.7688 193.242 36.1942 193.014C35.6197 192.786 35.0979 192.443 34.6608 192.006C34.2237 191.569 33.8806 191.047 33.6527 190.473C33.4247 189.898 33.3166 189.283 33.335 188.665V51.3357C33.3166 50.7178 33.4247 50.1028 33.6527 49.5282C33.8806 48.9537 34.2237 48.4319 34.6608 47.9948C35.0979 47.5577 35.6197 47.2146 36.1942 46.9866C36.7688 46.7586 37.3839 46.6506 38.0017 46.669L228.664 46.6691ZM101.526 122.94L39.9998 182.234L40.0016 186.665L181.284 186.667L115.528 122.94C113.653 121.117 111.142 120.097 108.527 120.097C105.912 120.097 103.4 121.117 101.526 122.94ZM180.96 140.959C178.391 141.098 175.976 142.231 174.228 144.119L161.438 157.566L191.46 186.66L226.665 186.665L226.66 184.547L188.096 143.648C187.152 142.738 186.032 142.03 184.805 141.568C183.578 141.105 182.27 140.898 180.96 140.959ZM226.665 53.3357H40.0016L39.9968 172.92L96.8134 118.1C99.9468 115.044 104.15 113.334 108.527 113.334C112.903 113.334 117.107 115.044 120.24 118.1L156.255 152.994L168.978 139.547C170.482 137.932 172.292 136.631 174.303 135.719C176.313 134.807 178.484 134.303 180.691 134.236C185.154 134.109 189.485 135.753 192.741 138.808L226.66 174.814L226.665 53.3357Z" fill="#CE2783"/></svg>',
  'png-to-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.1" d="M226.667 53.333H40V186.666H226.667V53.333Z" fill="#CE2783"/><path d="M189.966 109.835C184.675 109.777 179.623 107.626 175.915 103.852C172.207 100.077 170.146 94.9878 170.183 89.6972C170.22 84.4065 172.352 79.346 176.112 75.6237C179.871 71.9014 184.953 69.8206 190.244 69.837C195.581 69.9111 200.68 72.0628 204.457 75.8351C207.228 78.6599 209.099 82.2434 209.833 86.1319C210.566 90.0205 210.13 94.0393 208.578 97.6796C207.026 101.32 204.43 104.418 201.116 106.582C197.803 108.745 193.923 109.877 189.966 109.835ZM189.999 109.836V106.503L190.032 103.169C192.667 103.199 195.252 102.447 197.46 101.008C199.667 99.5694 201.399 97.5087 202.437 95.0863C203.474 92.6639 203.77 89.9884 203.287 87.3978C202.805 84.8072 201.565 82.4178 199.726 80.5312C197.192 78.0044 193.777 76.5602 190.199 76.5032C188.446 76.4993 186.709 76.8413 185.087 77.5095C183.466 78.1778 181.993 79.1593 180.752 80.3978C179.511 81.6362 178.526 83.1074 177.854 84.7269C177.182 86.3465 176.836 88.0827 176.836 89.8361C176.836 91.5895 177.182 93.3257 177.854 94.9453C178.526 96.5649 179.511 98.036 180.752 99.2744C181.993 100.513 183.466 101.494 185.087 102.163C186.709 102.831 188.446 103.173 190.199 103.169V109.836L189.999 109.836Z" fill="#CE2783"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.3357 166.665H11.3357C10.7178 166.683 10.1028 166.575 9.52822 166.347C8.95369 166.119 8.43185 165.776 7.99478 165.339C7.5577 164.902 7.21463 164.38 6.98664 163.806C6.75865 163.231 6.65056 162.616 6.66901 161.998V24.6687C6.65056 24.0508 6.75865 23.4358 6.98664 22.8612C7.21463 22.2867 7.5577 21.7649 7.99478 21.3278C8.43185 20.8907 8.95369 20.5476 9.52822 20.3196C10.1028 20.0917 10.7178 19.9836 11.3357 20.002H201.999C202.616 19.9836 203.231 20.0917 203.806 20.3196C204.381 20.5476 204.902 20.8907 205.339 21.3278C205.777 21.7649 206.12 22.2867 206.348 22.8612C206.576 23.4358 206.684 24.0508 206.665 24.6687V33.3354H199.999V26.6687H13.3357V166.665Z" fill="#CE2783"/><path d="M228.664 46.6691C229.282 46.6507 229.897 46.7588 230.472 46.9868C231.046 47.2148 231.568 47.5578 232.005 47.9949C232.442 48.432 232.786 48.9538 233.014 49.5284C233.242 50.1029 233.35 50.718 233.331 51.3358V188.665C233.35 189.283 233.242 189.898 233.014 190.473C232.786 191.047 232.442 191.569 232.005 192.006C231.568 192.443 231.046 192.786 230.472 193.014C229.897 193.242 229.282 193.35 228.664 193.332H38.0017C37.3839 193.35 36.7688 193.242 36.1942 193.014C35.6197 192.786 35.0979 192.443 34.6608 192.006C34.2237 191.569 33.8806 191.047 33.6527 190.473C33.4247 189.898 33.3166 189.283 33.335 188.665V51.3357C33.3166 50.7178 33.4247 50.1028 33.6527 49.5282C33.8806 48.9537 34.2237 48.4319 34.6608 47.9948C35.0979 47.5577 35.6197 47.2146 36.1942 46.9866C36.7688 46.7586 37.3839 46.6506 38.0017 46.669L228.664 46.6691ZM101.526 122.94L39.9998 182.234L40.0016 186.665L181.284 186.667L115.528 122.94C113.653 121.117 111.142 120.097 108.527 120.097C105.912 120.097 103.4 121.117 101.526 122.94ZM180.96 140.959C178.391 141.098 175.976 142.231 174.228 144.119L161.438 157.566L191.46 186.66L226.665 186.665L226.66 184.547L188.096 143.648C187.152 142.738 186.032 142.03 184.805 141.568C183.578 141.105 182.27 140.898 180.96 140.959ZM226.665 53.3357H40.0016L39.9968 172.92L96.8134 118.1C99.9468 115.044 104.15 113.334 108.527 113.334C112.903 113.334 117.107 115.044 120.24 118.1L156.255 152.994L168.978 139.547C170.482 137.932 172.292 136.631 174.303 135.719C176.313 134.807 178.484 134.303 180.691 134.236C185.154 134.109 189.485 135.753 192.741 138.808L226.66 174.814L226.665 53.3357Z" fill="#CE2783"/></svg>',
  'rotate-pages': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M164.964 0H175.357C181.563 0.0306317 187.696 1.32994 193.381 3.81809C199.066 6.30624 204.182 9.93065 208.415 14.4686C217.165 23.986 221.961 36.4791 221.826 49.4067V60.4081H237.383C237.734 60.4052 238.082 60.4748 238.405 60.6125C238.728 60.7501 239.02 60.9529 239.261 61.2081C239.734 61.7411 239.996 62.4286 239.998 63.1414C240.015 63.7735 239.801 64.3899 239.395 64.8747L215.926 92.4784C215.692 92.7467 215.403 92.9617 215.079 93.1091C214.756 93.2565 214.404 93.3327 214.048 93.3327C213.692 93.3327 213.34 93.2565 213.017 93.1091C212.693 92.9617 212.404 92.7467 212.17 92.4784L188.701 64.8753C188.295 64.3905 188.081 63.7741 188.098 63.142C188.1 62.4292 188.362 61.7417 188.835 61.2087C189.071 60.9466 189.361 60.7393 189.686 60.6011C190.01 60.4629 190.36 60.3973 190.713 60.4087H206.739V49.4067C206.969 40.9049 203.814 32.6596 197.967 26.4833C192.12 20.3069 184.06 16.7049 175.558 16.4689H165.165C163.758 16.421 162.426 15.82 161.46 14.7964C160.493 13.7727 159.969 12.4091 160.002 11.0015V5.4674C159.967 4.09281 160.463 2.75764 161.387 1.73941C162.311 0.721181 163.592 0.098216 164.964 0Z" fill="#7CC33F"/><path d="M168.6 55.3334L132 18C128.594 15.2145 124.393 13.5806 120 13.3334H20C14.6957 13.3334 9.60859 15.4405 5.85786 19.1912C2.10714 22.942 0 28.029 0 33.3334L0 206.667C0 211.971 2.10714 217.058 5.85786 220.809C9.60859 224.56 14.6957 226.667 20 226.667H153.333C158.638 226.667 163.725 224.56 167.475 220.809C171.226 217.058 173.333 211.971 173.333 206.667V67.3334C173.192 62.9061 171.519 58.6649 168.6 55.3334ZM166.667 206.667C166.667 210.203 165.262 213.594 162.761 216.095C160.261 218.595 156.87 220 153.333 220H20C16.4638 220 13.0724 218.595 10.5719 216.095C8.07142 213.594 6.66667 210.203 6.66667 206.667V33.3334C6.66667 29.7972 8.07142 26.4058 10.5719 23.9053C13.0724 21.4048 16.4638 20 20 20H120V56.6667C120.067 59.2976 121.143 61.8021 123.004 63.663C124.865 65.524 127.369 66.5992 130 66.6667H166.667V206.667ZM126.667 22.8L163.267 60H129.933C129.488 60.0295 129.041 59.9635 128.624 59.8064C128.206 59.6493 127.826 59.4047 127.511 59.0891C127.195 58.7735 126.951 58.3941 126.794 57.9764C126.637 57.5586 126.571 57.1121 126.6 56.6667L126.667 22.8Z" fill="#7CC33F"/><path opacity="0.1" d="M122.533 20C125.184 20.0023 127.726 21.0574 129.599 22.9333L163.733 56.9333C165.609 58.8069 166.664 61.3487 166.666 64V206.667C166.666 210.203 165.261 213.594 162.761 216.095C160.26 218.595 156.869 220 153.333 220H19.9993C16.4631 220 13.0717 218.595 10.5713 216.095C8.07077 213.594 6.66602 210.203 6.66602 206.667V33.3333C6.66602 29.7971 8.07077 26.4057 10.5713 23.9052C13.0717 21.4048 16.4631 20 19.9993 20H122.533Z" fill="#7CC33F"/></svg>',
  'combine-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.2973 126.465C32.7499 126.46 31.2572 125.892 30.0973 124.868C28.8828 123.735 28.3368 122.057 28.6523 120.426C29.4417 116.129 36.2139 111.048 47.2401 106.48C49.1751 102.854 50.9129 99.1267 52.4461 95.3138C54.1496 91.0702 55.6037 87.0647 57.0271 82.7172C53.3168 74.2016 52.2871 65.4875 54.5271 61.4877C55.3506 60.0062 56.8886 59.0628 58.5825 59.0002C63.6404 59.0002 65.4467 64.1568 65.4467 68.9846C65.1597 74.736 64.062 80.4181 62.1862 85.8626C63.3396 87.9727 64.6059 90.019 65.9796 91.9926C67.7837 94.6143 69.829 97.0615 72.0889 99.3022C75.4801 98.7141 78.913 98.3981 82.3546 98.3572C86.6463 97.8614 90.9583 99.0998 94.3328 101.797C95.1421 102.779 95.5791 104.015 95.5667 105.287C95.5722 105.89 95.4712 106.489 95.2685 107.056C94.6959 108.621 93.1153 110.489 88.8179 110.493C82.1334 110.15 75.8255 107.293 71.1586 102.495C68.3136 103.011 65.2246 103.722 61.9712 104.61C59.0359 105.417 56.133 106.332 53.3439 107.325C49.4331 114.528 41.8535 126.452 34.5303 126.456L34.2973 126.465ZM31.4723 120.989C31.4521 121.103 31.4436 121.218 31.447 121.333C31.4486 122.273 32.1969 123.041 33.136 123.067C35.804 123.065 40.199 118.398 44.7746 110.81C37.0286 114.417 31.9673 118.275 31.4723 120.989ZM84.7663 106.948C85.276 107.073 85.7987 107.136 86.3234 107.137C88.1569 107.137 89.4973 106.279 89.7375 104.956C90.1385 102.812 88.4983 101.99 87.055 101.676C83.0184 101.098 78.9164 101.152 74.8962 101.835C77.774 104.239 81.1429 105.984 84.7663 106.948ZM58.1383 97.1625C57.3308 99.1851 56.359 101.365 55.3059 103.516C57.32 102.854 59.2799 102.268 61.2471 101.731C63.7381 101.039 66.2056 100.44 68.5865 99.9525L68.3265 99.6406C66.6409 97.7828 65.078 95.8172 63.6479 93.7562C62.7194 92.4217 61.8343 91.057 60.9618 89.5769C60.1739 91.9002 59.2456 94.3914 58.1383 97.1625ZM57.0021 63.0075C55.6598 68.118 56.1421 73.5367 58.3659 78.3299C59.5915 74.2793 60.3289 70.0968 60.5625 65.8712C60.5625 64.1133 60.2012 61.9924 58.5267 61.9867C57.9662 62.0143 57.4506 62.3016 57.1321 62.7636L57.0021 63.0075Z" fill="#5C5CE0"/><path opacity="0.1" d="M99.7903 136.25C99.7909 125.205 108.745 116.251 119.79 116.25C119.862 116.25 119.928 116.27 120 116.271V63.219C120.012 60.7389 119.038 58.3558 117.293 56.5933L93.7428 32.7292C92.0344 30.9816 89.6928 29.9975 87.2489 30H16.5006C10.099 30.0609 4.9546 35.2918 5.0003 41.6934V163.306C4.9544 169.708 10.0989 174.939 16.5006 175H99.7903V136.25Z" fill="#5C5CE0"/><path d="M143.279 209.502C141.813 208.04 139.439 208.044 137.977 209.511C137.977 209.511 137.978 209.51 137.977 209.511L123.748 223.806V135C123.748 132.929 122.069 131.25 119.998 131.25C117.927 131.25 116.248 132.929 116.248 135V223.772L102.009 209.6C100.541 208.139 98.1672 208.145 96.7067 209.613C95.2476 211.08 95.252 213.451 96.7164 214.912L117.4 235.498C118.866 236.96 121.24 236.956 122.701 235.489C122.701 235.49 122.702 235.489 122.701 235.489L143.289 214.804C144.75 213.338 144.745 210.964 143.279 209.502C143.279 209.502 143.279 209.502 143.279 209.502Z" fill="#5C5CE0"/><path d="M234.941 53.9342L211.393 30.0742C208.978 27.6274 205.684 26.25 202.246 26.25H131.499C123.028 26.3141 116.206 33.2228 116.25 41.6944V50.1947L96.3927 30.0739C93.9781 27.6273 90.6839 26.25 87.2463 26.25H16.4992C8.02776 26.3141 1.20641 33.2228 1.25021 41.6944V163.306C1.20641 171.777 8.02771 178.686 16.4992 178.75H100.497V171.25H16.4992C12.1682 171.19 8.70221 167.637 8.75021 163.306V41.6944C8.70221 37.3631 12.1682 33.8099 16.4992 33.75H87.2463C88.6782 33.75 90.0505 34.3237 91.0563 35.3428L114.602 59.2009C115.658 60.2711 116.25 61.7141 116.25 63.2178V116.607C118.728 116.117 121.279 116.131 123.75 116.65V41.6944C123.702 37.3632 127.168 33.8099 131.499 33.75H196.25V60C196.25 64.8325 200.168 68.75 205 68.75H231.25V163.306C231.298 167.637 227.832 171.19 223.501 171.25H138.54V178.75H223.501C231.973 178.686 238.794 171.777 238.75 163.306V63.2178C238.75 59.7427 237.382 56.4076 234.941 53.9342ZM205 61.25C204.31 61.2487 203.752 60.6898 203.75 60V34.0533C204.623 34.2853 205.423 34.7354 206.074 35.3613L229.629 59.2285C230.183 59.8051 230.606 60.4947 230.869 61.25H205Z" fill="#5C5CE0"/></svg>',
  'protect-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M131.267 212.297C124.276 215.828 117.913 218.536 113.623 220.197V24.7375L189.482 59.7217C190.498 60.1364 191.185 61.0973 191.25 62.1924V115.022L192.368 115C194.5 115.012 196.635 115.153 198.75 115.421V62.1924C198.679 58.18 196.3 54.5685 192.642 52.9199L110 14.8047L27.3535 52.92C23.6714 54.5402 21.2823 58.1697 21.25 62.1924V137.93C21.25 172.07 45.6738 191.797 68.5694 207.607C81.0929 216.351 94.6227 223.556 108.867 229.067L110 229.429L111.133 229.067C118.016 226.703 124.742 223.906 131.272 220.693L131.267 212.297ZM106.123 219.948C94.467 214.838 83.319 208.64 72.8271 201.436C51.5039 186.709 28.75 168.437 28.75 137.93V62.1924C28.8024 61.0985 29.4871 60.1354 30.503 59.7265L106.123 24.8541L106.123 219.948Z" fill="#5C5CE0"/><path d="M225 166.25H224.763C222.412 133.707 201.709 130 192.5 130C183.291 130 162.588 133.707 160.237 166.25H160C152.409 166.258 146.258 172.409 146.25 180V225C146.258 232.591 152.409 238.742 160 238.75H225C232.591 238.742 238.742 232.591 238.75 225V180C238.742 172.409 232.591 166.258 225 166.25ZM198.892 207.166V216.721C198.891 218.532 197.423 220 195.613 220H189.056C187.246 219.999 185.779 218.531 185.779 216.721V207.166C181.731 203.545 181.385 197.328 185.006 193.28C188.627 189.233 194.844 188.887 198.892 192.508C202.939 196.129 203.285 202.346 199.664 206.393C199.421 206.665 199.163 206.923 198.892 207.166ZM170.262 166.25C171.368 153.131 176.47 140 192.5 140C208.53 140 213.632 153.131 214.738 166.25H170.262Z" fill="#5C5CE0"/><path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M107.623 223.614C99.1445 220.004 25 181.421 25 149.955V57.1454C25.028 56.017 25.8298 55.0567 26.935 54.8275C46.6658 51.3198 96.3565 24.567 107.623 19.5123V223.614Z" fill="#5C5CE0"/></svg>',
  'ocr-pdf': '<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M110.247 151.982L101.248 177.226C101.141 177.687 100.719 178.004 100.247 177.978H91.746C91.082 177.978 90.8281 177.646 90.999 176.982L118.25 101.103C118.416 100.605 118.582 100.039 118.748 99.4139C118.976 98.2816 119.101 97.1311 119.124 95.9764C119.082 95.6735 119.293 95.3937 119.596 95.3514C119.647 95.3443 119.698 95.3443 119.749 95.3514H132C132.377 95.323 132.708 95.6001 132.747 95.9764L162.122 177.109C162.371 177.685 162.205 177.978 161.624 177.978H152.122C151.698 177.974 151.311 177.733 151.121 177.353L142 151.982H110.247ZM139.124 142.353C138.455 140.351 137.518 137.607 136.311 134.101C135.1 130.605 133.829 126.982 132.498 123.232C131.165 119.482 129.915 115.856 128.748 112.353C127.581 108.857 126.705 106.025 126.121 103.857H125.999C125.496 105.859 124.767 108.336 123.811 111.289C122.85 114.248 121.766 117.458 120.559 120.918C119.353 124.375 118.103 127.959 116.809 131.67C115.516 135.381 114.287 138.942 113.123 142.353H139.124Z" fill="#3DA74E"/><path opacity="0.1" d="M61.0001 220C52.1321 219.954 44.9747 212.739 45.0001 203.871V36.1292C44.9747 27.2612 52.1321 20.0459 61.0001 20H159.432C162.827 19.9939 166.082 21.3501 168.469 23.7647L201.234 56.6809C203.658 59.1028 205.014 62.3927 205 65.8191V203.871C205.025 212.739 197.868 219.954 189 220H61.0001Z" fill="#3DA74E"/><path d="M203.892 54.0332L171.128 21.1232C168.042 17.9953 163.828 16.2392 159.434 16.25H61.001C50.0631 16.2978 41.2278 25.19 41.25 36.128V203.872C41.2278 214.81 50.0631 223.702 61.001 223.75H188.999C199.937 223.702 208.772 214.81 208.75 203.872V65.8203C208.766 61.4008 207.017 57.1578 203.892 54.0332ZM198.579 59.3311C199.136 59.9051 199.615 60.5504 200.002 61.25H165C164.31 61.2487 163.751 60.6898 163.75 60V24.9024C164.505 25.3051 165.199 25.8132 165.811 26.4112L198.579 59.3311ZM188.999 216.25H61.001C54.2035 216.207 48.7235 210.67 48.75 203.872V36.128C48.7235 29.3303 54.2035 23.7935 61.001 23.75H156.25V60C156.256 64.8301 160.17 68.7442 165 68.75H201.25V203.872C201.277 210.67 195.797 216.207 188.999 216.25Z" fill="#3DA74E"/></svg>',
  'chat-pdf': '<svg width="240" height="206" viewBox="0 0 240 206" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="240" height="206" fill="url(#pattern0_23380_32349)"/><defs><pattern id="pattern0_23380_32349" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_23380_32349" transform="matrix(0.0025152 0 0 0.00292624 0.0468227 0.0313192)"/></pattern><image id="image0_23380_32349" width="367" height="319" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/></defs></svg>',
  'chat-pdf-student': '<svg width="240" height="206" viewBox="0 0 240 206" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="240" height="206" fill="url(#pattern0_23380_32349)"/><defs><pattern id="pattern0_23380_32349" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_23380_32349" transform="matrix(0.0025152 0 0 0.00292624 0.0468227 0.0313192)"/></pattern><image id="image0_23380_32349" width="367" height="319" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAW8AAAE/CAYAAACJskLjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAGjaSURBVHgB7b19kFzXdR94zu0GSOiLg9qya5XNLnpSJhVudosDV8UV127CGa5ji6BkDCRKpiiAaDCWBNHyYmBbtpisdwZOIjmObQCOTSKiIjRImKIlShhGJKh4bc0wqay2sklhmPxBi/IKjUplXclWFkOLH8BMv3ty7r3n3nd7MCCAQX9Onx856O7Xr/u9fh+/e+7vfCEoFArFCOBcfW5sFbbUCigmAGwNCXYAUM39GUReg8bQ/1lyr3iRX8rrNvnpMr+/bJD4uW2ShZcrW6rNv/LE55egT0BQKBSKTYh/Uf+7k0y6E0zSdzEBT3qyRmJCJiE+8uzc9pr/QF775+l98mvE5+hXokDuRIsGYYlfv7Tt3e9eHD82tww9gJK3QqHYFFhgy9rYLfuRaJqZbSJY0Y7kbGS6ZV7WdETLLy/w0iZAq3krVJvuzZ2NueZ633uu/rkaQDEGUBmrANTI2JoBuou3U2P2nnDrmMDizN+O8GmxCtCobKGXxk8ca0KXoOStUCiGFo6wodhaZyLbzZLGJLRZ1UzUAPOsgbxswC7++FXI+Wbx7372lyYr1k7w9nfzy0lD5DbOu2HBADZ4+6du/9KxRegwlLx7hPoHvjdZEOx2uhpfVy9Vtm5ZbMyPN0GhUNwwFvZ+YZLZa5Yp8u4oexDQa/x6EWzxXFGx81ON3sgXOc7XZ8YuGZiuIt/rZHd7Dmd5hQeR89bSr/3Il/9RAzoEJe8eYP993ztqiWbWLF5GNDNPvvAjp0ChUFwT3sq22w6xMDHD1u1tjhSdE5FZe5GoOA7VYqkfhH01MJHXVk0xWUGcZaated2coMlMfmT8iZsncSXvLuOhXd+bZYtg7mrvk8Gp08/fvggKhWJdLNS/UANb3U9k2QCyY86aZW15kR/nrbl0apAI+2r404d/vl6pwCw7N2tB0sF5qlQP34wmruTdRezb9WqdH06+7Uo8zXvqhTumQKFQtGGhfnSsKFaPssVa99Ed4KM7FpkAj0ydfnQRhhDnH36kzsw9aww7PlkaZwfo3H/7pceOwAag5N0l1KfP14qV1QV+WrvGqsusf4+z/j3w1oNC0Qs40m61WoeYqWeQLW23zAA1Vgtz/Cef/uW+xVV3CucPHqxBqzLHv2m/J2Ck+S2VWw6/9watcCXvLoGt7vNwbeL2UOlEoQj4o4d+8xBb1nPesc/GdsXgPGBxeKrxaBM2Gc4/fJClFPRSikFosqwy9d4TJ5rX+3kl7y7gKg7Kq4JPwvEnz95x3esrFJsNbG1PrLZaRxFp0pGSYXmkoOLI3xxSeeR64azwaoFnXNy4i5YBqEz9xSceu67ZhZJ3h3FdOveVaD519o5xUChGEP/H3t+aZSt7VrIfm2yJHv6J078yDyOE//CJg8wZtJ//XtuypTr1w49dm8CVvDsIr3Ovts7xxTd2gx+Fii3GG9+6swkKxYjgxfrRmmm1zvgsRXbesbV9vFJ9c24Yoke6gf/wswfn0JCTUZarQFM//MQTb0vgBhQdARP3mHdQboC4HQrEaVAoRgR/uPc3D1WK4hwC3sXS9nl+nPqJ0788M6rE7fDffOnEHFg65tL6LcLCnznH5ttAybtDoNUWT/2uz0G5LozZDQrFJseZ+tGxf7bvt84QwDEkuA3A/s4b1Td+9G+e/uwiKOAvfOmLh9kAPMUD2pixxcL5ev2qxmAVFDeNhz7w/xyytrg5hyPBhLPeNWRQsVnhZBJcpQXWtl1Bp2VLxYGfGjFt+3pwa6s1s7J1y11sgU+8c8uWo7zowHrrqeV9k3A6N9niGNw8XGzrBCgUmxBnP/ab05WCzqGxNX65VFQqO5W418f2RmPZmtU9/PQioK3/x0/+rXUlVSXvm0DSuTsEY0l1b8Wmwz/be3S2YvAbRNYVZTv1ZvX1qXsbh5uguCree6LRtGB/zT03QCcvzlwpnyh53wSK1VU3palBh8A6oOreik0FR9wEdpZCEakjP3X6l+p7RtgpeSP4r7/4ZecXWGT55Db7pjm09n0l7w3CFZxitq1DZ1Grv/+VGigUmwDf2nf0JBP3HLqaJHyv/NTpz86B4sZQQal7QjNrrW8l7w2gvuvViberFHgz0JBBxWbAix9n4ibrCkpdtEBTP/X7v6SljzeAHzrxpUVAfA4QxuBNaLO+lbxvED4RB+AMdAsaMqgYcrzIFrdztKGrXW3NPfdqGOBNgQp73LeaQGizvpW8bwA3UClw45CQQVAohhCeuJ3FjdikLWbqJ58+PPRVAPuNH/pSY9GVwkXXgOLNUqpV8r5O9IS4AzRkUDGUiMTNJmKTKqgRJR0Egp3nf1wXijQzV/K+DvSQuD00ZFAxbHhx79FZsEHjhi1K3B3HZXMqVFuku6N0ouR9DfjGwa7YVI+I20FDBhXDBE/c7MBnqeSicRq3EnfH4RJ3XNct5gasXLaeH5S8rwKnO7u63IWlDRebugnU9vKgAQrFgONbe3/7kCduNjlsYR9Wjbt74GO86OrAEsFO91rJex14a3tl9dyNNFToNFQ6UQw6XqgfnfAFpnyDSXtk11d+SdPduwhr7cvoGl8S3O1eK3lncNr2vvteXfDWdg9lkvXAN8V+jTpRDCp8Le5VOuN4mwll7l5NwOk+TNXPatgCr/mXoPCWtiftldXzzJqTMBgYsysr2hpNMZiQ6oAVxOd+6vQvbqj7ueLGsP1Eo8mDpSstMOacliNbEtZlSVrA3XwBTrOlPZCheQR4iK3vY1omVjFIOPvxo0d5El9zSTitKhwGRe+A+Bozw/ZbL8HokLeXIC6vTBbGOL2oXlDoTu3+H2CMFaurrsmD3iCKgcCL+36rzh6zGRe2RlWjIYE9Bg+Yy85l2cJWbVOTt7OuC8RJ/rG7WRKZBAyu2qECwczeD3zvudPP374ICkUf4XRuaNFv+8gSsod3NX6xCYqegtC6Wbhjss3VSWdd63rYyHodoKWT/Nt2qnyi6CtY50ak7ewxa+w6/dlONCBR3CAwxAqSexh68t4U1vW1UVP5RNFPuEQcdDo3wHm7uqIOyr6BhMGHlLx9HDb5LMRNY11fEyyf7Lv3Ty489eJfVotH0VMEucTO+WhuoIfvfebRJij6AnSlYSmY3kNF3rHGSGFDnOPIAc1R1r+XVP9W9BJY+LwHF1985P1a3rWvIAuueTNWodUcmjjvXheHGlSw/n3mQZaKQKHoAVwbMyTf7b2pnXD6D/Y5jDlheNuJZ4aHvL2ePeLELRirACwogSu6DSeXEBRzEKJLDoCir3j9kQfDPY/mgnsYngxLhP2giHAEfo41cM3AVHQNuGpnnf+f/xraDaf/wKK6w58Psk33WtPjhxmsgftGyApFh/GH+36rzlP0Oj9tFpWKRpcMACzaKeesLIBedq+HhryR4GVQXAHXCHnfrlfPO58AKBQdgrXkanRDxcKcZlEOBthhfJcLFDTWLLrXQ0PexhbHeP6mSSrrwztz9977XS0jq7hp/LO9v+XkkprrQ/kT2vV9YMDnZJLPCRjT8tUFh4a8G9+6s8lTBk1SuTrczXZGZRTFzcDHdBPVQx5foffbgOAHB/dO+lreFpZcpIlbNlSa91Nn72hUbDHOF1YTFOvCySgP7Xr1nMooio2gslqw1U01g3Dqp07/ijZXGBAYoP1OMiGkl8plQwZngZutW3byIKTTuauAT/KEl1G0lZriBuCtbnZSuoiG1cqqOikHCDygTrrzUgGTBlSELsNbgCuXJi2YHYQuTtu6EaNWruHLsi7zzomezZ7ULZX5xjzLJNfA3l3fnUNAlQneBnx85p48e/tN34hnpk+OXbrVHuLzNGERbuMpHLI1wKfUIjoTwJJcTMSanEsmsuCW8/u8TmiUxc+hgqEMry+LJsuM1OX1YVDyeXCfj8vjd/K6fjsG5DM2bbPiH627yMP6GC7u+P1pH428Tp+zsg3rt2/8ftimIWo6J7kxtvkXn3hsJPoy/uG+3zwJZOt87Bo/8dQva1z3gOAHBx+YZNJ2zS+a73j8K+NxecfJ21X2K1Yv1/le2M3ffhcv2t6+hrtx/B2MmBaQu994AcV7qsn/7mmc/SvXvGnq73+lZk1lgTSB521A85WtWw835sebsAH8/oMnJ4jsAkoNdCFGcsFLnijDCIwGQc6rFeIkIeRAkMYXoSEMy6lcJ67H0yl3DaBcC9l66XtNJH0K7xl3LaFFQyT7QCSk7567mFj3wbCf7rLz+5seZTvZvgn5x/UxFHBzxsVShUkNDL303hMnmrDJsMBWd6vV+r67F1uVYvzehtYvGRS8cfDBk3wN1vkCbbzzxNNpUO0Yedc/8MpkQWwFE0ySv/l8ufb4/bFyFIYbS8jbr1JaXf65f/R36mu0xey8HgvcEXhhqkf5gxptcXU0Cx4Qnz57xw1ZkV954GRtFWhBKspdQbpBd/NkXRKuPDfk2JEJnihatWG5r2lpMX6PkYEgEnEidLlsjBB4uJgKIdu4vXIQCduIn7WUkX8ibwSS5RD2C+IgYP2FKesAZATuBwYM16vhwcAReMXCqR9+4okGbBL8EVvdfE7q/BPV6h4gvHWwXgNY+b6fvpIdj85Kh5vWvPfteqX+0K4/OV9YXJCuxt7SgUTSDij/YJwHB/vJ3dzetonk7mwuf6e5z4/hSnFdGYROB3/q7O17+MNHQHE11FxW5o1Go6wCTPLJ2CGnLJxBf9bSgBzN62AxU3wH/Yt05uUcB4d5NI4hzMIQUL4jgeLW5AtIuDuu6jfkG2mT3yXHrH6BbE/oGYSHwxt+dVk5WxeyJxS3LfsX7PFsz/izaOFuXnbyP37yE+f/0ycersOQY8GnwVPd/dhKpdB7aKCwMimGxGJO3A4bJu+9bGnvu+9PFvhqPplJFhiINxF4VEbk0WK47dN9j94S8/ddEiIT+La8C24Ap8++b46ty50ajXJ1+KSe+149eb3RKHx6XOldLD+fES5IdeE4/Hphw1NdVDqExuWrvIXcRvuBGoVUPUFj20WAslxWt3HsiDsC6fuprAtMUVOXrUctPZFwSfFttYTjZzA+bz8SqWsepXddwSb88n/+5N/6/kVvIQ0niqKYDb8KG1MqlwwU+KqdddctG16Nte/dMHk7TXv/fa8e5dntAllvaaftBIMmWljr7AfPN/1UN1lZ5Y2MmKTKYFABAm5A1XGygLHFFH90ERTrg6DuolF856FrgOnytfgplJlTmyWazlV8FhYGBo0+DGwzczFoENkAkH2jTcZ0sNixzehNFnyYnmEaIGRrQr9iH4SRAmUyR3HkKekf80HJW+OlsV5uMw4UXpOn8mfHH+dI3JI5f/GT9VkYMjirmw/6pLv51OoeLLx+8ME6uGQpNka3Pv6VU2vfvyHyrk+/UmutXF6wZJ2cIdZ1AmaP67EuBoLGaGb5iXUkayckyo2AJReYDXn5vYzywh1TKqO8LWp2ZeXaspSBc/Is+BGlU1Eam4Wg41lrkyESA4qQAZGow3XgPwfZZwgSBZciSORqLC3pQMRE2fYjUwd5RYwDR7alChL2XC69cpyhTCBpRxw40CtAXgD3WxOVCKKThuKYgjB78VP7zw+TFb5auGqd5AhiQa3uwQL7W2b9dYfr89h1k7dvN7aC51jimMCkZEJ+wVOSP9dQd5pkUqaBh9uZ5GbFSORQrttk39RxuAk4GYUqZo/KKOuDD/aha61jt8Ipyo6f991haUGHRxmPKenSaQImgkWykktjmMrviFpIouHwkJvFlN73PLpmWibDgtjj4cqSHW1j4PJTyaJHEP27XXTPpZhE+Jl3Jh4JaDue/kqusWNp4fVH6kNRspcdvLMyDP0OKAYGrx98oM7nZQdfURe2PfZMY711rou8H7rvu/t5+vxtvjZvsxZE1hA7KMof/h6Q6ztKlHGaXV7w8tBmect7GEMG3Qou5nuPT4m/SZz+5o/MOxlFCXxdXFM2OdA4sFwATvHTZq4FR3nYE3VGpN6PiEKiWErNUVNJxJtmV3TFLE0+v+Yag8Db7ZQtI0DykQJl5n6yqjPWxdI6SM7QkqnpSjLOBPryhweyzz5eGjHhLZZRHIE/ONAE/kd7/8E073uNd7r5E5pNOVCooM9fwatZ3Q7XbIPmih3xtdqIrzHG8qJwcFRBrwRC5lpCX1SKmnxnL7kvMT72N58vp5tuCba841QnO6XLIDC+977vNphc9oMi4rqO8YFnDjT5Yfz3H/gndfZz8MwLbvMB1zySO7XLWwCOs0Kgt/NsAMj5xaR/y0oUJeQoeZePRPETFqwRy0JkNgMuHchecOGH7rmJhr1xOTUUA76DCeGJlemTH6s+tA8xbtPtVRVEApFEIv+e9Z7zMdephL+ixoskRwHbpJkw/ITvh/JXrZls8jqWxshUHIFPveuxpwcyyYcPwSGxw46AYmBw+ZEHZvnqqjmD89arWN0O+HZf4qUSsGxx54k2IUY7xHKv+/l0UfO/i4hmfqVaPPfM/M1b0Z2AZmW2ofHU2TsOgGJdnD94sAYrMFk1uN+nJ0MZS+75v3zMYtxj3HhwmRqXOYx24Ah8of6Fmi3MeZ/xXIFx1bsHA28dfKDGF9ACuBkR0oFtGyHvkPgiXwLBtHCSyZrkG4jvObj3jcHX2OY5Xt1667FOWs+dxN5drx7jXb6m3ruZ4UZ1Jyd1QpoaBfwZEzmb8nNsUu8PGaZZUg9J8g9ClgVqA6kHQr9gYOvUthONJgwI/njfb5zkfawbA42pU5/TAXxAcPmRB0/yRLLO11XjlseeedvzclXNu2XwDF+bO+JrChkXGCWTAIkUiTNjxFNmy9bx02fvnBtU4nY4ffaOGf45p2BUwTMiJe4bg0uJ/wtfPFHHihl38dBJ86Y1ujxkUru3wYMTk/DySRggoIQHQqEF3gYFzknJ185+LzpauKaUta7l/dCu7866ZA6IwVtXSCSByClcpV7PZj1yz+nn71yEIYGLcbarqwv8CzZ9I193fvgUzvPZfKmydcv8IA+sw4I/+8Qn2DqysyZMb1Navgnpp1K0y0nq0UK3xE6ow1sfe/qmIqg6AZZMJqmABTf7mnrq0XFQ9B1JLgn+liPbTjwzd63PXEHePpb7Mn4/yiN5JvFVcL5i6Z5htOK8NFSpngNfcGmTga1rPm8vgTGLp5+/fREUHYeTUiq0suAIPK/HEmQVee0KYxmIevhFvtZ+dG2ac6+xsP/XT/KYUuf7+/DUU3/7GCj6jrdYLmFzu84XSXPb489c14B6hWxSrOLJXB6Joa55plsWxLtU2XrLjw7r9Fv2e1N42n00D/oU2gNsXW93SUouzl2Ju3twUkrBzkgMYZQplpDyJCbTZv1s57f7Kp8s1OfG0MJ+v7sV1PDAAYCTS1wpXgyBVVPX+7k2y9sVmeJFJ/MkuiCPtH/IvcfWxQVjaVPopvvue5WnKzAJwwa1rgcCLqOSRZIFn6koDszo1ESJrkUsrXB2fLLz8plF6AMW9n2hzvv0ZX760uRTj143USi6Ay+X8Gnhi4T9IiyXPHZtuSSiLc6brbfZMtHGF8DH9WqUuIgSU9hN4/CqFMWBwlTOw4BDtevBxPYTjeZ/+kR9zxYD32aOHoupp5jKGsaE4lD8p4LgQlUXoQ9g8X03Wet2Rx2VAwDXd5bPhQsMWbwR4vafjU98PW6L386XlVIJpUptPurEwoEnv/W+TXXyBzV80DuDXcs3g/NqXQ82Ln66PgMWjpY1wW1q8pDr4CaULZ/a0mPrO0gmWy+6vKTC4F/S2O7+4vLBB2ZZwnDhp+eZV++5UV9I0rwLMqyDxaznAF972UpMSVkt+dRmI26H6tYtc+CzQAcDYmUfMVuq4y60UYl78LH98cYxDFIWAEjVAMSYxNkGMkXvG4cUW6bdrlieuSlx9xeXHtl7iB2Jc25sb2HlQxtxYnvyrk+fcynBdVmGkMqyBs07BrQ6VKzdFA6+tXASBE8nn4M+o5203zfQ8fKKK8F3yZFww0gdxFRVRUygWBkFcD/NTPc0yom3uVvq4zZA0Tc4ndtSMSelMec2mn3rybtYuTVZAULUUjoZc4vBvW5s6sSOimlAP+GSZ4rWTiXt4QXr34t80yzGovRZoaxUB8U/sjbeulTtaY6BT/HnO94afAkUfUGI54YFltHG2EQ+zhb3ho1hkU14RE7F1mRJW8ZYeNysVneElyb60MQh6Nr2sAvv06zH4Qcr2kcwl0p8xa51uvZUYDf0CAv1vzvJI8ltvNkllUz6Az/TQnTJUTUEu3TriT+4rjaPV4MnbyaPybWkHdLes+uNSW0UiAVd6F0vt+dqjBBN/f6Lf1mTJTYJgvWNF9xdZEBql2MqnhxzJFwiZs9074rzafmSy/2XBkcRjrgvr2xj4iZXo/u8tbgHbhKmPv3qBGUZhhlfSyn7WHUKRuKkW2MWoUdwVpCvMXKDHd0Vgw/jQjp9r+JYzBxSDfHMKt/RM92bfCNpt2OLoOg5Ll269Sif/gmXQUkW7ulElq1pFS6XHtd6w9siTtz7FewdqfUTQTrpftSJJ+6tW65LJnFp/A/tevWGO78r+gik57JOExjjvKVkeWrv0wvd+1/W//4E+gQiaP71xq8ugqKncJUC+djv59PeMeJ2MFBA7NC+xjmZg5ZHyTrELkedeKnEEfd1OiVb1WqNT85drpP0vl3X3/ld0T8wKbv7Jda1D8IJZSn0sh7L4TXoMorCNdBwe2BfBkVPwQ7Kk+zPqvPIvdxq4Z5O1rUxhuy41Odui/F2SCUaCEbqpBPiInQJqY72DUSTuNlABeBhPiGso8J+u7K68OCuVzd9NcRhxvZGY9lZWlBGCpJ0caOy87yn8R3QZfC2dkNQbLSWSQ/xlre40Vncy0UL73nXE51tyGHIuJrdSTaJszyJ8Q7zO2P8RTgycKnn0CVstI42z3waFfJFkC7wyakxmauMMuAgsM2y7xuG1vPxNcVgQqxBl8HK+92hA9CWRVB0Hc6P8dYjD5x0uTPs83iNLe6pThO3g4QKtvfBLmt3E7ruONbSSMUce6u4CyGDLhzwZiJ23GefPHvHOJ+eELKJNMcyynmniYNi4GD9QFvWN5GUy/BmTH0jC92E07t5K66NYfPHNUSw6/DEvbJtgU92nU/wsu0ScTvE9Hj0c7q4A+KkBK8g8LMKvgYjhi6EDDY6FQ745Nnb59jy3smc0GQOqBWm8n12aI50W7dBRKBpgrXtiVGCusKj2Q5dBFtfweoekYCDfsIl4Fy6vO0c+gYvrtk67ewWcTtInLf7l6T7QnyLSlluBNHJkEGnc7MUcxg6COdAdhKMtfaUOMCO7bv31QV1Zg4WQj97gJg14YvDYpjchuhvug26CLbJJoPl3+q0MaLIEEq7hp6/fGbPu7rc3W664bs0pZZ70FYCVoyD0FgYRgydChl02ZM36qC8XjgZ5fSL76vzqXrYDRB8tiaL1da5fff+yU1lbik6hVBcOdI0hhZpMqf1bdL4BuyubcTbdGGCwDM1zSXoEt749MemCc05Ptg+c5LP8j296JZkpNU1rF/LJJRnYIYfSeu7EyGDhS2OdDsz9Sl2ZroBglzpWJdwhea3vRauVnifgSjzWopFqpK/MtQKclU7oVv4Tn2uxnf0Dp5eL/9YY07Juwtgi9v1MT1jgG5zpZtvueXyVK/a3KWSsLHbGWThgrEdGowobjZkkA/k8V6lvZdWOBxwESn8uMOurp7XiJT+IfQykXrK0g82AmFN+YkugLd3l0+JR7W6O40QUfLgSXBlXcHLU7/2zhPP1PHYfM+COwyscXbHSBMpawlwZfblyOBmQgadjOFrhPcYmRX+pO+KBCEiZe+93+19/egRR7q1vGASbiuQIG+KpZYNdA1s1U/KXax6dwfx1sE6OybfcY4s1Zkclw0Ue260C04nYPKLR1Q5DwqVqWCULe+Nhgx2U+e+HkQrvAL0o14Ld04UxDP77tPszN7CBp7mG8l42vaZMlmBKgToYqQgf/uED1AFrWfSKYQmCqte3zZI5/nc7rzl8a/2JfmpbdzPQgQ9yppUZmSt742EDPJxPDwIFRhdREqIC6cjEDTXusvO1LDCXqGsjh9qmoh/KaXJuz6x3bONHHm7jd6qzsqbBs3Ux9741INnLBXH+H4aQ3685ZZLP9orfXs9RPKOXXNA0sDCQoorjabD0uFGQwadzu2kCxggPHn2fXMVW/wlftpw2Zk+rJClFP6rg6LLQCypOraBjYUF2WHZpUCuf1Wfm/AkA3RxZ2NOG3vcBN46uHfyrcsr55gbWXr0na4O3/r4Hxzupb69HmJ7Pcn2KtufKQJuJGTQSRSu3yQMINxMgAeVA/z0AJ/oJu/tDn5+UqWUHiArAxsLVBGWmZdd2STaHehcHohajGqDcE7JNz/98aOEdgF8/DYsItmd73j8KwNRe9+0x5mG9mdXEvjoyiYO1xMyGAtOwYDDzQqeevF947zDv+BJnGB/sbL6/f2exDXNvtOIjE0p4TK1PfF/3YrztsSSCfmyoUreG8Bbn2Fr+9I7zjkKh9Br8si2E1+Z6qdMshZG/CUSeuqAWW2TKzJ7RxL2Onpbusazw9Rp6KkXbj/mCl2x5HoKvVPa1mEVzj+865XZg0riHULUIH3xiXB/xXhBbyFR1+K8eVCYcJsv1Fl5Q3DatrO2bcHWNjsl+Rgu2RbufOeJp+dgwBB7WMIVhgFE4nb/jK7m7eClE8CrepRdt/dB07mvB26wOfXCHQeMteN8nzecOIuG5lZXaeFnd/07jQ+/aSTOxlLnLq1w6WzTrW3XfDK+r2youB68+cjeQ2++tXoeyB5y2jafvCPveOwrXa1PcjMwvINj4g+/wtoOyb0qgTs8dfb2Pc4ZmS+LjYNdt3cYYjgSb5x93wEqcJwv3EXWS2toYO5TH/y35z9538v7QbEhhP6VpWGU92bAEPHdxZvLpcUD/Fjj8xppcg04ieTNgx9fYK47xqfMtaV7yVCxc9sAWts53Ljve+jlOndb32Ec7VDBHM4ZWdm6ZTsZnOLp6E6zpTq+mRoHOxL/Jy/8D6zb0xR6PZxqLKs0HvnA0vcf+eC5OihuCDb4kCCXtaWiYIzrwm5o3hJpws9Iiftt4JJtXj/48ZO25RySdLdxBaWQ9rxjwLTtq6EaauR4SyDWMoE8McepdaMcKrgWknizCJsYX3r+f1zkh/GDu87VsYKzTATjfCWc/PkP/hsnpRypVMzisfmdTVBcG6nNCUnZTqdMeRemjzqxXZjZGmjVwmP3e7EOI7yufal1qEWtGWOc8YrLBdHxd93y5rF+h//dCKoivqV5XYhjylcZ3QzLUceJszsb/NBwVncFYdZZ4nwxfJlsqzmz+1+/BLh65Nj8jzdB8TZICrebw1K4vbLYgC7cXfz9rtOSu3HV8s4QSfuNyy0XQTIW8qNw3lDr8DuHwNJei+raBSSZBNYmaxxGPVRw1PHYNwOJf+YD//ekQbbEyU7yhcFOTrP/F3f/X6e2IB35dSXxdRCaVvLx8mnxsauO8f5LuaW6kB7PN/UOCoXEm6DwpP06k/brb7Vm0Gna4dAvWsAj73789CIMKTx5l2SdIk7QhJJowTQglU0UAL/7/F9d5IfFmel/NcGEdIgvkDpfGPXCUv2zu//PRbSt47/xzb+hTW5zSEIO5r5JTAWqsBvRJkzcE6FK0Wh3iy9Ju5hxjkg0fuxcJEfaJ4aXtCOqIr9BqXlL7ldWoEqZW5Hj2PyPuen4gZnp7xypEMwapDoP8JPG4OTndv/zZsXQ3BayL83NTzVhxBEyKmNDBjG9JeLb/9uNwlQugsxHj5mR1LwTafMfv9wO6AqE4aJLtHn3id9fhE2CqrRjEpCkyZdddBSKq0H07gOfYxJ3XXz4SnK6+A6ycLLFJsCvTi80WHs9ziQ+otorxTqdSGWx/JgXH7rGdsHy5tFiwj3uHLEwwdc/8eAEmcr+H7zVqrORfZsca29pv2sTWNpr4S1vRJNVFKQ1wU0aKqh4e4je3XB/f3t6gaUU3M+k5ci8ztdXfXb6j5b4Zjq2lSovPTqS1jhKUEAwsxOBuzluhzMsz9U/VwvJOTAyVvcPDtYnCYpZVn4ns0SoRX7YlKQdESxvihUYIiKJo4tn4v9V81ZcHz4/P9Xgh8bc9EKNqWqOn98d+ijCyVVcxb/3oW81WFY59eiz9y7CpgdlhnawiTA1jofuZMBVqzUsCjboN3eM90WWRqqX7CE+gjNExW3h0OKyMbbBItVzm0HTvhaqJNdXKEgVr6Uon+TinEJx/RC9u+6fT/+ht8bBWeOE+6mA/Z//0NkLfLctVipw/Je/dt8mJZqUq1w+pHL53ZnMVgq6jUKj401peQcrm2bpTTthnRMyjI2uTOtxu6167D3HnhqZGUc1XF+Ot1P/SrG4R7t/paJzmJv/yQY/NL4w/WKtMDhtiJwjycWM110rqd/40PNN1g/mqVI5tZmIHME0g1SCsWMlShJc6GjZBcubqFWT6PEmbBJcZMI21t7NB2vGkh3zNGX8kVzk6+bIu//x5rey10M1r+cdL6zQuckvUMelomN4dP7eJj+4cgLHfuMjL0zYAg6BtZNMNUzkNINFa+a3PzzfZNNhHir21OGv7RlyIrdU5sOnCt4xY943Zeh8h1gc801V7HBb3k4WgTftITQ46SKZPFmH8a/JR+2UvdUc236sMdIZpF7ztik9Pre0g94dSFwdlorOQizsA+75P7z/myynADs5mciJdvC16GLIZ37n/q+fZ0fnS0T21M8/+5FFGD54iRtTGnOud8fqsJ29tXgbbkYDxtAFGDKwhV2DAnaToWl4iyW2FLPMWjZCowX2ue0nnloEhUdM0slju+UCc8QdHZfqsFR0D5999oOLIPVijt5/hi0t2s9/ziIfZ7tinB/rv3v/V/kGJjdNfg4qsPjpZz7WhKEA+gzL3Op2CKkV1PFQQTeLgVAnvAlDgP/PSyLs1EacZMN6UpJSvY7Nv2XeojkFt8LSu0fcyl4P1TIXJ1kBqRKDLFQoeobDz+5ZBCHyf3T/15xFvhtdDDnCXcxzu/kKnTYFwBc/8vQSL1sEUzxXvfSupQPzewbv5jaGZ/yFU73RcXSUS7JY3K7cX9jdWrM3hYszM2PFG38+bQ3cbSxNo4UQKRKySzxhO1kEtsHSbUrYb4uq5Oni2ulb5kpRyUTRF4hU4v7g8Qe+UqPCkTjudhqoI3NXs9pYnKGtb9DJn3nqJRb3Fq1pvTR2CZb2zB/o/41vbQoQzBsxxJvNT3E7nGHpZBNndbWg1YQBwHkm63dden2CLPB5o4nWm38+6Ty1hqQ0gKu/gvgcj8fzVSbs7cdOKWFfJ6pvM/iXwakKRZ8hMklD/uCJ+59iEjDTbNLe5SUWoLtZ5eMpONKf30L41AMnF9lqXzJUvISmsvSxZw40occw3gYqiRt9mRNJac41lE4CveZNYzTWFxJ0ZH3Lm29O8m+/26CdoDdfnyyrKEryEMJSBcz8JSyee+8/bjRBsSFU8whUaHveeWeKQtEpfOLZfYsgVvnJ6ZNjtBUm2anl6quwRQ6TYp1PgmHLnO3QrzzwxSa/v8QE8rKxdrF66dauW+dWfJKY9EdMtYIkuwI677AM9+94Y67r5O2I+tZLlyawKO4iYybcIApvvlELFp+Ulna/17jzhEvOwv7Bra2lcZVDOoJYEja3ATBLk/fQ9HjFIONAIOF5+YMzTOav32pdfQ+2yPFuvpzvQl+LHJ2kMM0kMtva9hZ8/cHHzvOVfoGn8YtM9i9vRdO87+mf62R4IoX4bsmG91FdId7NhGqd1EmH5Sv1z9UIWu4OPg8dxp8dPFhbXcUJg0WN9/4uV/4A3nirRnG0CJ2UXaGNZX6yxGS+RIV97tK7CiXrLqG6/tjfXlmQPfwXQKEYEohFvQhZx6OvPvjFCQrNJJzEchezzATz6DiT6bhb5kyWAgv45sd/h9e2SxUE1mKhiQW9zATbhNal5r3PPNqEGwMmiTukwflEZt/wRIIDOqt5XwJ3S+MGk+ucJc1fMQarLSZpPlY86DEHuPKytVYBY6YCIUxG1g+RjrSETNRsfb/MA9LiDz/xJW0A0SO0NWPwVYdjvCBduUyhGFZ89OlPOlJxf6ne+JkHf2+CJ5U1dqZNMC/dxdd6Dck62cUR/YQ3io2fdxJs2YJ/uPcfuiUuymUZLTWZ3JqmihegVTShWuEB483m1BVyhddJUjKOt8J5kYnepE7eWtVqTQpdNdd7+/zBmdqqI2EL/DvZgjawg/djzP1WHsjG8I1WLWQUlWKqSXl7rFUzUYOzqIkHNB7gVt7xzub4sWNqVfcJuG/XK+fZJNgRBDhMkzwo5RN+Sg8/dfbOBigUI4AXHjw6wZY5SxB2oupInf1/fDc46WUsVI5wIPHmU6qB70ne19F2Mda0/N9t+U9jP7T1/3cDQlgXhbTBek3YDQ4F4dK/fevOw2HLLbamqs11d+pWtqovmbEq2LFochHZsQqZMQMF74G9jb/aSUV1/u5l3tYCb267m21U0NU7ge1un024q0nC8yRr0Rc4DGYa0QX+ITxAmaYharKyc2HLFlp674kTTVAMFKqYylUGnZsdPpAXqApXqmreitHBfU8fvsJKdzhTnxt758o72GLFMeNqZqMdY67ewW+xxcukarDmAj3QvWa0UATtLJOyrbkJP3nL3sKOvuLbIIlylp2rYp+nsBRP/Jfdk8IPDWjD8oon4RaWcYfhM0zIt/GrPSG6JfY99ib1BfCatGXnLS77MD3iZSwLUbXarJ041gTF0CDKJomcM4kk1EDzLzXDUqHYEySRqOkuXm2979S/ULMrduw9235wiO+iepzTAmaBAZJGWDG0zG8uyUuGrZXPhbzLvMxl5uLlSOj8j/vsshQGfY0JmgcSmuaX/5w31zBMytUqNt2q4yeON0GxqVBNPsm2nvHt0SY8hVLLW6G4Tvx4Izg2Xzu41zn6KTYXDI2IKVU6cffcNvPW0l9t/L0p6ABeeXimzhb1NJP292//0rEGKDY1TFZkGCm5wNsLVIFCobhh+ARC3+0shnlj1ChJOB072cOygnibs/CLgv4cFJseBiE1H06P3oVBuZSisolCsQEQRjEbJMMSyniO4E6CjoGHie3Osq9URqcF2ijD6yHWSh+0YAw4dY5KQtfiVArFhpHdPSkrHiUT0v3XQcvbBK2TutOSXjFoyC3vVNMbM8eKhngrFBuDlYCREATgbe00swXRT0xnSweJjd+FlvSKgYPJAk3WvYpocKtLKhQDjaB5i6kNUTqJmneA7WAsgIkp6tbqPTsCyC+daB7kryG3whUKxY0Bs1sq5sm3sXcHwZpJSMRRw3skYPKwEvmj9gxLDRVUKDYCk6uO0oA4OJUglDeRVJxOge2s25xTtMDha4GmuHH4MXpNXWHMrjhEtbsVig2hzW2IsZNlnmJJ1EkbHCW4BRQjAbOepC0aXYxA0VBBhWJjQJPlSSTtW4RwCu9Dp2ABlLlHCNXQ0xpzC8An60iBKrnMeieb1KfPjxWrrTrvz12gUHQBfIFfMFu3Nhrz403oMlI8N3gjqAw5gc5L39Kd3iXrqMw5AshLwso1hrRWLumV5c3EXStWVhdACvsoFN2Ao02+zmYf2vW9uSfP3n4EughqUyXLHvIxmZl8PZLOINXxJjXARwFiUrcVo7oCvbK8lbgVvQQT59zeD3xvEroHygK9Pbx1LAEnQUTpLM+6bzNqeY8EYrRJao4B7V04RPfuvuW994N/Og1K3IoegyWUWegmop8SRO3G0KQKYqX8DlrJeEW0r2IzI5nU7bVM8hjv3ozipigmQKHoNairBkP0GsUCr5i4OpJ4Zze37L7dWjsOik2P0I0JA1GnAjpttgD1RDbhrTRBoegx+FLvbhGn0IehvKOozTrurGri2rOBi//V2iajAB/nHRW5rEAVxAJV4Un3ZZPK1i3z4Lp7KBQ9BF/bp6BriJ10IAmQcQGV0SYdM4xMqKbSVvNCsXlhUs0FxCSTZCnxPfNaN+bHHXF31fOvUOTgi3vpqRf/8jHoGmwpRsaiyxDqxEoqM3Y6MsSZXFbDvUcCqRlD3rcSQg2Gnl8AT71w+zEyOMWX3iKqFa7oEpgxm8yqR8zWLVPQRVxBopKjk+K+bWervpkg0KABLUw1CqiKPyVLiU/OyiSfYA9Dj04/f/sivE1/QIViWCCddMr+lXIXkRA4Zo2JOwLX0zJsagwUmx4mdNILL8qCVCHLMk3yFArFhhA6L2SRJSF+izLdu2Ogwr4WMvCVvEcBefHItSZAssa1tolCsUFQesBskRjjHUYlWvTaQmUUYOia51mztRSKjqHNgdlh07uQDZDOlkcB0fL20re1KXQpL0Os9bwVio0hxAOuuXtiFW8CwI5K3gaaXmUnqoFi08PgmrI5EiaIZSOG3sR5KxSbEOvKI7GKN4bGJx03jIzerSMBV064BhlZxwiT8LZKJgrFTYAQUgXBEinIJNT0hg6BZ8jLIfZXLe9RgCkjTaiMXvIRJvFPCVyh2CB8YEkqOyHhJdgW7A0dQ6VilzteplAxsIgNrqlMkV9boEqdHwrFBkExRBCDGzGYRhL23dmaggDvPXGiyV+5xLrJc6DY9HDNGCQl3pcZlgJVEJ97qMNSodgQMDZgSLcThektgQ1z2g6bRn/hiS/uBMVIQApTUZvWHUvCtuvfCoViA8hKCMYlseQbAHZUOFGMErxsEq3tUCon1o2PBapIk3QUig3B20aYJepEoIQQdtRhqRgtpB6WZRnYJNFFnziqbKJQbAQ25EzgOgWqIOgoBeHYv6n/nZNuNUf1aCzE5660lXusOPOJ70fjlntr3cr7QTI3JtTvjnW8K/6FyOnsxDJhfp2+EyGuT+l5FWMNFnffh+/3JQ+RlnnRsqm2XrYts7TtxDNNUAwERPMOaC9QFTrKo9oFCsWG4KoKVjCL9V7nXiqoOsbv1o3TUjD0EDZOEw/Jcf6xSDW6XeI7DwhosHBkHKpeYcETY+Pnx2HebJ0pVoCvJ+dfi3lviVJXtjKA0fiAxYJioSP3WHGavHzK7RWvW1T8TPzyIx9d4peLBZnjSuT9RYw2AcknCM/KglS+QJXKJgrFjcNAahK/hrgRMKsPG+xf44jbm9iWUn9LiHVkrfRSY/sbxZ4nMpGeQ1lwSrY0IqVS4eG+JpJ15LZ26Zjiz5LbHonS9zii99+NsV1yQbJ9qkzwdmYqaL/feuQjJ2nmgRoo+oJwBtuzCOjKdF6VTRSKGwWz7GvBL1lqkUHrTrXzxXcphOlJ12Ak2kioNqRcONOcrHyT9OGhIIIEwgaCspZcUD7JfyflxCzkTmF74XPZdnyZ8RAkk9aXPvflAOCeukHE1Fsr9tzKp39mBhQ9h5fBjBvBr16gCt0IDwqF4oZgjVkOKkUWJehfy6sIT7oGcoINRMkECVCSO2Iidk+8XmfxPk8vcbj33TJnxUdy9sQsBfmD5R6GEpsNDmHAgLTtSNSivmOqEi25/NIBSF7jGH/70WCFT2sp2h4ihQoKpK0OUPbaWRBqeSsUG0HIxckT364IDkySSPhAkjKCPBLcUMmyDoRJuRUdPu8tc7GYIVnIYnknWQUslGQfPue3QxQteU/k3qKP247SSZBQy+3KxCGSft2ubFlQAu8dTF6ACsQmKEMHpW6lat4KxcYQPI/rlJ/C7NEE4vXWNwT9WypXeCvXLzfJKrZSlzBp0hJakCx2L68glBZ3XM6k7OSOQPhZhJlY7ZHMMX1/+PPvOaIw8rlgidu2WYLfrwm7qgTeKxiJMMlDULN0+WCIq+atUGwQmPWnSsvcPwRJyggeRG8B53o0CAlbWc8/j9Z4sIYlfsREB2ckVCwdkG1yTCJza5PFjLmz0u8WCTEHi9xvy5Z6t9+f6NAMJA5xXbdcCFwdmd1GNabEl4tCfLekyEuSjtY3USg2hGAGtRN4yJ7wL6tYLFukw26xEQKt+EBAgILp0cVsS96zX2YoyiIVqFAB0nEYonzhRwKQClgu7DB0aIBKBV2bNP990Vbz61Tcow21CEUJ99sxPkTcvT1WGDNRIfobrJ6Om6iZOzvcW+wQKmuEgEJe3w8wE7BSOAKfwmMaTtgtxCSdGCQIMUTQFaiKpN5Ly7s+fb5WrLYO8X5MgOLGQXDqqbN3NEAxIPAV8WMgLkrESSwwyDegXf6fGnMNGAJcPFiftGRP8o+oud/hpBTJIUXxxlKIJfcW/g6rBN5VRPKOAy5kRalSgapead71Xa9OMHEv8AZVM9s4Jvfd9+rdT71wxwFQ9B9y54TCE1mBqrAUhgnbTzQW+WH84sGH5pge/neUVB6Te8vEivcWOUBNLfDuQaJNIE3t1ilQ1RPNmy3uMZ7gnVHi7gAI6g/t+u4cKPqPlAIntZXxykjBYcP2E0/OsWjyawRZFApkUS4AuVOzJhZ4DRQdRZj1YLS8KdkJkBWs7IXl3SqKSXAjtaIj4JtoPygGBl4TzsMEh9yLdNuJxlwBlYclRt3Hl+chiVQ6PN3zIKEcVALvJMxVllN+lfHw2YRu70hRqMbdWdRA0X+IWRSzKx1KEh9uBmcZpVFg5eHc6rbJoRoTgZJVvsMatcA7iYy8peYB+OgmhDLIKas92D3wCW6ComPgU7cEiv7DpqBbbEt12yTxW47AmUYOwJoU/BiGaKUWSwh5dBKKVQu8Q0hJOpD1rGxPledlLeg6Klu3zPPGm6DoCPgMHgdF/4FlIC6ieCtjPSqATUHi7xELPMajk9RiCVJKTCAyIZadZ4TeAlcCv2mYTN+GMlknT9SBnljejfnxZR4j9vB5XgbFTYFPnIYLDhrkjkpxgiAPQ+y4zOEscITKgTwtX7I0S4ucUiKREngH0EbLUqAq1TdJskkPLG+Hp8/esVR//ys7W6Yyw9u+CxQ3BsJldi6fOv3i++ZBMSgIjv8oRPo4XIiBJ5sKzgK/eLDuxJKTBNL8gUT1900e3BKLEoq8w1aKb7MGfo+GEW4MjryDPSClKuXA+gQdIfCeXmONb93Z5ActManYFMhtIKR0XwXphHyWyyaxvQOcBf7nTOBExUkykm6PMUDSN3iQhhFeSxnXOPCNw3gzIFWsTP0s2wtUodHYa4ViA8CszsRapyWltzYXnAWOyBKKb+mDGJtLSD0Uirq4FLMKTkyNQrlhmMjZkF1YWaKOF1GMgdtAoVDcEJiedoQnKNGC+XubTzbJ8Z62MEIDZbla77xMhbSSE1PjwG8YToS6EJ4irVOgKjyztB0UCsWNgXAsxAhCnp4T3oJUhqIJmxQ+DtyFEQJAVg+cUinaWEExVFGsaRz4jcHlvS+XPStj2GB7iVhXiAYUCsWNAcEnnlFeK9/3U0DRv11vSHgNNjF8HDhW9pBzpodwQS+dBAnFSCJPzMj0mZjfVgv8+mAM0csUK0QmaxuhrEJMzk+skR8KxY3ClUZN/StjcHdsJBxemRHIbXjP4435wpoptrCXfS3wWL/cv5vVCQ9NH8bVAr8+mBhXvUYySTGZ8nLCFY4ChUJxXXj9kfoEE3S4Z0huJUmTL280R1p2EUYA259oLFlbmQIyy9HShpB1GbMxKRaz4oO1Q4tZXRvGVnDRPXFaVCabpGgTWTbWal3S2iMKxXXC2uJQeCY5laUQ2dbs26JpwojAEXhhW1P88y9G0g5de8KMJHboCSn1Wo3wWjDVytbF8JTyPh8CTClgxuI0KBSK6wIT1GTKKRTFm7IGNmIfNbc+9rWRqkGz/YmnmcAr9/iEMkDp0Zl1rY+ZmKhhhNeCcWnpKEWhUgKBADGLOAF8SKUTheLauHhwX51vnpp7TqmdO4XWgpgKXrt/FmEE4Sxwwxo4H4GLbQ2Tg9MyhMNLiVl26NaKy2qBrwefwcrTlYZ7pHCBRadlmt1JNMr21srKIVAoFG8LBDMrKndZmVOeSdhgyGi2dApGFO9yBF5U7uHDtJycuEEDDx3qMVrjfvwLUShK4G0IJWGNfSm8zAztDGE09O/OqPWtUFwdr32q7gycWjKy10l+R5/7hs0tJ55dhBHGu7wGXvgolFAnICTy+DBCimXPMcaBj6sF3g5P3qefv3ORj9FiWISh3V5by4/UYWfMrlzSuiMKxTq4eLBe47tmDjKbW/rLUGzG4GWUUONaS/ZC0MBdFIq1zgKHFHECeU3wEBvurPFasVKcW3nkIxo8AVkzBh7m5mNN7/aC3r7KeioZS2AO1d//Sg0UCkUb+OY4w//eJi8oFJdAbw1ZiTjxAgEvv+UW1MqPAqeBVxyBE74mBZYCYRNKbUIpKxt08TFesqAEnpF3destTn+7mL2X9LpYoCosoLHC4ILKJwpFif/8qYeP8sOEmIwhpDtWpRJ7Ekj8lAintIpeO95VEviylRwTH3Eigq1P4gFQAs+QyDtEndDvuOcxpKnMvIzPU0enHcXKylFQKBTwnw8+PMtcM4MxDecqFack4rtZWDwCiisQCZyt7SaFWO+ggYtsApSK5TlLfAxHnMDbLjNnTduVy+foyua1BFdckv54nqps2XrYET8oFCMIT9wEc0ZsagMp6M27j0wwIDHW1mNr6cDWx7/StygTeuT+Wd7ByRbh4UGNMXe+AwPFgnE1lchCPLYVEVJcWRgvpvhjDcsW4Z5Ri5d3uMJG2PvB705jQd+Q9yh7TOu3NWlAPF8p7D3SREGhGAlcnJkZa735xklAOx2D2kyIk/D3hSFLgbwhutvcX3Pb418Zhz7BEbf1DlVv0C6a33t2CgYUjsArYBdYLKn5Xo1lJfAwIJqgpYTOmORqpkyNGoGbtQtOf/N983w0JHQw6d4I7Rq4gxS7pPHCmHP77v0TjUJRjAT+309+cvrym2/wDJWmU70SnsyLUzI5+2PIljThXeYnfSNLJy9E4pZ9mqSZ6YH1W20/0WgWYIKE4o6fDY5MCm2+ULwIMSJlJDVws97CSkEHpGAV5QWqMg08JvxK7RMa41dHH9r1J+f37XqlDgrFJsS//9mDk3/2iU8tsOXnZqY1isztBRLA9m4LGOLdRALnG21m24n+OCldidUKuEiYNbhcmYQBhiNwFk2mLJoLvuJgDIZLpWJ8ypNkY8LIEThe7Y29H3hlEi1+u1wHY8lYHwcuZdLW+bxf7wI/LlYInoNbti6qJq4YRpxnaaT6emuCDO1Ga+vsQhvzRJxkEFsGs2GklDCtT5KJN8XtkXefeHoO+gT7c/cvOEv7ynfoeOWxrw/8jNlr4CQauNjaRmSUEAUXK4R738LISCj4dm/uu4+lEIIYVULl6jHhMhA6lkV34pv5MrfCa3wJL4HPpHIWvfVrGcyFdZu+wJTbWLOjtm2Z70UN1j8aX9jdhgZLRta3Ns0t/I1k8q+Q7tYmrGdkPWvty//om3/tGGxCnPiZrx4iW0y74xCPcTiuBVTSWrFEkPXnJ94sDhUXrRzrLEkbXUOxOrMnNfJPjZxPJ/uaWAA0Vm8O5AfxxpPtYGpOK2QYAsPS/vjzYwv/fcGSpeyaoLD/aFN5IxPr1ElsdSVdFzb7fv5N0g6gJIXwnfyRGn++5lsG+LIRLv4BIDbuijqsyZyTUfcGn4YTa1IRE/fpOegTcp17HSxXHnt2KLpkBSemXcCggYeob0fW0tahzM30l8jFAmjTOzHxWivs3fXKnEGcFekEMwvcIY9CWfd5IPH2z2CZsQkxEjYcfJkMYXKKgiQOlcVq48jB04IwW5XZAEhiKJTEEJPaMN+23GT5DRu3GW42XDz+zR+bgk2Gxz76B0f5981gabFI7TbJZRMiLV9nlk15HIWobPk5kM/J8TaBfMMBd+eIKA7Sodx+yptrqyMHiRjjfpBsz1Cs7BS+h6TmnCdVf2H4y8X4S8GWzkF0TsO4nXSjSwfF7DfG7UOy3KC9tl25f6kbo9umIw0TyMN9nQlEnvZN9vnIbYNL3B78E3bikJCcd2JS8W0+trUYyQMSheJnPPGed+fZOEPRHqj+7tc3bTKUudYKp8/eOWeJjrjnJZn6V5EtE/Kknrgsyit5g/qQ9SOCIMTIWCqVdPEql+QS50ZSYwWD1t62HSgF+oQQF4qB+oXoAw/4IlwURUsh/KhPbiacnD4z9rsf+epJ/nkz5TQnDl9y/BMpiooYji7J+lJjggKfgrwXPhlOnFRTMPkQmwbFbMyOs6ms+gKChGek70w2grPgZYxFqRNC+fQvthfLP5y+Qj6YoqTW/j5aM7OD8vvTV2C6Tsvf43e4/A1xClp+RpZa2z/ido5I+rn7j16LuB2sc7oOCbwTEyv3OA3cX7EY52zlnziH3RA7BtZ8g37uo/thk+Ka5O3gCJx96R/io9IslxJQ+x3QlkafaqjJ8rIZVHnRC6/LnCfyd0hMw2SbZzdasKRQCmXlBe7bTX5cszAMHiU1BzNflmVfRXDFLT3McMT95pZVnmpSPR2KK8g0lbkLFYGlZCnFcsDeyswOixAmSmsYUSUoH/VK7sTo4qakpaXdwFRhL9i3Ng4tkAhcPhtGi/aTjVmt+XjR+UAEStM5SqM9lFdAHAXCgJGLfYF6E8nHb5DBSWYC6RPxN8rhiCObe3eZjDm8/Yun56DHcEWbvLW9Uj1v3WB9fTg0yFEna5GcmIAXQhVCIWuZn4WKhCbNCQuixmYl8Osib4fTL/7388bSFKQCVm0GRzRGEm1KRqY3oYzJLWRKZBxy7uN95CfpJOlTUS2X7xbZBZMUk1GFEHmMacScxikrD5Ru9HX5ufychc2Axx84U/vBllWXcBW97/FAQ3xAKQDkX7f/E499OlgyA6I04sZzkW0zcqInvkiV4XxjYmaZgcU5GOSl9zAnfWrj1jZQvv8lzcv0Sor2ISYdjuRdks8m0aaETYNWmiPGSXh4NGHqt6ZOYIwo8dvl5y+TxXu2P97oic/EW9ifuX+yYCu7eOQj5+1K67xY2zdCxmNM9kMV5hsI3GViuj4EUdzzghbERyKpTriJCRxhA3DhgHytzvLFugPLBg7JuFrrvEwbk2l4eYtAXDmTQITY0w4SQJvhB9lrWrMeSpJEqae6gcAkOSfMq6KOG9ZDeYzbJda8/9oUDDEcca8WhbO4a5lejVAmOgQN1//0qPm6Fa33Q3qnoFidElmbjldYr6y2LLcKQKb1ln8gtq98Dqw49UisZytSy3qfvXL7cX+DPu4dneE7mayNjC7eYQhZckype8vvLn8vinYf9q/U+WUyDrj2eEHQxv33h0hjlCy/13iDx/+rE1+egx6g9ZkPT7Mr4BD5BsfQEavZGpja8rvDVaI2OjGN08BLJzK2XX98ftK5QzyAv/fVU7BJcN2Wd46nzt7ZcFY4H5Bf43uo6ZZF8k3KYkDb4GBtYksI6xIkyzlH1Fkoa9sK8XuvmMEDJAtSyNl/R5yqQ5zRYrlu+Q2ldRe/a0OHZGDwex85M7HSKs7xD6ulhdGwDSoHRYuVomMXxZYOjAqQabmY2eNxpoSiqWA0gOPKcSsQh8VkmAKIMOPfy10lUbpaY2UHypRxIZzCpFnkhXbQuS1jTHXQWMIpx/gD803FawbT8NF2dbVtHZLpIRYJ5Sa9DH0uBPbID95hx3tF3M7a5jHnjIT+dUzuMBbOuEEBhgiZhNL0cT5SidBLJzEePNRI8VUKedhlC/zD+2GTYMNM5dLhn2QtvOKzxugABD08zbnbSVI2ZhIXZPdVboVDkjaTTw2SNAohagQleiX3L7U7w+R+b9PE4zYhm0nLl665eYdXNjn+0W/sbwGxNx5uKx3EANHDmJhU9H/xM0gFZcykqkipmZPSvxcUE6dPt0+uIJ27eMrCUCrnhSDRbRhLSQSYTDFBhNzvGJWISOIk/mnMVwDI9y9eWGGEEnmkXD1cJJRmXJANS+mj8gOw/FD6cWF7MntcZjvkyBvveNf4D33xy0fGjzV6ncfQje2FQYE1cxgilATu+CefZ4Y5nyWZV3sZhaCweHKzSCgIHcSDu16dqJDdz0PCBH/xZGlMYar5EK1tTCF+kIgWZUoepA3RufM6KkQyZY83uS39mhRkkRQiGF5DfDvaSihWXiI3ypbD8Momv/3hM4fYxjiG2TGNoX/G/2IrhnMpQSQ5RSSDXNqIoXQOMc45fY5EKsnkk7h+22vI1eV15Jm2cEFoC90rpZYYUxATolO4ochhYR+MxHmmmiJyfit5yF+UQzIZJO5HKcWs3QepbYe0yJ9/iS3Uxfd+6cQi9BEuY9KaYgEgm111EHwY53Fr5fAwla1NEgqyVEjtEtna68u9V0WsD7uE0lHyXouQpelbQtX4dtoRl5fmvs12JD6/wmD3CRrh3rKluGF8Qg0/mvRd7dMIusKSdgMKn9gdKEFm0ZqM5C2a6tCR99H7n5vl4zebEW+KszYQLOUy4aYkVj5e7FjDZZ/eZHgdG45V1RgKx81FgFioQnht3ffINque6ixWhWWNHGdJnArL3TL/vfx50/J7YKxfH8P67pwZCslS1l0CBLIfbrnfp5SEFQaWsPWYVMU3oRumbRGuB/4xVZC4a/fotmPlMfu8rAN/evkvzvA3jcWb+x3mLa99v0W3wCpV4fZb//3Me8wbL62+c2tz/NixgcoSdvJJa6Uyxz+tS31lsVkA7BmmRJdYjZCv+Jp3YQafRfKDVeSajPH8lSEn8K6S96Dh0x/81w0+n27KFJI6IM6MxcIMVv9QkTcT91GiYiZYGhidbMmp6P5vs1y9k46W+fnMp7764FBbHjeLX//Q8+fRO91lkh2lPJmhmC00fviZPU0YYKz83P0zlTILuvMgOFx5/NmhyThex4kJuNYCzxKyKmiZwL8+lPfBcHvnNoA84DvIlySKCuHVItMGEUenz4wd/fD8SebpQyhB60lcRvHTAkLuGxQFarmo0tSoE3eAN/YxdG7JCh6Jp/sSDD62/t6zx4ytjoN32nUB2C3LvjuIGrgLI0zFCyTkuIwHL+m8IDO0TsyRI28AgvYIhOjGipEsg39IHHG3KrjAMkGdYl6KOPcShweXrnxC9HyEJhna+XNPf3zkCtevB3/UfEIHRIcklDf48ABPPNM0tjLVDQJnCew5GDKU5WQdgQeyjjHfZQamW1MI3JpG8chHhmqQchg58k4ZciReTodkjTvmG+xoEybuWlEx5zD0SyyRQiTF4G4rUup/2gWWkac+/czHmqBISDcxld4Cqc7A/94Kw4KSwG86EmUZXSIeyyVma3V8yxBUHVwPeRihz8JEzHoc+bDCMhIlDNbHiiGLtBk9y1sMbUzCCZShbAMOR9yrprLAF9yOGFifwm1KqSRG+Akt+RnF0raVrTuVuNtBKZrUUBY344dBO4T+IEfgBcIRuHG40MfjLlHHbG2Nuw47Tuce9ibJpYTiGzoQpDilMP0uZZWYqoZzwxQqWYURAtowc0IXpywhgkQSFZrWGszx7Dc+8sLEqnUlMeG26IiUgUicMG1JSRAjS/j5qc987WcOgOIKOIsM/Q1ssUy0j1FKOEzKSYLTwMWCvI4EHicrwJHqY19rwCaFI3B2YroZyQKSKyeb6i1JaeIYLAz+nuLBb46PH1Qee3Yjg2BPMVKWN+u9CFlVQ4fg68P4HAZRNvkHH35+PwtzCyxkhxsyxrOnglApYDq8jWJxkz3yma99VIn7KkAoo/vbIv2H1PLOcPxaKzhpxGxd3bmZiTsiWeBkliyURaFFQgnFZUGyAYKUMhQW+EjKJkDio4z5eyB5dt5fOViH5Dc+/C1Xw6LBF9ZYMhAIUnlUjNmMVGZDio575Oef/Zk5UFwVIbJEohB8dctA2pSs8OEEyx+Lb/e+S8Jx0ggemx+ZDleewLc5AsclK/e/jVV5UjlZBKkS7iqCzw46gY8eeZflS7EtB1/0zkEyvL/woRdnCypcDG9MJvfLy5ohIQORxDkZ53683uGff/bDAz/t6zcs5LmUoR5uezTCcEIKTF2FmLGJW1dHcja2/Vhj2V5mAke2wBGz1hsOJth0oTaKr4VSsAU+yE7MEQwVTOKCCF7h1JX1ogeDvT//obNHeSSZg1gdAGO9mFhINfB3TjJ8PV5kq2LP//rsRzZlG7dOI5I2lAQOkE2phxm8/4vrLF42WysjZXGvxfYGE/gtIqFEa5tC5EluHmURSGyBf3QgCXwUyTuLf8Y1tyj1/Y6dmz4z9vc/dNZ1+g5xp5krNYWQxBJQWVEpJm7W9fCew1+/f9O2feo8KoG0rW/bk0Ljyxt4eMGj+ktrlxUER4Y9gqQTKC1wllCgLBphs8LEMawwWOA0kBr4SJE32tg0wqvEmJWRC++H6hvQL8xNv1irVrYt8FUznXYsj0fPIZmUstYFqsDU4a/t0eSbG4B1zZNDmCB6B6Wf3JhsKj28MLe0GvlrFwq4dYjS3LuNZIGzhCIOakjEnc3EomVe0OBp4CMYbQLljYlr7G7/Rn9kE0fcBoGJmyaCzyxkTUrkSLamyN/lr1iCLUzcA16DYzBhwmwmDOkhvpsgC7QcXjhpBFPXK2xWtxZzoGiDt8CZwNniXpLW0qGGZBmJEmdh/nJo+SiUwZFQRkw2iT+XIIXYlU5AeaP3CMSNC2wA1sqdwWynpDRuiugO/jV+togtJe6NIpE0SkViRCid2MNN3g4uoiQk3qzuHGWd++3gCfwtM4WewMVvDWUZKxd94uSU2I9nkCSUEZNNyrJx0jwx3aFZ85ieYm56YQKx4tLda1g2lwhJN5T1cczN7+AnP/ULz05PHZ7fozflhhEHQ+nUY2NNGCSi4UzSWQsXeaLE/fZwEkqLCZwJ+uU4oIesy9g/CfMYcOc7mC0+fX/fywaMluXtfm2o4yRKcta5BXtvaR3Z80f7EVfP8b6MpSZtZcKI2IBlr9xyZ+HIL359+gAobgrpRg36VPgjifXeDKa34rrhNfDLQuD+GjBlFFLsyuirwrtLxCX24NHVg/dPQh8xWpp36mXZ3vNL3uzp3Xpk+o9neX8a7rmQdNgNqZiFaQqXmtb4YYdx5LPP7p4DxU3DO6koJmnEJk9p8FSMGDyBbwsaOEikCaWWaqKJQ+nYrFTwy64pBvQJoxkq2JbQ0haKB73AkQ/98ax1MdxZkHbMmAz7R3nmkMzswYUsPfwr31Di7hyy+O4oRkEKHVP+HkE4Dfy2x5/cydfAKSlc5jMxS0e2wRgXXhCOt1a29k0+GUnyprIFLkBK0umN7f2r0398srB2rl2laa/eGvZHenmG1sDLFmnq0W/8dAMUHYNEFJTV5gDjhQDuRFwehm4Miq7gPSeerLML5FTsoAq5E9NfOkaa6cGhflnfI1jbJDgqQyxHnqC4fsf7ToEdk2O/uufbC7zhOgKWJQDzMiuJORDKzulwASs49eizH1wERYcRvNdWogW9dOK7dKamcYoRxm0nTtf5wlj0ylpoLki5Q1MIfezy5Vvq0AeMZicdiDku/uhnYSbuju38IWHirrWIXAz3JBG0VQCkzN4PTlMs0z8BzsNWM/XLX7tPk2+6ANG7/aVAok3FiIIhryqo6BCKWyt7iMxrvhtP7EcvfhIIhO4YYzf0AaMVKhgbFfhu6IG1U/vHJF10NknHEXcBsMCbngCIhn+WPomAuZMsMgZfFUtozT2PPnNvExRdQaxtUiZihAnZmsRbxQjDaeAskRymFFDgY78xps6LlDLZD+lk9KJNkGIV1Ywo5d0OiyZ/e3phYoWJm3wn67bAFu+gxLSM2pI9XWbcKq1MPTqvxN1d5Fpm1sMSQGUTRcJ7TjQafLteTKnzoYwwlm3VEN68vG0SeozR6qTjLW9KRq7P2fHNHm3H79TPTS9MAplv8CneniQaDxkpfPiRdPCRXHiJPn/y73z93jooeoLopAxdlaLjwUjEz/D0sFR0FyyZPIlkDyFKPzXwJXFEebVQAahBjzGCcd4ghi6ygiVZlpnq3Qk8uuel/Ujm27y9sXzr4SHUdl3zkRgieOR/O6PE3StkBaioPU0+D/9RKFj7trAUZ2ouysRmIYOhtCzdBT3GKIYKRpEkxvRKqFhnNJPPTf+LWbLQaE8GkkquIbMT2yXVtN0jv/qNe+dA0Q/4cJN8GtxpCU0x5EDXpLnsuFRKbGHQ70cHrpGSTQRrinh7AcuVnblpU+uXf5qJm2g2ZdpgxgLhHLszTyYReFJSDvzqmZ9sgKKnKPnZlwiO/5LUhoVLoAyuCCBTXSYqUg6AL7KbFR6yfbhURpG8U6AJxMJ9Pg8GfTWDjZpcvzL9z0/yGdyfaduS2+6WWCwJwhM3mbDAXRB7ZufvXQRF71GG1fPA6tKffaQRxsw6TbJUtCOEkBoJNqCUlUtQMb2/VkaLvN29mRLOg4yBKfJkYwd/bvrc2Bv0gzN8w9+NaNfkTcYu7yjbQXFMWhcg2uQFe+bm79UY7j6BgmMyPA83pAyxflKsoreiDYEvfOOOKJa4Vh7eECz60AZgtKJNDIbC2ETeWRlIVCIN4jo34Ab43PR3am/SG2cM4EQINQy5HrHUbJqCYwwoiW4wZOKuTs3NTzVB0UdYSawNr6JwEjNc2U0FCkWElZQQT9ghWswvM2Ep9Boj57CkEO0RnIcYgwowMizgdR4RR9wFFS6GeyJm6km2O0ogUZuTstw+LSFUlLgHAgZSXZMyEAkgTokVCkGrJQk6pUObQqedsmhVrzFyoYKpoGDicJQIkHD4C3vt+c9np//lBK+3wB+pQVZv23+t+1Ib5Bhsm3r7wP5Fo8Q9MLAQU53DQE5lf2clbkU7qtXUkMGyrR2zK6GPpd9HzmEZMxtRQvnWBplUrhHy80vT/2KSyfkb/NkxjCoJOANOHJTofV8Yc+99LD/4kfnJvz9/Tx0UgwUMHTpiqYLA3ph8IQqFh7O8TbT7UqYfxsxco7JJd4HpWJd9axKi1fU2hvcv/vR39oM1C7zW9hirkiy34HjGUH1MtkMx7Z2OKHEPHqTPVbCmUrZOcCrbTdIGTdEhVGPJhFDTxIaGp+G6obelja5hNKsK+lKwgWAp6iVIb5tT9ws//Z1Z/mwjxnli+qpQDVC0bbHEpWOPW27N3N+b/1/mQDF4wLwZA0JZ7lECkDQ9XiHwmjdIbZMs09Lr3jx7KzTOu7ugJJMQptBAEaZJWo6t57CcYeJmvp8ri24HCztErgSyNu2GmiRR0oHP/9PJBigGFFncKKSyNyqXKNYBa96sncT5NCXeIJ6lAZo+XDWjJZsQLIMUbaaMu8uuOgxrJ2amv1OLn/mF3d85yWPrHFEWTSgidlkShbLMK//va3x6d35+fqoBioEFyTlMZRJArCsbUqC1kY4iR7C8TQhFyGq/R4u81xgtyxuxmQK7M/oNWnXi5jF2Jy+wtX2Kl9/Nq0+KPLKmHEmUWWKWB0jEITUJ7NQXNKJk4EGSYRtj8ElCkILzGTVYUNGGlAfgGxG7+9/4tsTBf6m1TboKrBSL0JKDTCm0O9aUE3irvMZPZv1nAGK3hiiFyHNf30DaqcUMTWrysqlfV+IeDpDMu7zjmcTh3H6iFQoHlrzBxFwQjNEm5B2XIbys9yP9SMkmj83/2BLfoMvSKmW9mzPFbIZMG8zC7yWNPtF1+oAA+buVuIcJZKN8hiA9CiG8aj/HCoVDzJHOOugk6U2jTXoANriPUZohS2alQ+qFllYECQfPMiX9szj6Ygzy5pdntmFLiXvYYMqoAf8EDUUiV7+lIoezvEP97qRxlwRu+5OoM3JJOlur5vhqUdT55twRqglKSf4ohRNFmUQIHGLvjPAuJW8lhhBBOv4P/+lfnwHFECKN1CFskNJYrsytWANHlVbm7CUjoAiwann3AMfmdy5Txe6RSL88ZCQhmz+vhWRlJuI+osQ9vCgbckSYZEGRJuko1iBY24Ap4iTFemNfsnRGsZOO1775tj1Q5mME0DpEXi6hbDWXUkWHf/Of/vU5UAwxUlIOSaV139dULgO1vhVtiAXobHiUQlVGapxoenzP8Ng3f6zBR36KB9AmhHkzlUElkaEhPgeIIWUIr1WM2fOb3/yfj4FiqOGsJYnvDjNhCgU/Y9kDhSJHGOBdzy3TFuPt/WJGNe+e4nef/6uLM9PfmSqKyiyfg3osFxvyp0rpG4OBtsyLT7Vw25yTXkAx/Aitk0KwYAwcpe56Kusf+N5kQeDqv/e8Ye1oAF+ubKnON+bHm9BhBKKWpA8XLyi1i7yc0oc+aCNN3g7H5n+8yQ8HmMSPQAGTFs1P86kZZ1tsjO/jpkGzBLT6sjXvmD/2nJL2ZkLoiOITnttK94bX0SnSOTy063uzhaU5UHQRBMXK6uxD9/3pzJMv/Mgp6BB8nHdZKdSXhXUxJ7E5lyHoOXuPPHlHCIk35E8xCnB3nuRXpNQrE3pYrvFz3DT27Xq1zvf3HCh6ATa87LH69PmXOmeBVz1VV2IMWpmp7WH70MNyZDVvhcJXhKMYo4tSbD/Gene4qqDB3aDoJcbsykodOggnmxShgl0ojxTjvsPznoveSt6KEUbIpMxrskPMyvLPO1eaijdSA0VPwTy7AzqElhcpUmQShTqiMuj7tEuNNlEoegYf4x11TBASB2mH5pd1zvJ2RdFA0VPwmbwAHYRkV2ap8WVFwX60qlbyVow0AoE73jaUNExfVbCzGiZ/23FQ9BTG2gZ0EtLnlDCUpnIuk1x26zWUvBUji9QpXkr8+n9jAgZ0Fqefv32RlZkjoOg6mFuX2RI+0PjWnU3oEFwnHRtrmoTkHADfPT7V+YZeQ6NNFKMOiTYpQwaDDdX5m/H02ffN1d//SsMaU2frrWN6rCIHvmy2VBtPz493NqzX9bAsQvFg6xpupeoJorl1fry/nl1SKEYVGGt3Q2zNIIuhW2G7Yg3OgWK40ApXiJXcPZIOHiBTN+xyctd6UPJWjCwkqiQWQVjTKUkLUylyuB6WpVuSpHFHVLtt7w1vJW/FiCNl5Kw1nLSgt6IdZWs88tUEo17ioD0sFYoewt1wrryJja0XcE2avEKRIc/DiV3IY30T0qqCCkVvIXW7k/WNvpFszLBUKAJ8J50Y2y3x3dLGBazXTDTaRKHoKaRGnIQL2mwxYOfyKxWbAdEnib79KfmGLL5/PFq0GuetUPQOlmJ6syiZmKwpVMNbsRbR2rZeUysbcVGfaFTJWzHaELkkEvbVuikpRhuutklWPiFmW0rKPJQlcXoIlU0UI43UrjTyNaLEeGsfNEU7osPSy2w+3ART5eCiDyO+krdidBHSLeILn3ghXZSy5B2FIiBo3hQTdVJoEkLyXfYUSt6KEYeUNPF3ZgjkLSPCNFpQEeCiTSr+Wbo4UkMGC1LwpMdQ8laMNKQBcbolSUxutboV7agEm5va0rqIcq9Jj6EOS8UIw13+0eKmROQhlhcUinZQ7JCX6nhjPyNO1PJWjCykEUPoNhyWZCl0uR6uUEAWkURe9faWdypPpenxCkXvEAhaqlWgN6pIor2JND1e0Y6cpwnKsoIOmqSjUPQUFKbC4Tb0GTvJ3tZIQcUVMCTNOnw1HJIZmyTu9H5vQKEYUYRkCxINU3ItIITvUrcKeiuGFNU8sxIptkQLWbqkSToKRQ/hp7+EkntRVqiimGbZheIm9Q98b7IgmECyYzBEYNJqVrZuWWzMjzdhBOFCBUO3yuC0dNeIkSZMFlwvedRQQYWiV4id48McONSDTVzO92enufuhXd+bLSzN+W0PoSpTrKw2H9z16p6nz96xBCMIL4/46yMVhPVJAeI06TlUNlGMLELneNFOwh1Z9kHjf269FTqGfbterfPNPgfDjVoFYKE+fX6oZg0dQyxcRmWRKmI2twSqeSsUvUVsYuUDeCXGO8btAl3qpOmNsB82B8bYAp+GEYPrHp/qeaeKgii2tyFtxqBQ9BTRR4lSoAIg5F24O5LvyQ5a3vytNdgkYMqqwQiirDgZSTxcM96R2QcHt5K3YnSBmEICqWxQmBIxOumwJIObRid2zksYQaTOOf6VCYM+GSozL3sLJW/F6CL2jXeSCRoqF3e+piB/43HYBOCj0qzYYhFGDtWYEg8gcomr5e2sbtunajhK3oqRRRBNhLQJJEQwddeBTsomp5+/fZEHhSMwxGAlaZkJY0/jW3c2YQQR6934SCESec1b4Ib64bDUUEHFyMKXhDNlPRPyRB5CCboRtXv67Pvm6u9/pWGNqRPiDhgq4MtmS7XRmB9fhhGEi/M24hhxQSeWrL9GLHovCaHVwlQKRc+AsWtOWZVKKFu8T11I0hGrdQ4UQweSWu8uKQfRV6TMNDYtCatQ9BQxUQckUT7Il94JBQpFiWDnupDAFOMdYr4lL141b4WiZ/C5lLGOSXs9E7kTOyh6K4YeKUGHJD/AR5mgFqZSKHqOGKgb28ej62bVZo0rFAllo0rXNb50XIblmqSjUPQMFLVtxKykIPRjBqwYcDiHpWRYStBJiO2WBJ2+5Merw1IxssBYCpbKhgyxTqyIKgpFQiihENjbBG83xPrvpN3jFYreQe42JLkFEbIiVe5NlbwVOWRIT1FKHmGIpz6UiVTZRDGyWGtaJzKP0YNdCBVUDCuqPkCwTOK6or5Jz6HkrRhdtE10DaXMHIkcBIVCEDVvC1lVwdBNBwKNaqigQtEzSIRgfIVZyKD2sFRcAakqSNZPzaSfpfgr+zHSK3krRhYocbtti+KDJukocrSCNELJR4Kpnnd4raGCCkXPgUkmQSpfKxQZfGiHkUJmIc47DvLUp046Gm2iGFmENmipMKzU9W57W6FISPJIUNhidZO8f15PoZa3YmThJ794ZVqOOC7V/lYktPy/vvQrxtZLSS7BK+S3nkDJWzHSKGu/lrIJhcLeGimoyFCF0HTBOSoNxUgTZ4IHB7dq3gpFT+GIOhA45V7KTrewVAw7fKwgkisH61ueWQyRSb4ejhv0lbwVih5D+lXmS/DKZQqFjywJcd1kw3O5TAw7MHvvslTyVow4UkmqFGUSiVtlE0WOUPbGQKl5OwQd3KrlrVD0FqXDMlpR0K+cC8UAoxXS42M9bwqp8RgkFO8rMT2/ZpS8FSMNa9tDBSGoJl4EV81b0YZYuzsk5pCv6W1RIlB6n9Wl5K0YWUjPhSuaDceCzaBQZBC5hELneAghghiL4KhsolD0EVqMSnF1EEUr2xeo8g5LKw5M6sO1o+StGFlE09qny4X8ymRta4q8Yi1iTRNL4rAMvSydrwRtH2ZqSt4KRajhrVa34qpwYd4+qoQgNRwOzkoD1CeFTclboQiIFQWVxBXrwJWBSqGCoSRs7CaP2j1eoegT/NT3agWqFAoPKWQGXjJB8gk7FsMLjfNWKPoCiuGBCsW68NnxoYIC87eh1AKNQGUThaJ/QGqPF0QtTKVYByEtvqwoGJJzPIH3QTdR8laMLCxRMzzzKXOUWlhikE5uNZUxUCjAUbS5yzsoyYTiVBDma+K8dJfMMvQYSt6KkQWiaWavks4dHwuyk6BQgCfqCemYg5R3jxdLvEB4DXoMJW/F6ALpZf8QXJQQnycFxcBuUCjAzdJg0oq2LXVNIDi6wx+T+iL0GEreipFFBWnJPcYIgvg8RZrwDbv3A69MgmKk8U8eeLLOZF1LTYdBCDwk6XiHybsuVZegx1APu2Kk8dB9373IptNYcFpKuhy2hQo2K1tv2dmYH++5pqnoPx5/4Cu1LVQs8AVRM6FxDhoXVooWTax0gvTSvmcOTEGPoZa3YrRBdCqmxtM6HRj4vVqxunIUFCOHk9NnxipEC5awFhJxnIfSh3cjJLnEOy9PQR+glrdipFF//yu1wuB5KBsyYE7hwQp39yc9xxb4AbXARwPO4jaWzvDTCQAqgwP50UgfBpeiw9dHs/7M/nHoA9TyVow0Gt+6s8m3YQOkO0qO1Fw23KvTxcrlc/t2vVIHxaaFs7Yf/+gfzJLFc2xpT5BvWemEEkOhBE4oTEW+zomn9CPQJ6jlrRh51KfPjzExf5+fbs9zdbLQQVqTgXmeTfKXKhaeg4pddtl3Vb/Y/duSVfLnN4/wba30rdXr+lRYs3qN/fDvV7P9lZcteVnNN+YWVvPPXm27b/d+uU71avuz9k1eVKm2f7ZcpbXm89e7rVZaxhzNmjb+DT7Ze5iSxzD2VmLuNn70DmkAGCK8PY0bpObDf/BQX6xuByVvhYKx94PfncaCzgTyDp4pSZuHK2UU/9T3clizrA2yPL6T3WtehslXA/mG0MYeab2KtCGqOG06xcekR28lYtxngnLn45Q/SkNS0zT7LMpuxbJciaTSzofnbscNZl1jxMGLV+yT/zkUtkVYvmf9sxi3EX88q8cojZ/l+7080fb7TOo3mhEqltvD9NtIfqtvXCbLZT2Spu8gaTZyXMPBCOuHbbk1bdaxMh2D2ADttQqu7jzwzIEm9AkqmygUjNPffN8809+RECpIKcuSqL3KICVyK8l4/XKyqSdm6pGZfQuWy8uvhPSIEDuTlz5UX1TDv04zAtm/RLOYSz2h2FYgVgleL/c57YyVYYQiM8uD9b/bK7xp9+LP8QWZUuf0WN8j7VMpNAnPUfw9kFOxlFalaN/GVTN1mSJVxi92lfzcryhD9ry/MH03xH0DoWhK5VvTcZFqgGXYX8qSLH8HJsoOvz/Fd/vt+9rdZA70k7gdlLwVCsHps3fO8V15xD33d+kVDRpQHkvCjosA1hI4RcImsUDXWSd9Nmbsec6xlBvy7XY5pr5taV+iXRjWkJ1Ej1h/GsrBwJNUHBgwzh2EHOM4EzYjtnayZW1GkuUsoNyfQPjxR0eSTKMTZsSYPQYyjpOOtuMR7GSCnGgJ42DhP2ex/F7IxyYhWkiDkESIoGTWpP1M+yMxomXRKWjbdhoF+VxWZn72qw/OQ5+BoFAo2rB31ytM4jgbXnmJIxIvxtdXyieBoK9eSrZ8P8gDkL7X0WyMLweAzDYNj9nGIdq2KSs0bj3/DEUJIPu+oNR47V5oDTIZoe3DJkoqToPwcgbIZ3M5R+zeRGv+53jJI9SJCQfImCjPUPnBoBeXEhCV8grKdj0tQxbhAaIKQbLJ5ZBmEkk5Z5HxgOS35rKRSC7R1vd/budtkFBEsslkEsjmC8u87PCnv/axBgwAlLwVinXgMiuNxZN82+6I1ndkLgkdbOfUhPje2sdoLCaCzz9LuaWfROtEotBG2F4xppJoIjOj/8+mDZekA3GDQrZpNkE5iUbCKl/LQAX5tsIXY9iJpMMn7RqCaVwOLo4lLbbp73JUENsHqESUQra5nh6OgRUdPBFrSdqZc7H8DTba9CQavk+sgUjo6fvjPpT7vfZ7WPtexAod+PQzH2vCgEDJW6G4ClwUSuvSyiE0NMMv11QYTKR8BXIHpiNZY0RPvTJqZd1l/jvk7dKCLr8wEmGbVzNURRTOC8+vZsFHAsNEZNBO3Ekrz5yfcNX1SwIPjIiZ87KcXUBcjmus27Rvsm4YNDzhy7gUYqvRk3fpeMyt5NKyFpIvHZBC7OtvM7fIwwxD1g8WfJBYlg0URz7z7APHYMCg5K1QXAM+kQdgEit4iO/rCYmKSO9niTxXkjCWVvL6kko0P/PPJosXysiRZIjH78pkjGxfADKrPBsEILeck0wQNozC617OKGWO+DuT5V2WDggWe9a4OVnBsrkotQSit4hpdpBZ6m37Ga3y8IMxs/jDcRDZJ/4Gl56ebzMQdJSIogqfzo8ne8hInUrpxGTLwpe51Hdc5PXnW6uVU4fn9wxkYpaSt0JxA3BE3tpiJkwBdzGh15jEauEd5/sPZOFKzGF8KSEBFNuLZ68j8uXrf96HrkFJvlSuI58nsGu0cUjrG3mjTScHm+QY977lJ5VsG9FKjYtMJEIASOF+2L6dyhWdHEvN2MjvCb/Lggjr5T7G9UUeQTkABvL1KG0/rQ+USSm27bcbI4OCDZ+pmPA785bBgeXtMlpYZsZeQrt6AYrK4qASdo7/AlCTf1zDTgU3AAAAAElFTkSuQmCC"/></defs></svg>',
  UPLOAD_ICON: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 33"><g clip-path="url(#a)"><path fill="#fff" d="M32.077 19.164a6.87 6.87 0 0 1-2.027 4.893 6.877 6.877 0 0 1-4.893 2.026h-1.05a1.198 1.198 0 0 1 0-2.396h1.05c1.208 0 2.344-.47 3.199-1.325a4.49 4.49 0 0 0 1.325-3.198 4.463 4.463 0 0 0-1.245-3.102 4.521 4.521 0 0 0-3.038-1.392 1.2 1.2 0 0 1-.998-1.75c.2-.385.355-.782.458-1.18.11-.414.165-.84.165-1.264A5.31 5.31 0 0 0 23.459 6.7c-1.93-1.928-5.265-2.035-7.296-.225a5.374 5.374 0 0 0-1.747 3.31 1.197 1.197 0 0 1-1.685.936 4.268 4.268 0 0 0-.825-.28 4.077 4.077 0 0 0-3.75 1.057 3.831 3.831 0 0 0-1.091 3.556c.055.253.138.504.244.744A1.198 1.198 0 0 1 6.29 17.48a3.127 3.127 0 0 0-2.072.968 3.076 3.076 0 0 0-.847 2.123c0 .833.325 1.616.914 2.205a3.098 3.098 0 0 0 2.203.912h3.354a1.198 1.198 0 0 1 0 2.396H6.488a5.476 5.476 0 0 1-3.897-1.614 5.475 5.475 0 0 1-1.615-3.9c0-1.41.534-2.749 1.503-3.772a5.511 5.511 0 0 1 2.208-1.421 6.208 6.208 0 0 1 1.795-5.595 6.47 6.47 0 0 1 5.872-1.697 7.766 7.766 0 0 1 2.215-3.398 7.674 7.674 0 0 1 5.113-1.948 7.69 7.69 0 0 1 5.471 2.266 7.69 7.69 0 0 1 2.266 5.471 7.345 7.345 0 0 1-.3 2.073 6.91 6.91 0 0 1 3.048 1.856 6.85 6.85 0 0 1 1.91 4.759Z"/><path fill="#fff" d="m22.677 17.815-4.796-4.787a1.198 1.198 0 0 0-1.693 0L11.4 17.816a1.198 1.198 0 1 0 1.694 1.694l2.75-2.751v13.07a1.198 1.198 0 0 0 2.396 0V16.772l2.744 2.739a1.199 1.199 0 0 0 1.692-1.696Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.55.528h31.943v31.943H.55z"/></clipPath></defs></svg>',
  SECURITY_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><g fill="none" fill-rule="evenodd"><path fill="#8E8E8E" fill-rule="nonzero" d="M21.5006559,6 L33.9986881,10.1630417 L34,20.1773333 C34,27.8265833 28.9100068,34.6259167 21.5006559,37 C14.123138,34.6858984 9.16213086,28.0099101 9.00389527,20.4144132 L9,20.0520417 L9,10.165625 L21.5006559,6 Z M21.4999997,7.581 L10.4999997,11.246 L10.4999997,20.0510254 C10.5046599,26.9292654 14.8030505,33.0037194 21.2726644,35.3404771 L21.496,35.418 L21.7168055,35.3398823 C28.0480726,33.0130596 32.3496907,27.1255801 32.4961403,20.5253563 L32.4999997,20.1773333 L32.498,11.244 L21.4999997,7.581 Z"></path><path fill="#FA0F00" fill-rule="nonzero" d="M27.705263,16.4844793 C27.9899772,16.1836294 28.4646708,16.1705488 28.7655207,16.455263 C29.0390206,16.7140941 29.0746947,17.1299329 28.8650105,17.4294339 L28.794737,17.5155207 L20.535541,26.2427934 C20.2781341,26.5147885 19.8650957,26.5517706 19.5656859,26.3452708 L19.4795411,26.2760079 L15.7387371,22.7906577 C15.4356791,22.508295 15.4189022,22.0337178 15.7012648,21.7306597 C15.9579582,21.4551524 16.3735066,21.416241 16.6746314,21.6235864 L16.7612629,21.6931874 L19.957,24.671 L27.705263,16.4844793 Z"></path></g></svg>',
  INFO_ICON_MOBILE: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346625 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0ZM7.85 2.15C8.03902 2.13953 8.22813 2.16869 8.4052 2.23561C8.58228 2.30253 8.74341 2.40574 8.87825 2.5386C9.01309 2.67147 9.11867 2.83105 9.1882 3.00712C9.25773 3.18319 9.28968 3.37185 9.282 3.561C9.29702 3.75292 9.27029 3.94582 9.20365 4.12643C9.13701 4.30703 9.03205 4.47106 8.89597 4.60723C8.75989 4.74341 8.59594 4.84849 8.41538 4.91525C8.23482 4.98202 8.04194 5.00888 7.85 4.994C7.65886 5.00554 7.46744 4.97637 7.2884 4.90842C7.10937 4.84047 6.9468 4.73529 6.81144 4.59984C6.67608 4.46439 6.57102 4.30174 6.50319 4.12266C6.43537 3.94358 6.40633 3.75214 6.418 3.561C6.41033 3.37185 6.44228 3.18319 6.51181 3.00712C6.58134 2.83105 6.68691 2.67147 6.82175 2.5386C6.9566 2.40574 7.11773 2.30253 7.2948 2.23561C7.47188 2.16869 7.66099 2.13953 7.85 2.15ZM10 12.5C10 12.6326 9.94733 12.7598 9.85356 12.8536C9.75979 12.9473 9.63261 13 9.5 13H6.5C6.3674 13 6.24022 12.9473 6.14645 12.8536C6.05268 12.7598 6 12.6326 6 12.5V11.5C6 11.3674 6.05268 11.2402 6.14645 11.1464C6.24022 11.0527 6.3674 11 6.5 11H7V8H6.5C6.3674 8 6.24022 7.94732 6.14645 7.85355C6.05268 7.75979 6 7.63261 6 7.5V6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24022 6.05268 6.3674 6 6.5 6H8.5C8.63261 6 8.75979 6.05268 8.85356 6.14645C8.94733 6.24021 9 6.36739 9 6.5V11H9.5C9.63261 11 9.75979 11.0527 9.85356 11.1464C9.94733 11.2402 10 11.3674 10 11.5V12.5Z" fill="#6D6D6D"/></svg>',
  INFO_ICON: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 7.07578C9.59371 7.07578 10.075 6.59449 10.075 6.00078C10.075 5.40707 9.59371 4.92578 9 4.92578C8.40629 4.92578 7.925 5.40707 7.925 6.00078C7.925 6.59449 8.40629 7.07578 9 7.07578Z" fill="#222222"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.167 12H10V8.2C10 8.14696 9.97893 8.09609 9.94142 8.05858C9.90391 8.02107 9.85304 8 9.8 8H7.833C7.833 8 7.25 8.016 7.25 8.5C7.25 8.984 7.833 9 7.833 9H8V12H7.833C7.833 12 7.25 12.016 7.25 12.5C7.25 12.984 7.833 13 7.833 13H10.167C10.167 13 10.75 12.984 10.75 12.5C10.75 12.016 10.167 12 10.167 12Z" fill="#222222"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9 1.05078C7.42764 1.05078 5.89059 1.51704 4.58322 2.3906C3.27585 3.26415 2.25687 4.50578 1.65516 5.95845C1.05344 7.41112 0.896004 9.0096 1.20276 10.5517C1.50951 12.0939 2.26667 13.5105 3.3785 14.6223C4.49033 15.7341 5.90688 16.4913 7.44903 16.798C8.99118 17.1048 10.5897 16.9473 12.0423 16.3456C13.495 15.7439 14.7366 14.7249 15.6102 13.4176C16.4837 12.1102 16.95 10.5731 16.95 9.00078C16.95 6.89231 16.1124 4.8702 14.6215 3.37928C13.1306 1.88837 11.1085 1.05078 9 1.05078ZM9 15.9568C7.62423 15.9568 6.27936 15.5488 5.13545 14.7845C3.99154 14.0201 3.09998 12.9338 2.57349 11.6627C2.04701 10.3917 1.90926 8.99306 2.17766 7.64373C2.44606 6.2944 3.10855 5.05496 4.08137 4.08215C5.05418 3.10933 6.29362 2.44684 7.64295 2.17844C8.99228 1.91004 10.3909 2.04779 11.6619 2.57428C12.933 3.10076 14.0194 3.99233 14.7837 5.13623C15.548 6.28014 15.956 7.62501 15.956 9.00078C15.956 10.8456 15.2231 12.6149 13.9186 13.9194C12.6141 15.2239 10.8448 15.9568 9 15.9568Z" fill="#222222"/></svg>',
  CLOSE_ICON: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_15746_2423)"><g clip-path="url(#clip1_15746_2423)"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2381 15.9994L19.6944 13.5434C19.8586 13.3793 19.9509 13.1566 19.9509 12.9245C19.951 12.6923 19.8588 12.4696 19.6946 12.3054C19.5305 12.1412 19.3078 12.0489 19.0757 12.0488C18.8435 12.0488 18.6208 12.141 18.4566 12.3051L16.0002 14.7615L13.5435 12.3051C13.3793 12.141 13.1566 12.0489 12.9245 12.049C12.6923 12.0491 12.4697 12.1414 12.3057 12.3056C12.1416 12.4698 12.0495 12.6925 12.0496 12.9246C12.0497 13.1568 12.142 13.3794 12.3062 13.5434L14.7622 15.9994L12.3062 18.4555C12.1427 18.6197 12.051 18.8421 12.0512 19.0738C12.0515 19.3055 12.1436 19.5277 12.3074 19.6916C12.4711 19.8556 12.6933 19.9478 12.925 19.9482C13.1567 19.9486 13.3791 19.8571 13.5435 19.6938L16.0002 17.2374L18.4566 19.6938C18.6208 19.8579 18.8435 19.9501 19.0756 19.9501C19.3078 19.95 19.5305 19.8577 19.6946 19.6935C19.8588 19.5293 19.9509 19.3066 19.9509 19.0745C19.9509 18.8423 19.8586 18.6196 19.6944 18.4555L17.2381 15.9994Z" fill="white"/></g></g><defs><clipPath id="clip0_15746_2423"><rect width="8" height="8" fill="white" transform="translate(12 12)"/></clipPath><clipPath id="clip1_15746_2423"><rect width="8" height="8" fill="white" transform="translate(12 12)"/></clipPath></defs></svg>',
};

function createSvgElement(iconName) {
  // Check cache first
  if (svgCache.has(iconName)) {
    return svgCache.get(iconName).cloneNode(true);
  }

  const svgString = ICONS[iconName];
  if (!svgString) {
    window.lana?.log(
      `Error Code: Unknown, Status: 'Unknown', Message: Icon not found: ${iconName}`,
      lanaOptions,
    );
    return null;
  }

  // Parse and cache SVG
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  // Cache the parsed element
  svgCache.set(iconName, svgElement);

  // Return a clone
  return svgElement.cloneNode(true);
}

// Initialize analytics functions as no-ops until loaded
window.analytics = {
  verbAnalytics: () => {},
  reviewAnalytics: () => {},
  sendAnalyticsToSplunk: () => {},
};

async function loadAnalyticsAfterLCP(analyticsData) {
  const { verb, userAttempts } = analyticsData;
  try {
    const analyticsModule = await import('../../scripts/alloy/verb-widget.js');
    const { default: verbAnalytics, reviewAnalytics, sendAnalyticsToSplunk } = analyticsModule;
    window.analytics.verbAnalytics = verbAnalytics;
    window.analytics.reviewAnalytics = reviewAnalytics;
    window.analytics.sendAnalyticsToSplunk = sendAnalyticsToSplunk;
    window.analytics.verbAnalytics('landing:shown', verb, { userAttempts });
    window.analytics.reviewAnalytics(verb);
  } catch (error) {
    window.lana?.log(
      `Error Code: Unknown, Status: 'Unknown', Message: Analytics import failed: ${error.message} on ${verb}`,
      lanaOptions,
    );
  }
  return window.analytics;
}

window.addEventListener('analyticsLoad', async ({ detail }) => {
  const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  const {
    verbAnalytics: stubVerb,
    reviewAnalytics: stubReview,
    sendAnalyticsToSplunk: stubSend,
  } = window.analytics;

  if (window.PerformanceObserver) {
    await Promise.race([
      new Promise((res) => {
        try {
          const obs = new PerformanceObserver((entries) => {
            if (entries.getEntries().length > 0) {
              obs.disconnect();
              res();
            }
          });
          obs.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (error) {
          res();
        }
      }),
      delay(3000),
    ]);
  } else {
    await delay(3000);
  }

  await loadAnalyticsAfterLCP(detail);

  const {
    verbAnalytics,
    reviewAnalytics,
    sendAnalyticsToSplunk,
  } = window.analytics;

  if (
    verbAnalytics === stubVerb
    || reviewAnalytics === stubReview
    || sendAnalyticsToSplunk === stubSend
  ) {
    window.lana?.log(
      'Analytics failed to initialize correctly: some methods remain no-ops on verb-widget block',
      lanaOptions,
    );
  }
});

export default async function init(element) {
  if (isOldBrowser()) {
    window.location.href = EOLBrowserPage;
    return;
  }

  // Remove the prerender element when it's in the viewport
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      document.querySelector('#prerender_verb-widget')?.remove();
      observer.disconnect();
    }
  });
  observer.observe(element);

  const isMobile = isMobileDevice();
  const isTablet = isTabletDevice();

  const { locale } = getConfig();
  const ppURL = window.mph['verb-widget-privacy-policy-url'] || `https://www.adobe.com${locale.prefix}/privacy/policy.html`;
  const touURL = window.mph['verb-widget-terms-of-use-url'] || `https://www.adobe.com${locale.prefix}/legal/terms.html`;

  const children = element.querySelectorAll(':scope > div');
  const VERB = element.classList[1];
  const widgetHeading = createTag('h1', { class: 'verb-heading' }, children[0].textContent);
  let noOfFiles = null;
  let openFilePicker = true;
  const userAttempts = getVerbKey(`${VERB}_attempts`);

  function mergeData(eventData = {}) {
    return { ...eventData, noOfFiles };
  }

  children.forEach((child) => {
    child.remove();
  });

  let widgetSubCopy;
  let widgetDemoButton;
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

  if (VERB.indexOf('chat-pdf') > -1) {
    widgetSubCopy = createTag('p', { class: 'verb-copy verb-sub-copy' }, window.mph[`verb-widget-${VERB}-sub-description`]);
    widgetCopy.append(widgetSubCopy);
  }

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
  const infoIcon = createTag('div', { class: 'info-icon milo-tooltip top', 'data-tooltip': `${window.mph['verb-widget-tool-tip']}` });
  const securityIconSvg = createSvgElement('SECURITY_ICON');
  const infoIconName = (isMobile || isTablet) ? 'INFO_ICON_MOBILE' : 'INFO_ICON';
  const infoIconSvg = createSvgElement(infoIconName);
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

  if (isMobile) {
    widget.classList.add('mobile');
    infoIcon.classList.add('mobile');
  } else if (isTablet) {
    widget.classList.add('tablet');
  }

  widgetLeft.append(widgetHeader, widgetHeading, errorState);

  if (isMobile || isTablet) {
    widgetLeft.insertBefore(widgetMobCopy, errorState);
    if (LIMITS[VERB].level === 0) {
      openFilePicker = false;
      widget.classList.add('trial');
      const widgetMobileFreeTrial = createTag('a', { class: 'verb-mobile-cta', href: getPricingLink() }, window.mph['verb-widget-cta-mobile-start-trial']);
      widgetLeft.insertBefore(widgetMobileFreeTrial, errorState);
    } else if (LIMITS[VERB].mobileApp) {
      openFilePicker = false;
      widget.classList.add('mobile-app');
      const storeType = getStoreType();
      const mobileLink = window.mph[`verb-widget-${VERB}-${storeType}`] || window.mph[`verb-widget-${VERB}-apple`];
      const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph['verb-widget-cta-mobile']);
      widgetMobileButton.addEventListener('click', () => {
        window.analytics.verbAnalytics('goto-app:clicked', VERB, { userAttempts });
      });
      widgetLeft.insertBefore(widgetMobileButton, errorState);
    } else {
      widgetLeft.insertBefore(widgetButton, errorState);
      widgetLeft.insertBefore(button, errorState);
    }
  } else if (VERB.indexOf('chat-pdf') > -1) {
    const demoBtnWrapper = createTag('div', { class: 'demo-button-wrapper' });
    widgetDemoButton = createTag('a', { href: getDemoEndpoint(), class: 'verb-cta demo-cta', tabindex: 0 }, window.mph['verb-widget-cta-demo']);
    demoBtnWrapper.append(widgetButton, widgetDemoButton);
    widgetLeft.insertBefore(widgetCopy, errorState);
    // widgetLeft.insertBefore(widgetButton, errorState);
    widgetLeft.insertBefore(demoBtnWrapper, errorState);
    widgetLeft.insertBefore(button, errorState);
  } else {
    widgetLeft.insertBefore(widgetCopy, errorState);
    widgetLeft.insertBefore(widgetButton, errorState);
    widgetLeft.insertBefore(button, errorState);
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

  async function checkSignedInUser() {
    if (!window.adobeIMS?.isSignedInUser?.()) return;

    element.classList.remove('upsell');
    element.classList.add('signed-in');

    let accountType;
    try {
      accountType = window.adobeIMS.getAccountType();
    } catch {
      accountType = (await window.adobeIMS.getProfile()).account_type;
    }

    if (LIMITS[VERB].signedInAcceptedFiles) {
      button.accept = [...LIMITS[VERB].acceptedFiles, ...LIMITS[VERB].signedInAcceptedFiles];
    }

    if (accountType !== 'type1') redDir(VERB);
  }

  function handleAnalyticsEvent(
    eventName,
    metadata,
    documentUnloading = true,
    canSendDataToSplunk = true,
  ) {
    window.analytics.verbAnalytics(eventName, VERB, metadata, documentUnloading);
    if (!canSendDataToSplunk) return;
    window.analytics.sendAnalyticsToSplunk(eventName, VERB, metadata, getSplunkEndpoint());
  }

  function setCookie(name, value, expires) {
    document.cookie = `${name}=${value};domain=.adobe.com;path=/;expires=${expires}`;
  }

  function handleUploadingEvent(data, attempts, cookieExp, canSendDataToSplunk) {
    prefetchTarget();
    const metadata = mergeData({ ...data, userAttempts: attempts });
    handleAnalyticsEvent('job:uploading', metadata, false, canSendDataToSplunk);
    if (LIMITS[VERB]?.multipleFiles) {
      handleAnalyticsEvent('job:multi-file-uploading', metadata, false, canSendDataToSplunk);
    }
    setCookie('UTS_Uploading', Date.now(), cookieExp);
    window.addEventListener('beforeunload', (windowEvent) => {
      handleExit(windowEvent, VERB, { ...data, userAttempts: attempts }, false);
    });
  }

  function handleUploadedEvent(data, attempts, cookieExp, canSendDataToSplunk) {
    setTimeout(() => {
      window.dispatchEvent(redirectReady);
      window.lana?.log(
        'Adobe Analytics done callback failed to trigger, 3 second timeout dispatched event.',
        { sampleRate: 100, tags: 'DC_Milo,Project Unity (DC)' },
      );
    }, 3000);
    setCookie('UTS_Uploaded', Date.now(), cookieExp);
    const calcUploadedTime = uploadedTime();
    const metadata = { ...data, uploadTime: calcUploadedTime, userAttempts: attempts };
    handleAnalyticsEvent('job:uploaded', metadata, false, canSendDataToSplunk);
    if (LIMITS[VERB]?.multipleFiles) {
      handleAnalyticsEvent('job:multi-file-uploaded', metadata, false, canSendDataToSplunk);
    }
    exitFlag = true;
    setUser();
    incrementVerbKey(`${VERB}_attempts`);
  }

  const { cookie } = document;
  const limitCookie = exhLimitCookieMap[VERB] || exhLimitCookieMap[VERB.match(/^pdf-to|to-pdf$/)?.[0]];
  const cookiePrefix = appEnvCookieMap[DC_ENV] || '';
  const isLimitExhausted = limitCookie && cookie.includes(`${cookiePrefix}${limitCookie}`);

  if (!window.adobeIMS?.isSignedInUser?.() && isLimitExhausted) {
    await showUpSell(VERB, element);
    window.analytics.verbAnalytics('upsell:shown', VERB, { userAttempts });
    window.analytics.verbAnalytics('upsell-wall:shown', VERB, { userAttempts });
  }

  // Race the condition
  await checkSignedInUser();

  // Redirect after IMS:Ready
  window.addEventListener('IMS:Ready', checkSignedInUser);

  window.prefetchTargetUrl = null;

  element.parentNode.style.display = 'block';

  widget.addEventListener('click', (e) => {
    if (e.srcElement.classList.value.includes('error')) { return; }
    if (e.srcElement.classList.value.includes('demo')) { return; }
    if (openFilePicker === true) { button.click(); }
  });

  button.addEventListener('click', (data) => {
    [
      'filepicker:shown',
      'dropzone:choose-file-clicked',
      'files-selected',
      'entry:clicked',
      'discover:clicked',
    ].forEach((analyticsEvent) => {
      window.analytics.verbAnalytics(analyticsEvent, VERB, { ...data, userAttempts });
    });
  });

  button.addEventListener('change', (data) => {
    const { target: { files } } = data;
    if (!files) return;
    noOfFiles = files.length;
  });

  button.addEventListener('cancel', () => {
    window.analytics.verbAnalytics('choose-file:close', VERB, { userAttempts });
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
  });

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });

  element.addEventListener('unity:track-analytics', (e) => {
    const cookieExp = new Date(Date.now() + 90 * 1000).toUTCString();

    const { event, data } = e.detail || {};
    const canSendDataToSplunk = e.detail?.sendToSplunk ?? true;

    if (!event) return;
    const metadata = mergeData({ ...data, userAttempts });
    const analyticsMap = {
      change: () => {
        handleAnalyticsEvent('choose-file:open', metadata, true, canSendDataToSplunk);
      },
      drop: () => {
        ['files-dropped', 'entry:clicked', 'discover:clicked'].forEach((analyticsEvent) => {
          handleAnalyticsEvent(analyticsEvent, metadata, true, canSendDataToSplunk);
        });
        setDraggingClass(widget, false);
      },
      cancel: () => {
        handleAnalyticsEvent('job:cancel', metadata, true, canSendDataToSplunk);
      },
      uploading: () => handleUploadingEvent(data, userAttempts, cookieExp, canSendDataToSplunk),
      uploaded: () => handleUploadedEvent(data, userAttempts, cookieExp, canSendDataToSplunk),
      redirectUrl: () => {
        if (data) initiatePrefetch(data.redirectUrl);
        handleAnalyticsEvent('job:redirect-success', metadata, false, canSendDataToSplunk);
      },
      chunk_uploaded: () => {
        if (canSendDataToSplunk)  window.analytics.sendAnalyticsToSplunk('job:chunk-uploaded', VERB, metadata, getSplunkEndpoint());
      }
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
    const errorCode = e.detail?.code;
    const errorInfo = e.detail?.info;
    const metadata = e.detail?.metadata;
    const errorData = e.detail?.errorData;
    const canSendDataToSplunk = e.detail?.sendToSplunk || true;

    if (!errorCode) return;

    handleError(e.detail, true, lanaOptions);

    if (errorCode.includes('cookie_not_set')) return;

    const errorAnalyticsMap = {
      error_only_accept_one_file: 'error_only_accept_one_file',
      error_unsupported_type: 'error:UnsupportedFile',
      error_empty_file: 'error:EmptyFile',
      error_file_too_large: 'error:TooLargeFile',
      error_max_page_count: 'error:max_page_count',
      error_min_page_count: 'error:min_page_count',
      error_generic: 'error',
      error_max_quota_exceeded: 'error:max_quota_exceeded',
      error_no_storage_provision: 'error:no_storage_provision',
      error_duplicate_asset: 'error:duplicate_asset',
    };

    const key = Object.keys(errorAnalyticsMap).find((k) => errorCode?.includes(k));

    if (key) {
      const event = errorAnalyticsMap[key];
      window.analytics.verbAnalytics(event, VERB, event === 'error' ? { errorInfo } : {});
      if (canSendDataToSplunk) {
        window.analytics.sendAnalyticsToSplunk(
          event,
          VERB,
          { ...metadata, errorData },
          getSplunkEndpoint(),
        );
      }
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
  function runWhenDocumentIsReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  runWhenDocumentIsReady(() => {
    window.dispatchEvent(new CustomEvent('analyticsLoad', {
      detail: {
        verb: VERB,
        userAttempts,
      },
    }));
  });
}
