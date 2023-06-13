/**
 * @jest-environment jsdom
 */
import { redirectLegacyBrowsers } from '../../acrobat/scripts/legacyBrowser';

describe('Test redirect for legacy browsers', () => {
  let userAgentGetter;

  beforeEach(async () => {
    window.bowser = await require('../../acrobat/scripts/bowser.js');
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('legacy browsers', async () => {
    userAgentGetter.mockReturnValue('curl/7.54.0');
    redirectLegacyBrowsers();
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it.each`
    userAgent
    ${'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko'}
    ${'Mozilla/5.0 (Windows NT 6.2; Trident/7.0; rv:11.0) like Gecko'}
    ${'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'}
    ${'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)'}
    ${'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4170.0 Safari/537.36 Edg/85.0.552.2'}
    ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.3.16'}
  `('legacy browsers', async ({userAgent}) => {
    userAgentGetter.mockReturnValue(userAgent);
    redirectLegacyBrowsers();
    expect(window.location.assign).toHaveBeenCalledWith(
      'https://acrobat.adobe.com/home/index-browser-eol.html'
    );
  });

  it.each`
    userAgent
    ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'}
    ${'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62'}
    ${'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36 Edg/86.0.622.48'}
    ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15'}
    ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) LoiLoNote/7.0.1 Version/14.6 Safari/605.1.15'}
    ${'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'}
    ${'Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'}
    ${'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 OPR/97.0.4719.17'}
    ${'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/113.0'}
  `('modern browsers', async ({userAgent}) => {
    userAgentGetter.mockReturnValue(userAgent);
    window.bowser = await require('../../acrobat/scripts/bowser.js');
    redirectLegacyBrowsers();
    expect(window.location.assign).not.toHaveBeenCalled();
  });  
});
