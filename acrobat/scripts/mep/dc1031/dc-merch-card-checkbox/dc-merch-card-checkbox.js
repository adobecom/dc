import { setLibs } from '../../../utils.js';

const miloLibs = setLibs('/libs');
const { getMetadata } = await import(`${miloLibs}/blocks/section-metadata/section-metadata.js`);
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const NO_AI_CLASS = 'solo-product';
const AI_CLASS = 'ai-bundled';
const CALLOUT_SELECTOR = '[slot="callout-content"]';

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
    const value = key.includes('button') || key.includes('price') ? val.content : val.content.textContent;
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
function cloneAndUpdatePrice(aiPrice, price) {
  const priceClone = {
    ...price,
    priceEl: price.priceEl?.cloneNode(true),
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
  const reservedKeys = ['reader', 'checkbox'];
  for (const [key] of Object.entries(obj)) {
    if (!reservedKeys.includes(key) && fragmentPath.includes(key)) return key;
  }
  return defaultKey;
}

function addCheckbox(card, cardId, md) {
  card.dataset.aiAdded = false;
  const callout = card.querySelector(CALLOUT_SELECTOR);
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
function addReaderPrice(md, aiPrice, freeProductPriceEl) {
  freeProductPriceEl.innerHTML = `
    <span class="${NO_AI_CLASS}">${freeProductPriceEl.innerHTML}</span>
    <span class="${AI_CLASS}">${aiPrice.priceEl.innerHTML}</span>
  `;
  const commitmentTypeLabel = md.reader.pricing.terms;
  const commitmentTypeLabelEl = createTag('p', { class: `card-heading ${AI_CLASS}`, slot: 'body-xxs' });
  commitmentTypeLabelEl.innerHTML = `<em>${commitmentTypeLabel}</em>`;
  freeProductPriceEl.parentNode.insertBefore(commitmentTypeLabelEl, freeProductPriceEl);
}
function addPrices(card, md, aiPrice) {
  const prices = card.querySelectorAll('[data-wcs-osi][data-template]');
  const priceArray = Array.from(prices).filter((el) => !el.closest(CALLOUT_SELECTOR));

  priceArray.forEach((el) => {
    const price = getPrice(el);
    cloneAndUpdatePrice(aiPrice, price);
  });
  const freeProductPriceEl = card?.querySelector('p[slot="heading-m-price"]');
  if (!priceArray?.length && freeProductPriceEl) addReaderPrice(md, aiPrice, freeProductPriceEl);
}
function attachQtyUpdateObserver(button, clonedButton) {
  clonedButton.dataset.quantity = `${button.dataset.quantity},${button.dataset.quantity}`;
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-quantity') {
        const qty = button.dataset.quantity;
        clonedButton.dataset.quantity = `${qty},${qty}`;
      }
    }
  });
  observer.observe(button, { childList: true, attributes: true, attributeFilter: ['data-quantity'] });
}
function addReaderButton(button, md, aiOsiCodes) {
  button.classList.add(NO_AI_CLASS);
  const buyButton = md.reader.buy.button.querySelector('a');
  buyButton.classList.add(AI_CLASS);
  buyButton.classList.add('button-l');
  buyButton.dataset.wcsOsi = aiOsiCodes.primary;
  button.parentNode.appendChild(buyButton);
}
function addButtons(card, md, aiOsiCodes) {
  const readerButton = card.querySelector('.con-button[href*="/reader/"]');
  if (readerButton) {
    addReaderButton(readerButton, md, aiOsiCodes);
    return;
  }
  card.querySelectorAll('.con-button[href*="commerce."]').forEach((button) => {
    const originalOsi = getOsi(button);
    const buttonType = button.classList.contains('blue') ? 'primary' : 'secondary';
    const clonedButton = button.cloneNode(true);
    clonedButton.classList.add(AI_CLASS);
    clonedButton.dataset.wcsOsi = `${originalOsi},${aiOsiCodes[buttonType]}`;
    clonedButton.dataset.checkoutWorkflowStep = 'email';
    button.classList.add(NO_AI_CLASS);
    button.parentNode.appendChild(clonedButton);
    if (button.dataset?.quantity !== '1') attachQtyUpdateObserver(button, clonedButton);
  });
}
function processCard(card, cardIdx, fragPath, md, fragAudience) {
  const cardPlanType = getKey(fragPath, 'abm', md[fragAudience]);
  const aiOsiCodes = md[fragAudience][cardPlanType];
  const cardId = `${fragAudience}-${cardPlanType}-card${cardIdx + 1}`;
  const aiPrice = addCheckbox(card, cardId, md);
  if (!aiPrice.priceEl) return;
  addPrices(card, md, aiPrice);
  addButtons(card, md, aiOsiCodes);
}
function allReqsFound(card) {
  const reqs = card.querySelectorAll(`${CALLOUT_SELECTOR} [data-template="price"] .price,
    a.con-button[href*="commerce."],
    a.con-button[href*="/reader/"]`);
  return (reqs.length > 1);
}
function waitToProcessCardIfNeeded({ card, cardIdx, fragPath, md, fragAudience }) {
  const cardObserver = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (allReqsFound(card)) {
          observer.disconnect();
          processCard(card, cardIdx, fragPath, md, fragAudience);
        }
      }
    }
  });

  if (allReqsFound(card)) {
    processCard(card, cardIdx, fragPath, md, fragAudience);
  } else {
    cardObserver.observe(card, { childList: true, subtree: true });
  }
}
export default async function init(el) {
  const fragContainer = el.closest('div.fragment[data-path]:has(.merch-card, merch-card)');
  if (!fragContainer) return;
  const fragPath = fragContainer.dataset.path;
  const md = parseMetadata(getMetadata(el));
  const fragAudience = getKey(fragPath, 'individuals', md);
  fragContainer.querySelectorAll('.merch-card, merch-card').forEach((card, cardIdx) => {
    waitToProcessCardIfNeeded({ card, cardIdx, fragPath, md, fragAudience });
  });
}
