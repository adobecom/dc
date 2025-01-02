import LIMITS from '../verb-widget/limits.js';

export const localeMap = {
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
  hk_zh: 'zh-tw',
  tw: 'zh-tw',
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

function getUnityLibs(prodLibs = '/unitylibs') {
  const { hostname, search } = window.location;
  if (!/\.hlx\.|\.aem\.|local|stage/.test(hostname)) return prodLibs;
  // eslint-disable-next-line compat/compat
  const branch = new URLSearchParams(search).get('unitylibs') || 'main';
  const env = hostname.includes('.hlx.') ? 'hlx' : 'aem';
  return `https://${branch}${branch.includes('--') ? '' : '--unity--adobecom'}.${env}.live/unitylibs`;
}

export default async function init(el) {
  let mobileApp;
  if ((/iPad|iPhone|iPod/.test(window.browser?.ua) && !window.MSStream)
    || /android/i.test(window.browser?.ua)) {
    mobileApp = true;
  }

  const element = el.querySelector('span');
  const verb = element.classList[1].replace('icon-', '');
  if (mobileApp && LIMITS[verb].mobileApp) return;

  const unitylibs = getUnityLibs();
  const langFromPath = window.location.pathname.split('/')[1];
  const languageCode = localeMap[langFromPath] ? localeMap[langFromPath].split('-')[0] : 'en';
  const languageRegion = localeMap[langFromPath] ? localeMap[langFromPath].split('-')[1] : 'us';
  const { default: wfinit } = await import(`${unitylibs}/core/workflow/workflow.js`);
  await wfinit(el, 'acrobat', unitylibs, 'v2', languageRegion, languageCode);
}
