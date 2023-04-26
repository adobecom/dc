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
  const cardContainer = createTag('div', { class: 'content-container' });
  const cardContent = createTag('div', { class: 'card-box' }, cardContainer);
  if (properties['promotionText']) {
    const promotionText = createTag('div', {class: 'promotion-text'}, properties['promotionText']);
    cardContent.insertBefore(promotionText, cardContainer);
    cardContent.classList.add('promotion-active');
  }
  const title = createTag('div', {class: 'title'}, properties['title']);
  const price = createTag('div', {class: 'price'});
  const disclaimer = createTag('div', {class: 'disclaimer'});
  const radioGroup = createRadioGroup(properties, createTag, block);
  const divider = createTag('div', {class: 'divider'});
  const footer = createFooter(properties, createTag);
  cardContainer.append(title);
  cardContainer.append(price);
  cardContainer.append(disclaimer);
  cardContainer.append(radioGroup);
  cardContainer.append(divider);
  cardContainer.append(footer);
  block.append(cardContent);
  cardContainer.classList.add(properties['title'].replace(/\s+/g, '-').toLowerCase());

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
      properties[row.children[0].innerText] =  row.children[1] ? row.children[1].innerText : '';
      if (row.children[0].innerText.startsWith('option')) {
        countOptions ++;
        const xfLink = row.querySelector('a[href]');
        if (xfLink) {
          properties[row.children[0].innerText + 'XfLink'] = xfLink.getAttribute('href');
        }
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
// todo 1: promotion text:
// todo 1: make border collor customizable (orange or black depending on promotion existence)
// todo 1: text can have more lines and different style for each line

// todo 2: toggle content:
// todo 2: what will be content for price/disclaimer/footer and what parts we should include in pricing cards, how it will be created

// todo 3:
// make sure that we hide/show (manipulate) with dom only inside current pricing card
// test with more than one pricing card on the page

// todo 4:
// should we create a container element where we can put all pricing cards inside it (maybe create card container that will pick all pricing cards from page)
