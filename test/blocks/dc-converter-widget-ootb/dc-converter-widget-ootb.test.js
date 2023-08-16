import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body_cache.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/dc-converter-widget-ootb/dc-converter-widget-ootb'
);

describe('dc-converter-widget block', () => {
  before(() => {
    const block = document.body.querySelector('.dc-converter-widget-ootb');
    init(block);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('handles DC_Hosted:Ready event', async() => {
    window.dc_hosted = {
      getUserLimits: async () => ({
        upload: {
          can_upload: true
        }
      }),
    };
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    await delay(100);
    expect(window.doccloudPersonalization).to.be.exist;
  });

  it('handles IMS:Ready event', async () => {
    window.adobeIMS = {
      isSignedInUser: () => false,
    };
    window._satellite = {
      track: sinon.stub(),
    };
    window.bowser = {
      getParser: () => ({
        getBrowserName: () => 'Chrome',
        getBrowserVersion: () => '110',
      }),
    };
    const widget = await readFile({ path: './mocks/widget.html' });
    sinon.stub(window, 'fetch');
    var res = new window.Response(widget, {
      status: 200
    });
    window.fetch.returns(Promise.resolve(res));
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    await delay(1000);
    expect(document.querySelector('#CID')).to.be.exist;
  });

  it('handles Bowser:Ready event', () => {
    window.dispatchEvent(new CustomEvent('Bowser:Ready'));
  });
});
