import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

/**
 * Creates a color select dropdown with the specified colors
 * @returns {Object} The decorated elements
 */
export function decorateBlock() {
  // Available colors
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  
  // Create container
  const container = createTag('div', { class: 'color-select-container' });
  
  // Create select dropdown
  const selectContainer = createTag('div', { class: 'color-select-dropdown-container' });
  const label = createTag('label', { for: 'color-select' }, 'Select a color:');
  const select = createTag('select', { id: 'color-select', class: 'color-select-dropdown' });
  
  // Add options to select
  colors.forEach((color) => {
    const option = createTag('option', { value: color.toLowerCase() }, color);
    select.append(option);
  });
  
  // Create color display div
  const colorDisplay = createTag('div', { 
    class: 'color-select-display',
    style: 'background-color: red; width: 500px; height: 500px;',
  });
  
  // Assemble the structure
  selectContainer.append(label, select);
  container.append(selectContainer, colorDisplay);
  
  return { container, select, colorDisplay };
}

/**
 * Handles color change
 * @param {Event} e Change event
 * @param {Element} colorDisplay The color display element
 */
function handleColorChange(e, colorDisplay) {
  const selectedColor = e.target.value;
  colorDisplay.style.backgroundColor = selectedColor;
}

/**
 * Adds interactivity to the block
 * @param {Element} block The block element
 * @param {Object} elements The decorated elements
 */
function addInteractivity(block, elements) {
  const { select, colorDisplay } = elements;
  if (!select || !colorDisplay) return;

  // Add event listener for color selection
  select.addEventListener('change', (e) => handleColorChange(e, colorDisplay));
}

/**
 * Loads and initializes the block
 * @param {Element} block The block element
 */
export default async function init(block) {
  try {
    // Add block class
    block.classList.add('color-select');
    
    // Decorate the block
    const elements = decorateBlock();
    
    // Clear block and add new content
    block.textContent = '';
    if (elements.container) {
      block.append(elements.container);
    }
    
    // Add interactivity
    addInteractivity(block, elements);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error initializing color-select block:', error);
    
    // Fallback content
    block.textContent = 'Color selection is currently unavailable.';
  }
}