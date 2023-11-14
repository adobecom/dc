import { expect } from '@esm-bundle/chai';
import { getBrowserData } from '../../acrobat/scripts/legacy.js';

describe('legacy test', () => {
  it('should return an empty object if userAgent is not provided', async () => {
    const userAgent = null;
    const browserData = getBrowserData(userAgent);
    expect(browserData).to.be.an('object').that.is.empty;
  });
  it('should return browser data when userAgent is provided', async () => {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36\n';
    const browserData = getBrowserData(userAgent);
    expect(browserData).to.be.an('object');
    expect(browserData).to.have.property('ua').that.equals(userAgent);
  });
});
