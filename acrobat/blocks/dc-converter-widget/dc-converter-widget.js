// Could use webpack/rollup. Just manually inline these structures, for now.
// import langLocaleMap from './localeMap.js';
const localeMap = {
  'ca_fr': 'fr-FR',
  'be_fr': 'fr-FR',
  'dk': 'da-DK',
  'de': 'de-DE',
  'lu_de': 'de-DE',
  'ch_de': 'de-DE',
  'at': 'de-DE',
  'es': 'es-ES',
  'ar': 'es-ES',
  'cl': 'es-ES',
  'co': 'es-ES',
  'cr': 'es-ES',
  'ec': 'es-ES',
  'gt': 'es-ES',
  'pe': 'es-ES',
  'pr': 'es-ES',
  'fi': 'fi-FI',
  'fr': 'fr-FR',
  'ch_fr': 'fr-FR',
  'lu_fr': 'fr-FR',
  'it': 'it-IT',
  'ch_it': 'it-IT',
  'jp': 'ja-JP',
  'nb': 'nb-NO',
  'no': 'nb-NO',
  'nl': 'nl-NL',
  'pt': 'pt-BR',
  'sv': 'sv-SE',
  'se': 'sv-SE',
  'zh_cn': 'zh-CN',
  'zh_hk': 'zh-TW',
  'hk_zh': 'zh-hant-hk',
  'tw': 'zh-hant-tw',
  'kr': 'ko-KR',
  'cz': 'cs-CZ',
  'pl': 'pl-PL',
  'ru': 'ru-RU',
  'tr': 'tr-TR',
  'br': 'pt-BR',
  'la': 'es-ES',
  'mx': 'es-ES',
  'be_nl': 'nl-NL',
};

// import verbToRedirectLinkSuffix from './verbRedirMap.js'
const verbRedirMap = {
  'createpdf': 'createpdf',
  'crop-pages': 'crop',
  'delete-pages': 'deletepages',
  'extract-pages': 'extract',
  'combine-pdf': 'combine',
  'protect-pdf': 'protect',
  'add-comment': 'addcomment',
  'pdf-to-image': 'pdftoimage',
  'reorder-pages': 'reorderpages',
  'sendforsignature': 'sendforsignature',
  'rotate-pages': 'rotatepages',
  'fillsign': 'fillsign',
  'split-pdf': 'split',
  'insert-pdf': 'insert',
  'compress-pdf': 'compress',
  'png-to-pdf': 'jpgtopdf',
};

let url = new URL(window.location.href);
let langFromPath = url.pathname.split('/')[1];
const pageLang = localeMap[langFromPath] || 'en-US';

