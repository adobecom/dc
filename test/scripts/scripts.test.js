import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../helpers/waitfor.js';

document.head.innerHTML = '<meta name="promotion" content="abc"/><meta name="dc-widget-version" content="123"/>';
document.body.innerHTML = '<main><div class="promotion"/><div class="dc-converter-widget"/><div><p>{{change-region}}</p><p>{{free-trial}}</p><p>{{credit-cards}}</p></div></main>';

const { scripts } = await import('../../acrobat/scripts/scripts');

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
    window.adobeIMS = {
      initialized: true,
    };
    window.dc_hosted = true;
    window.bowser = true;
    window._satellite = {
      track: sinon.spy(),
    };

    clock.tick(1100);
    expect(window.bowser).to.be.true;
  });

  it('Placeholder Labels', async ()=> {
    const placeholderLabel = document.querySelectorAll('p[data-local]');
    expect(placeholderLabel.length).to.equal(3);
  });
});
