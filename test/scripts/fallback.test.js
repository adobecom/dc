import { expect } from '@esm-bundle/chai';
import { getRedirectURL } from '../../acrobat/scripts/fallback.js';

describe('Fallback Function Tests', () => {
  describe('getRedirectURL', () => {
    it('should redirect frictionless paths', () => {
      const acrobatPath = '/acrobat/online/compress-pdf';
      expect(getRedirectURL(acrobatPath)).to.equal('https://acrobat.adobe.com/home/index-browser-eol.html');
    });
    it('should redirect all other paths', () => {
      const otherPath = '/acrobat/resources/faq';
      expect(getRedirectURL(otherPath)).to.equal('https://helpx.adobe.com/x-productkb/global/adobe-supported-browsers.html');
    });
    it('should return null for an undefined or null path', () => {
      expect(getRedirectURL(undefined)).to.be.null;
      expect(getRedirectURL(null)).to.be.null;
    });
  });
});
