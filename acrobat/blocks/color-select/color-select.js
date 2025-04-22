import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// Available colors with their RGB values
const COLORS = {
  Red: '#FF0000',
  Blue: '#0000FF',
  Green: '#00FF00',
  Black: '#000000',
  White: '#FFFFFF',
};

/**
 * Creates a color select dropdown and color display panel
 * @param {HTMLElement} element - The block element
 */
export default async function init(element) {
  // Create the main container
  const container = createTag('div', { class: 'color-select-container' });

  // Create the select dropdown
  const selectWrapper = createTag('div', { class: 'color-select-dropdown-wrapper' });
  const select = createTag('select', { class: 'color-select-dropdown' });

  // Create the color display panel
  const colorDisplay = createTag('div', {
    class: 'color-select-display',
    style: 'width: 500px; height: 500px; border: 1px solid #ccc;',
  });

  // Add all color options to the select dropdown
  Object.entries(COLORS).forEach(([colorName, colorValue]) => {
    const option = createTag('option', { value: colorValue }, colorName);
    select.appendChild(option);
  });

  // Set the initial color
  colorDisplay.style.backgroundColor = select.value;

  // Add change event listener to update the color display
  select.addEventListener('change', () => {
    colorDisplay.style.backgroundColor = select.value;
  });

  // Assemble the component
  selectWrapper.appendChild(select);
  container.appendChild(selectWrapper);
  container.appendChild(colorDisplay);

  // Add the assembled component to the block
  element.appendChild(container);
}