export default function init(element) {
  const widget = element;
  const DC_WIDGET_VERSION_FALLBACK = '2.40.0_1.172.1';
  const DC_GENERATE_CACHE_VERSION_FALLBACK = '1.172.1';
  const STG_DC_WIDGET_VERSION = document.querySelector('meta[name="stg-dc-widget-version"]')?.getAttribute('content');
  const STG_DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="stg-dc-generate-cache-version"]')?.getAttribute('content');

  let DC_DOMAIN = 'https://dev.acrobat.adobe.com';
  let DC_WIDGET_VERSION = document.querySelector('meta[name="dc-widget-version"]')?.getAttribute('content');
  let DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="dc-generate-cache-version"]')?.getAttribute('content');
  const lanaOptions = {
    sampleRate: 1,
    tags: 'Cat=DxDC_Frictionless,origin=milo',
  };
  if (!DC_WIDGET_VERSION) {
    DC_WIDGET_VERSION = DC_WIDGET_VERSION_FALLBACK;
    window.lana?.log(`DC WIDGET VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_WIDGET_VERSION_FALLBACK}`, lanaOptions);
  }
  if (!DC_GENERATE_CACHE_VERSION) {
    DC_GENERATE_CACHE_VERSION = DC_GENERATE_CACHE_VERSION_FALLBACK;
    window.lana?.log(`DC GENERATE CACHE VERSION IS NOT SET, USING FALLBACK VERSION: ${DC_GENERATE_CACHE_VERSION_FALLBACK}`, lanaOptions);
  }
  let WIDGET_ENV = `https://dev.acrobat.adobe.com/dc-hosted/${DC_WIDGET_VERSION}/dc-app-launcher.js`;
  let ENV = 'dev';
  let REDIRECT_URL = '';
  let DC_GENERATE_CACHE_URL = '';

  if (window.location.hostname === 'www.adobe.com') {
    WIDGET_ENV = `https://acrobat.adobe.com/dc-hosted/${DC_WIDGET_VERSION}/dc-app-launcher.js`;
    DC_DOMAIN = 'https://acrobat.adobe.com';
    ENV = 'prod';
  }

  if (window.location.hostname === 'stage--dc--adobecom.hlx.page'
    || window.location.hostname === 'main--dc--adobecom.hlx.page'
    || window.location.hostname === 'stage--dc--adobecom.hlx.live'
    || window.location.hostname === 'main--dc--adobecom.hlx.live'
    || window.location.hostname === 'www.stage.adobe.com') {
    WIDGET_ENV = `https://stage.acrobat.adobe.com/dc-hosted/${STG_DC_WIDGET_VERSION}/dc-app-launcher.js`;
    DC_DOMAIN = 'https://stage.acrobat.adobe.com';
    DC_GENERATE_CACHE_VERSION = STG_DC_GENERATE_CACHE_VERSION;
    ENV = 'stage';
  }

  widget.querySelector('div').id = 'VERB';
  const VERB = widget.querySelector('div').innerText.trim().toLowerCase();

  // Redir URL
  const REDIRECT_URL_DIV = widget.querySelectorAll('div')[2];
  if (REDIRECT_URL_DIV) {
    // REDIRECT_URL_DIV.id = 'REDIRECT_URL';
    REDIRECT_URL = REDIRECT_URL_DIV.textContent.trim();
    REDIRECT_URL_DIV.remove();
  }


    // Generate cache url
    const GENERATE_CACHE_URL_DIV = widget.querySelectorAll('div')[4];
    if (GENERATE_CACHE_URL_DIV) {
      // GENERATE_CACHE_URL_DIV.id = 'GENERATE_CACHE_URL';
      DC_GENERATE_CACHE_URL = GENERATE_CACHE_URL_DIV.textContent.trim();
      GENERATE_CACHE_URL_DIV.remove();
    }

  // Redirect
  const fallBack = 'https://www.adobe.com/go/acrobat-overview';
  const redDir = () => {
    if (window.location.hostname != 'main--dc--adobecom.hlx.live'
      && window.location.hostname != 'www.adobe.com' ) {
      window.location = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}-${ENV}`|| REDIRECT_URL;
    } else {
      window.location = REDIRECT_URL || `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}` || fallBack;
    }
  };

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'CID';
  widget.appendChild(widgetContainer);

  const isReturningUser = window.localStorage.getItem('pdfnow.auth');
  const isRedirection = /redirect_(?:conversion|files)=true/.test(window.location.search);
  const preRenderDropZone = !isReturningUser && !isRedirection;
  if (preRenderDropZone) {
    (async () => {
      // TODO: Make dynamic
      const response = await fetch(DC_GENERATE_CACHE_URL || `${DC_DOMAIN}/dc-generate-cache/dc-hosted-${DC_GENERATE_CACHE_VERSION}/${VERB}-${pageLang.toLocaleLowerCase()}.html`);
      // eslint-disable-next-line default-case
      switch (response.status) {
        case 200: {
          const template = await response.text();
          const doc = new DOMParser().parseFromString(template, 'text/html');
          document.head.appendChild(doc.head.getElementsByTagName('Style')[0]);
          widgetContainer.appendChild(doc.body.firstElementChild);
          performance.mark("milo-insert-snippet");
          break;
        }
        default:
          break;
      }
    })();
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
  dcScript.dataset.enable_unload_prompt = 'true';
  if (preRenderDropZone) {
    dcScript.dataset.pre_rendered = 'true';
  }

  window.addEventListener('Bowser:Ready', async () => {
    // EOL Redirect
    const { redirectLegacyBrowsers } = await import('../../scripts/legacyBrowser.js');
    redirectLegacyBrowsers();
  })

  widget.appendChild(dcScript);

  window.addEventListener('IMS:Ready', () => {
    let evt;
    evt = new CustomEvent('dc.imslib.ready', { detail: { instance: window.adobeIMS }});
    evt.initEvent('dc.imslib.ready', true, true);
    document.dispatchEvent(evt);
    // window.adobe_dc_sdk.imsReady = true;
  })

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
      };
      window.doccloudPersonalization = doccloudPersonalization;
      // Personalization Ready Event
      const personalizationIsReady = new CustomEvent('Personalization:Ready');

      window.dispatchEvent(personalizationIsReady);
    });
  });
}
