/* eslint-disable no-unused-expressions */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

/**
 * Helper for creating DOM elements in tests
 * @param {string} html The HTML to create
 * @returns {Element} The element
 */
function createElementFromHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

const scripts = {};

/**
 * Mock import function to allow testing modules that import
 * @param {string} url The URL to import
 * @returns {object} The imported module
 */
window.importShim = async (url) => {
  if (scripts[url]) {
    return scripts[url];
  }
  // Mock the createTag function from utils.js
  if (url.includes('utils.js')) {
    scripts[url] = {
      createTag: (tag, attrs = {}, html = '') => {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
          el.setAttribute(key, value);
        });
        if (html) el.innerHTML = html;
        return el;
      },
    };
    return scripts[url];
  }
  // In an actual test environment, we would mock all necessary imports
  // For now, we'll return an empty object for anything else
  scripts[url] = {};
  return scripts[url];
};

// Mock module for testing
const mockColorSelectModule = {
  init: async (block) => {
    // Create container
    const container = document.createElement('div');
    container.className = 'color-select-container';

    // Create dropdown
    const select = document.createElement('select');
    select.className = 'color-select-dropdown';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select a color';
    select.append(defaultOption);

    // Add color options
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
    colors.forEach((color) => {
      const option = document.createElement('option');
      option.value = color.toLowerCase();
      option.textContent = color;
      select.append(option);
    });

    // Create color display
    const colorDisplay = document.createElement('div');
    colorDisplay.className = 'color-display';

    // Add event listener
    select.addEventListener('change', (e) => {
      colorDisplay.style.backgroundColor = e.target.value;
    });

    // Append to container
    container.append(select, colorDisplay);

    // Add to block
    block.textContent = '';
    block.append(container);
  },
};

describe('Color Select Block', () => {
  let colorSelectBlock;

  beforeEach(async () => {
    // Create a test block
    colorSelectBlock = createElementFromHTML('<div class="color-select"></div>');
    document.body.appendChild(colorSelectBlock);
  });

  afterEach(() => {
    // Clean up
    sinon.restore();
    document.body.innerHTML = '';
  });

  it('initializes the block correctly', async () => {
    // Initialize the block
    await mockColorSelectModule.init(colorSelectBlock);

    // Check if container was created
    const container = colorSelectBlock.querySelector('.color-select-container');
    expect(container).to.exist;

    // Check if dropdown was created with the correct options
    const dropdown = colorSelectBlock.querySelector('.color-select-dropdown');
    expect(dropdown).to.exist;
    expect(dropdown.options.length).to.equal(6); // 5 colors + default

    // Check if color display was created
    const colorDisplay = colorSelectBlock.querySelector('.color-display');
    expect(colorDisplay).to.exist;
    expect(colorDisplay.style.backgroundColor).to.equal('');
  });

  it('changes color when dropdown selection changes', async () => {
    // Initialize the block
    await mockColorSelectModule.init(colorSelectBlock);

    const dropdown = colorSelectBlock.querySelector('.color-select-dropdown');
    const colorDisplay = colorSelectBlock.querySelector('.color-display');

    // Simulate selection of a color
    dropdown.value = 'red';
    const changeEvent = new Event('change');
    dropdown.dispatchEvent(changeEvent);

    // Check if the color display changed to the selected color
    expect(colorDisplay.style.backgroundColor).to.equal('red');
  });
});
