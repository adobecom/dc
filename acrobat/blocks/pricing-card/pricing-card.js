import {createTag} from "../../scripts/miloUtils.js";

const init = (block) => {
  createTag.then((createTag) => {
    const properties = getProperties(block);
    preparePricingCardDOM(block, properties, createTag);
    collectContent(block, properties, createTag);
    toggleContent(properties['initialOption'], block);
  });
};
const preparePricingCardDOM = (block, properties, createTag) => {
  const cardContentContainer = createTag('div', { class: 'content-container' });
  const mainContent = createTag('div', { class: 'main-content' });
  const card = createTag('div', { class: 'card-box' }, cardContentContainer);
  const promotion = createTag('div', {class: 'promotion'});

  if (properties['promotionText']) {
    const promotionText = createTag('div', {class: 'promotion-text'}, properties['promotionText']);
    promotion.append(promotionText);
    card.classList.add('promotion-active');
  }
  card.insertBefore(promotion, cardContentContainer);

  const title = createTag('div', {class: 'title'}, properties['title']);
  const price = createTag('div', {class: 'price-placeholder'});
  const disclaimer = createTag('div', {class: 'disclaimer'});
  const radioGroup = createRadioGroup(properties, createTag, block);
  const footer = createFooter(properties, createTag);

  mainContent.append(title);
  mainContent.append(price);
  mainContent.append(disclaimer);
  cardContentContainer.append(mainContent);
  cardContentContainer.append(radioGroup);
  cardContentContainer.append(footer);
  block.append(card);
  cardContentContainer.classList.add(properties['title'].replace(/\s+/g, '-').toLowerCase());

}
const createRadioGroup = (properties, createTag, block) => {
  const radioGroup = createTag('div', {class: 'radio-group'});
  for (let i = 1; i <= properties['countOptions']; i++) {
    const currentOption = `option${i}`;
    const radioInput = createTag('input', {
      type: 'radio',
      name: 'selectedOption' + properties['title'],
      value: properties[currentOption],
      id: currentOption + '-' + properties[currentOption] + '-' + properties['title'],
      option: currentOption
    });
    if (properties['initialOption'] === currentOption) {
      radioInput.setAttribute('checked', true);
    }
    radioInput.addEventListener('change', (e) => toggleContent(e.target.getAttribute('option'), block));
    const label = createTag('label', {for: currentOption + '-' + properties[currentOption] + '-' + properties['title'],});
    label.innerText = properties[currentOption];

    const radioItem = createTag('div', {class: 'radio-item'});
    radioItem.append(radioInput);
    radioItem.append(label);
    radioGroup.append(radioItem);
  }
  return radioGroup;
}
const createFooter = (properties, createTag) => {
  const footer = createTag('div', {class: 'card-footer'});
  const footerSecureTransaction =  createTag('div', {class: 'footer-secure-transaction'});
  const footerImg = createTag('img', {class: 'icon', src: '/acrobat/blocks/pricing-card/lock-icon-grey-40x50.png'});
  const secureTransactionText = createTag('span', {class: 'text'}, 'Secure transaction');
  footerSecureTransaction.append(footerImg);
  footerSecureTransaction.append(secureTransactionText);
  const footerContent = createTag('div', {class: 'footer-content'});
  footer.append(footerSecureTransaction);
  footer.append(footerContent);
  return footer;
}
const getProperties = (block) => {
  const properties = {};
  const tableRows = block.querySelectorAll(':scope > div');
  let countOptions = 0;
  tableRows.forEach((row) => {
    if (row.children[0] && row.children[0].innerText) {
      properties[row.children[0].innerText] =  row.children[1] ? row.children[1].innerHTML : '';
      if (row.children[0].innerText.startsWith('option')) {
        countOptions ++;
      }
    }
  });
  if (!properties['initialOption']) {
    properties.initialOption = 'option1';
  }
  properties.countOptions = countOptions;
  return properties;
};
const collectContent = (cardNode, cardProperties, createTag) => {
  const prices = [];
  const disclaimers = [];
  const ctas = [];
  const getPricesFromTableProps = (i) => {
    prices.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`price${i}`]));
    ctas.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`cta${i}`]));
    disclaimers.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`disclaimer${i}`]));
  }

  for (let i = 1; i <= cardProperties['countOptions']; i++) {
    if (cardProperties['price1']) {
      getPricesFromTableProps(i);
    }
  }

  prices.forEach(p => {
    cardNode.querySelector('.price-placeholder')?.append(p);
  });
  disclaimers.forEach(d => {
    cardNode.querySelector('.disclaimer')?.append(d);
  });
  ctas.forEach(f => {
    cardNode.querySelector('.footer-content')?.append(f);
  });
}

const toggleContent = (option, card) => {
 card.querySelectorAll('.display').forEach(e => hideElement(e));
 card.querySelectorAll(`.${option}`).forEach(e => displayElement(e));
};
const hideElement = (element) => {
  element.classList.add('hide');
  element.classList.remove('display');
}
const displayElement = (element) => {
  element.classList.add('display');
  element.classList.remove('hide');

};

export default init;
