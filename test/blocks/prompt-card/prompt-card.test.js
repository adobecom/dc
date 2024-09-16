import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const head = await readFile({ path: './mocks/head-block.html' });

const { default: init } = await import(
  '../../../acrobat/blocks/prompt-card/prompt-card.js'
);

describe('prompt-card block', () => {
  before(async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = await readFile({ path: './mocks/body-block.html' });
    const block = document.querySelector('.prompt-card');
    await init(block);
  });

  it('creates a prompt-card block', async () => {
    expect(document.querySelector('.prompt-icon')).to.be.exist;
    expect(document.querySelector('.prompt-prefix span')).to.be.exist;
    expect(document.querySelector('.prompt-title')).to.be.exist;
    expect(document.querySelector('.prompt-copy')).to.be.exist;
    expect(document.querySelector('#prompt')).to.be.exist;
    expect(document.querySelector('.prompt-copy-btn')).to.be.exist;
  });

  it('copies the prompt when copy button is clicked', async () => {
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.false;
    document.querySelector('.prompt-copy-btn').click();
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.true;
    expect(document.querySelector('.prompt-close')).to.be.exist;
    document.querySelector('.prompt-close').click();
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.false;
  });

  it('copies the prompt when copy button is clicked', async () => {
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.false;
    document.querySelector('.prompt-copy-btn').dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.true;
    expect(document.querySelector('.prompt-close')).to.be.exist;
    document.querySelector('.prompt-close').click();
    expect(document.querySelector('.prompt-toast').checkVisibility()).to.be.false;
  });
});
