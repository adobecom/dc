import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { getMetadata } = await import(`${miloLibs}/blocks/section-metadata/section-metadata.js`);
const { createTag, getConfig } = await import(`${miloLibs}/utils/utils.js`);
const { decorateDefaultLinkAnalytics } = await import(`${miloLibs}/martech/attributes.js`);

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

function waitForPlaceholderResolved(el) {
  // eslint-disable-next-line compat/compat
  return new Promise((resolve) => {
    if (el.classList.contains('placeholder-resolved')) {
      resolve();
    } else {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            resolve();
            observer.disconnect();
            break;
          }
        }
      });
      observer.observe(el, { childList: true });
    }
  });
}
async function getPrice(el) {
  await waitForPlaceholderResolved(el);
  const major = el.querySelector('.price-integer')?.textContent;
  const minor = el.querySelector('.price-decimals')?.textContent;
  const price = parseFloat(`${major}.${minor}`);
  return price;
}
function parseMetadata(metadata) {
  const results = {};
  for (const [key, val] of Object.entries(metadata)) {
    const [l1, l2, l3] = key.split('-');
    let value = val.content.textContent;
    if (key.includes('button')) value = val.content;
    else if (key.includes('description')) value = val.content.innerHTML;
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

async function cloneAndUpdatePrice(aiPriceEl, acrobatPriceEl) {
  const bundlePriceEl = acrobatPriceEl.cloneNode(true);
  bundlePriceEl.classList.add(AI_CLASS);
  acrobatPriceEl.classList.add(NO_AI_CLASS);
  acrobatPriceEl.parentNode.insertBefore(bundlePriceEl, acrobatPriceEl);
  let aiPrice = await getPrice(aiPriceEl);
  const acrobatPrice = await getPrice(acrobatPriceEl);
  if (acrobatPriceEl.dataset.template === 'optical') aiPrice /= 12;
  const bundlePrice = (acrobatPrice + aiPrice).toFixed(2);
  const major = bundlePrice.split('.')[0];
  const minor = bundlePrice.split('.')[1];
  setTimeout(() => {
    bundlePriceEl.querySelector('.price-integer').textContent = major;
    bundlePriceEl.querySelector('.price-decimals').textContent = minor;
  }, 100);
}
function getKey(fragmentPath, defaultKey, obj) {
  const reservedKeys = ['reader', 'checkbox'];
  for (const [key] of Object.entries(obj)) {
    if (!reservedKeys.includes(key) && fragmentPath.includes(key)) return key;
  }
  return defaultKey;
}
function getAIPriceEl(card) {
  return card.querySelector(`${CALLOUT_SELECTOR} [is="inline-price"]`);
}
function sendCheckboxAnalytics(fragAudience, cardPlanType, checked) {
  const msg = `${fragAudience}-${cardPlanType}-checkbox-${checked ? 'checked' : 'unchecked'}`;
  // eslint-disable-next-line no-underscore-dangle
  window._satellite?.track?.('event', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: msg,
        },
      },
    },
    data: { _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName: msg } } } } },
  });
}
async function addCheckbox({ card, md, fragAudience, cardPlanType }) {
  const cardTitle = card.querySelector('h3')?.textContent.trim().toLowerCase().split(' ').join('-');
  const cardId = `${fragAudience}-${cardPlanType}-${cardTitle}`;
  card.dataset.aiAdded = false;
  const callout = card.querySelector(CALLOUT_SELECTOR);
  const isReader = card.querySelector('.con-button[href*="adobe.com/reader/"]');
  let description = isReader
    ? md.checkbox.reader.description
    : md.checkbox.description;
  description = description.replace('[AIP]', '<span class="price-placeholder"></span>');
  const checkboxContainer = createTag(
    'div',
    { slot: 'callout-content', class: 'ai-checkbox-container' },
    `<input type="checkbox" id="ai-checkbox-${cardId}">
    <label for="ai-checkbox-${cardId}">
      <span><strong>${md.checkbox.headline}</strong></span>
      <span class="ai-checkbox-subtitle">${description}</span>
    </label>`,
  );
  const priceEl = getAIPriceEl(card);
  const pricePlaceholder = checkboxContainer.querySelector('.price-placeholder');
  pricePlaceholder.replaceWith(priceEl);
  const checkbox = checkboxContainer.querySelector('input');
  checkbox.addEventListener('change', (e) => {
    const merchCard = e.target.closest('merch-card');
    merchCard.dataset.aiAdded = e.target.checked;
    sendCheckboxAnalytics(fragAudience, cardPlanType, e.target.checked);
  });

  callout?.replaceWith(checkboxContainer);
}
function addReaderPrice(md, priceEl, readerPriceEl) {
  readerPriceEl.innerHTML = `
    <span class="${NO_AI_CLASS}">${readerPriceEl.innerHTML}</span>
    <span class="${AI_CLASS}"></span>
  `;
  const aiPriceEl = priceEl.cloneNode(true);
  readerPriceEl.querySelector(`.${AI_CLASS}`).appendChild(aiPriceEl);
  const commitmentTypeLabelEl = createTag(
    'p',
    { class: `card-heading ${AI_CLASS}`, slot: 'body-xxs' },
    `<em>${md.reader.pricing.terms}</em>`,
  );
  readerPriceEl.parentNode.insertBefore(commitmentTypeLabelEl, readerPriceEl);
}
async function addPrices({ card, md }) {
  const prices = card.querySelectorAll('[is="inline-price"]');
  if (!prices.length) return;
  const priceEl = getAIPriceEl(card);
  const priceArray = Array.from(prices).filter((el) => el !== priceEl);

  priceArray.forEach((el) => {
    cloneAndUpdatePrice(priceEl, el);
  });
  const freeProductPriceEl = card?.querySelector('p[slot="heading-m-price"]');
  if (!priceArray?.length && freeProductPriceEl) addReaderPrice(md, priceEl, freeProductPriceEl);
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
  const clonedAiContent = md.reader.buy.button.cloneNode(true);
  const buyButton = clonedAiContent.querySelector('a');
  buyButton.classList.add(AI_CLASS);
  buyButton.classList.add('button-l');
  buyButton.dataset.wcsOsi = aiOsiCodes.primary;
  if (!button.getAttribute('aria-label')) {
    const headline = button.closest('div:has(h3)')?.querySelector('h3')?.textContent;
    button.setAttribute('aria-label', `${button.textContent} ${headline}`);
  }
  button.parentNode.appendChild(buyButton);
  if (buyButton.hasAttribute('aria-label')) {
    const newLabel = buyButton.getAttribute('aria-label').replace('Acrobat', 'AI Assistant');
    buyButton.setAttribute('aria-label', newLabel);
  } else {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
          const newLabel = buyButton.getAttribute('aria-label').replace('Acrobat', 'AI Assistant');
          buyButton.setAttribute('aria-label', newLabel);
          observer.disconnect();
        }
      }
    });
    observer.observe(button, { attributes: true, attributeFilter: ['aria-label'] });
  }

}
function addAriaLabel(button, newButton) {
  if (button.hasAttribute('aria-label')) {
    newButton.setAttribute('aria-label', `${button.getAttribute('aria-label')} with AI Assistant`);
  } else {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
          newButton.setAttribute('aria-label', `${button.getAttribute('aria-label')} with AI Assistant`);
          observer.disconnect();
        }
      }
    });
    observer.observe(button, { attributes: true, attributeFilter: ['aria-label'] });
  }
}
async function addButtons({ card, md, fragAudience, cardPlanType }) {
  decorateDefaultLinkAnalytics(card, getConfig());
  const aiOsiCodes = md[fragAudience][cardPlanType];
  const readerButton = card.querySelector('.con-button[href*="/reader/"]');
  if (readerButton) {
    addReaderButton(readerButton, md, aiOsiCodes);
    return;
  }
  card.querySelectorAll('.con-button[is="checkout-link"]').forEach((button) => {
    const originalOsi = getOsi(button);
    const buttonType = button.classList.contains('blue') ? 'primary' : 'secondary';
    const clonedButton = button.cloneNode(true);
    clonedButton.classList.add(AI_CLASS);
    clonedButton.dataset.wcsOsi = `${originalOsi},${aiOsiCodes[buttonType]}`;
    clonedButton.dataset.checkoutWorkflowStep = 'email';
    const daaLl = clonedButton.getAttribute('daa-ll');
    clonedButton.setAttribute('daa-ll', `ai-${daaLl}`);
    button.classList.add(NO_AI_CLASS);
    button.parentNode.insertBefore(clonedButton, button);
    addAriaLabel(button, clonedButton);
    attachQtyUpdateObserver(button, clonedButton);
  });
}
function processCard(card, md) {
  const fragContainer = card.closest('div.fragment[data-path]');
  if (!fragContainer) return;
  const fragPath = fragContainer.dataset.path;
  const fragAudience = getKey(fragPath, 'individuals', md);
  const cardPlanType = getKey(fragPath, 'abm', md[fragAudience]);
  addCheckbox({ card, md, fragAudience, cardPlanType });
  addPrices({ card, md });
  addButtons({ card, md, fragAudience, cardPlanType });
}
export default async function init(el) {
  const md = parseMetadata(getMetadata(el));
  document.querySelectorAll('merch-card').forEach((card) => {
    processCard(card, md);
  });
  const mainObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.matches && node.nodeName === 'MERCH-CARD') {
            processCard(node, md);
          }
        });
      }
    }
  });
  mainObserver.observe(document.querySelector('main'), { childList: true, subtree: true });
}
