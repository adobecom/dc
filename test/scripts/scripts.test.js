import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import * as sinon from 'sinon';

document.head.innerHTML = '<meta name="promotion" content="abc"/><meta name="dc-widget-version" content="123"/>';
document.body.innerHTML = '<header><main><div class="promotion"/><div class="dc-converter-widget"/></main></header>';

describe('Test scripts.js', () => {
  let clock;

  before(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    clock.restore();
    sinon.restore();
  });

  it('triggers events', async () => {
    window.adobeIMS = { initialized: true };
    window.dc_hosted = true;
    window.browser = true;
    // eslint-disable-next-line no-underscore-dangle
    window._satellite = { track: sinon.spy() };
    clock.tick(1100);
    expect(window.browser).to.be.true;
  });
});

describe('Test replace dot media', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/replaceDotMedia.body.html' });
  });

  it('Without scripts should be not null', () => {
    expect(document.querySelector('img[src*="./media_"]')).not.to.be.null;
  });

  it('With scripts should be null', async () => {
    await import('../../acrobat/scripts/scripts.js');
    expect(document.querySelector('img[src*="./media_"]')).to.be.null;
  });
});
