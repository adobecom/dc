import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../acrobat/blocks/interactive-marquee/interactive-marquee.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Interactive marquee', () => {
  before(async () => {
    const marquee = document.querySelector('.interactive-marquee');
    init(marquee);
  });

  it('should test using left-to-right arrows on tabs', async () => {
    const tabs = await waitForElement('.slider-tabs');
    expect(tabs).to.exist;
    const tabsArray = tabs.querySelectorAll('.slider-tab');
    await tabsArray[0].click();
    await tabsArray[0].focus();
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(tabsArray[1]);
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(tabsArray[2]);
  });

  it('should test using up-down arrows on tabs', async () => {
    const tabs = await waitForElement('.slider-tabs');
    expect(tabs).to.exist;
    const tabsArray = tabs.querySelectorAll('.slider-tab');
    await tabsArray[2].click();
    await tabsArray[2].focus();
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    await sendKeys({ press: 'ArrowUp' });
    expect(document.activeElement).to.equal(tabsArray[1]);
    await sendKeys({ press: 'ArrowUp' });
    expect(document.activeElement).to.equal(tabsArray[0]);
  });

  it('should test ENTER on tabs', async () => {
    const tabs = await waitForElement('.slider-tabs');
    expect(tabs).to.exist;
    const tabsArray = tabs.querySelectorAll('.slider-tab');
    await tabsArray[0].focus();
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    await sendKeys({ press: 'Enter' });
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    expect(tabsArray[0].getAttribute('aria-selected')).to.equal('true');
  });

  it('should test SPACE on tabs', async () => {
    const tabs = await waitForElement('.slider-tabs');
    expect(tabs).to.exist;
    const tabsArray = tabs.querySelectorAll('.slider-tab');
    await tabsArray[0].click();
    await tabsArray[0].focus();
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    await tabsArray[1].focus();
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    await sendKeys({ press: ' ' });
    // eslint-disable-next-line
    await new Promise((resolve) => { setTimeout(() => resolve(), 50); });
    console.log(tabsArray[1].getAttribute('aria-selected'));
    expect(tabsArray[1].getAttribute('aria-selected')).to.equal('true');
  });
});
