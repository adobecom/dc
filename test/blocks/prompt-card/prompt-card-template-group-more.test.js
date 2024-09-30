/* eslint-disable no-promise-executor-return */
/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';

describe('prompt-cards using the template and group features', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-template-group-more.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await delay(500);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  it('creates prompt cards', () => {
    const blades = document.querySelectorAll('.prompt-card:not(.hidden)');
    expect([...blades].length).to.equal(2);
  });

  it('shows all cards after click view-all button', async () => {
    const button = document.querySelector('.view-all .con-button');
    button.click();
    const promptcards = document.querySelectorAll('.prompt-card:not(.hidden)');
    expect([...promptcards].length).to.equal(6);
  });
});
