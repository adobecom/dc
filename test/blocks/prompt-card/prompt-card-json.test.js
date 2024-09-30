/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

describe('prompt-cards using json feature', () => {
  before(async () => {
    const promptcards = await readFile({ path: './mocks/promptcards.json' });
    sinon.stub(window, 'fetch');
    const res = new window.Response(promptcards, { status: 200 });
    window.fetch.returns(Promise.resolve(res));
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-json.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await waitForElement('.prompt-blade');
  });

  after(() => {
    sinon.restore();
  });

  it('creates prompt cards', async () => {
    const blades = document.querySelectorAll('.prompt-blade');
    expect([...blades].length).to.equal(2);
  });
});
