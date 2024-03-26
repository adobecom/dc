import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../acrobat/blocks/interactive-marquee/interactive-marquee.js');

describe('Interactive Marquee', () => {
  const marquees = document.querySelectorAll('.interactive-marquee');
  marquees.forEach(async (marquee) => {
    await init(marquee);
  });
  it('Should active a selected slide', () => {
    const tab = document.querySelector('.slider-tab:nth-child(2)');
    const slide = document.querySelector('.slider-deck .slide:nth-child(2)');
    tab.click();
    expect(tab.classList.contains('active')).to.be.true;
    expect(slide.classList.contains('active')).to.be.true;
  });
});
