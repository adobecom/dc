import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

// Simple mock for createTag
const createTagMock = (tag, attrs, content) => {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  }
  if (content) el.textContent = content;
  return el;
};

describe('Template Block', () => {
  let block;

  before(async () => {
    // Setup document
    document.head.innerHTML = await readFile({ path: './head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/template.html' });

    // Setup mocks
    const mockUtils = { createTag: createTagMock };

    // Mock imports
    window.setLibs = () => '/libs';
    // eslint-disable-next-line compat/compat
    window.import = () => Promise.resolve(mockUtils);

    // Load module and run init
    const mod = await import('../../../acrobat/blocks/template/template.js');
    block = document.querySelector('.blockname');
    await mod.default(block);
  });

  it('should create all required elements', () => {
    // Check main structure elements exist
    expect(block.querySelector('.blockname-container')).to.exist;
    expect(block.querySelector('.foreground')).to.exist;
    expect(block.querySelector('.copy')).to.exist;
    expect(block.querySelector('.main-copy')).to.exist;

    // Check content elements exist
    expect(block.querySelector('h2')).to.exist;
    expect(block.querySelector('p')).to.exist;

    // Check action area exists
    expect(block.querySelector('.action-area')).to.exist;

    // Check links exist
    const links = block.querySelectorAll('a');
    expect(links.length).to.be.at.least(1);
  });
});
