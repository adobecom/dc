/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
//import init from '../../../acrobat/blocks/dc-converter-widget-ootb/dc-converter-widget-ootb';

describe.skip('dc-converter-widget', () => {
  beforeEach(async () => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body.html'),
      'utf8'
    );
    window.performance.mark = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads widget from prod env', async () => {
    let fetchUrl = '';
    window.fetch = jest.fn((url) => {
      fetchUrl = url;
      return Promise.resolve({
        status: 200,
        text: () =>
          Promise.resolve(
            fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))
          ),
      });
    });
    delete window.location;
    window.location = new URL('https://www.adobe.com');
    const block = document.querySelector('.dc-converter-widget-ootb');
    const widget = await init(block);
    document.dispatchEvent(new Event('milo:deferred'));
    const launcher = document.querySelector('#adobe_dc_sdk_launcher');
    expect(launcher.getAttribute('src')).toMatch(/^https:\/\/acrobat.adobe.com\//);
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
        text: () =>
          Promise.resolve(
            fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))
          ),
      });
    });
    delete window.location;
    window.location = new URL(`https://${hostname}`);
    const block = document.querySelector('.dc-converter-widget-ootb');
    const widget = await init(block);
    document.dispatchEvent(new Event('milo:deferred'));
    const launcher = document.querySelector('#adobe_dc_sdk_launcher');
    expect(launcher.getAttribute('src')).toMatch(/^https:\/\/stage.acrobat.adobe.com\//);   
  });

  it('loads widget failed from prod env', async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        status: 404,
      })
    );
    delete window.location;
    window.location = new URL('https://www.adobe.com');
    const block = document.querySelector('.dc-converter-widget-ootb');
    const widget = await init(block);
    expect(document.querySelector('#CID').children).toHaveLength(3);
  });

  it.each`
    hostname
    ${'stage--dc--adobecom.hlx.page'}
    ${'main--dc--adobecom.hlx.page'}
    ${'stage--dc--adobecom.hlx.live'}
    ${'www.stage.adobe.com'}
  `('redirects when signed in on stage', async ({ hostname }) => {
    window.fetch = jest.fn((url) =>
      Promise.resolve({
        status: 200,
        text: () =>
          Promise.resolve(
            fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))
          ),
      })
    );
    window.adobeIMS = {
      isSignedInUser: jest.fn(() => true)
    };
    delete window.location;
    window.location = new URL(`https://${hostname}`);
    const block = document.querySelector('.dc-converter-widget-ootb');
    const widget = await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    expect(window.location).toMatch(/^https:\/\/www.adobe.com\/go\/acrobat-/);
  });

  it.each`
    hostname
    ${'main--dc--adobecom.hlx.live'}
    ${'www.adobe.com'}
  `('redirects when signed in', async ({ hostname }) => {
    window.fetch = jest.fn((url) =>
      Promise.resolve({
        status: 200,
        text: () =>
          Promise.resolve(
            fs.readFileSync(path.resolve(__dirname, './mocks/widget.html'))
          ),
      })
    );
    window.adobeIMS = {
      isSignedInUser: jest.fn(() => true)
    };
    delete window.location;
    window.location = new URL(`https://${hostname}`);
    const block = document.querySelector('.dc-converter-widget-ootb');
    const widget = await init(block);
    window.dispatchEvent(new CustomEvent('IMS:Ready'));
    // Issue with jest and window.location
    //expect(window.location).toMatch(/https:\/\/www.adobe.com\/go\/testredirect/);
  });
});
