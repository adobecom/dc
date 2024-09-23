import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

describe('prompt-cards in a section using a template', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-template.html' });
    await import('../../../acrobat/scripts/scripts.js');
    await waitForElement('.prompt-blade');
  });

  it('creates prompt cards', async () => {
    const blades = document.querySelectorAll('.prompt-blade');
    expect([...blades].length).to.equal(5);
  });
});
