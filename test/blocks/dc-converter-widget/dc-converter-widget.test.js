/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body_cache.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/dc-converter-widget/dc-converter-widget.js'
);

describe('dc-converter-widget block', () => {
  before(() => {
    const block = document.body.querySelector('.dc-converter-widget');
    init(block);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('handles DC_Hosted:Ready event', async () => {
    window.dc_hosted = {
      getUserLimits: async () => ({
        upload: {
          can_upload: true,
        },
      }),
    };
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    await delay(100);
    // exception in loaded adobe_dc_sdk scripts
    // expect(window.doccloudPersonalization).to.be.exist;
  });

  it('handles IMS:Ready event', async () => {
    window.adobeIMS = {
      isSignedInUser: () => false,
    };
    window._satellite = {
      track: sinon.stub(),
    };
    window.browser = {
      name: 'Chrome',
    };
    const widget = await readFile({ path: './mocks/widget.html' });
    sinon.stub(window, 'fetch');
    const res = new window.Response(widget, {
      status: 200,
    });
    window.fetch.returns(Promise.resolve(res));
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    await delay(1000);
    expect(document.querySelector('#CID')).to.be.exist;
  });

  it('no multiple inits', async () => {
    const block = document.body.querySelector('.dc-converter-widget');
    await init(block);
    const widgets = document.querySelectorAll('div[data-section="widget"]');
    expect(widgets.length).to.be.equal(1);
    const scripts = document.querySelectorAll('#adobe_dc_sdk_launcher');
    expect(scripts.length).to.be.equal(1);
  });
});
