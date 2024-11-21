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
        results[l1][l2][l3] = value;
      }
    }
  }
  return results;
}
function updatePrice(el, price1, price2) {
  const newPrice = (price1.price + price2.price).toFixed(2);
  const major = newPrice.split('.')[0];
  const minor = newPrice.split('.')[1];
  el.querySelector('.price-integer').textContent = major;
  el.querySelector('.price-decimals').textContent = minor;
}
function getAiOsiCodes(el, metadata) {
  const closestFragment = el.closest('.fragment[data-path]');
  if (!closestFragment) return { content: false, osi: false };
  const fragmentPath = closestFragment.dataset.path;
  let firstTabId = 'individual';
  for (const [key] of Object.entries(metadata)) {
    if (fragmentPath.includes(key)) {
      firstTabId = key;
      break;
    }
  }
  let secondTabId = 'abm';
  for (const [key] of Object.entries(metadata[firstTabId])) {
    if (fragmentPath.includes(key)) {
      secondTabId = key;
      break;
    }
  }
  return metadata[firstTabId][secondTabId];
  // const parentTabContainer = closestTabContainer?.parentNode?.closest('[role="tabpanel"]');
  // const closestId = closestTabContainer?.id?.split('-')[3] || '1';
  // const parentTabId = parentTabContainer?.id?.split('-')[3] || '1';
  // const offerType = el.classList.contains('con-button') && !el.classList.contains('blue')
  //   ? 'secondary' : 'primary';
  // const productObj = metadata.products[offerType]?.[closestId];
  // if (!productObj) return { content: false, osi: false };
  // const additionalTabIndex = productObj[parentTabId] ? parentTabId : 'other';
  // const product = productObj[additionalTabIndex];
  // const content = product?.content;
  // const osiEl = content?.tagName === 'A' || content.dataset.wcsOsi
  //   ? content : content?.querySelector('a, [data-wcs-osi]');
  // const osi = getOsi(osiEl);
  // return { content, osi, price: product.price, id: `${parentTabId}-${closestId}` };
}
function addCheckbox(card, metadata, price, id) {
  card.dataset.aiAdded = false;
  const callout = card.querySelector('[slot="callout-content"]');
  const description = metadata.checkbox.description.replace('[price]', price.priceEl.outerHTML);
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
  callout.replaceWith(checkboxContainer);
  const checkbox = checkboxContainer.querySelector('input');
  checkbox.addEventListener('change', (e) => {
    const merchCard = e.target.closest('merch-card');
    merchCard.dataset.aiAdded = e.target.checked;
  });
}
function addPrices(card, metadata, aiPrice) {
  card.querySelectorAll('[data-wcs-osi][data-template="price"]').forEach((el) => {
    // TODO: exit if in callout or checkbox
    const originalPrice = getPrice(el);
    // TODO: clone el, add classes
    // TODO: updatePrice on clone
    // updatePrice(priceClone, aiPrice, originalPrice);
    console.log('prices', aiPrice, originalPrice);
  });
}
function addButtons(card, metadata, aiOsi) {
  card.querySelectorAll('.con-button').forEach((el) => {
    // TODO: handle button not being a cart link (reader, business pricing, modal)
    const originalOsi = getOsi(el);
    // TODO: clone el, add classes, add osi, fix quantity add event listener for quantity updates
    console.log('osi codes', aiOsi, originalOsi);
  });
}
export default async function init(el) {
  const container = el.closest('div:has(.merch-card, merch-card)');
  const cards = container.querySelectorAll('.merch-card, merch-card');
  if (!cards.length) return;
  const md = parseMetadata(getMetadata(el));
  cards.forEach((card, index) => {
    const aiOsiCodes = getAiOsiCodes(card, md);
    const aiPrice = addCheckbox(card, md, price, `${id}-${index + 1}`);
    addPrices(card, md, aiPrice);
    addButtons(card, md, aiOsiCodes);
  });
}
