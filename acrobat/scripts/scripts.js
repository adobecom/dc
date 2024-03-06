/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const pattern = /{{phone-\S\w*\S\w*}}/g;
document.querySelectorAll('a').forEach((p, idx) => {
  if (pattern.exec(p.innerHTML)) {
    p.setAttribute('number-type', p.innerHTML.match(pattern)[0].replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ''));
    p.classList.add(`geo-pn${idx}`);
  }
});

/**
 * The decision engine for where to get Milo's libs from.
 */
const setLibs = (prodLibs, location) => {
  const { hostname, search } = location || window.location;
  // eslint-disable-next-line compat/compat
  const branch = new URLSearchParams(search).get('milolibs') || 'main';
  if (branch === 'main' && hostname === 'www.stage.adobe.com') return 'https://www.stage.adobe.com/libs';
  if (!(hostname.includes('.hlx.') || hostname.includes('local') || hostname.includes('stage'))) return prodLibs;
  if (branch === 'local') return 'http://localhost:6456/libs';
  const tld = hostname.includes('live') ? 'live' : 'page';
  return branch.includes('--') ? `https://${branch}.hlx.${tld}/libs` : `https://${branch}--milo--adobecom.hlx.${tld}/libs`;
};

const getLocale = (locales, pathname = window.location.pathname) => {
  if (!locales) {
    return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  }
  const LANGSTORE = 'langstore';
  const split = pathname.split('/');
  const localeString = split[1];
  const locale = locales[localeString] || locales[''];
  if (localeString === LANGSTORE) {
    locale.prefix = `/${localeString}/${split[2]}`;
    if (
      Object.values(locales)
        .find((loc) => loc.ietf?.startsWith(split[2]))?.dir === 'rtl'
    ) locale.dir = 'rtl';
    return locale;
  }
  const isUS = locale.ietf === 'en-US';
  locale.prefix = isUS ? '' : `/${localeString}`;
  locale.region = isUS ? 'us' : localeString.split('_')[0];
  return locale;
};

const getBrowserData = (userAgent) => {
  if (!userAgent) {
    return {};
  }
  const browser = {
    ua: userAgent,
    isMobile: userAgent.includes('Mobile'),
  };

  const regex = [
    {
      browserReg: /edg([ae]|ios)?/i,
      versionReg: /edg([ae]|ios)?[\s/](\d+(\.?\d+)+)/i,
      name: 'Microsoft Edge',
    },
    {
      browserReg: /chrome|crios|crmo/i,
      versionReg: /(?:chrome|crios|crmo)\/(\d+(\.?\d+)+)/i,
      name: 'Chrome',
    },
    {
      browserReg: /firefox|fxios|iceweasel/i,
      versionReg: /(?:firefox|fxios|iceweasel)[\s/](\d+(\.?\d+)+)/i,
      name: 'Firefox',
    },
    {
      browserReg: /msie|trident/i,
      versionReg: /(?:msie |rv:)(\d+(\.?\d+)+)/i,
      name: 'Internet Explorer',
    },
    {
      browserReg: /safari|applewebkit/i,
      versionReg: /(?:version)\/(\d+(\.?\d+)+)/i,
      name: 'Safari',
    },
  ];

  for (const reg of regex) {
    if (reg.browserReg.test(userAgent)) {
      browser.name = reg.name;
      const version = userAgent.match(reg.versionReg);
      if (version) {
        browser.version = reg.name === 'Microsoft Edge' ? version[2] : version[1];
      }

      return browser;
    }
  }

  return browser;
};

// Get browser data
window.browser = getBrowserData(window.navigator.userAgent);

// Add origin-trial meta tag
const { hostname } = window.location;
if (hostname === 'www.stage.adobe.com') {
  const TRIAL_TOKEN = 'ApPnSNHCIWK27DqNdhiDHtOnC8mmBgtVJX5CLfG0qKTYvEG3MRpIdFTlz35GPStZLs926t+yC9M4Y6Ent+YKbgkAAABkeyJvcmlnaW4iOiJodHRwczovL2Fkb2JlLmNvbTo0NDMiLCJmZWF0dXJlIjoiU2NoZWR1bGVyWWllbGQiLCJleHBpcnkiOjE3MDk2ODMxOTksImlzU3ViZG9tYWluIjp0cnVlfQ==';
  const tokenElement = document.createElement('meta');
  tokenElement.httpEquiv = 'origin-trial';
  tokenElement.content = TRIAL_TOKEN;
  document.head.appendChild(tokenElement);
}

