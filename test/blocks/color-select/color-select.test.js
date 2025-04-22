/* eslint-disable no-unused-expressions */
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../../acrobat/scripts/utils.js';

const { decorateBlock } = await import('../../../acrobat/blocks/color-select/color-select.js');

describe('Color Select Block', () => {
  let block;

  beforeEach(() => {
    // Set up Milo libs path
    setLibs('/libs');

    // Create a mock block
    block = document.createElement('div');
    block.className = 'color-select';
    document.body.appendChild(block);
  });

  afterEach(() => {
    // Clean up
    if (block && block.parentElement) {
      document.body.removeChild(block);
    }
  });

  it('should decorate the block with dropdown and color display', async () => {
    // Decorate the block
    await decorateBlock(block);

    // Check dropdown is created
    const select = block.querySelector('select.color-select-dropdown');
    expect(select).to.exist;

    // Check all 5 color options are available
    const options = select.querySelectorAll('option');
    expect(options.length).to.equal(5);
    expect(options[0].value).to.equal('red');
    expect(options[1].value).to.equal('blue');
    expect(options[2].value).to.equal('green');
    expect(options[3].value).to.equal('black');
    expect(options[4].value).to.equal('white');

    // Check color display is created
    const colorDisplay = block.querySelector('.color-select-display');
    expect(colorDisplay).to.exist;
    expect(colorDisplay.style.width).to.equal('500px');
    expect(colorDisplay.style.height).to.equal('500px');
    expect(colorDisplay.style.backgroundColor).to.equal('red');
  });

  it('should update color display when selection changes', async () => {
    // Decorate the block
    await decorateBlock(block);

    const select = block.querySelector('select.color-select-dropdown');
    const colorDisplay = block.querySelector('.color-select-display');

    // Initial background color should be red
    expect(colorDisplay.style.backgroundColor).to.equal('red');

    // Change selection to blue
    select.value = 'blue';
    select.dispatchEvent(new Event('change'));
    expect(colorDisplay.style.backgroundColor).to.equal('blue');

    // Change selection to green
    select.value = 'green';
    select.dispatchEvent(new Event('change'));
    expect(colorDisplay.style.backgroundColor).to.equal('green');
  });
});
