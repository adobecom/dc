import { createTag } from './miloUtils.js';

export default async function replacePlaceholdersWithImages(documentElement, locale, miloLibs) {
  const extractCountryCode = () => {
    if (typeof locale !== 'undefined') {
      return locale.split('-').pop().toLowerCase();
    }
    return 'us';
  };

  const country = extractCountryCode();
  const path = `${miloLibs}/icons/accepted-credit-cards/${country}.png?format=webply&optimize=medium`;
  const pattern = /{{credit-cards}}/g;
  const paragraphs = documentElement.querySelectorAll('p');

  await createTag.then((tag) => {
    paragraphs.forEach((p) => {
      const matched = pattern.exec(p.innerHTML);
      if (matched) {
        const cardsImage = tag('img', {
          src: path,
          loading: 'lazy',
          'data-local': 'credit-cards-icon',
          style: 'min-height: 33px;',
        });
        cardsImage.onerror = async () => {
          window.lana?.log(`Failed to load credit-card icon for: ${country}`);
          cardsImage.remove();
        };
        p.replaceWith(cardsImage);
      }
    });
  });
}
