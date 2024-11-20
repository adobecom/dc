import { setLibs } from '../../../utils.js';

const miloLibs = setLibs('/libs');
const { getMetadata } = await import(`${miloLibs}/blocks/section-metadata/section-metadata.js`);

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
  const major = parseInt(el.querySelector('.price-integer')?.textContent, 10);
  const minor = parseInt(el.querySelector('.price-decimals')?.textContent, 10);
  const price = parseFloat(`${major}.${minor}`).toFixed(2);
  return { major, minor, price };
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
function updatePrice(el, price1, price2) {
  const newPrice = (price1 + price2).toString();
  const major = newPrice.split('.')[0];
  const minor = newPrice.split('.')[1];
  el.querySelector('.price-integer').textContent = major;
  el.querySelector('.price-decimals').textContent = minor;
}
function getProduct(el, metadata) {
  const closestTabContainer = el.closest('[role="tabpanel"]');
  const parentTabContainer = closestTabContainer.closest('[role="tabpanel"]');
  const closestId = closestTabContainer?.id?.split('-')[3] || '0';
  const parentTabId = parentTabContainer?.id?.split('-')[3] || '1';
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
  return { content, osi, price: product.price };
}
function addCheckbox(card, metadata) {
  card.dataset.aiAdded = false;
  // TODO: find callout box and add checkbox, update price
  // TODO: event listener: if checked add class, if not remove
}
function addPrices(card, metadata) {
  const { price: aiPrice } = getProduct(card, metadata);
  card.querySelectorAll('[data-wcs-osi][data-template="price"]').forEach((el) => {
    // TODO: exit if in callout or checkbox
    const originalPrice = getPrice(el);
    // TODO: clone el, add classes
    // TODO: price node is string and should be number. Can use updatePrice once that's fixed?
    console.log('prices', aiPrice, originalPrice);
  });
}
function addButtons(card, metadata) {
  const { osi: aiOsi } = getProduct(card, metadata);
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
  const metadata = getMetadata(el);
  const parsedMetadata = parseMetadata(metadata);
  cards.forEach((card) => {
    addCheckbox(card);
    addPrices(card, parsedMetadata);
    addButtons(card, parsedMetadata);
  });
}
