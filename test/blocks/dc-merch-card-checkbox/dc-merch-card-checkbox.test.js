import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../acrobat/blocks/dc-merch-card-checkbox/dc-merch-card-checkbox.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
document.head.innerHTML = await readFile({ path: './mocks/head.html' });

describe('Merch Card AI Checkbox', () => {
  before(async () => {
    const elem = document.querySelector('.dc-merch-card-checkbox');
    init(elem);
  });

  it('should add AI checkbox to an Acrobat Reader merch card', async () => {
    const acrobatReaderAiCheckbox = await waitForElement('#ai-checkbox-individual-abm-acrobat-reader');
    expect(acrobatReaderAiCheckbox).to.exist;
  });

  it('should change price and CTA when AI is bundled with Acrobar Reader', async () => {
    const acrobatReaderAiCheckbox = await waitForElement('#ai-checkbox-individual-abm-acrobat-reader');
    const price = acrobatReaderAiCheckbox.closest('merch-card').querySelector('p#free');
    const actionArea = acrobatReaderAiCheckbox.closest('merch-card').querySelector('div[slot="footer"] .action-area');

    const aiPrice = window.getComputedStyle(price.querySelector('span.ai-bundled'));
    const noAiPrice = window.getComputedStyle(price.querySelector('span.solo-product'));

    const aiCTA = window.getComputedStyle(actionArea.querySelector('a:not(.solo-product)'));
    const noAiCTA = window.getComputedStyle(actionArea.querySelector('a.solo-product'));

    expect(aiPrice.display).to.include('none');
    expect(aiCTA.display).to.include('none');
    expect(noAiPrice.display).to.include('inline');
    expect(noAiCTA.display).to.include('inline');

    acrobatReaderAiCheckbox.click();

    expect(aiPrice.display).to.include('inline');
    expect(aiCTA.display).to.include('inline');
    expect(noAiPrice.display).to.include('none');
    expect(noAiCTA.display).to.include('none');
  });

  it('should change quantity of licences in ai CTA href for Business Acrobat Standard card', async () => {
    const acrobatStandardBusinessAiCheckbox = await waitForElement('#ai-checkbox-business-abm-acrobat-standard-for-teams');
    const aiCTA = acrobatStandardBusinessAiCheckbox.closest('merch-card').querySelector('div[slot="footer"] .action-area a.ai-bundled');
    const nonAiCTA = acrobatStandardBusinessAiCheckbox.closest('merch-card').querySelector('div[slot="footer"] .action-area a.solo-product');

    expect(aiCTA.dataset.quantity).to.equal('2,2');
    expect(nonAiCTA.dataset.quantity).to.equal('2');

    nonAiCTA.dataset.quantity = 124;
    // eslint-disable-next-line compat/compat
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });

    expect(aiCTA.dataset.quantity).to.equal('124,124');
  });
});
