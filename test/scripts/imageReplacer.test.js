import { expect } from '@esm-bundle/chai';
import replacePlaceholdersWithImages from '../../acrobat/scripts/imageReplacer.js';

describe('replacePlaceholdersWithImages', () => {
  let documentElement;

  beforeEach(() => {
    documentElement = document.createElement('div');
    documentElement.innerHTML = `
    <p>AMEX_V_MC_D_DU_JCB_PP</p>
    <p>AMEX_V_MC_JCB_JPBANK</p>
    <p>AMEX_V_MC_PP</p>
    <p>AMEX_VISA_MC_D_DU_ELC_PP_BOLETO</p>
    <p>AMEX_VISA_MC_D_DU_JCB_PAYPAL</p>
    <p>AMEX_VISA_MC_D_PAYPAL</p>
    <p>AMEX_VISA_MC_JCB_JPBANK_JPSTORE</p>
    <p>V_MC_DD_PP</p>
    <p>V_MC</p>
  `;
  });

  it('replaces card placeholders with images', async () => {
    await replacePlaceholdersWithImages(documentElement);
    const imgElements = documentElement.querySelectorAll('img');
    expect(imgElements.length).to.equal(9);
    imgElements.forEach((img) => {
      expect(img.getAttribute('src')).to.match(/\/acrobat\/img\/icons\/credit-cards-.+\.(jpg|png)/);
      expect(img.getAttribute('loading')).to.equal('lazy');
      expect(img.getAttribute('data-local')).to.equal('credit-cards');
    });
  });

  it('removes the original paragraph element', async () => {
    await replacePlaceholdersWithImages(documentElement);
    const pElements = documentElement.querySelectorAll('p');
    expect(pElements.length).to.equal(0);
  });

  it('logs an error if an image fails to load', async () => {
    await replacePlaceholdersWithImages(documentElement);
    const imgElements = documentElement.querySelectorAll('img');
    await imgElements[0].onerror();
    const imgElements2 = documentElement.querySelectorAll('img');
    expect(imgElements2.length).to.equal(8);
  });
});
