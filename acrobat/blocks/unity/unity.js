import LIMITS from '../verb-widget/limits.js';

export const localeMap = {
  '': 'en-us',
  br: 'pt-br',
  ca: 'en-us',
  ca_fr: 'fr-fr',
  mx: 'es-es',
  la: 'es-es',
  africa: 'en-us',
  za: 'en-us',
  be_nl: 'nl-nl',
  be_fr: 'fr-fr',
  be_en: 'en-us',
  cz: 'cs-cz',
  cy_en: 'en-us',
  dk: 'da-dk',
  de: 'de-de',
  ee: 'en-us',
  es: 'es-es',
  fr: 'fr-fr',
  gr_en: 'en-us',
  gr_el: 'en-us',
  ie: 'en-us',
  il_en: 'en-us',
  il_he: 'en-us',
  it: 'it-it',
  lv: 'en-us',
  lt: 'en-us',
  lu_de: 'de-de',
  lu_en: 'en-us',
  lu_fr: 'fr-fr',
  hu: 'en-us',
  mt: 'en-us',
  mena_en: 'en-us',
  mena_ar: 'en-us',
  nl: 'nl-nl',
  no: 'nb-no',
  at: 'de-de',
  pl: 'pl-pl',
  pt: 'pt-br',
  ro: 'ro-ro',
  ch_de: 'de-de',
  si: 'en-us',
  sk: 'en-us',
  ch_fr: 'fr-fr',
  fi: 'fi-fi',
  se: 'sv-se',
  ch_it: 'it-it',
  tr: 'tr-tr',
  uk: 'en-gb',
  bg: 'en-us',
  ru: 'ru-ru',
  ua: 'en-us',
  au: 'en-au',
  hk_en: 'en-us',
  in: 'en-us',
  in_hi: 'hi-in',
  nz: 'en-nz',
  hk_zh: 'zh-tw',
  tw: 'zh-tw',
  jp: 'ja-jp',
  kr: 'ko-kr',
  ae_en: 'en-us',
  ae_ar: 'en-us',
  sa_en: 'en-us',
  sa_ar: 'en-us',
  th_en: 'en-us',
  th_th: 'th-th',
  sg: 'en-us',
  cl: 'es-es',
  co: 'es-es',
  ar: 'es-es',
  cr: 'es-es',
  pr: 'es-es',
  ec: 'es-es',
  pe: 'es-es',
  eg_en: 'en-us',
  eg_ar: 'en-us',
  gt: 'es-es',
  id_en: 'en-us',
  id_id: 'id-id',
  ph_en: 'en-us',
  ph_fil: 'en-us',
  my_en: 'en-us',
  my_ms: 'en-us',
  kw_en: 'en-us',
  kw_ar: 'en-us',
  ng: 'en-us',
  qa_en: 'en-us',
  qa_ar: 'en-us',
  vn_en: 'en-us',
  vn_vi: 'en-us',
};

function getUnityLibs(prodLibs = '/unitylibs') {
  const { hostname, search } = window.location;
  if (!/\.hlx\.|\.aem\.|local|stage/.test(hostname)) return prodLibs;
  // eslint-disable-next-line compat/compat
  const branch = new URLSearchParams(search).get('unitylibs') || 'main';
  if (branch === 'main' && hostname === 'www.stage.adobe.com') return prodLibs;
  const env = hostname.includes('.aem.') ? 'aem' : 'hlx';
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
