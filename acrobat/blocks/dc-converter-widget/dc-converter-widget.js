// Could use webpack/rollup. Just manually inline these structures, for now.
const localeMap = {
  '': 'en-us',
  br: 'pt-br',
  ca: 'en-ca',
  ca_fr: 'fr-ca',
  mx: 'es-mx',
  la: 'es-la',
  africa: 'en-africa',
  za: 'en-za',
  be_nl: 'nl-be',
  be_fr: 'fr-be',
  be_en: 'en-be',
  cz: 'cs-cz',
  cy_en: 'en-cy',
  dk: 'da-dk',
  de: 'de-de',
  ee: 'et-ee',
  es: 'es-es',
  fr: 'fr-fr',
  gr_en: 'en-gr',
  gr_el: 'el-gr',
  ie: 'en-ie',
  il_en: 'en-il',
  il_he: 'he-il',
  it: 'it-it',
  lv: 'lv-lv',
  lt: 'lt-lt',
  lu_de: 'de-lu',
  lu_en: 'en-lu',
  lu_fr: 'fr-lu',
  hu: 'hu-hu',
  mt: 'en-mt',
  mena_en: 'en-mena',
  mena_ar: 'ar-mena',
  nl: 'nl-nl',
  no: 'nb-no',
  at: 'de-at',
  pl: 'pl-pl',
  pt: 'pt-pt',
  ro: 'ro-ro',
  ch_de: 'de-ch',
  si: 'sl-si',
  sk: 'sk-sk',
  ch_fr: 'fr-ch',
  fi: 'fi-fi',
  se: 'sv-se',
  ch_it: 'it-ch',
  tr: 'tr-tr',
  uk: 'en-gb',
  bg: 'bg-bg',
  ru: 'ru-ru',
  ua: 'uk-ua',
  au: 'en-au',
  hk_en: 'en-hk',
  in: 'en-in',
  in_hi: 'hi-in',
  nz: 'en-nz',
  hk_zh: 'zh-hant-hk',
  tw: 'zh-hant-tw',
  jp: 'ja-jp',
  kr: 'ko-kr',
  ae_en: 'en-ae',
  ae_ar: 'ar-ae',
  sa_en: 'en-sa',
  sa_ar: 'ar-sa',
  th_en: 'en-th',
  th_th: 'th-th',
  sg: 'en-sg',
  cl: 'es-cl',
  co: 'es-co',
  ar: 'es-ar',
  cr: 'es-cr',
  pr: 'es-pr',
  ec: 'es-ec',
  pe: 'es-pe',
  eg_en: 'en-eg',
  eg_ar: 'ar-eg',
  gt: 'es-gt',
  id_en: 'en-id',
  id_id: 'id-id',
  ph_en: 'en-ph',
  ph_fil: 'fil-ph',
  my_en: 'en-my',
  my_ms: 'ms-my',
  kw_en: 'en-kw',
  kw_ar: 'ar-kw',
  ng: 'en-ng',
  qa_en: 'en-qa',
  qa_ar: 'ar-qa',
  vn_en: 'en-vn',
  vn_vi: 'vi-vn',
};

// import verbToRedirectLinkSuffix from './verbRedirMap.js'
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
};

const exhLimitCookieMap = {
  'to-pdf': 'ac_cr_p_c',
  'pdf-to': 'ac_ex_p_c',
  'compress-pdf': 'ac_cm_p_ops',
  'rotate-pages': 'ac_or_p_c',
  createpdf: 'ac_cr_p_c',
  'ocr-pdf': 'ac_ocr_p_c',
};

const appEnvCookieMap = {
  dev: 'd_',
  stage: 's_',
  prod: 'p_',
};

const url = window.location;

const langFromPath = url.pathname.split('/')[1];
const pageLang = localeMap[langFromPath] || 'en-us';

