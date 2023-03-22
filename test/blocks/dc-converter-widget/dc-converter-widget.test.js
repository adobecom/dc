import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/dc-converter-widget/dc-converter-widget'
);

describe('dc-converter-widget block', () => {
  before(() => {
    const block = document.body.querySelector('.dc-converter-widget');
    init(block);
  });

  it('shoud creates a DC converter widget block', async function () {
    this.timeout(5000); // default 2000ms
    const button = await waitForElement('#lifecycle-nativebutton');
    expect(document.querySelector('#lifecycle-drop-zone')).to.be.exist;
    expect(document.querySelector('#lifecycle-nativebutton')).to.be.exist;
  });

  it('should handle DC_Hosted:Ready event', () => {
    window.dc_hosted = {
      getUserLimits: async () => {
        upload: {
          can_upload: true;
        }
      },
    };
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
  });
});
