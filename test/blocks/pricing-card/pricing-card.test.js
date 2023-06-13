import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

let head = await readFile({ path: './mocks/head.html' });
let body = await readFile({ path: './mocks/body.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/pricing-card/pricing-card'
);

describe('pricing-card block', () => {
  it('shoud creates a promotion block', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    const block = await waitForElement('.pricing-card');
    await init(block);
    const card = await waitForElement('.card-box');
    expect(card).to.be.exist;
  });
});
