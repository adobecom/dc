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
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        if (branch === 'main' && hostname === 'www.stage.adobe.com') return 'https://www.adobe.com/libs';
        if (!(hostname.includes('.hlx.') || hostname.includes('local') || hostname.includes('stage'))) return prodLibs;
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.hlx.page/libs` : `https://${branch}--milo--adobecom.hlx.page/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

export const getBrowserData = () => {
  const userAgent = navigator.userAgent;
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
        const versionElements = browser.version.split('.');
        browser.majorVersion = parseInt(versionElements[0], 10);
      }
      return browser;
    }
  }
  return browser;
}
