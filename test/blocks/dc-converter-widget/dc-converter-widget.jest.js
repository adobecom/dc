/**
 * @jest-environment jsdom
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';
import init from '../../../acrobat/blocks/dc-converter-widget/dc-converter-widget.js';

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
    window.performance.mark = jest.fn();
    window._satellite = { track: jest.fn() };
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

  it('loads widget from prod env', async () => {
    let fetchUrl = '';
    window.fetch = jest.fn((url) => {
      fetchUrl = url;
      return Promise.resolve({
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      });
    });
    window.adobeIMS = { isSignedInUser: jest.fn(() => false) };
    window.dc_hosted = { getUserLimits: async () => ({ upload: { can_upload: true } }) };
    delete window.location;
    window.location = new URL('https://www.adobe.com/acrobat/online/pdf-to-ppt.html');
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    expect(fetchUrl).toMatch(/^https:\/\/www.adobe.com\/dc\//);
  });

  it('handles content inserted from edge', async () => {
    delete window.location;
    window.location = new URL('https://www.adobe.com');
    const block = document.querySelector('.dc-converter-widget');
    const section = document.createElement('section');
    section.id = 'edge-snippet';
    section.appendChild(document.createTextNode('content'));
    block.appendChild(section);
    await init(block);
    expect(document.querySelector('#CID').dataset.rendered).toEqual('true');
  });

  it.each`
    hostname
    ${'stage--dc--adobecom.hlx.page'}
    ${'main--dc--adobecom.hlx.page'}
    ${'stage--dc--adobecom.hlx.live'}
    ${'main--dc--adobecom.hlx.live'}
    ${'www.stage.adobe.com'}
  `('loads widget from stage env', async ({ hostname }) => {
    let fetchUrl = '';
    window.fetch = jest.fn((url) => {
      fetchUrl = url;
      return Promise.resolve({
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      });
    });
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/pdf-to-ppt.html`);
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    expect(fetchUrl).toMatch(/^https:\/\/www.stage.adobe.com\/dc\//);
  });

  it('loads widget failed from prod env', async () => {
    window.fetch = jest.fn(() => Promise.resolve({ status: 404 }));
    delete window.location;
    window.location = new URL('https://www.adobe.com/acrobat/online/pdf-to-ppt.html');
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    expect(document.querySelector('#CID').children).toHaveLength(0);
  });

  it.each`
    hostname
    ${'stage--dc--adobecom.hlx.page'}
    ${'main--dc--adobecom.hlx.page'}
    ${'stage--dc--adobecom.hlx.live'}
    ${'www.stage.adobe.com'}
    ${'main--dc--adobecom.hlx.live'}
  `('redirects when signed in on stage', async ({ hostname }) => {
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      },
    ));
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/pdf-to-ppt.html`);
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location).toBe('https://www.adobe.com/go/acrobat-pdftoppt-stage');
  });

  it.each`
    hostname
    ${'www.adobe.com'}
  `('redirects when signed in', async ({ hostname }) => {
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      },
    ));
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/pdf-to-ppt.html`);
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location).toBe('https://www.adobe.com/go/acrobat-pdftoppt');
  });

  it.each`
    hostname
    ${'www.adobe.com'}
  `('redirects when signed in - redirect link in block', async ({ hostname }) => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body_redirect.html'),
      'utf8',
    );
    window.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      },
    ));
    window.adobeIMS = { isSignedInUser: jest.fn(() => true) };
    delete window.location;
    window.location = new URL(`https://${hostname}/acrobat/online/pdf-to-ppt.html`);
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location).toBe('https://www.adobe.com/go/testredirect');
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
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      },
    ));
    window.browser = { name, version };
    delete window.location;
    window.location = new URL('https://www.adobe.com/acrobat/online/pdf-to-ppt.html');
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    expect(window.location.href).toBe('https://acrobat.adobe.com/home/index-browser-eol.html');
  });

  it('generate cache URL', async () => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body_gen_cache.html'),
      'utf8',
    );
    let fetchUrl = '';
    window.fetch = jest.fn((url) => {
      fetchUrl = url;
      return Promise.resolve({
        status: 200,
        text: () => Promise.resolve(fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))),
      });
    });
    delete window.location;
    window.location = new URL('https://www.adobe.com/acrobat/online/pdf-to-ppt.html');
    const block = document.querySelector('.dc-converter-widget');
    await init(block);
    expect(fetchUrl).toBe('https://www.adobe.com/generate_cache_url');
  });
});
