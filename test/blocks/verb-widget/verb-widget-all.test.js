/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);
import { getConfig, setConfig } from 'https://main--milo--adobecom.aem.live/libs/utils/utils.js';

const verbs = [
  'pdf-to-word',
  'pdf-to-jpg',
  'pdf-to-excel',
  'pdf-to-ppt',
  'convert-pdf',
  'word-to-pdf',
  'jpg-to-pdf',
  'png-to-pdf',
  'excel-to-pdf',
  'ppt-to-pdf',
  'ocr-pdf',
  'compress-pdf',
  'pdf-editor',
  'merge-pdf',
  'split-pdf',
  'crop-pdf',
  'delete-pdf-pages',
  'rotate-pdf',
  'rearrange-pdf',
  'extract-pdf-pages',
  'add-pages-to-pdf',
  'add-pdf-page-numbers',
  'sign-pdf',
  'request-signature',
  'password-protect-pdf',
  'ai-chat-pdf',
  'study-with-acrobat',
];

describe('verb-widget block', () => {
  let placeholders;

  beforeEach(async () => {
    const placeholdersText = await readFile({ path: './mocks/placeholders.json' });
    placeholders = JSON.parse(placeholdersText);

    window.mph = {};
    placeholders.data.forEach((item) => {
      window.mph[item.key] = item.value;
    });

    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    window.adobeIMS = { isSignedInUser: () => false };
  });

  afterEach(() => {
    sinon.restore();
  });

  verbs.forEach((verb) => {
    it(`init verb-widget for ${verb}`, async () => {
      const conf = getConfig();
      setConfig({ ...conf, locale: { prefix: '' } });
      document.body.innerHTML = await readFile({ path: `./mocks/body-${verb}.html` });
      const block = document.body.querySelector('.verb-widget');
      await init(block);
      expect(document.querySelector('.verb-widget .acrobat-icon svg')).to.exist;
      expect(document.querySelector('.verb-widget .verb-image svg')).to.exist;
      expect(document.querySelector('.verb-widget .security-icon svg')).to.exist;
      expect(document.querySelector('.verb-widget .info-icon svg')).to.exist;
    });
  });
});
