/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

describe('prompt-cards in a section using the group feature', () => {
  before(async () => {
    const placeholder = await readFile({ path: './mocks/placeholder.json' });
    sinon.stub(window, 'fetch');
    const res = new window.Response(placeholder, { status: 200 });
    window.fetch.returns(Promise.resolve(res));
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-group-placeholder.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await waitForElement('.prompt-blade');
  });

  it('shows replaced placeholder text', async () => {
    const prefix = document.querySelector('.prompt-prefix');
    expect(prefix.textContent).to.equal('聞く');
    const button = document.querySelector('.prompt-copy-btn');
    expect(button.textContent).to.equal('コピー');
  });
});
