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
  const tld = hostname.includes('live') ? 'live' : 'page';
  return branch.includes('--') ? `https://${branch}.hlx.${tld}/libs` : `https://${branch}--milo--adobecom.hlx.${tld}/libs`;
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

// Add any config options.
const CONFIG = {
  codeRoot: '/acrobat',
  contentRoot: '/dc-shared',
  imsClientId: 'acrobatmilo',
  local: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  stage: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  live: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  prod: { edgeConfigId: '9f3cee2b-5f73-4bf3-9504-45b51e9a9961' },
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
  const { locales } = await import(`${miloLibs}/scripts/scripts.js`);
  const {
    loadArea, loadDelayed, loadScript, setConfig, loadLana, getMetadata, getLocale
  } = await import(`${miloLibs}/utils/utils.js`);
  const { ietf } = getLocale(locales);
  addLocale(ietf);
  setConfig({ ...CONFIG, locales, miloLibs });
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
