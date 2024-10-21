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
        // eslint-disable-next-line compat/compat
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        if (branch === 'main' && hostname === 'www.stage.adobe.com') return '/libs';
        if (!(hostname.includes('.hlx.') || hostname.includes('local') || hostname.includes('stage'))) return prodLibs;
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.hlx.live/libs` : `https://${branch}--milo--adobecom.hlx.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

export function getEnv() {
  const prodHosts = ['www.adobe.com', 'sign.ing', 'edit.ing'];
  const stageHosts = [
    'stage--dc--adobecom.hlx.page', 'main--dc--adobecom.hlx.page',
    'stage--dc--adobecom.hlx.live', 'main--dc--adobecom.hlx.live',
    'www.stage.adobe.com',
  ];

  if (prodHosts.includes(window.location.hostname)) return 'prod';
  if (stageHosts.includes(window.location.hostname)) return 'stage';
  return 'dev';
}

export function isOldBrowser() {
  const { name, version } = window?.browser || {};
  return (
    name === 'Internet Explorer' || (name === 'Microsoft Edge' && (!version || version.split('.')[0] < 86)) || (name === 'Safari' && version.split('.')[0] < 14)
  );
}
