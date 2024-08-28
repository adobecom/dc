/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';

const { default: init } = await import(
  '../../../acrobat/blocks/dc-converter-widget/dc-converter-widget.js'
);

describe('dc-converter-widget block', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body_cache.html' });
    const block = document.body.querySelector('.dc-converter-widget');
    await init(block);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('handles an error in DC_Hosted:Ready', async () => {
    window.lana = { log: sinon.stub() };
    window.dc_hosted = {
      getUserLimits: async () => null,
    };
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    await delay(100);
    expect(window.lana.log.getCall(0).args[0]).to.eq('DC Widget failed. type=undefined name=TypeError message=Cannot read properties of null (reading \'upload\')');
  });
});
