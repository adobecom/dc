import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const head = await readFile({ path: './mocks/head-block.html' });

const { default: init } = await import(
  '../../../acrobat/blocks/prompt-card/prompt-card.js'
);

describe('prompt-card block', () => {
  let clock;

  before(async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = await readFile({ path: './mocks/body-block-icon.html' });
    const block = document.querySelector('.prompt-card');
    await init(block);
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('has a customized icon', async () => {
    const icon = document.querySelector('.prompt-icon');
    expect(icon).to.be.exist;
    expect(icon.src).to.contains('word-to-pdf.svg');
  });
});
