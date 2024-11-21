import { setLibs } from '../../../utils.js';

const miloLibs = setLibs('/libs');
const { getMetadata } = await import(`${miloLibs}/blocks/section-metadata/section-metadata.js`);
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const NO_AI_CLASS = 'solo-product';
const AI_CLASS = 'ai-bundled';


function getOsi(el) {
  if (!el) return false;
  if (el.dataset.wcsOsi) return el.dataset.wcsOsi;
  try {
    const { href } = el.href;
    // eslint-disable-next-line compat/compat
    const url = new URL(href);
    return url.searchParams.get('osi');
  } catch (e) {
    return false;
  }
}
function getPrice(el) {
  const major = el.querySelector('.price-integer')?.textContent;
  const minor = el.querySelector('.price-decimals')?.textContent;
  const price = parseFloat(`${major}.${minor}`);
  const priceEl = el.querySelector('.price');
  return { major, minor, price, priceEl };
}
function parseMetadata(metadata) {
  const parsedData = {
    checkbox: {
      headline: metadata['checkbox-headline'].content.textContent,
      description: metadata['checkbox-description'].content.textContent,
    },
    products: {
      primary: {},
      secondary: {},
    },
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in metadata) {
    if (key.startsWith('primary') || key.startsWith('secondary')) {
      const product = key.split('-');
      const [offerType, tabIndex, additionalTabIndex] = product;
      parsedData.products[offerType][tabIndex] ??= {};
      const content = metadata[key].content.querySelector(':scope > *');
      const results = {
        content,
        priceText: content.textContent,
        price: getPrice(content),
        osi: getOsi(content),
      };
      if (additionalTabIndex) {
        parsedData.products[offerType][tabIndex][additionalTabIndex] = results;
      } else {
        parsedData.products[offerType][tabIndex].other = results;
      }
    }
  }
  return parsedData;
}
function updatePrice(aiPrice, price) {
  const priceClone = { 
    ...price,
    priceEl: price.priceEl.cloneNode(true),
  };
  const newPrice = (priceClone.price + aiPrice.price).toFixed(2);
  const major = newPrice.split('.')[0];
  const minor = newPrice.split('.')[1];
  price.priceEl.classList.add(NO_AI_CLASS);
  priceClone.priceEl.classList.add(AI_CLASS);
  priceClone.priceEl.querySelector('.price-integer').textContent = major;
  priceClone.priceEl.querySelector('.price-decimals').textContent = minor;
  price.priceEl.parentNode.appendChild(priceClone.priceEl);
}
function getProduct(el, metadata) {
  const closestTabContainer = el.closest('[role="tabpanel"]');
  const parentTabContainer = closestTabContainer?.parentNode?.closest('[role="tabpanel"]');
  const closestId = closestTabContainer?.id?.split('-')[closestTabContainer?.id?.split('-').length - 1] || '1';
  const parentTabId = parentTabContainer?.id?.split('-')[parentTabContainer?.id?.split('-').length - 1] || '1';
  const offerType = el.classList.contains('con-button') && !el.classList.contains('blue')
    ? 'secondary' : 'primary';
  const productObj = metadata.products[offerType]?.[closestId];
  if (!productObj) return { content: false, osi: false };
  const additionalTabIndex = productObj[parentTabId] ? parentTabId : 'other';
  const product = productObj[additionalTabIndex];
  const content = product?.content;
  const osiEl = content?.tagName === 'A' || content.dataset.wcsOsi
    ? content : content?.querySelector('a, [data-wcs-osi]');
  const osi = getOsi(osiEl);
  return { content, osi, price: product.price, id: `${parentTabId}-${closestId}` };
}
function addCheckbox(card, metadata, price, id) {
  card.dataset.aiAdded = false;
  const callout = card.querySelector('[slot="callout-content"]');
  const description = metadata.checkbox.description.replace('[price]', `<strong>${price.priceEl.outerHTML}</strong>`);
  const checkboxHtml = `
    <input type="checkbox" id="ai-checkbox-${id}">
    <label for="ai-checkbox-${id}">
      <span><strong>${metadata.checkbox.headline}</strong></span>
      <span class="ai-checkbox-subtitle">${description}</span>
    </label>`;
  const checkboxContainer = createTag(
    'div',
    { slot: 'callout-content', class: 'ai-checkbox-container' },
    checkboxHtml,
  );
  callout?.replaceWith(checkboxContainer);
  const checkbox = checkboxContainer.querySelector('input');
  checkbox.addEventListener('change', (e) => {
    const merchCard = e.target.closest('merch-card');
    merchCard.dataset.aiAdded = e.target.checked;
  });
}
function addPrices(card, metadata, aiPrice) {
  console.log('addPrices', card, metadata, aiPrice);
    const container = card.querySelector('p[id*="price---"]');
    const priceEl = container?.querySelector('span.placeholder-resolved[data-wcs-osi][data-template="price"]')
    const strikePriceEl = container?.querySelector('span[data-wcs-osi][data-template="strikethrough"]')
    const acrobatReaderPriceEl = !container && card?.querySelector('p[slot="heading-m-price"]')
        
    const price = priceEl ? getPrice(priceEl) : null;
    const strikePrice = strikePriceEl ? getPrice(strikePriceEl) : null;
    if(acrobatReaderPriceEl) {
      acrobatReaderPriceEl.innerHTML = `
        <span class="${NO_AI_CLASS}">${acrobatReaderPriceEl.innerHTML}</span>
        <span class="${AI_CLASS}">${aiPrice.priceEl.innerHTML}</span>
      `
    } else {
      price && updatePrice(aiPrice, price);
      strikePrice && updatePrice(aiPrice, strikePrice);
    }
}
function addButtons(card, metadata, aiOsi, id) {
  card.querySelectorAll('.con-button').forEach((button, buttonIdx) => {
    // TODO: handle button not being a cart link (reader, business pricing, modal)
    // cartlinks
    if (button?.href.includes('commerce.')) {
      const originalOsi = getOsi(button);
      button.dataset.buttonId = `${id}-${buttonIdx + 1}`;
      const clonedButton = button.cloneNode(true);
      clonedButton.classList.add(AI_CLASS);
      clonedButton.dataset.wcsOsi = `${originalOsi},${aiOsi}`;
      clonedButton.dataset.checkoutWorkflowStep = 'email';
      clonedButton.setAttribute('style', 'border: 3px solid red');
      button.classList.add(NO_AI_CLASS);
      button.parentNode.appendChild(clonedButton);
      // quantity change
      if (button.dataset?.quantity === '1') return;
      clonedButton.dataset.quantity = `${button.dataset.quantity},${button.dataset.quantity}`;
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-quantity') {
            const buddy = mutation.target.parentNode.querySelector(`.${AI_CLASS}[data-button-id="${mutation.target.dataset.buttonId}"]`);
            const quantity = mutation.target.getAttribute('data-quantity');
            buddy.dataset.quantity = `${quantity},${quantity}`;
            // console.log(`Quantity updated to ${quantity},${quantity} for`, buddy);
          }
        }
      });
      observer.observe(button, { childList: true, attributes: true, attributeFilter: ['data-quantity'] });
    }
    // TODO: clone el, add classes, add osi, fix quantity add event listener for quantity updates
    // console.log('osi codes', aiOsi, originalOsi);
    // ISSUES REMINDER:
    // 1. async/race condition?
    // 2. offerId's can't be trusted absed off the aiosi in the gray container
  });
}
export default async function init(el) {
  const container = el.closest('div:has(.merch-card, merch-card)');
  const cards = container.querySelectorAll('.merch-card, merch-card');
  if (!cards.length) return;
  const metadata = getMetadata(el);
  const parsedMetadata = parseMetadata(metadata);
  cards.forEach((card, index) => {
    const { osi, price, id } = getProduct(card, parsedMetadata);
    addCheckbox(card, parsedMetadata, price, `${id}-${index + 1}`);
    addPrices(card, parsedMetadata, price);
    addButtons(card, parsedMetadata, osi, `${id}-${index + 1}`);
  });
}
