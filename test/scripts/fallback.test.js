import { expect } from '@esm-bundle/chai';

describe('legacy test', () => {
  it('window.browser is assigned', async () => {
    await import('../../acrobat/scripts/fallback.js');
    expect(window).to.be.an('object');
  });
});
