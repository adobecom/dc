import { createTag } from './miloUtils.js';

// Array of image names
const imageNames = [
  'credit-cards-amex_v_mc_d_du_jcb_pp.jpg',
  'credit-cards-amex_v_mc_jcb_jpbank.png',
  'credit-cards-amex_v_mc_pp.jpg',
  'credit-cards-amex_visa_mc_d_du_elc_pp_boleto.jpg',
  'credit-cards-amex_visa_mc_d_du_jcb_paypal.jpg',
  'credit-cards-amex_visa_mc_d_paypal.jpg',
  'credit-cards-amex_visa_mc_jcb_jpbank_jpstore.png',
  'credit-cards-v_mc_dd_pp.jpg',
  'credit-cards-v_mc.jpg',
];

export default async function replacePlaceholdersWithImages(elements) {
  createTag.then((tag) => {
    elements.forEach((p) => {
      const elementId = p.getAttribute('id');
      const elementDOM = document.getElementById(elementId);
      const cardName = elementDOM.innerHTML.toLowerCase();
      const matchedImage = imageNames.find((image) => image.includes(cardName));

      if (!matchedImage) {
        window.lana?.log(`No image available for credit-card placeholder: ${cardName}`);
        return;
      }

      const imagePath = `/acrobat/img/icons/${matchedImage}`;
      const imgAttributes = {
        src: imagePath,
        loading: 'lazy',
        'data-local': 'credit-cards',
      };
      const imgElement = tag('img', imgAttributes);

      imgElement.onerror = () => {
        window.lana?.log(`Error loading image for credit-card placeholder: ${cardName}`);
        imgElement.remove();
      };
      elementDOM.replaceWith(imgElement);
    });
  });
}
