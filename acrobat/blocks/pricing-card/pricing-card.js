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
  const price = createTag('div', {class: 'price'});
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
  properties.countOptions = countOptions;
  console.log('properties', properties);
  return properties;
};
const collectContent = (cardNode, cardProperties, createTag) => {
  const prices = [];
  const disclaimers = [];
  const ctas = [];
  const getPricesFromSections = (i) => {
    const optionContent = document.querySelectorAll(`.section.option${i}`);
    optionContent.forEach((content) => {
      const optionProperties = getProperties(content.querySelector('.section-metadata'));
      if (optionProperties['pricing-card'] === cardProperties.title) {
        hideElement(content);
        switch (optionProperties['place']) {
          case 'price' : prices.push(content);break;
          case 'disclaimer': disclaimers.push(content);break;
          case 'footer-content': ctas.push(content);break;
        }
      }
    });
  };
  const getPricesFromTableProps = (i) => {
    prices.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`price${i}`]));
    ctas.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`cta${i}`]));
    disclaimers.push(createTag('div',{ class: `option${i} hide` }, cardProperties[`disclaimer${i}`]));
  }

  for (let i = 1; i <= cardProperties['countOptions']; i++) {
    if (cardProperties['price1']) {
      getPricesFromTableProps(i);
    } else {
      getPricesFromSections(i);
    }
  }

  prices.forEach(p => {
    cardNode.querySelector('.price')?.append(p);
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

//todo  inline prices and buttons (when milo  m@s is released) - check do we need some style adaptation
//todo finish section styling (with class pricing-card-columns)
//todo see how qty selector will be supported, it should be m@s element since in aem it is also m@s element
//todo since we have different variations of pricing pods, make sure we support all of them (maybe create css rules that can be added to section that contains prices)
