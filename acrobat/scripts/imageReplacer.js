import { createTag } from './miloUtils.js';

export default async function replacePlaceholdersWithImages(locale, miloLibs) {
  const country = (locale?.split('-').pop()?.toLowerCase()) ?? 'us';
  const path = `${miloLibs}/icons/accepted-credit-cards/${country}.png?format=webply&optimize=medium`;
  const pattern = /{{credit-cards}}/g;
  const paragraphs = document.querySelectorAll('p');

  await createTag.then((tag) => {
    paragraphs.forEach((p) => {
      const matched = pattern.exec(p.innerHTML);
      if (matched) {
        const img = tag('img', {
          src: path,
          loading: 'lazy',
          'data-local': 'credit-cards-icon',
          class: 'credit-cards-icon',
          style: 'min-height: 33px;',
        });
        img.addEventListener('error', () => {
          window.lana?.log(`Failed to load credit-card icon for: ${country}`);
          this.remove();
        });
        p.parentNode.replaceChild(img, p);
      }
    });
  });
}
