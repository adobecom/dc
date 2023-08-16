import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

const head = await readFile({ path: './mocks/head.html' });

const { default: init } = await import(
  '../../../acrobat/blocks/pricing-card/pricing-card'
);

describe('pricing-card block', () => {
  it('shoud creates a promotion block', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = await waitForElement('.pricing-card');
    await init(block);
    const card = await waitForElement('.card-box');
    expect(card).to.be.exist;
    const buttons = [...document.querySelectorAll('input[type="radio"]')];
    expect(buttons[2].checked).to.be.true;    
    buttons[0].click();
    expect(buttons[0].checked).to.be.true;
    expect(buttons[2].checked).to.be.false;      
  });

  it('shoud creates a promotion block, no initial option', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = await readFile({ path: './mocks/body_noinitialoption.html' });
    const block = await waitForElement('.pricing-card');
    await init(block);
    const card = await waitForElement('.card-box');
    expect(card).to.be.exist;    
    const buttons = [...document.querySelectorAll('input[type="radio"]')];
    expect(buttons[0].checked).to.be.true;
    buttons[1].click();
    expect(buttons[0].checked).to.be.false;
    expect(buttons[1].checked).to.be.true;       
  });  
});
