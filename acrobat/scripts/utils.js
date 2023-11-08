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

/**
 * Loads a CSS file.
 * @param {string} href URL to the CSS file
 */
async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @param {Document} doc Document object to query for metadata. Defaults to the window's document
 * @returns an array of HTMLElement nodes that match the given scope
 */
function getAllMetadata(scope, doc = document) {
  return [...doc.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
    .reduce((res, meta) => {
      const id = toClassName(meta.name
        ? meta.name.substring(scope.length + 1)
        : meta.getAttribute('property').split(':')[1]);
      res[id] = meta.getAttribute('content');
      return res;
    }, {});
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

/**
 * Sanitizes a string for use as a js property name.
 * @param {string} name The unsanitized string
 * @returns {string} The camelCased name
 */
function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

const pluginContext = {
  getAllMetadata,
  loadCSS,
  toCamelCase,
  toClassName,
};

export async function setExperimentsContext(codeBasePath, miloLibs) {
  const { getMetadata } = await import(`${miloLibs}/utils/utils.js`);
  const { sampleRUM } = await import(`${miloLibs}/utils/samplerum.js`);
  pluginContext.getMetadata = getMetadata;
  pluginContext.sampleRUM = sampleRUM;
  window.hlx.codeBasePath = codeBasePath;
  window.hlx.patchBlockConfig = [];
}

export async function runExperiments(config, miloLibs) {
  if (!pluginContext.getMetadata('experiment')
    && !Object.keys(getAllMetadata('campaign')).length
    && !Object.keys(getAllMetadata('audience')).length) {
    return;
  }
  // eslint-disable-next-line import/no-relative-packages
  const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
  await runEager(document, { ...config }, pluginContext);
  const { experiment } = window.hlx;
  if (!experiment) {
    return;
  }
  const { selectedVariant } = experiment;
  const control = experiment.variants[experiment.variantNames[0]];
  if (selectedVariant === experiment.variantNames[0] || !control?.blocks?.length) {
    return;
  }
  const { getConfig, updateConfig } = await import(`${miloLibs}/utils/utils.js`);
  const variant = experiment.variants[selectedVariant];
  updateConfig({
    ...getConfig(),
    expBlocks: control.blocks.reduce((res, block, i) => {
      res[block] = variant.blocks[i];
      return res;
    }, {}),
  });
}

export async function showExperimentsOverlay(config, miloLibs) {
  if (!pluginContext.getMetadata('experiment')
    && !Object.keys(getAllMetadata('campaign')).length
    && !Object.keys(getAllMetadata('audience')).length) {
    return;
  }
  // eslint-disable-next-line import/no-relative-packages
  const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
  return runLazy(document, { ...config }, pluginContext);
}