// Adding .html to canonical url for .ing pages
if (hostname.endsWith('.ing')) {
  const canonEl = document.head.querySelector('link[rel="canonical"]');
  if (!canonEl?.href.endsWith('.html')) canonEl?.setAttribute('href', `${canonEl.href}.html`);
}

function loadStyles(paths) {
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}

function addLocale(locale) {
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('property', 'og:locale');
  metaTag.setAttribute('content', locale);
  document.head.appendChild(metaTag);
}

// Add project-wide styles here.
const STYLES = '/acrobat/styles/styles.css';

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = '/libs';

const locales = {
  // Americas
  ar: { ietf: 'es-AR', tk: 'oln4yqj.css' },
  br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
  ca: { ietf: 'en-CA', tk: 'pps7abe.css' },
  ca_fr: { ietf: 'fr-CA', tk: 'vrk5vyv.css' },
  cl: { ietf: 'es-CL', tk: 'oln4yqj.css' },
  co: { ietf: 'es-CO', tk: 'oln4yqj.css' },
  la: { ietf: 'es-LA', tk: 'oln4yqj.css' },
  mx: { ietf: 'es-MX', tk: 'oln4yqj.css' },
  pe: { ietf: 'es-PE', tk: 'oln4yqj.css' },
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  // EMEA
  africa: { ietf: 'en', tk: 'pps7abe.css' },
  be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
  be_en: { ietf: 'en-BE', tk: 'pps7abe.css' },
  be_nl: { ietf: 'nl-BE', tk: 'cya6bri.css' },
  cy_en: { ietf: 'en-CY', tk: 'pps7abe.css' },
  dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
  de: { ietf: 'de-DE', tk: 'vin7zsi.css' },
  ee: { ietf: 'et-EE', tk: 'aaz7dvd.css' },
  es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
  fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
  gr_en: { ietf: 'en-GR', tk: 'pps7abe.css' },
  ie: { ietf: 'en-GB', tk: 'pps7abe.css' },
  il_en: { ietf: 'en-IL', tk: 'pps7abe.css' },
  it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
  lv: { ietf: 'lv-LV', tk: 'aaz7dvd.css' },
  lt: { ietf: 'lt-LT', tk: 'aaz7dvd.css' },
  lu_de: { ietf: 'de-LU', tk: 'vin7zsi.css' },
  lu_en: { ietf: 'en-LU', tk: 'pps7abe.css' },
  lu_fr: { ietf: 'fr-LU', tk: 'vrk5vyv.css' },
  hu: { ietf: 'hu-HU', tk: 'aaz7dvd.css' },
  mt: { ietf: 'en-MT', tk: 'pps7abe.css' },
  mena_en: { ietf: 'en', tk: 'pps7abe.css' },
  nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
  no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
  pl: { ietf: 'pl-PL', tk: 'aaz7dvd.css' },
  pt: { ietf: 'pt-PT', tk: 'inq1xob.css' },
  ro: { ietf: 'en-RO', tk: 'aaz7dvd.css' },
  sa_en: { ietf: 'en', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css' },
  si: { ietf: 'sl-SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'en-SK', tk: 'aaz7dvd.css' },
  ch_fr: { ietf: 'fr-CH', tk: 'vrk5vyv.css' },
  fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
  se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
  ch_it: { ietf: 'it-CH', tk: 'bbf5pok.css' },
  tr: { ietf: 'tr-TR', tk: 'aaz7dvd.css' },
  ae_en: { ietf: 'en', tk: 'pps7abe.css' },
  uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
  at: { ietf: 'de-AT', tk: 'vin7zsi.css' },
  cz: { ietf: 'cs-CZ', tk: 'aaz7dvd.css' },
  bg: { ietf: 'bg-BG', tk: 'aaz7dvd.css' },
  ru: { ietf: 'ru-RU', tk: 'aaz7dvd.css' },
  ua: { ietf: 'uk-UA', tk: 'aaz7dvd.css' },
  il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl' },
  ae_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl' },
  sa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  // Asia Pacific
  au: { ietf: 'en-AU', tk: 'pps7abe.css' },
  hk_en: { ietf: 'en-HK', tk: 'pps7abe.css' },
  in: { ietf: 'en-GB', tk: 'pps7abe.css' },
  id_id: { ietf: 'id', tk: 'czc0mun.css' },
  id_en: { ietf: 'en', tk: 'pps7abe.css' },
  my_ms: { ietf: 'ms', tk: 'sxj4tvo.css' },
  my_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  nz: { ietf: 'en-GB', tk: 'pps7abe.css' },
  ph_en: { ietf: 'en', tk: 'pps7abe.css' },
  ph_fil: { ietf: 'fil-PH', tk: 'ict8rmp.css' },
  sg: { ietf: 'en-SG', tk: 'pps7abe.css' },
  th_en: { ietf: 'en', tk: 'pps7abe.css' },
  in_hi: { ietf: 'hi', tk: 'aaa8deh.css' },
  th_th: { ietf: 'th', tk: 'aaz7dvd.css' },
  cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd' },
  tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
  jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
  // Langstore Support.
  langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
  // geo expansion MWPW-124903
  za: { ietf: 'en-GB', tk: 'pps7abe.css' }, // South Africa (GB English)
  ng: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Nigeria (GB English)
  cr: { ietf: 'es-419', tk: 'oln4yqj.css' }, // Costa Rica (Spanish Latin America)
  ec: { ietf: 'es-419', tk: 'oln4yqj.css' }, // Ecuador (Spanish Latin America)
  pr: { ietf: 'es-419', tk: 'oln4yqj.css' }, // Puerto Rico (Spanish Latin America)
  gt: { ietf: 'es-419', tk: 'oln4yqj.css' }, // Guatemala (Spanish Latin America)
  eg_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Egypt (Arabic)
  kw_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Kuwait (Arabic)
  qa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Quatar (Arabic)
  eg_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Egypt (GB English)
  kw_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Kuwait (GB English)
  qa_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Qatar (GB English)
  gr_el: { ietf: 'el', tk: 'fnx0rsr.css' }, // Greece (Greek)
  el: { ietf: 'el', tk: 'aaz7dvd.css' },
  vn_vi: { ietf: 'vi', tk: 'jii8bki.css' },
  vn_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
};

// Add any config options.
const CONFIG = {
  codeRoot: '/acrobat',
  contentRoot: '/dc-shared',
  imsClientId: 'acrobatmilo',
  commerce: { checkoutClientId: 'doc_cloud' },
  local: {
    edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745cdfdga',
    pdfViewerClientId: 'ec572982b2a849d4b16c47d9558d66d1',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  dcmain: {
    pdfViewerClientId: 'a42d91c0e5ec46f982d2da0846d9f7d0',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  dcstage: {
    pdfViewerClientId: '2522674a708e4ddf8bbd62e18585ae4b',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  stage: {
    edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c',
    marTechUrl: 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-2c94beadc94f-development.min.js',
    pdfViewerClientId: '5bfb3a784f2642f88ecf9d2ff4cd573e',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  live: {
    edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c',
    pdfViewerClientId: '18e9175fc6754b9892d315cae9f346f1',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  prod: {
    edgeConfigId: '9f3cee2b-5f73-4bf3-9504-45b51e9a9961',
    pdfViewerClientId: '8a1d0707bf0f45af8af9f3bead0d213e',
    pdfViewerReportSuite: 'adbadobenonacdcprod,adbadobedxprod,adbadobeprototype',
  },
  locales,
  // geoRouting: 'on',
  prodDomains: ['www.adobe.com'],
  jarvis: {
    id: 'DocumentCloudWeb1',
    version: '1.0',
    onDemand: false,
  },
  htmlExclude: [
    /www\.adobe\.com\/(\w\w(_\w\w)?\/)?express(\/.*)?/,
    /www\.adobe\.com\/(\w\w(_\w\w)?\/)?go(\/.*)?/,
  ],
};

// Setting alternative Jarcis client ID for these paths
if (window.location.pathname.match('/sign/')
  || window.location.pathname.match('/documentcloud/')
  || window.location.pathname.match('/acrobat/business/')) {
  CONFIG.jarvis.id = 'DocumentCloudsignAcro';
};

// Default to loading the first image as eager.
(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.setAttribute('loading', 'eager');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */
const { ietf } = getLocale(locales);

(async function loadPage() {
  // Fast track the widget
  const widgetBlock = document.querySelector('[class*="dc-converter-widget"]');

  if (widgetBlock) {
    document.body.classList.add('dc-bc');
    document.querySelector('header').className = 'global-navigation has-breadcrumbs';
    const verb = widgetBlock.children[0].children[0]?.innerText?.trim();
    const blockName = widgetBlock.classList.value;
    widgetBlock.removeAttribute('class');
    widgetBlock.id = 'dc-converter-widget';
    const DC_GENERATE_CACHE_VERSION = document.querySelector('meta[name="dc-generate-cache-version"]')?.getAttribute('content');
    const INLINE_SNIPPET = document.querySelector('section#edge-snippet');
    const dcUrls = INLINE_SNIPPET ? [] : [
      `https://www.adobe.com/dc/dc-generate-cache/dc-hosted-${DC_GENERATE_CACHE_VERSION}/${verb}-${ietf.toLowerCase()}.html`,
    ];

    dcUrls.forEach((url) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      if (url.split('.').pop() === 'html') { link.setAttribute('as', 'fetch'); }
      if (url.split('.').pop() === 'js') { link.setAttribute('as', 'script'); }
      link.setAttribute('href', url);
      link.setAttribute('crossorigin', '');
      document.head.appendChild(link);
    });

    const { default: dcConverter } = await import(`../blocks/${blockName}/${blockName}.js`);
    await dcConverter(widgetBlock);
  }

  // Setup CSP
  (async () => {
    if (document.querySelector('meta[name="dc-widget-version"]')) {
      const { default: ContentSecurityPolicy } = await import('./contentSecurityPolicy/csp.js');
      ContentSecurityPolicy();
    }
  })();

  // Setup Milo
  const miloLibs = setLibs(LIBS);

  // Milo and site styles
  if (!document.getElementById('inline-milo-styles')) {
    const paths = [`${miloLibs}/styles/styles.css`];
    if (STYLES) { paths.push(STYLES); }
    loadStyles(paths);
  }

  // Import base milo features and run them
  const { loadArea, setConfig, loadLana, getMetadata } = await import(`${miloLibs}/utils/utils.js`);

  addLocale(ietf);

  if (getMetadata('commerce')) {
    const { default: replacePlaceholdersWithImages } = await import('./imageReplacer.js');
    replacePlaceholdersWithImages(ietf, miloLibs);
  }

  setConfig({ ...CONFIG, miloLibs });
  loadLana({ clientId: 'dxdc', tags: 'Cat=DC_Milo' });

  // get event back form dc web and then load area
  await loadArea(document, false);

  // Setup Logging
  const { default: lanaLogging } = await import('./dcLana.js');
  lanaLogging();

  // IMS Ready
  const imsReady = setInterval(() => {
    if (window.adobeIMS && window.adobeIMS.initialized) {
      clearInterval(imsReady);
      const imsIsReady = new CustomEvent('IMS:Ready');
      window.dispatchEvent(imsIsReady);
    }
  }, 1000);

  // DC Hosted Ready...
  const dcHostedReady = setInterval(() => {
    if (window.dc_hosted) {
      clearInterval(dcHostedReady);
      const imsIsReady = new CustomEvent('DC_Hosted:Ready');
      window.dispatchEvent(imsIsReady);
    }
  }, 1000);

  if (document.querySelectorAll('a[class*="geo-pn"]').length > 0 || document.querySelectorAll('a[href*="geo"]').length > 0) {
    const { default: geoPhoneNumber } = await import('./geo-phoneNumber.js');
    geoPhoneNumber();
  }
}());


