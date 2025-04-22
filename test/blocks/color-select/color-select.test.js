import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

const createTag = (tag, attributes, html) => {
  const el = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  if (html) {
    if (typeof html === 'string') {
      el.innerHTML = html;
    } else {
      el.append(html);
    }
  }
  return el;
};

describe('Color Select Block', () => {
  let colorSelectBlock;
  let colorSelectJs;

  beforeEach(async () => {
    // Load the JS implementation
    const jsContent = await readFile({ path: './acrobat/blocks/color-select/color-select.js' });
    
    // Create a mock global environment
    window.miloLibs = '/libs';
    window.setLibs = stub().returns('/libs');
    window.createTag = createTag;
    
    // Mock import
    window.import = stub().resolves({ createTag });
    
    // Load the block JS
    const module = new Function('import', `const setLibs = window.setLibs; ${jsContent}; return { default: init };`);
    colorSelectJs = await module(window.import);
    
    // Create block element
    colorSelectBlock = document.createElement('div');
    document.body.appendChild(colorSelectBlock);
  });

  afterEach(() => {
    document.body.removeChild(colorSelectBlock);
  });

  it('should create a color select dropdown with 5 color options', async () => {
    await colorSelectJs.default(colorSelectBlock);
    
    const container = colorSelectBlock.querySelector('.color-select-container');
    expect(container).to.exist;
    
    const select = colorSelectBlock.querySelector('.color-select-dropdown');
    expect(select).to.exist;
    
    const options = select.querySelectorAll('option');
    expect(options.length).to.equal(5); // 5 colors
    
    // Verify all color options
    const colorNames = Array.from(options).map(option => option.textContent);
    expect(colorNames).to.include.members(['Red', 'Blue', 'Green', 'Black', 'White']);
  });

  it('should create a 500x500 color display div', async () => {
    await colorSelectJs.default(colorSelectBlock);
    
    const colorDisplay = colorSelectBlock.querySelector('.color-select-display');
    expect(colorDisplay).to.exist;
    
    // Check dimensions
    expect(colorDisplay.style.width).to.equal('500px');
    expect(colorDisplay.style.height).to.equal('500px');
  });

  it('should change the color of the display div when a different option is selected', async () => {
    await colorSelectJs.default(colorSelectBlock);
    
    const select = colorSelectBlock.querySelector('.color-select-dropdown');
    const colorDisplay = colorSelectBlock.querySelector('.color-select-display');
    
    // Initial color should be set (first option)
    const initialColor = select.value;
    expect(colorDisplay.style.backgroundColor).to.equal(initialColor);
    
    // Change selection to the second option
    select.selectedIndex = 1;
    const newEvent = new Event('change');
    select.dispatchEvent(newEvent);
    
    // Color display should update to match the new selection
    expect(colorDisplay.style.backgroundColor).to.equal(select.value);
  });
});