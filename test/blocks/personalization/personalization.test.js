import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

let head = await readFile({ path: './mocks/head.html' });
let body = await readFile({ path: './mocks/body.html' });
await import('../../../acrobat/scripts/scripts');

describe('personalization block', () => {
  beforeEach(() => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('shows the default content', async () => {
    const { default: init } = await import(
      '../../../acrobat/blocks/personalization/personalization'
    );
    const block = document.querySelector('.personalization');
    init(block);
    const defaultBlock = await waitForElement(
      '.personalization div[data-tag="default"]'
    );
    expect(defaultBlock).to.be.exist;
  });

  it('shows default content with valid verb', async () => {
    window.doccloudPersonalization = {
      download: {
        can_download: true,
      },
      export_pdf: {
        can_process: true,
        has_processed: false,
        upload: {
          can_upload: true,
        },
      },
      isUpsellDisplayed: {
        export_pdf: false,
      },
    };
    const { default: init } = await import(
      '../../../acrobat/blocks/personalization/personalization'
    );
    const block = document.querySelector('.personalization');
    init(block);
    window.dispatchEvent(new CustomEvent('Personalization:Ready'));
    const defaultBlock = await waitForElement(
      '.personalization div[data-tag="default"]'
    );
    const secondConvBlock = document.querySelector(
      '.personalization div[data-tag="2nd conversion"]'
    );
    const clsPopin = document.querySelector('#CLS_POPIN');
    expect(defaultBlock).to.be.exist;
    expect(secondConvBlock).to.be.not.exist;
    expect(clsPopin).to.be.exist;
  });

  it('shows content as organize_pdf with unknown verb', async () => {
    window.doccloudPersonalization = {
      download: {
        can_download: true,
      },
      organize_pdf: {
        can_process: true,
        has_processed: false,
        upload: {
          can_upload: true,
        },
      },
      isUpsellDisplayed: {
        l1Verbs: false,
      },
    };
    const { default: init } = await import(
      '../../../acrobat/blocks/personalization/personalization'
    );
    document.querySelector('#adobe_dc_sdk_launcher').dataset.verb =
      'unknown-verb';
    const block = document.querySelector('.personalization');
    init(block);
    window.dispatchEvent(new CustomEvent('Personalization:Ready'));
    const defaultBlock = await waitForElement(
      '.personalization div[data-tag="default"]'
    );
    const secondConvBlock = document.querySelector(
      '.personalization div[data-tag="2nd conversion"]'
    );
    expect(defaultBlock).to.be.exist;
    expect(secondConvBlock).to.be.not.exist;
  });

  it('shows second conversion content', async () => {
    window.doccloudPersonalization = {
      download: {
        can_download: false,
      },
      export_pdf: {
        can_process: true,
        has_processed: true,
        upload: {
          can_upload: false,
        },
      },
      isUpsellDisplayed: {
        export_pdf: true,
      },
    };
    const { default: init } = await import(
      '../../../acrobat/blocks/personalization/personalization'
    );
    const block = document.querySelector('.personalization');
    init(block);
    window.dispatchEvent(new CustomEvent('Personalization:Ready'));
    const defaultBlock = await waitForElement(
      '.personalization div[data-tag="default"]'
    );
    const secondConvBlock = await waitForElement(
      '.personalization div[data-tag="2nd conversion"]'
    );
    const clsPopin = document.querySelector('#CLS_POPIN');
    expect(defaultBlock).to.be.exist;
    expect(secondConvBlock).to.be.exist;
    expect(clsPopin).to.be.exist;
  });

  it('shows upsell content', async () => {
    window.doccloudPersonalization = {
      download: {
        can_download: false,
      },
      export_pdf: {
        can_process: false,
        has_processed: true,
        upload: {
          can_upload: false,
        },
      },
      isUpsellDisplayed: {
        export_pdf: true,
      },
    };
    const { default: init } = await import(
      '../../../acrobat/blocks/personalization/personalization'
    );
    const block = document.querySelector('.personalization');
    init(block);
    window.dispatchEvent(new CustomEvent('Personalization:Ready'));
    const defaultBlock = await waitForElement(
      '.personalization div[data-tag="default"]'
    );
    const secondConvBlock = document.querySelector(
      '.personalization div[data-tag="2nd conversion"]'
    );
    const upsellBlock = await waitForElement(
        '.personalization div[data-tag="upsell"]'
      );    
    const clsPopin = document.querySelector('#CLS_POPIN');
    expect(defaultBlock).to.be.exist;
    expect(secondConvBlock).to.be.exist;
    expect(upsellBlock).to.be.exist;
    expect(clsPopin).to.be.not.exist;
  });
});
