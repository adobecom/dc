import { expect } from '@esm-bundle/chai';

describe('legacy test', () => {
  it('redirectToURL is assigned', async () => {
    await import('../../acrobat/scripts/fallback.js');
    expect(window.redirectToURL).to.be.an('function');
  });
});
