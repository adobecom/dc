/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay, waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);
import { getConfig, setConfig } from 'https://main--milo--adobecom.aem.live/libs/utils/utils.js';

const USER_AGENTS = {
  iPhone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
  Android:
    'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  iPad: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
  iPadPro:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/604.1',
};

describe('verb-widget block mobile tests', () => {
  let placeholders;
  let originalUserAgent;

  beforeEach(async () => {
    const placeholdersText = await readFile({ path: './mocks/placeholders.json' });
    placeholders = JSON.parse(placeholdersText);

    window.mph = {};
    placeholders.data.forEach((item) => {
      window.mph[item.key] = item.value;
    });
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    window.adobeIMS = { isSignedInUser: () => false };
    originalUserAgent = window.navigator.userAgent;
  });

  afterEach(() => {
    sinon.restore();
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    delete window.browser;
  });

  it('initializes correctly on iPhone with sign widget', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-sign-pdf.html' });

    Object.defineProperty(window.navigator, 'userAgent', {
      value: USER_AGENTS.iPhone,
      configurable: true,
    });
    window.browser = { ua: USER_AGENTS.iPhone };

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);

    expect(block).to.exist;
  });

  it('initializes correctly on Android with crop widget', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-crop-pdf.html' });

    Object.defineProperty(window.navigator, 'userAgent', {
      value: USER_AGENTS.Android,
      configurable: true,
    });
    window.browser = { ua: USER_AGENTS.Android };

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);

    expect(block).to.exist;
  });

  it('initializes correctly on iPad with compress widget', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-compress-pdf.html' });

    Object.defineProperty(window.navigator, 'userAgent', {
      value: USER_AGENTS.iPad,
      configurable: true,
    });
    window.browser = { ua: USER_AGENTS.iPad };

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);

    expect(block).to.exist;
  });

  it('initializes correctly on iPad Pro with crop widget', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-crop-pdf.html' });

    Object.defineProperty(window.navigator, 'userAgent', {
      value: USER_AGENTS.iPadPro,
      configurable: true,
    });
    window.browser = { ua: USER_AGENTS.iPadPro };
    document.ontouchend = () => {};

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);

    expect(block).to.exist;
  });
});
