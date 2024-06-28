/**
 * @jest-environment jsdom
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';
import init from '../../../acrobat/blocks/mobile-widget/mobile-widget.js';

describe('dc-converter-widget', () => {
  const sideEffects = {
    document: {
      addEventListener: {
        fn: document.addEventListener,
        refs: [],
      },
      keys: Object.keys(document),
    },
    window: {
      addEventListener: {
        fn: window.addEventListener,
        refs: [],
      },
      keys: Object.keys(window),
    },
  };
  beforeEach(async () => {
    ['document', 'window'].forEach((obj) => {
      const { fn } = sideEffects[obj].addEventListener;
      const { refs } = sideEffects[obj].addEventListener;
      function addEventListenerSpy(type, listener, options) {
        refs.push({ type, listener, options });
        fn(type, listener, options);
      }
      sideEffects[obj].keys.push('addEventListener');
      global[obj].addEventListener = addEventListenerSpy;
    });
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body.html'),
      'utf8',
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    const rootElm = document.documentElement;

    [...rootElm.attributes].forEach((attr) => rootElm.removeAttribute(attr.name));

    while (rootElm.firstChild) {
      rootElm.removeChild(rootElm.firstChild);
    }

    ['document', 'window'].forEach((obj) => {
      const { refs } = sideEffects[obj].addEventListener;
      while (refs.length) {
        const { type, listener, options } = refs.pop();
        global[obj].removeEventListener(type, listener, options);
      }
      Object.keys(global[obj])
        .filter((key) => !sideEffects[obj].keys.includes(key))
        .forEach((key) => {
          delete global[obj][key];
        });
    });

    // Restore base elements
    rootElm.innerHTML = '<head></head><body></body>';
  });

  it.each`
    name                   | version
    ${'Internet Explorer'} | ${'10.0.0.0'}
    ${'Microsoft Edge'}    | ${'85.0.0.0'}
    ${'Safari'}            | ${'13.0.0'}
  `('redirects an EOL browser', async ({ name, version }) => {
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/body.html'))),
      },
    ));
    window.browser = { name, version };
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL('https://www.adobe.com/acrobat/online/sign-pdf.html');
    const block = document.querySelector('.mobile-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location.href).toBe('https://acrobat.adobe.com/home/index-browser-eol.html');
  });

  it.each`
    hostname
    ${'stage--dc--adobecom.hlx.page'}
    ${'main--dc--adobecom.hlx.page'}
    ${'stage--dc--adobecom.hlx.live'}
    ${'www.stage.adobe.com'}
    ${'main--dc--adobecom.hlx.live'}
  `('redirects when signed in on stage', async ({ hostname }) => {
    window.browser = {
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      isMobile: true,
      name: 'Safari',
      version: '16.6',
    };
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/mobile.html'))),
      },
    ));
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/sign-pdf.html`);
    const block = document.querySelector('.mobile-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location.href).toBe('https://www.adobe.com/go/acrobat-fillsign-stage');
  });
  it.each`
    hostname
    ${'www.adobe.com'}
  `('redirects when signed in', async ({ hostname }) => {
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/body.html'))),
      },
    ));
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/sign-pdf.html`);
    const block = document.querySelector('.mobile-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location.href).toBe('https://www.adobe.com/go/acrobat-fillsign');
  });
});
