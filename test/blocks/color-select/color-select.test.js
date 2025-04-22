import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

// Mock the import
const mockCreateTag = stub();
mockCreateTag.callsFake((tag, attributes, html) => {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }
  if (html) {
    element.innerHTML = html;
  }
  return element;
});

// Mock utils import
const mockUtils = { createTag: mockCreateTag };

describe('Color Select Block', () => {
  let colorSelectBlock;
  let utils;

  beforeEach(async () => {
    utils = mockUtils;
    document.body.innerHTML = '<main><div class="color-select"></div></main>';
    colorSelectBlock = document.querySelector('.color-select');

    // Set up the mock for utils import
    window.miloLibs = 'miloLibs';
    window.import = stub().resolves(utils);

    // Import the block's init function
    const { default: init } = await import('../../../acrobat/blocks/color-select/color-select.js');

    // Initialize the block
    await init(colorSelectBlock);
  });

  it('should create a color select dropdown and display', () => {
    const container = colorSelectBlock.querySelector('.color-select-container');
    expect(container).to.exist;

    const select = colorSelectBlock.querySelector('.color-select-dropdown');
    expect(select).to.exist;
    expect(select.tagName).to.equal('SELECT');

    const options = select.querySelectorAll('option');
    expect(options.length).to.equal(5);

    const colorDisplay = colorSelectBlock.querySelector('.color-select-display');
    expect(colorDisplay).to.exist;
    expect(colorDisplay.style.width).to.equal('500px');
    expect(colorDisplay.style.height).to.equal('500px');
  });

  it('should change the displayed color when a new option is selected', () => {
    const select = colorSelectBlock.querySelector('.color-select-dropdown');
    const colorDisplay = colorSelectBlock.querySelector('.color-select-display');

    // Get the initial color
    const initialColor = colorDisplay.style.backgroundColor;

    // Select a different color (second option)
    select.selectedIndex = 1;

    // Trigger the change event
    const changeEvent = new Event('change');
    select.dispatchEvent(changeEvent);

    // Check if the color display was updated
    expect(colorDisplay.style.backgroundColor).to.not.equal(initialColor);
  });
});
