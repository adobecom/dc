/**
 * @jest-environment jsdom
 */
import ContentSecurityPolicy from '../../../acrobat/scripts/contentSecurityPolicy/csp';

describe('Test ContentSecurityPolicy', () => {
  let hostnameGetter;
  let url;

  beforeEach(async () => {
    delete window.location;
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  test('ContentSecurityPolicy for www.adobe.com', async () => {
    window.location = new URL('https://www.adobe.com/acrobat/online/test');
    await ContentSecurityPolicy();
    const meta = document.querySelector('head meta');
    expect(meta.hasAttribute('http-equiv')).toBe(true);
    expect(meta.hasAttribute('content')).toBe(true);
    expect(meta.getAttribute('http-equiv')).toBe('Content-Security-Policy');
  });

  test.each`
    hostname
    ${'www.stage.adobe.com'}
    ${'main--dc--adobecom.hlx.page'}
    ${'main--dc--adobecom.hlx.live'}
    ${'stage--dc--adobecom.hlx.page'}
  `('ContentSecurityPolicy for stage', async ({ hostname }) => {
    window.location = new URL(`https://${hostname}/acrobat/online/test`);
    await ContentSecurityPolicy();
    const meta = document.querySelector('head meta');
    expect(meta.hasAttribute('http-equiv')).toBe(true);
    expect(meta.hasAttribute('content')).toBe(true);
    expect(meta.getAttribute('http-equiv')).toBe('Content-Security-Policy');
  });

  test('ContentSecurityPolicy for localhost', async () => {
    window.location = new URL('https://localhost:2000/acrobat/online/test');
    await ContentSecurityPolicy();
    const meta = document.querySelector('head meta');
    expect(meta.hasAttribute('http-equiv')).toBe(true);
    expect(meta.hasAttribute('content')).toBe(true);
    expect(meta.getAttribute('http-equiv')).toBe('Content-Security-Policy');
  });
});
