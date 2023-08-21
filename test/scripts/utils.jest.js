/**
 * @jest-environment jsdom
 */
import { expect } from 'chai';
import { setLibs, getLibs, getBrowserData } from '../../acrobat/scripts/utils';

describe('Test utils.js', () => {
  it('tests setLibs', async () => {
    const libs = setLibs('/libs');
    expect(libs).to.be.equal('https://main--milo--adobecom.hlx.page/libs');
  });

  it('tests setLibs for prod', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.adobe.com'
    );    
    const libs = setLibs('/libs');
    expect(libs).to.be.equal('/libs');
    expect(getLibs()).to.be.equal('/libs');
  });

  it('tests setLibs for stage', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com'
    );    
    const libs = setLibs('/libs');
    expect(libs).to.be.equal('https://www.adobe.com/libs');
  });  

  it('tests setLibs for milolibs local', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com?milolibs=local'
    );    
    const libs = setLibs('/libs');
    expect(libs).to.be.equal('http://localhost:6456/libs');
  });

  it('tests setLibs for milolibs repo', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com?milolibs=main--milo--tsayadobe'
    );    
    const libs = setLibs('/libs');
    expect(libs).to.be.equal('https://main--milo--tsayadobe.hlx.page/libs');
  });   

  describe('tests getBrowserData', () => {
    let userAgentGetter;
    beforeEach(() => {
      userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    });

    it('Chrome', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
      userAgentGetter.mockReturnValue(userAgent);

      const {name, version, majorVersion, isMobile } = getBrowserData();
      expect(name).to.be.equal('Chrome');
      expect(version).to.be.equal('111.0.0.0');
      expect(majorVersion).to.be.equal(111);
      expect(isMobile).to.be.equal(false);
    });

    it('Firefox', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/113.0';
      userAgentGetter.mockReturnValue(userAgent);

      const {name, version, majorVersion, isMobile } = getBrowserData();
      expect(name).to.be.equal('Firefox');
      expect(version).to.be.equal('113.0');
      expect(majorVersion).to.be.equal(113);
      expect(isMobile).to.be.equal(false);
    });

    it('Microsoft Edge', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4170.0 Safari/537.36 Edg/85.0.552.2';
      userAgentGetter.mockReturnValue(userAgent);

      const {name, version, majorVersion, isMobile } = getBrowserData();
      expect(name).to.be.equal('Microsoft Edge');
      expect(version).to.be.equal('85.0.552.2');
      expect(majorVersion).to.be.equal(85);
      expect(isMobile).to.be.equal(false);
    });

    it('Safari', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15';
      userAgentGetter.mockReturnValue(userAgent);

      const {name, version, majorVersion, isMobile } = getBrowserData();
      expect(name).to.be.equal('Safari');
      expect(version).to.be.equal('16.4');
      expect(majorVersion).to.be.equal(16);
      expect(isMobile).to.be.equal(false);
    });

    it('IE', () => {
      const userAgent = 'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)';
      userAgentGetter.mockReturnValue(userAgent);

      const {name, version, majorVersion, isMobile } = getBrowserData();
      expect(name).to.be.equal('Internet Explorer');
      expect(version).to.be.equal('9.0');
      expect(majorVersion).to.be.equal(9);
      expect(isMobile).to.be.equal(false);
    });

    it('Mobile', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1';
      userAgentGetter.mockReturnValue(userAgent);

      const {isMobile } = getBrowserData();
      expect(isMobile).to.be.equal(true);
    });
  });
});
