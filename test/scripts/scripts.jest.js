/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */

import { delay } from '../helpers/waitfor.js';

const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      config = { ...conf };
      return config;
    },
    () => config,
  ];
})();

const mockSetConfig = jest.fn().mockImplementation(setConfig);

describe.skip('Test scripts', () => {
  beforeAll(() => {
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
    jest.mock('https://www.adobe.com/libs/utils/utils.js', () => ({
      loadArea: jest.fn(),
      loadScript: jest.fn(),
      loadLana: jest.fn(),
      getLocale: jest.fn().mockImplementation(() => ({ ietf: 'en-US' })),
      setConfig: mockSetConfig,
      getMetadata: jest.fn().mockReturnValue('123'),
      loadIms: jest.fn().mockImplementation(() => Promise.resolve()),
    }));
    jest.mock(
      'https://main--milo--adobecom.hlx.page/libs/utils/utils.js',
      () => ({
        loadArea: jest.fn(),
        loadScript: jest.fn(),
        loadLana: jest.fn(),
        getLocale: jest.fn().mockImplementation(() => ({ ietf: 'en-US' })),
        setConfig: mockSetConfig,
        getMetadata: jest.fn().mockReturnValue('123'),
        loadIms: jest.fn().mockImplementation(() => Promise.resolve()),
      }),
    );
    jest.mock('/libs/utils/utils.js', () => ({
      loadArea: jest.fn(),
      loadScript: jest.fn(),
      loadLana: jest.fn(),
      getLocale: jest.fn().mockImplementation(() => ({ ietf: 'en-US' })),
      setConfig: mockSetConfig,
      getMetadata: jest.fn().mockReturnValue('123'),
      loadIms: jest.fn().mockImplementation(() => Promise.resolve()),
    }));
    window.adobeIMS = {
      initialized: true,
      isSignedInUser: jest.fn().mockReturnValue(false),
    };
    window.browser = {
      name: 'Chrome',
      isMobile: false,
    };
    window._satellite = { track: jest.fn() };
    window.dc_hosted = { getUserLimits: jest.fn().mockImplementation(async () => ({})) };
    window.fetch = jest.fn().mockImplementation(async () => ({ status: 404 }));
  });

  beforeEach(() => {
    jest.resetModules();
    document.head.innerHTML = '<meta name="promotion" content="abc"/><meta name="dc-widget-version" content="123"/>';
    document.body.innerHTML = '<header><main><div class="dc-converter-widget"><div><div>pdf-to-image</div></div></div></main></header>';
  });

  describe('Test prod', () => {
    it('uses prod milolibs', async () => {
      delete window.location;
      window.location = new URL(
        'https://www.adobe.com/acrobate/online/ppt-to-pdf',
      );
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('/libs');
    });
  });

  describe('Test prod with milolibs', () => {
    it('uses prod libs, milolibs ignored', async () => {
      delete window.location;
      window.location = new URL(
        'https://www.adobe.com/acrobate/online/ppt-to-pdf?milolibs=main--milo--tsayadobe',
      );
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('/libs');
    });
  });

  describe('Test stage', () => {
    it('uses stage milolibs', async () => {
      delete window.location;
      window.location = new URL('https://www.stage.adobe.com/acrobat/online/ppt-to-pdf');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('https://www.stage.adobe.com/libs');
    });
  });

  describe('Test stage hostname with local branch', () => {
    it('uses localhost milolibs', async () => {
      delete window.location;
      window.location = new URL('https://www.stage.adobe.com/acrobat/online/ppt-to-pdf?milolibs=local');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('http://localhost:6456/libs');
    });
  });

  describe('Test live hostname with main branch', () => {
    it('uses hlx live libs', async () => {
      delete window.location;
      window.location = new URL('https://main--dc--adobecom.hlx.live/acrobat/online/word-to-pdf');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('https://main--milo--adobecom.hlx.live/libs');
    });
  });

  describe('Test live hostname with milo branch', () => {
    it('uses branch hlx live libs', async () => {
      delete window.location;
      window.location = new URL('https://main--dc--adobecom.hlx.live/acrobat/online/word-to-pdf?milolibs=main--milo--tsayadobe');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('https://main--milo--tsayadobe.hlx.live/libs');
    });
  });

  describe('Test page hostname with main branch', () => {
    it('uses hlx page libs', async () => {
      delete window.location;
      window.location = new URL('https://main--dc--adobecom.hlx.page/acrobat/online/word-to-pdf');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('https://main--milo--adobecom.hlx.page/libs');
    });
  });

  describe('Test page hostname with milo branch', () => {
    it('uses branch hlx page libs', async () => {
      delete window.location;
      window.location = new URL('https://main--dc--adobecom.hlx.page/acrobat/online/word-to-pdf?milolibs=main--milo--tsayadobe');
      await require('../../acrobat/scripts/scripts.js');
      await delay(100);
      const config = await getConfig();
      expect(config.miloLibs).toEqual('https://main--milo--tsayadobe.hlx.page/libs');
    });
  });
});
