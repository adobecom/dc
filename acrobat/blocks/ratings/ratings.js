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

// Function to select the rating and update accessibility attributes
function selectRating(selectedValue, radioElements) {
  radioElements.forEach((radio) => {
    const isActive = radio.value === selectedValue;
    radio.setAttribute('aria-checked', isActive.toString());
    radio.checked = isActive;
    if (isActive) {
      radio.focus();
    }
  });
}

// Function to handle rating change and accessibility
function handleRatingChange(radioInputs, tooltips, tooltipDelay) {
  let timeoutId = null;
  let hoverIndex = null;

  function showTooltip(index) {
    hoverIndex = index;
    const tooltipText = tooltips[index - 1];
    const tooltipElement = document.querySelector('.tooltip-text');
    if (tooltipElement) {
      tooltipElement.textContent = tooltipText;
      tooltipElement.style.opacity = 1;
    }
  }

  function hideTooltip() {
    hoverIndex = null;
    const tooltipElement = document.querySelector('.tooltip-text');
    if (tooltipElement) {
      tooltipElement.style.opacity = 0;
    }
  }

  radioInputs.forEach((radio, index, radioElements) => {
    // Initial configuration of tabindex and role attributes
    radio.setAttribute('tabindex', '0');
    radio.setAttribute('role', 'radio');
    radio.setAttribute('aria-checked', 'false');

    // Click event to update the selection
    radio.addEventListener('click', (event) => {
      const selectedValue = event.currentTarget.value;
      selectRating(selectedValue, radioElements);
    });

    // Focus event to show the tooltip during keyboard navigation
    radio.addEventListener('focus', (event) => {
      const selectedValue = parseInt(event.currentTarget.value, 10);
      showTooltip(selectedValue);
    });

    // Blur event to hide the tooltip when focus is lost
    radio.addEventListener('blur', () => {
      hideTooltip();
    });

    // Keyboard events for navigation
    radio.addEventListener('keydown', (event) => {
      let newIndex;
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          radio.click();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          newIndex = index - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          newIndex = index + 1;
          break;
        default:
          return;
      }

      // Change focus to the new radio input if it exists
      if (newIndex !== undefined && newIndex >= 0 && newIndex < radioElements.length) {
        radioElements[newIndex].focus();
      }
    });

    // Mouseover event to show the tooltip when hovering with the mouse
    radio.addEventListener('mouseover', () => {
      if (hoverIndex !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
        showTooltip(index + 1);
      } else {
        timeoutId = setTimeout(() => {
          showTooltip(index + 1);
        }, tooltipDelay);
      }
    });

    // Mouseout event to hide the tooltip when the mouse leaves
    radio.addEventListener('mouseout', () => {
      hideTooltip();
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    });
  });
}

// Function to create the rating structure
function ratings(element, data) {
  console.log(data);
  // Create the rating elements
  const container = createTag('div', { class: 'rating-container' });
  const title = createTag('div', { class: 'rating-title' });
  const form = createTag('div', { class: 'rating-form' });
  const fieldset = createTag('fieldset', { class: 'rating-fieldset' }, 'Rate your experience');
  const legend = createTag('legend', { class: 'rating-legend' }, 'Rate your experience');
  const tooltipElement = createTag('div', { class: 'tooltip-text' }, ''); // Tooltip element
  container.appendChild(tooltipElement); // Append tooltip to container

  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']; // Custom labels
  const tooltips = labels.map((label) => label); // Array of tooltips
  const tooltipDelay = 300; // Tooltip delay in ms

  labels.forEach((label, index) => {
    const starLabel = `${label} ${index + 1} ${index + 1 === 1 ? 'star' : 'stars'}`;
    const input = createTag('input', {
      'data-tooltip': label,
      name: 'rating',
      'aria-label': starLabel,
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
  const ratingRadios = form.querySelectorAll('input[name="rating"]');
  handleRatingChange(ratingRadios, tooltips, tooltipDelay);
}

// initialization function
export default async function init(element) {
  const data = getMetaData(element);
  removeMetaDataElements(element);
  ratings(element, data);
}
