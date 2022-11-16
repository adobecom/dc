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

export const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';

/* Check if browser version is compatible with DC Widget */
export function browserDetection() {
  // Uses Bowser Library (https://lancedikson.github.io/bowser/docs/Parser.html)
  const parser  = bowser.getParser(window.navigator.userAgent);
  const browserName = parser.getBrowserName();
  const version = parser.getBrowserVersion();

  if (!browserName) return null;
  let majorVersion = null;
  if (version) {
      const versionElements = version.split('.');
      if (versionElements.length >= 1) {
          majorVersion = parseInt(versionElements[0], 10);
      }
  }
  if (/Internet Explorer/i.test(browserName)) return 'IE';
  if (/Microsoft Edge/i.test(browserName)) {
      // if we cannot determine major version, we should not redirect to be on the safe side
      if (!majorVersion || majorVersion >= 79) {
          return 'EDGE-CHROMIUM';
      }
      return 'EDGE-LEGACY';
  }
  if (/Chrome/i.test(browserName)) return 'CHROME';
  if (/Firefox/i.test(browserName)) return 'FF';
  if (/Safari/i.test(browserName)) {
      // if we cannot determine major version, we should not redirect to be on the safe side
      return (!majorVersion || majorVersion >= 13) ? 'SAFARI' : 'SAFARI-LEGACY';
  }
  return null;
}

/*
Redirects to EOL Browser page if browser conditions are not met.
 */
export function redirectLegacyBrowsers() {
  const browserType = browserDetection();
  if (browserType === 'IE' || browserType === 'EDGE-LEGACY' || browserType === 'SAFARI-LEGACY' ) {
    window.location.assign(EOLBrowserPage);
  }
}

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs) => {
      const { hostname } = window.location;
      if (!hostname.includes('hlx.page')
        && !hostname.includes('hlx.live')
        && !hostname.includes('localhost')) {
        libs = prodLibs;
        return libs;
      }
      const branch = new URLSearchParams(window.location.search).get('milolibs') || 'main';
      if (branch === 'local') return 'http://localhost:6456/libs';
      if (branch.indexOf('--') > -1) return `https://${branch}.hlx.page/libs`;
      return `https://${branch}--milo--adobecom.hlx.page/libs`;
    }, () => libs,
  ];
})();