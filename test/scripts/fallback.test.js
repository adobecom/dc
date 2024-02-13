import { expect } from '@esm-bundle/chai';

describe('legacy test', () => {
  it('redirectToURL is assigned', async () => {
    await import('../../acrobat/scripts/fallback.js');
    expect(window.redirectToSupportPage).to.be.an('function');
    expect(window.routes).to.be.an('array');
  });
});
