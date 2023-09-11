import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setMobileOS } from '../../../acrobat/blocks/app-banner/app-banner.js';
import { waitForElement } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/app-banner/app-banner.js'
);

describe('app-banner iOS block', () => {
  const block = document.body.querySelector('.app-banner');
  before(() => {
    setMobileOS('iOS');
    init(block);
  });

  it('Has .app-banner-icon', async () => {
    await waitForElement('.app-banner-icon');
    const icon = document.body.querySelector('.app-banner-icon');
    expect(icon).to.exist;
  });

  it('Has .app-banner-description', async () => {
    await waitForElement('.app-banner-description');
    const desc = document.body.querySelector('.app-banner-description');
    expect(desc).to.exist;
  });

  it('Has .app-banner-details', async () => {
    await waitForElement('.app-banner-details');
    const node = document.body.querySelector('.app-banner-details');
    expect(node).to.exist;
  });

  it('Has .app-banner-stars', async () => {
    await waitForElement('.app-banner-stars');
    const node = document.body.querySelector('.app-banner-stars');
    expect(node).to.exist;
  });

  it('Has .app-banner-title', async () => {
    await waitForElement('.app-banner-title');
    const node = document.body.querySelector('.app-banner-title');
    expect(node).to.exist;
  });

  it('Has .app-banner-reviews', async () => {
    await waitForElement('.app-banner-reviews');
    const node = document.body.querySelector('.app-banner-reviews');
    expect(node).to.exist;
  });

  it('Can close the banner ', async () => {
    const node = document.body.querySelector('.app-banner-details');
    node.click();
    const node1 = document.body.querySelector('.app-banner-details');
    expect(node1).not.to.exist;
  });
});

document.body.innerHTML = '';
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('app-banner unknown block', () => {
  const block = document.body.querySelector('.app-banner');
  before(() => {
    setMobileOS('unknown');
    init(block);
  });

  it('Has no .app-banner-icon', async () => {
    const icon = block.querySelector('.app-banner-icon');
    expect(icon).to.be.null;
  });
});

document.body.innerHTML = '';
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('app-banner Andriod block', () => {
  const block = document.body.querySelector('.app-banner');
  before(() => {
    setMobileOS('Android');
    init(block);
  });

  it('Has .app-banner-icon', async () => {
    await waitForElement('.app-banner-icon');
    const icon = document.body.querySelector('.app-banner-icon');
    expect(icon).to.exist;
  });

  it('Has .app-banner-description', async () => {
    await waitForElement('.app-banner-description');
    const desc = document.body.querySelector('.app-banner-description');
    expect(desc).to.exist;
  });

  it('Has .app-banner-details', async () => {
    await waitForElement('.app-banner-details');
    const node = document.body.querySelector('.app-banner-details');
    expect(node).to.exist;
  });

  it('Has .app-banner-stars', async () => {
    await waitForElement('.app-banner-stars');
    const node = document.body.querySelector('.app-banner-stars');
    expect(node).to.exist;
  });

  it('Has .app-banner-title', async () => {
    await waitForElement('.app-banner-title');
    const node = document.body.querySelector('.app-banner-title');
    expect(node).to.exist;
  });

  it('Has .app-banner-reviews', async () => {
    await waitForElement('.app-banner-reviews');
    const node = document.body.querySelector('.app-banner-reviews');
    expect(node).to.exist;
  });

  it('Can close the banner ', async () => {
    const node = document.body.querySelector('.app-banner-details');
    node.click();
    const node1 = document.body.querySelector('.app-banner-details');
    expect(node1).not.to.exist;
  });
});
