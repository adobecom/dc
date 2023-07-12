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
  'ee': 'en-ee',
  'es': 'es-es',
  'fr': 'fr-fr',
  'gr_en': 'en-gr',
  'gr_el': 'el-gr',
  'ie': 'en-ie',
  'il_en': 'en-il',
  'it': 'it-it',
  'lv': 'en-lv',
  'lt': 'en-lt',
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
  'si': 'si-si',
  'sk': 'sk-sk',
  'ch_fr': 'fr-ch',
  'fi': 'fi-fi',
  'se': 'sv-se',
  'ch_it': 'it-ch',
  'tr': 'tr-tr',
  'uk': 'en-uk',
  'bg': 'en-bg',
  'ru': 'ru-ru',
  'ua': 'ua-ua',
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
  const HEADING = 'Convert PDF to PowerPoint';
  const COPY = 'Select a PDF file to convert it into a Microsoft PowerPoint presentation.';
  const LEGAL = 'Your file will be securely handled by Adobe servers and deleted unless you sign in to save it. By using this service, you agree to the Adobe Terms of Use and Privacy Policy.'

  //Create Fake Widget
  createTag.then((tag) => {
    const wrapper = tag('div', {id: 'CID', class: 'widget-wrapper' });
    const heading = tag('h1', { class: 'widget-heading' }, HEADING);
    const copy = tag('div', { class: 'widget-copy' }, COPY);
    const legal = tag('div', { class: 'widget-legal' }, LEGAL);
    element.append(wrapper);
    wrapper.append(heading);
    wrapper.append(copy);
    wrapper.append(legal);

    let WIDGET_ENV = `https://dev.acrobat.adobe.com/dc-hosted/2.40.0_1.172.1/dc-app-launcher.js`;

    const dcWidgetScript = tag('script', {
      id: 'adobe_dc_sdk_launcher',
      src: WIDGET_ENV,
      'data-dropzone_id': 'CID',
      'data-locale': pageLang,
      'data-server_env': 'STAGE',
      'data-verb': 'pdf-to-ppt',
      'data-load_typekit': 'false',
      'data-load_imslib': 'false',
      'data-enable_unload_prompt': 'true',
    });

    document.addEventListener('milo:deferred', ()=> {
      element.append(dcWidgetScript);
    })
  });
  
 
}
