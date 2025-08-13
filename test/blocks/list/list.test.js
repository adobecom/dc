import { expect } from '@esm-bundle/chai';

describe('block list', () => {
  let blocks;
  beforeEach(async () => {
    const blockListImport = await import('../../../acrobat/blocks/list.js');
    blocks = blockListImport.default;
  });
  it('should contain expected block names', () => {
    expect(blocks).to.contain('dc-converter-widget');
    expect(blocks).to.contain('verb-subfooters');
  });
  it('should have correct number of elements', () => {
    expect(blocks.length).to.be.equal(2);
  });
});
