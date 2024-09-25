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
    document.body.innerHTML = await readFile({ path: './mocks/body-json-more-less.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await delay(500);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  after(() => {
    sinon.restore();
  });

  it('has no a view-all button if no more items', () => {
    const promptcards = document.querySelectorAll('.prompt-card:not(.hidden)');
    expect([...promptcards].length).to.equal(2);
    const button = document.querySelector('.view-all .con-button');
    expect(button).to.not.exist;
  });
});
