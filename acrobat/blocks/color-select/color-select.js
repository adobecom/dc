/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { setLibs } from '../../scripts/utils.js';

const COLOR_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

/**
 * Decorates the color-select block
 * @param {Element} block The block element
 */
export async function decorateBlock(block) {
  const miloLibs = setLibs('/libs');
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);

  // Create container
  const container = createTag('div', { class: 'color-select-container' });

  // Create dropdown
  const selectWrapper = createTag('div', { class: 'color-select-dropdown-wrapper' });
  const label = createTag('label', { for: 'color-select-dropdown' }, 'Select a color:');
  const select = createTag('select', { id: 'color-select-dropdown', class: 'color-select-dropdown' });

  // Add options to dropdown
  COLOR_OPTIONS.forEach((option) => {
    const optionEl = createTag('option', { value: option.value }, option.label);
    select.appendChild(optionEl);
  });

  // Create color display area (500x500 div)
  const colorDisplay = createTag('div', {
    class: 'color-select-display',
    style: 'width: 500px; height: 500px; background-color: red;' // Default to first color
  });

  // Add event listener to update color display when selection changes
  select.addEventListener('change', (e) => {
    colorDisplay.style.backgroundColor = e.target.value;
  });

  // Assemble the DOM
  selectWrapper.append(label, select);
  container.append(selectWrapper, colorDisplay);
  block.textContent = '';
  block.append(container);
}

export default async function init(block) {
  // Decorate the block
  await decorateBlock(block);
}