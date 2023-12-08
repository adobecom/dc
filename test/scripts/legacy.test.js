import { expect } from '@esm-bundle/chai';

describe('legacy test', () => {
  it('window.browser is assigned', async () => {
    await import('../../../acrobat/scripts/legacy.js');
    expect(window.browser).to.be.an('object');
  });
});
