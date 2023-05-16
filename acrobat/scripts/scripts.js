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

/**
 * The decision engine for where to get Milo's libs from.
 */
const setLibs = (prodLibs, location) => {
  const { hostname, search } = location || window.location;
  const branch = new URLSearchParams(search).get('milolibs') || 'main';
  if (branch === 'main' && hostname === 'www.stage.adobe.com') return 'https://www.adobe.com/libs';
  if (!(hostname.includes('.hlx.') || hostname.includes('local') || hostname.includes('stage'))) return prodLibs;
  if (branch === 'local') return 'http://localhost:6456/libs';
  return branch.includes('--') ? `https://${branch}.hlx.page/libs` : `https://${branch}--milo--adobecom.hlx.page/libs`;
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
  ro: { ietf: 'ro-RO', tk: 'aaz7dvd.css' },
  sa_en: { ietf: 'en', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css' },
  si: { ietf: 'sl-SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'sk-SK', tk: 'aaz7dvd.css' },
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
  il_he: { ietf: 'he', tk: 'nwq1mna.css' },
  ae_ar: { ietf: 'ar', tk: 'nwq1mna.css' },
  mena_ar: { ietf: 'ar', tk: 'dis2dpj.css' },
  sa_ar: { ietf: 'ar', tk: 'nwq1mna.css' },
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
  eg_ar: { ietf: 'ar', tk: 'nwq1mna.css' }, // Egypt (Arabic)
  kw_ar: { ietf: 'ar', tk: 'nwq1mna.css' }, // Kuwait (Arabic)
  qa_ar: { ietf: 'ar', tk: 'nwq1mna.css' }, // Quatar (Arabic)
  eg_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Egypt (GB English)
  kw_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Kuwait (GB English)
  qa_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Qatar (GB English)
  gr_el: { ietf: 'el', tk: 'fnx0rsr.css' }, // Greece (Greek)
};

// Add any config options.
const CONFIG = {
  codeRoot: '/acrobat',
  contentRoot: '/dc-shared',
  imsClientId: 'acrobatmilo',
  local: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  stage: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  live: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  prod: { edgeConfigId: '9f3cee2b-5f73-4bf3-9504-45b51e9a9961' },
  locales,
  // geoRouting: 'on',
  prodDomains: ['www.adobe.com'],
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

(async function loadPage() {
  // Fast track the widget
  (async () => {
    const widgetBlock = document.querySelector('.dc-converter-widget');
    if (widgetBlock) {
      widgetBlock.removeAttribute('class');
      widgetBlock.id = 'dc-converter-widget';
      const { default: dcConverter } = await import('../blocks/dc-converter-widget/dc-converter-widget.js');
      dcConverter(widgetBlock);
    }
  })();

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
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  loadStyles(paths);

  // Import base milo features and run them
  const {
    loadArea, loadDelayed, loadScript, setConfig, loadLana, getMetadata, getLocale
  } = await import(`${miloLibs}/utils/utils.js`);
  const { ietf } = getLocale(locales);
  addLocale(ietf);
  setConfig({ ...CONFIG, miloLibs });
  loadLana({ clientId: 'dxdc' });
  await loadArea();

  // Promotion from metadata (for FedPub)
  const promotionMetadata = getMetadata('promotion');
  if (promotionMetadata && !document.querySelector('main .promotion')) {
    const { promotionFromMetadata } = await import('../blocks/promotion/promotion.js');
    promotionFromMetadata(promotionMetadata);
  }

  loadDelayed();

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

  loadScript('/acrobat/scripts/bowser.js');
}());

// Bowser Ready
const bowserReady = setInterval(() => {
  if (window.bowser) {
    clearInterval(bowserReady);
    const bowserIsReady = new CustomEvent('Bowser:Ready');
    window.dispatchEvent(bowserIsReady);
  }
}, 100);
