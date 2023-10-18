import { createTag } from './miloUtils.js';

export default async function replacePlaceholdersWithImages(locale, miloLibs) {
  const country = (locale?.split('-').pop()?.toLowerCase()) ?? 'us';
  const path = `${miloLibs}/icons/accepted-credit-cards/${country}.png?format=webply&optimize=medium`;
  const pattern = /{{credit-cards}}/g;

  await createTag.then((tag) => {
    document.querySelectorAll('p').forEach((p) => {
      const matched = pattern.exec(p.innerHTML);
      if (matched) {
        const img = tag('img', {
          src: path,
          loading: 'lazy',
          class: 'credit-cards-icon',
          style: 'min-height: 33px;',
          'data-country': `${country}`,
          onerror: `window.lana?.log('Failed to load credit-card icon ${country}'); this.remove()`,
        });
        p.replaceWith(img);
      }
    });
  });
}
