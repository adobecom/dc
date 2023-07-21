import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({
  path: './mocks/pricing.body.html',
});

const { default: init } = await import('../../acrobat/scripts/ccTranslations.js');

describe('Placeholder Image swap', () => {
  it('initites placeholdeers', async () => {
    init();
    // verify image
    const ccImg = document.querySelectorAll("img[data-local='credit-cards']");
    expect(ccImg.length).to.equal(1);
  });
});
