/* eslint-env mocha */
/* eslint-disable no-unused-vars */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../../acrobat/scripts/utils.js';

const miloLibs = setLibs('/libs');
const { setConfig } = await import(`${miloLibs}/utils/utils.js`);

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Susi-light', async () => {
  before(async () => {
    setConfig({ origin: '', locale: { ietf: 'en-us' } });
    window.adobeid = { client_id: 'test', redirect_uri: 'https://www.adobe.com' };
    const block = document.querySelector('.susi-light');
    const { default: init } = await import(
      '../../../acrobat/blocks/susi-light/susi-light.js'
    );
    init(block);
  });

  it('Susi-light gets decorated', () => {
    const block = document.querySelector('.susi-light');
    expect(block).to.exist;
  });
});
