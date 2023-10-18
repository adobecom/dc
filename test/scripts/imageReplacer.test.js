import { expect } from '@esm-bundle/chai';
import replacePlaceholdersWithImages from '../../acrobat/scripts/imageReplacer.js';

describe('replacePlaceholdersWithImages', () => {
  let documentElement;

  beforeEach(() => {
    documentElement = document.createElement('div');
    documentElement.innerHTML = '<p>{{credit-cards}}</p>';
    document.body.innerHTML = '';
    document.body.appendChild(documentElement);
  });

  it('replaces card placeholders with images', async () => {
    await replacePlaceholdersWithImages('es-US', '/libs');
    const imgElements = document.querySelectorAll('img');
    expect(imgElements.length).to.equal(1);
    imgElements.forEach((img) => {
      expect(img.getAttribute('src')).to.match(/.*\/icons\/accepted-credit-cards\/[^/]+\.(jpg|png|webp)/);
      expect(img.getAttribute('loading')).to.equal('lazy');
      expect(img.getAttribute('class')).to.equal('credit-cards-icon');
    });
  });

  it('removes the original paragraph element', async () => {
    await replacePlaceholdersWithImages('en-US', '/libs');
    const pElements = documentElement.querySelectorAll('p');
    expect(pElements.length).to.equal(0);
  });

  it('logs an error if an image fails to load', async () => {
    await replacePlaceholdersWithImages('en-US', '/libs');
    expect(documentElement.querySelectorAll('img').length).to.equal(1);
    await documentElement.querySelectorAll('img')[0].onerror();
    expect(documentElement.querySelectorAll('img').length).to.equal(0);
  });
});
