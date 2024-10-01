/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';

describe('prompt-cards using json feature', () => {
  before(async () => {
    sinon.stub(window, 'fetch');
    const res = new window.Response('Not Found', { status: 404 });
    window.fetch.returns(Promise.resolve(res));
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-json.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await delay(500);
  });

  after(() => {
    sinon.restore();
  });

  it('shows no prompt card', async () => {
    const promptcard = document.querySelector('.prompt-card');
    expect(promptcard).to.not.exist;
  });
});
