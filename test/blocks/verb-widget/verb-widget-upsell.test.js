/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);
import { getConfig, setConfig } from 'https://main--milo--adobecom.aem.live/libs/utils/utils.js';

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
    document.body.innerHTML = await readFile({ path: './mocks/body-compress-pdf.html' });
    window.adobeid = { client_id: 'acrobatmilo' };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('show upsell', async () => {
    document.cookie = 's_ta_cm_p_ops=1';
    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' }, codeRoot: '/acrobat' });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    expect(document.querySelector('.verb-widget .verb-upsell-heading')).to.exist;
    expect(document.querySelector('.verb-widget .verb-upsell-bullets')).to.exist;
    expect(document.querySelector('.verb-widget susi-sentry-light')).to.exist;
  });
});