export default async function init(element) {
  if (document.querySelector('div[data-section="widget"]')) return;
  element.closest('main > div').dataset.section = 'widget';
  const widget = element;
  const DC_WIDGET_VERSION_FALLBACK = '3.7.1_2.14.0';
  const DC_GENERATE_CACHE_VERSION_FALLBACK = '2.14.0';
  const STG_DC_WIDGET_VERSION = document.querySelector('meta[name="stg-dc-widget-version"]')?.getAttribute('content');
  const STG_DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="stg-dc-generate-cache-version"]')?.getAttribute('content');
  const IMS_GUEST = document.querySelector('meta[name="ims-guest"]')?.content;

  let DC_DOMAIN = 'https://dev.acrobat.adobe.com';
  let DC_WIDGET_VERSION = document.querySelector('meta[name="dc-widget-version"]')?.getAttribute('content');
  let DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="dc-generate-cache-version"]')?.getAttribute('content');
  const lanaOptions = {
    sampleRate: 1,
    tags: 'DC_Milo,Frictionless',
  };
  // LANA
  window.dcwErrors = [];
  if (!DC_WIDGET_VERSION) {
    DC_WIDGET_VERSION = DC_WIDGET_VERSION_FALLBACK;
    window.lana?.log(`DC WIDGET VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_WIDGET_VERSION_FALLBACK}`, lanaOptions);
    window.dcwErrors.push(`DC WIDGET VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_WIDGET_VERSION_FALLBACK}`);
  }
  if (!DC_GENERATE_CACHE_VERSION) {
    DC_GENERATE_CACHE_VERSION = DC_GENERATE_CACHE_VERSION_FALLBACK;
    window.lana?.log(`DC GENERATE CACHE VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_GENERATE_CACHE_VERSION_FALLBACK}`, lanaOptions);
    window.dcwErrors.push(`DC GENERATE CACHE VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_GENERATE_CACHE_VERSION_FALLBACK}`);
  }
  let WIDGET_ENV = `https://dev.acrobat.adobe.com/dc-hosted/${DC_WIDGET_VERSION}/dc-app-launcher.js`;
  let ENV = 'dev';
  let REDIRECT_URL = '';
  let DC_GENERATE_CACHE_URL = '';

  if (window.location.hostname === 'www.adobe.com' || window.location.hostname === 'sign.ing' || window.location.hostname === 'edit.ing') {
    WIDGET_ENV = `https://acrobat.adobe.com/dc-hosted/${DC_WIDGET_VERSION}/dc-app-launcher.js`;
    DC_DOMAIN = 'https://www.adobe.com/dc';
    ENV = 'prod';
  }

  if (window.location.hostname === 'stage--dc--adobecom.hlx.page'
    || window.location.hostname === 'main--dc--adobecom.hlx.page'
    || window.location.hostname === 'stage--dc--adobecom.hlx.live'
    || window.location.hostname === 'main--dc--adobecom.hlx.live'
    || window.location.hostname === 'www.stage.adobe.com') {
    WIDGET_ENV = `https://stage.acrobat.adobe.com/dc-hosted/${STG_DC_WIDGET_VERSION}/dc-app-launcher.js`;
    DC_DOMAIN = 'https://www.stage.adobe.com/dc';
    DC_GENERATE_CACHE_VERSION = STG_DC_GENERATE_CACHE_VERSION;
    ENV = 'stage';
  }

  const [FIRST_DIV, REDIRECT_URL_DIV, GENERATE_CACHE_URL_DIV] = widget.querySelectorAll(':scope > div');
  FIRST_DIV.id = 'VERB';
  const VERB = FIRST_DIV.textContent.trim().toLowerCase();

  if (REDIRECT_URL_DIV) {
    REDIRECT_URL = REDIRECT_URL_DIV.textContent.trim();
    REDIRECT_URL_DIV.remove();
  }

  // Feature checking for old browsers
  const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
  if (window?.browser?.name === 'Internet Explorer'
    || (window?.browser?.name === 'Microsoft Edge' && window?.browser?.version?.split('.')[0] < 86)
    || (window?.browser?.name === 'Microsoft Edge' && !window?.browser?.version)
    || (window?.browser?.name === 'Safari' && window?.browser?.version?.split('.')[0] < 14)) {
    window.location.href = EOLBrowserPage;
  }

  if (GENERATE_CACHE_URL_DIV) {
    // GENERATE_CACHE_URL_DIV.id = 'GENERATE_CACHE_URL';
    DC_GENERATE_CACHE_URL = GENERATE_CACHE_URL_DIV.textContent.trim();
    GENERATE_CACHE_URL_DIV.remove();
  }

  // Redirect
  const fallBack = 'https://www.adobe.com/go/acrobat-overview';
  const redDir = () => {
    if (window.location.hostname !== 'www.adobe.com' && window.location.hostname !== 'sign.ing' && window.location.hostname !== 'edit.ing') {
      window.location = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}-${ENV}` || REDIRECT_URL;
    } else {
      window.location = REDIRECT_URL || `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}` || fallBack;
    }
  };

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'CID';
  widgetContainer.className = `fsw wapper-${VERB}`;
  widget.appendChild(widgetContainer);

  const isRedirection = /redirect_(?:conversion|files)=true/.test(window.location.search);
  const { cookie } = document;
  const limitCookie = exhLimitCookieMap[VERB] || exhLimitCookieMap[VERB.match(/^pdf-to|to-pdf$/)?.[0]];
  const cookiePrefix = appEnvCookieMap[ENV] || '';
  const isLimitExhausted = limitCookie && cookie.includes(`${cookiePrefix}${limitCookie}`);
  const preRenderDropZone = !isLimitExhausted && !isRedirection;

  const INLINE_SNIPPET = widget.querySelector(':scope > section#edge-snippet');
  if (INLINE_SNIPPET) {
    if (!isLimitExhausted) {
      widgetContainer.dataset.rendered = 'true';
      widgetContainer.appendChild(...INLINE_SNIPPET.childNodes);
      performance.mark('milo-move-snippet');
    }
    widget.removeChild(INLINE_SNIPPET);
  } else if (preRenderDropZone) {
    const response = await fetch(DC_GENERATE_CACHE_URL || `${DC_DOMAIN}/dc-generate-cache/dc-hosted-${DC_GENERATE_CACHE_VERSION}/${VERB}-${pageLang}.html`);
    switch (response.status) {
      case 200: {
        const template = await response.text();
        if (!('rendered' in widgetContainer.dataset)) {
          widgetContainer.dataset.rendered = 'true';
          const doc = new DOMParser().parseFromString(template, 'text/html');
          document.head.appendChild(doc.head.getElementsByTagName('Style')[0]);
          widgetContainer.appendChild(doc.body.firstElementChild);
          performance.mark('milo-insert-snippet');
        }
        break;
      }
      default:
        break;
    }
  }

  window.addEventListener('IMS:Ready', async () => {
    // Redirect Usage
    if (window.adobeIMS.isSignedInUser()) {
      redDir();
      return;
    }

    const { default: frictionless } = await import('../../scripts/frictionless.js');
    frictionless(VERB);
  });

  const dcScript = document.createElement('script');
  dcScript.id = 'adobe_dc_sdk_launcher';
  dcScript.setAttribute('src', WIDGET_ENV);
  dcScript.dataset.dropzone_id = 'CID';
  dcScript.dataset.locale = pageLang;
  dcScript.dataset.server_env = ENV;
  dcScript.dataset.verb = VERB;
  dcScript.dataset.load_typekit = 'false';
  dcScript.dataset.load_imslib = 'false';
  dcScript.dataset.log_perf = 'true';
  dcScript.dataset.enable_unload_prompt = 'true';
  if (preRenderDropZone) {
    dcScript.dataset.pre_rendered = 'true'; // TODO: remove this line
  }
  if (IMS_GUEST) {
    dcScript.dataset.ims_guests = 'true';
  }

  widget.appendChild(dcScript);

  window.addEventListener('IMS:Ready', () => {
    const evt = new CustomEvent('dc.imslib.ready', { detail: { instance: window.adobeIMS } });
    evt.initEvent('dc.imslib.ready', true, true);
    document.dispatchEvent(evt);
    // window.adobe_dc_sdk.imsReady = true;
  });

  // DC Personalization
  window.addEventListener('DC_Hosted:Ready', () => {
    const DATA = window.dc_hosted.getUserLimits();
    DATA.then((val) => {
      const doccloudPersonalization = val;
      // if limit for 300 uploads is reached, limit is shared across all verbs,
      // upsell is shown for all verbs
      const canNotUpload = val.upload && !val.upload.can_upload;
      doccloudPersonalization.isUpsellDisplayed = {
        // L2 VERBS
        // convert-pdf, word-pdf, excel-pdf, jpg-pdf, ppt-pdf
        createPDF: canNotUpload || (val.create_pdf && !val.create_pdf.can_process),
        // pdf-word, pdf-excel, pdf-ppt, pdf-jpg (2 conversion allowed, limit is shared across them)
        exportPDF: canNotUpload || (val.export_pdf && !val.export_pdf.can_process),
        // compress-pdf
        compressPDF: canNotUpload || (val.compress_pdf && !val.compress_pdf.can_process),
        // password-protect
        passwordProtectPDF: canNotUpload || (val.protect_pdf && !val.protect_pdf.can_process),
        // merge-pdf
        mergePDF: canNotUpload || (val.combine_pdf && !val.combine_pdf.can_process),
        // L1 VERBS (all of them: request signature, pdf editor, delete pdf pages,
        // rotate pdf, rearrange pdf, split pdf, add pages to pdf, sign pdf, export pdf)
        l1Verbs: canNotUpload,
        // Half L2/L1
        ocrPDF: canNotUpload || (val.ocr_pdf && !val.ocr_pdf.can_process),
      };
      window.doccloudPersonalization = doccloudPersonalization;

      const downloadStatus = doccloudPersonalization.download?.can_download ? 'can_download' : 'cannot_download';
      localStorage.setItem(`${window.location.hostname}_download`, downloadStatus);
      // Personalization Ready Event
      const personalizationIsReady = new CustomEvent('Personalization:Ready');

      window.dispatchEvent(personalizationIsReady);
    }).catch(() => {
      window.dispatchEvent(new CustomEvent('DC_Hosted:Error'));
    });
  });

  window.addEventListener('DC_Hosted:Error', () => {
    const dropZone = document.querySelector('.dropZoneContent');
    if (dropZone && !dropZone.classList.contains('unavailable')) {
      dropZone.classList.add('unavailable');
      dropZone.style.pointerEvents = 'none';
      dropZone.parentElement.style.border = 'none';
      document.querySelector('h1').textContent = 'Currently unavailable';
      dropZone.innerHTML = '<img src="/acrobat/img/icons/error.svg"><p>We apologize for the inconvenience. We are working hard to make the service available. Please check back shortly.</p>';
      document.querySelector('div[class*="DropZoneFooter__dropzoneFooter"]').innerHTML = '';
    }
    window.lana?.log('DC Widget failed', lanaOptions);
  });
}
