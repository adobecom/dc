/* eslint-disable no-unused-vars */
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
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

/*
  import rules
*/

import createConverterWidgetBlock from './rules/dcConverterWidget.js';
import createBreadcrumbsBlocks from './rules/breadcrumbs.js';
import createVerbFooter from './rules/verbFooter.js';
import createReviewBlocks from './rules/review.js';
import createMetadata from './rules/metaData.js';


export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    document,
    url,
    html,
    params,
  }) => {
    const main = document.body;

    // main.querySelectorAll('s').forEach((s) => {
    //   const span = document.createElement('span');
    //   span.innerHTML = s.innerHTML;
    //   s.replaceWith(span);
    // });

    /*
      blocks
    */
    createBreadcrumbsBlocks(main, document);
    createConverterWidgetBlock(main, document, url);
    createReviewBlocks(main, document);
    createVerbFooter(main, document);
    createMetadata(main, document);
    /*
      clean
    */

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      '.globalnavfooter',
      '.globalnavheader',
      '.modalContainer',
      'header',
      'footer',
      '.language-Navigation',
      '#onetrust-consent-sdk',
      // [Docx issue] : Image files having convertToBlob issue while converting to png.
      'img[src="/content/dam/cc/us/en/creative-cloud/cc_express_appicon_256.svg"]',
      'img[src="/content/dam/cc/one-console/icons_rebrand/adobeexpress.svg"]',
      'img[src="/content/dam/cct/creativecloud/business/teams/mnemonics/cc-express.svg"]',
      'img[src="/content/dam/shared/images/product-icons/svg/cc-express.svg"]',
    ]);

    return main;
  },
};
