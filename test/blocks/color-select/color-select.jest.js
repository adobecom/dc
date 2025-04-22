/**
 * @jest-environment jsdom
 */

import { setLibs } from '../../../acrobat/scripts/utils.js';

// Mock createTag function
global.createTag = jest.fn((tag, attrs = {}, text = '') => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  if (text) el.textContent = text;
  return el;
});

// Mock the createTag import
jest.mock('/libs/utils/utils.js', () => ({
  createTag: global.createTag,
}), { virtual: true });

describe('Color Select Block', () => {
  let colorSelectModule;
  let block;

  beforeAll(async () => {
    // Set up window and document
    global.window = window;
    global.document = document;

    // Set libs path
    setLibs('/libs');

    // Import the module
    colorSelectModule = await import('../../../acrobat/blocks/color-select/color-select.js');
  });

  beforeEach(() => {
    // Create a block element
    block = document.createElement('div');
    block.className = 'color-select';
    document.body.appendChild(block);

    // Reset mocks
    global.createTag.mockClear();
  });

  afterEach(() => {
    // Clean up
    if (block && block.parentElement) {
      document.body.removeChild(block);
    }
  });

  it('should export init and decorateBlock functions', () => {
    expect(typeof colorSelectModule.default).toBe('function');
    expect(typeof colorSelectModule.decorateBlock).toBe('function');
  });

  it('should create a dropdown with 5 color options', async () => {
    await colorSelectModule.decorateBlock(block);

    // Verify dropdown is created
    expect(global.createTag).toHaveBeenCalledWith(
      'select',
      expect.objectContaining({
        id: 'color-select-dropdown',
        class: 'color-select-dropdown'
      })
    );

    // Check if options were added to the dropdown
    expect(global.createTag).toHaveBeenCalledWith(
      'option',
      expect.objectContaining({ value: 'red' }),
      'Red'
    );
    expect(global.createTag).toHaveBeenCalledWith(
      'option',
      expect.objectContaining({ value: 'blue' }),
      'Blue'
    );
    expect(global.createTag).toHaveBeenCalledWith(
      'option',
      expect.objectContaining({ value: 'green' }),
      'Green'
    );
    expect(global.createTag).toHaveBeenCalledWith(
      'option',
      expect.objectContaining({ value: 'black' }),
      'Black'
    );
    expect(global.createTag).toHaveBeenCalledWith(
      'option',
      expect.objectContaining({ value: 'white' }),
      'White'
    );
  });

  it('should create a 500x500 color display div', async () => {
    await colorSelectModule.decorateBlock(block);

    // Verify color display is created
    expect(global.createTag).toHaveBeenCalledWith(
      'div',
      expect.objectContaining({
        class: 'color-select-display',
        style: expect.stringContaining('width: 500px; height: 500px')
      })
    );
  });
});
