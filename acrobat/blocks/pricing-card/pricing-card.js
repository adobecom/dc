import {createTag} from "../../scripts/miloUtils.js";

const init = (block) => {
  createTag.then((createTag) => {
    const properties = getProperties(block);
    const cardContainer = createTag('div', { class: 'content-container' });
    const cardContent = createTag('div', { class: 'card-box' }, cardContainer);
    const promotionText = createTag('div', {class: 'promotion-text'});
    promotionText.innerText = properties['promotionText'];
    const title = createTag('div', {class: 'title'});
    title.innerText = properties['title'];
    const price = createTag('div', {class: 'price'});
    const disclaimer = createTag('div', {class: 'disclaimer'});
    const radioGroup = createTag('div', {class: 'radio-group'});

    for (let i = 1; i <= properties['countOptions']; i++) {
      const currentOption = `option${i}`;
      const radioInput = createTag('input', {
        type: 'radio',
        name: 'selectedOption',
        value: properties[currentOption],
        id: currentOption + '-' + properties[currentOption],
        option: currentOption
      });
      if (properties['initialOption'] === currentOption) {
        radioInput.setAttribute('checked', true);
      }
      radioInput.addEventListener('change', (e) => toggleContent(e.target.getAttribute('option'),block));
      radioGroup.append(radioInput);

      const label = createTag('label', {for: currentOption + '-' + properties[currentOption]});
      label.innerText = properties[currentOption];
      radioGroup.append(label);
    }

    const divider = createTag('div', {class: 'divider'});
    const footer = createTag('div', {class: 'footer'});


    cardContent.append(promotionText);
    cardContent.append(title);
    cardContent.append(price);
    cardContent.append(disclaimer);
    cardContent.append(radioGroup);
    cardContent.append(divider);
    cardContent.append(footer);
    block.append(cardContent);


    collectContent(block, properties);
    toggleContent(properties['initialOption'], block);

  });
};
const getProperties = (table) => {
  const properties = {};
  const tableRows = table.querySelectorAll(':scope > div');
  let countOptions = 0;
  tableRows.forEach((row) => {
    if (row.children[0] && row.children[0].innerText) {
      properties[row.children[0].innerText] =  row.children[1] ? row.children[1].innerText : '';
      if (row.children[0].innerText.startsWith('option')) countOptions ++;
    }
  });
  properties.countOptions = countOptions;
  return properties;
};
const getContent = (selectedOption) =>  {
  const optionContent = document.querySelectorAll(`.section.${selectedOption}`);
let price;
optionContent.forEach((content) => {
    const optionProperties = getProperties(content.querySelector('.section-metadata'));
    if (optionProperties['place'] === 'price') {
      price =  content;
    };
  });
return price;
};
const radioChangeHandler = (radio, card) => {
const priceOption = getPrice(radio.target.getAttribute('option'));
   card.querySelector('.price').append(priceOption);
};

const collectContent = (cardNode, cardProperties) => {
  const prices = [];
  const disclaimers = [];
  const selectedOption = cardProperties['initialOption'];
  // todo implement footers (ctas, qty selectors)
  const footers = [];
  for (let i = 1; i <= cardProperties['countOptions']; i++) {
    const optionContent = document.querySelectorAll(`.section.option${i}`);
    optionContent.forEach((content) => {
      const optionProperties = getProperties(content.querySelector('.section-metadata'));
      if (optionProperties['pricing-card'] === cardProperties.title) {
        hideElement(content);
        switch (optionProperties['place']) {
          case 'price' : prices.push(content);break;
          case 'disclaimer': disclaimers.push(content);break;
          case 'footer': footers.push(content);break;
        }
      }
    });
  }

  prices.forEach(p => {
    cardNode.querySelector('.price')?.append(p);
  });
  disclaimers.forEach(d => {
    cardNode.querySelector('.disclaimer')?.append(d);
  });
  footers.forEach(f => {
    cardNode.querySelector('.footer')?.append(f);
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
