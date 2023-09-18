import {createTag} from "./miloUtils.js";

export default async function replacePlaceholdersWithImages(elements) {
  createTag.then((tag) => {

    elements.forEach((p) => {
      const elementId = p.getAttribute('id');
      const elementDOM = document.getElementById(elementId);
      const cardName = elementDOM.innerHTML.toLowerCase();
      const imageName = `credit-cards-${cardName}.jpg`;
      const imagePath = `/acrobat/img/icons/${imageName}`;
      const imgAttributes = {
        'src': imagePath,
        'loading': 'lazy',
        'data-local': 'credit-cards'
      };
      
      const imgElement = tag('img', imgAttributes);
      // Attach the onerror event handler
      imgElement.onerror = () => {
        window.lana?.log('No image available for credit-card placeholder');
        imgElement.remove(); // this is not working properly
      };
      elementDOM.replaceWith(imgElement);
    });

  });
}
