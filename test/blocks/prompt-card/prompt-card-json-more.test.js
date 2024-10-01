/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

describe('prompt-cards view all feature', () => {
  before(async () => {
    const promptcards = await readFile({ path: './mocks/promptcards.json' });
    sinon.stub(window, 'fetch');
    const res = new window.Response(promptcards, { status: 200 });
    window.fetch.returns(Promise.resolve(res));
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-json-more.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await delay(500);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  after(() => {
    sinon.restore();
  });

  it('creates prompt cards on rows 1 with a view-all button', async () => {
    const promptcards = document.querySelectorAll('.prompt-card:not(.hidden)');
    expect([...promptcards].length).to.equal(2);
  });

  it('click the view-all button', () => {
    const button = document.querySelector('.view-all .con-button');
    button.click();
    const promptcards = document.querySelectorAll('.prompt-card:not(.hidden)');
    expect([...promptcards].length).to.equal(6);
    const hiddencards = document.querySelectorAll('.hidden');
    expect([...hiddencards].length).to.equal(0);
    expect(document.querySelector('.view-all .con-button')).to.not.exist;
  });
});
