/* eslint-disable no-unused-expressions */
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setLibs } from '../../scripts/utils.js';

window.setLibs = setLibs;

// Mock the createTag utility
const createTagMock = stub().callsFake((tag, attrs = {}, content = '') => {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (content) {
    element.textContent = content;
  }
  return element;
});

// Mock import for createTag
window.esmsInitialized = true;
window.importShim = async (importee) => {
  if (importee.includes('/utils/utils.js')) {
    return { createTag: createTagMock };
  }
  return {};
};

describe('Color Select Block', () => {
  let colorSelectBlock;
  let init;

  beforeEach(async () => {
    // Create a clean block for testing
    colorSelectBlock = document.createElement('div');
    document.body.appendChild(colorSelectBlock);
    
    // Import the module
    const mod = await import('./index.js');
    init = mod.default;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    createTagMock.reset();
  });

  it('should initialize the block with a dropdown and color display', async () => {
    await init(colorSelectBlock);
    
    // Validate the block contains the expected elements
    expect(colorSelectBlock.classList.contains('color-select')).to.be.true;
    
    const container = colorSelectBlock.querySelector('.color-select-container');
    expect(container).to.exist;
    
    const dropdown = colorSelectBlock.querySelector('.color-select-dropdown');
    expect(dropdown).to.exist;
    
    const display = colorSelectBlock.querySelector('.color-select-display');
    expect(display).to.exist;
    
    // Should have 5 color options
    const options = dropdown.querySelectorAll('option');
    expect(options.length).to.equal(5);
  });

  it('should change the display color when selecting a new color', async () => {
    await init(colorSelectBlock);
    
    const dropdown = colorSelectBlock.querySelector('.color-select-dropdown');
    const display = colorSelectBlock.querySelector('.color-select-display');
    
    // Initial color should be red
    expect(display.style.backgroundColor).to.equal('red');
    
    // Select blue
    dropdown.value = 'blue';
    const changeEvent = new Event('change');
    dropdown.dispatchEvent(changeEvent);
    
    // Color should now be blue
    expect(display.style.backgroundColor).to.equal('blue');
  });
});