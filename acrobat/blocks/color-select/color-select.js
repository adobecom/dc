/**
 * Color Select Block
 * A block that displays a dropdown with color options and a colored div
 */

import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

/**
 * Decorates the Color Select Block
 * @param {Element} block The block element
 */
function decorateBlock(block) {
  // Create the elements for the block
  const container = createTag('div', { class: 'color-select-container' });

  // Create select element with color options
  const select = createTag('select', { class: 'color-select-dropdown' });
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];

  // Add default option
  const defaultOption = createTag('option', { value: '', disabled: true, selected: true }, 'Select a color');
  select.append(defaultOption);

  // Add color options
  colors.forEach((color) => {
    const option = createTag('option', { value: color.toLowerCase() }, color);
    select.append(option);
  });

  // Create the color display div (500x500)
  const colorDisplay = createTag('div', { class: 'color-display' });

  // Add elements to container
  container.append(select, colorDisplay);

  // Add container to block
  block.textContent = '';
  block.append(container);
}

/**
 * Initialize the Color Select Block
 * @param {Element} block The block element
 */
function initEvents(block) {
  const select = block.querySelector('.color-select-dropdown');
  const colorDisplay = block.querySelector('.color-display');

  // Add event listener to change color when option is selected
  select.addEventListener('change', (e) => {
    const selectedColor = e.target.value;
    colorDisplay.style.backgroundColor = selectedColor;
  });
}

/**
 * Initialize the Color Select block
 * @param {Element} block The color select block element
 */
export default async function init(block) {
  decorateBlock(block);
  initEvents(block);
}
