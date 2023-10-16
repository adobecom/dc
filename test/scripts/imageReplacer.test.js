import { expect } from '@esm-bundle/chai';
import replacePlaceholdersWithImages from '../../acrobat/scripts/imageReplacer.js';

describe('replacePlaceholdersWithImages', () => {
  let documentElement;

  beforeEach(() => {
    documentElement = document.createElement('div');
    documentElement.innerHTML = '<p>{{credit-cards}}</p>';
  });

  it('replaces card placeholders with images', async () => {
    await replacePlaceholdersWithImages(documentElement, 'en-US', '/libs');
    const imgElements = await documentElement.querySelectorAll('img');
    expect(imgElements.length).to.equal(1);
    imgElements.forEach((img) => {
      expect(img.getAttribute('src')).to.match(/.*\/icons\/accepted-credit-cards\/[^/]+\.(jpg|png|webp)/);
      expect(img.getAttribute('loading')).to.equal('lazy');
      expect(img.getAttribute('data-local')).to.equal('credit-cards-icon');
    });
  });

  it('removes the original paragraph element', async () => {
    await replacePlaceholdersWithImages(documentElement, 'en-US', '/libs');
    const pElements = documentElement.querySelectorAll('p');
    expect(pElements.length).to.equal(0);
  });

  it('logs an error if an image fails to load', async () => {
    await replacePlaceholdersWithImages(documentElement, 'en-US', '/libs');
    const imgElements = documentElement.querySelectorAll('img');
    await imgElements[0].onerror();
    const imgElements2 = documentElement.querySelectorAll('img');
    expect(imgElements2.length).to.equal(1);
  });
});
