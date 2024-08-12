import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const sanitizedKeyDiv = (text) => text.toLowerCase().replace(/ /g, '');

const getMetaData = (el) => {
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const metaData = {};
  keyDivs.forEach((div) => {
    const valueDivText = div.nextElementSibling.textContent;
    const keyValueText = sanitizedKeyDiv(div.textContent);
    metaData[keyValueText] = valueDivText;
  });
  return metaData;
};
const removeMetaDataElements = (el) => {
  const children = el.querySelectorAll(':scope > div');
  children.forEach((child) => {
    child.remove();
  });
};

function ratings(element, data) {
  console.log(data);
  // Create the rating elements
  const container = createTag('div', { class: 'rating-container' });
  const title = createTag('div', { class: 'rating-title' });
  const form = createTag('div', { class: 'rating-form' });
  const fieldset = createTag('fieldset', { class: 'rating-fieldset' }, 'fieldset');
  const legend = createTag('legend', { class: 'rating-legend' }, 'legend');
  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']; // Customize labels as needed
  labels.forEach((label, index) => {
    const input = createTag('input', {
      'data-tooltip': label,
      name: 'rating',
      'aria-label': `${label} ${index + 1} star`,
      type: 'radio',
      class: 'tooltip',
      'aria-checked': 'false',
      value: `${index + 1}`,
    });
    fieldset.appendChild(input);
  });

  form.appendChild(fieldset);
  form.appendChild(legend);
  container.appendChild(title);
  container.appendChild(form);
  element.appendChild(container);
}

export default async function init(element) {
  const data = getMetaData(element);
  removeMetaDataElements(element);
  ratings(element, data);
}
