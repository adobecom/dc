/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);
import { getConfig, setConfig } from 'https://main--milo--adobecom.aem.live/libs/utils/utils.js';

describe('verb-widget block', () => {
  let xhr;
  let placeholders;

  beforeEach(async () => {
    sinon.stub(window, 'fetch');
    window.fetch.callsFake((x) => {
      if (x.endsWith('/acrobat/blocks/verb-widget/icons/fillsign.svg')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        });
      }
      return window.fetch.wrappedMethod.call(window, x);
    });
    xhr = sinon.useFakeXMLHttpRequest();

    window.lana = {
      log: sinon.stub(),
    }
    const placeholdersText = await readFile({ path: './mocks/placeholders.json' });
    placeholders = JSON.parse(placeholdersText);

    window.mph = {};
    placeholders.data.forEach((item) => {
      window.mph[item.key] = item.value;
    });

    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-sign-pdf.html' });
    window.adobeid = { client_id: 'acrobatmilo' };
  });

  afterEach(() => {
    xhr.restore();
    sinon.restore();
  });

  it('log lana for no svg', async () => {
    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' }, codeRoot: '/acrobat' });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    expect(window.lana.log.calledOnce).to.be.true;
  });
});
