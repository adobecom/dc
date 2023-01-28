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

import { setLibs } from './utils.js';
// import { redirectLegacyBrowsers } from './legacyBrowser.js';
import lanaLogging from './dcLana.js';
import ContentSecurityPolicy from './contentSecurityPolicy/csp.js';

ContentSecurityPolicy();

// CLS Scripts
const head = document.querySelector('head');
const clsPopIn = document.createElement('link');
clsPopIn.id = 'CLS_POPIN';
clsPopIn.setAttribute('rel', 'stylesheet');
clsPopIn.setAttribute('href', '/acrobat/styles/cls.css');
head.appendChild(clsPopIn);

// if there is a DC widget on the page check for legacy browser and redirect
// to EOL Browser page if needed.
if (document.querySelector('.dc-converter-widget')) {
  // redirectLegacyBrowsers();
}

// Add project-wide styles here.
const STYLES = '/acrobat/styles/styles.css';

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = 'https://milo.adobe.com/libs';

// Add any config options.
// window.adobeid = window.adobeid || {};
// window.adobeid.scope = 'AdobeID,openid,gnav,additional_info.optionalAgreements';
const CONFIG = {
  // onReady: () => {
  //   // DC Web IMS config
  //   if (window.adobe_dc_sdk) {
  //     let evt;
  //       evt = new CustomEvent('dc.imslib.ready', { detail: { instance: window.adobeIMS }});
  //       evt.initEvent('dc.imslib.ready', true, true);
  //       console.log('are u eorking');
  //     document.dispatchEvent(evt);
  //     window.adobe_dc_sdk.imsReady = true;
  //   }
  // },
  codeRoot: '/acrobat',
  contentRoot: '/acrobat',
  imsClientId: 'acrobatmilo',
  local: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  stage: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  live: { edgeConfigId: 'da46a629-be9b-40e5-8843-4b1ac848745c' },
  prod: { edgeConfigId: '9f3cee2b-5f73-4bf3-9504-45b51e9a9961' },
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
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

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  const { loadArea, loadDelayed, setConfig, loadLana } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  loadDelayed();
  loadLana({ clientId: 'dxdc' });
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
}());
