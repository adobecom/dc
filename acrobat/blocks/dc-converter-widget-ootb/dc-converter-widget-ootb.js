import {createTag} from "../../scripts/miloUtils.js";
// Could use webpack/rollup. Just manually inline these structures, for now.
const localeMap = {
  '': 'en-us',
  'br': 'pt-br',
  'ca': 'en-ca',
  'ca_fr': 'fr-ca',
  'mx': 'es-mx',
  'la': 'es-la',
  'africa': 'en-africa',
  'za': 'en-za',
  'be_nl': 'nl-be',
  'be_fr': 'fr-be',
  'be_en': 'en-be',
  'cz': 'cs-cz',
  'cy_en': 'en-cy',
  'dk': 'da-dk',
  'de': 'de-de',
  'ee': 'et-ee',
  'es': 'es-es',
  'fr': 'fr-fr',
  'gr_en': 'en-gr',
  'gr_el': 'el-gr',
  'ie': 'en-ie',
  'il_en': 'en-il',
  'il_he': 'he-il',
  'it': 'it-it',
  'lv': 'lv-lv',
  'lt': 'lt-lt',
  'lu_de': 'de-lu',
  'lu_en': 'en-lu',
  'lu_fr': 'fr-lu',
  'hu': 'hu-hu',
  'mt': 'en-mt',
  'mena_en': 'en-mena',
  'mena_ar': 'ar-mena',
  'nl': 'nl-nl',
  'no': 'nb-no',
  'at': 'de-at',
  'pl': 'pl-pl',
  'pt': 'pt-pt',
  'ro': 'ro-ro',
  'ch_de': 'de-ch',
  'si': 'sl-si',
  'sk': 'sk-sk',
  'ch_fr': 'fr-ch',
  'fi': 'fi-fi',
  'se': 'sv-se',
  'ch_it': 'it-ch',
  'tr': 'tr-tr',
  'uk': 'en-uk',
  'bg': 'bg-bg',
  'ru': 'ru-ru',
  'ua': 'uk-ua',
  'au': 'en-au',
  'hk_en': 'en-hk',
  'in': 'en-in',
  'in_hi': 'hi-in',
  'nz': 'en-nz',
  'hk_zh': 'zh-hant-hk',
  'tw': 'zh-hant-tw',
  'jp': 'ja-jp',
  'kr': 'ko-kr',
  'ae_en': 'en-ae',
  'ae_ar': 'ar-ae',
  'sa_en': 'en-sa',
  'sa_ar': 'ar-sa',
  'th_en': 'en-th',
  'th_th': 'th-th',
  'sg': 'en-sg',
  'cl': 'es-cl',
  'co': 'es-co',
  'ar': 'es-ar',
  'cr': 'es-cr',
  'pr': 'es-pr',
  'ec': 'es-ec',
  'pe': 'es-pe',
  'eg_en': 'en-eg',
  'eg_ar': 'ar-eg',
  'gt': 'es-gt',
  'id_en': 'en-id',
  'id_id': 'in-id',
  'ph_en': 'en-ph',
  'ph_fil': 'fil-ph',
  'my_en': 'en-my',
  'my_ms': 'ms-my',
  'kw_en': 'en-kw',
  'kw_ar': 'ar-kw',
  'ng': 'en-ng',
  'qa_en': 'en-qa',
  'qa_ar': 'ar-qa',
  'vn_en': 'en-vn',
  'vn_vi': 'vi-vn'
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
  'number-pages': 'number',
};

let url = new URL(window.location.href);
let langFromPath = url.pathname.split('/')[1];
const pageLang = localeMap[langFromPath] || 'en-us';

export default function init(element) {
  const widget = element;
  const DC_WIDGET_VERSION_FALLBACK = '2.40.0_1.172.1';
  const DC_GENERATE_CACHE_VERSION_FALLBACK = '1.172.1';
  const STG_DC_WIDGET_VERSION = document.querySelector('meta[name="stg-dc-widget-version"]')?.getAttribute('content');
  const STG_DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="stg-dc-generate-cache-version"]')?.getAttribute('content');
  const HEADING = 'Convert JPG to PDF';
  const COPY = 'Drag and drop an image file (JPG, PNG, BMP, and more) to use our PDF converter.';
  const WORD_HEADING = 'Convert PDF to Word';
  const WORD_COPY = 'Drag and drop a PDF file to use our PDF to Microsoft Word converter.';
  const LEGAL = 'Your file will be securely handled by Adobe servers and deleted unless you sign in to save it. By using this service, you agree to the Adobe Terms of Use and Privacy Policy.';
  const BTN = 'Select a file';

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
  const VERB = widget.querySelector('div').textContent.trim().toLowerCase();
      const dynamicHead = VERB === 'jpg-to-pdf' ? HEADING : WORD_HEADING;
      const dynamicCopy = VERB === 'jpg-to-pdf' ? COPY : WORD_COPY;
      //Create Fake Widget
      createTag.then((tag) => {
        const wrapper = tag('div', {id: 'CID', class: `fsw widget-wrapper wapper-${VERB}` });
        const heading = tag('h1', { class: 'widget-heading' }, dynamicHead);
        const center = tag('div', { class: 'widget-center' });
        const copy = tag('p', { class: 'widget-copy' }, dynamicCopy);
        const legal = tag('p', { class: 'widget-legal' }, LEGAL);
        const button = tag('p', { class: 'widget-button' }, BTN);
        wrapper.append(heading);
        wrapper.append(center)
        center.append(copy);
        center.append(button);
        wrapper.append(legal);
        element.append(wrapper);

        const dcWidgetScript = tag('script', {
          id: 'adobe_dc_sdk_launcher',
          src: WIDGET_ENV,
          'data-dropzone_id': 'CID',
          'data-locale': pageLang,
          'data-server_env': ENV,
          'data-verb': VERB,
          'data-load_typekit': 'false',
          'data-load_imslib': 'false',
          'data-enable_unload_prompt': 'true',
        });

        // element.prepend(dcWidgetScript);
        document.addEventListener('milo:deferred', ()=> {
          wrapper.classList.add('widget-loaded');
          element.prepend(dcWidgetScript);
        })
        // setTimeout(() => {
        //   wrapper.classList.add('widget-loaded');
        //   console.log('load widget');
        //   element.prepend(dcWidgetScript);
        // }, 5000)
      });

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

  window.addEventListener('IMS:Ready', async () => {
    // Redirect Usage
    if (window.adobeIMS.isSignedInUser()) {
      redDir();
      return;
    }

    const { default: frictionless } = await import('../../scripts/frictionless.js');
    frictionless(VERB);
  });

  window.addEventListener('Bowser:Ready', async () => {
    // EOL Redirect
    const { redirectLegacyBrowsers } = await import('../../scripts/legacyBrowser.js');
    redirectLegacyBrowsers();
  })

  // widget.appendChild(dcScript);

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
