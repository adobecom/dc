import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../acrobat/blocks/mobile-widget/mobile-widget.js');

sessionStorage.setItem('modalDismissed', 'true');

describe('Mobile widget', () => {
  it('is complete', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const mobileBlock = document.querySelector('.mobile-widget');
    await init(mobileBlock);
    expect(mobileBlock.querySelector('.mobile-widget_wrapper')).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_title-wrapper')).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_heading').textContent).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_artwork').src).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_copy').textContent).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_cta')).to.exist;
    expect(mobileBlock.querySelector('.mobile-widget_cta').href).to.contain('apps.apple.com');
  });
  it('Load Appstore link', async () => {
    window.browser = {
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      isMobile: true,
      name: 'Safari',
      version: '16.6',
    };
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const mobileBlock = document.querySelector('.mobile-widget');
    await init(mobileBlock);
    console.log(mobileBlock.querySelector('.mobile-widget_cta').href);
    expect(mobileBlock.querySelector('.mobile-widget_cta').href).to.contain('apps.apple.com');
  });
  it('Load Google Playstore link', async () => {
    window.browser = {
      ua: 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
      isMobile: true,
      name: 'Chrome',
      version: '116.0.0.0',
    };
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const mobileBlock = document.querySelector('.mobile-widget');
    await init(mobileBlock);
    expect(mobileBlock.querySelector('.mobile-widget_cta').href).to.contain('play.google.com');
  });
});
