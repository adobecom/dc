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
  const results = {};
  for (const [key, val] of Object.entries(metadata)) {
    const [l1, l2, l3] = key.split('-');
    const value = val.content.textContent;
    if (!l2) {
      results[l1] = value;
    } else {
      results[l1] ??= {};
      if (!l3) {
        results[l1][l2] = value;
      } else {
        results[l1][l2] ??= {};
        results[l1][l2][l3] = value;
      }
    }
  }
  return results;
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
function getKey(fragmentPath, defaultKey, obj) {
  for (const [key] of Object.entries(obj)) {
    if (fragmentPath.includes(key)) return key;
  }
  return defaultKey;
}

function addCheckbox(card, cardId, md) {
  card.dataset.aiAdded = false;
  const callout = card.querySelector('[slot="callout-content"]');
  if (!callout) return false;
  const description = md.checkbox.description.replace('[AIP]', '<span class="price-placeholder"></span>');
  const checkboxContainer = createTag(
    'div',
    { slot: 'callout-content', class: 'ai-checkbox-container' },
    `<input type="checkbox" id="ai-checkbox-${cardId}">
    <label for="ai-checkbox-${cardId}">
      <span><strong>${md.checkbox.headline}</strong></span>
      <span class="ai-checkbox-subtitle">${description}</span>
    </label>`,
  );
  const priceEl = callout?.querySelector('[data-template="price"]');
  const pricePlaceholder = checkboxContainer.querySelector('.price-placeholder');
  pricePlaceholder.replaceWith(priceEl);
  const checkbox = checkboxContainer.querySelector('input');
  checkbox.addEventListener('change', (e) => {
    const merchCard = e.target.closest('merch-card');
    merchCard.dataset.aiAdded = e.target.checked;
  });
  callout.replaceWith(checkboxContainer);
  return getPrice(priceEl);
}
function addPrices(card, metadata, aiPrice) {
  const prices = card.querySelectorAll('[data-wcs-osi][data-template]')  
  prices.forEach((el) => {
    const price = getPrice(el);
    /**
     * NOTE: since `addPrices()` is called after `addCheckbox()`, we know that 
     * the "gray box" AI price element is not going to be part of the list of prices
     * since it replaced by the checkbox. And the checkbox label's AI Assistant price
     * is missing attributes `data-wcs-osi` and `data-template`
     */
    updatePrice(aiPrice, price); 
  })
  // handle free product (Acrobat Reader)
  if(!prices?.length) {
    const freeProductPriceEl = card?.querySelector('p[slot="heading-m-price"]')
    if(freeProductPriceEl) {
       freeProductPriceEl.innerHTML = `
        <span class="${NO_AI_CLASS}">${freeProductPriceEl.innerHTML}</span>
        <span class="${AI_CLASS}">${aiPrice.priceEl.innerHTML}</span>
      `
      const commitmentTypeLabel = 'Annual, paid monthly'; // TODO: get from metadata
      const commitmentTypeLabelEl = createTag('p', { class:  `card-heading ${AI_CLASS}`, slot: 'body-xxs' });
      commitmentTypeLabelEl.innerHTML = `<em>${commitmentTypeLabel}</em>`;
      freeProductPriceEl.parentNode.insertBefore(commitmentTypeLabelEl, freeProductPriceEl)
    }
  }
}
function addButtons(card, md, aiOsi, id) {
  card.querySelectorAll('.con-button').forEach((button, buttonIdx) => {
    // TODO: handle button not being a cart link (reader, business pricing, modal)
    // cartlinks
    if (button?.href.includes('/reader/')) {
      button.classList.add(NO_AI_CLASS);
      const buyButton = md['reader-buybutton'].content.querySelector('a');
      buyButton.classList.add(AI_CLASS);
      buyButton.classList.add('button-l');
      button.parentNode.appendChild(buyButton);
    } else if (button?.href.includes('commerce.')) {
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
function processCard(card, cardIdx, fragPath, md, fragAudience, rawMetadata) {
  const cardPlanType = getKey(fragPath, 'abm', md[fragAudience]);
  const aiOsiCodes = md[fragAudience][cardPlanType];
  const cardId = `${fragAudience}-${cardPlanType}-${cardIdx + 1}`;
  const aiPrice = addCheckbox(card, cardId, md);
  if (!aiPrice) return;
  addPrices(card, md, aiPrice);
  addButtons(card, rawMetadata, aiOsiCodes, cardId);
}

export default async function init(el) {
  const fragContainer = el.closest('div.fragment[data-path]:has(.merch-card, merch-card)');
  if (!fragContainer) return;
  const fragPath = fragContainer.dataset.path;
  const rawMetadata = getMetadata(el);
  const md = parseMetadata(rawMetadata);
  const fragAudience = getKey(fragPath, 'individuals', md);
  fragContainer.querySelectorAll('.merch-card, merch-card').forEach((card, cardIdx) => {
    const cardObserver = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const callout = card.querySelector('[slot="callout-content"] [data-template="price"]');
          if (callout) {
            observer.disconnect();
            processCard(card, cardIdx, fragPath, md, fragAudience, rawMetadata);
          }
        }
      }
    });

    const callout = card.querySelector('[slot="callout-content"] [data-template="price"]');
    if (callout) {
      processCard(card, cardIdx, fragPath, md, fragAudience, rawMetadata);
    } else {
      cardObserver.observe(card, { childList: true, subtree: true });
    }
    // const cardPlanType = getKey(fragPath, 'abm', md[fragAudience]);
    // const aiOsiCodes = md[fragAudience][cardPlanType];
    // const cardId = `${fragAudience}-${cardPlanType}-${cardIdx + 1}`;
    // const aiPrice = addCheckbox(card, cardId, md);
    // if (!aiPrice) return;
    // addPrices(card, md, aiPrice);
    // addButtons(card, md, aiOsiCodes, cardId);
  });
}
