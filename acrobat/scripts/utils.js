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

const miloLibs = setLibs('/libs');
const { loadStyle } = await import(`${miloLibs}/utils/utils.js`);
export { loadStyle };
