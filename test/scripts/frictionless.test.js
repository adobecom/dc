import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../helpers/waitfor.js';

document.head.innerHTML = await readFile({
  path: './mocks/frictionless.head.html',
});
document.body.innerHTML = await readFile({
  path: './mocks/frictionless.body.html',
});

const { default: init } = await import('../../acrobat/scripts/frictionless');

describe('frictionless script', () => {
  let clock;

  before(() => {
    clock = sinon.useFakeTimers();
    window._satellite = {
      track: sinon.spy(),
    };
    window.browser = {
      name:'Chrome',
    };
    init('pdf-to-ppt');
  });

  beforeEach(() => {
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    clock.restore();
    sinon.restore();
  });

  it('initites frictionless', async () => {
    clock.tick(1100);
    expect(window._satellite.track.calledOnce).to.be.true;
    const event = window._satellite.track.args[0][1];
    const eventInfo =
      event.data._adobe_corpnew.digitalData.primaryEvent.eventInfo;
    expect(eventInfo.eventName).to.be.equal('productRating');
    expect(eventInfo.interaction.click).to.be.equal('productRating');
    expect(eventInfo.interaction.iclick).to.be.equal('true');
  });

  it('clicks the rating 4 and 5', async () => {
    const form = document.querySelector('.hlx-Review');
    const ratings = form.querySelectorAll('.tooltip');
    // click 4
    ratings[3].click();
    expect(window._satellite.track.calledOnce).to.be.true;
    let event = window._satellite.track.args[0][1];
    let eventInfo =
      event.data._adobe_corpnew.digitalData.primaryEvent.eventInfo;
    expect(eventInfo.eventName).to.be.equal('productRating');
    expect(eventInfo.interaction.click).to.be.equal('productRating');
    expect(eventInfo.interaction.verb).to.be.equal('dc/production/pdf-to-ppt');
    expect(eventInfo.interaction.rating).to.be.equal('4');
    sinon.resetHistory();
    // click 5
    ratings[4].click();
    event = window._satellite.track.args[0][1];
    eventInfo = event.data._adobe_corpnew.digitalData.primaryEvent.eventInfo;
    expect(eventInfo.interaction.rating).to.be.equal('5');
  });

  it('submits form', async () => {
    const form = document.querySelector('.hlx-Review');
    const submitEvent = new SubmitEvent('submit', { submitter: form });
    form.dispatchEvent(submitEvent);
    expect(window._satellite.track.calledOnce).to.be.true;
    const event = window._satellite.track.args[0][1];
    const eventInfo =
      event.data._adobe_corpnew.digitalData.primaryEvent.eventInfo;
    expect(eventInfo.eventName).to.be.equal('productRating');
    expect(eventInfo.interaction.click).to.be.equal('productRating');
    expect(eventInfo.interaction.verb).to.be.equal('dc/production/pdf-to-ppt');
  });

  it('handles modal:open with Chrome when no ext dialog', async () => {
    window.dispatchEvent(new CustomEvent('modal:open'));
    clock.tick(1100);
  });

  it('handles modal:open with Chrome', async () => {
    const form = document.querySelector('.review');
    const ext = document.createElement('div');
    ext.classList.add('browser-ext');
    ext.innerHTML = await readFile({
      path: './mocks/frictionless.chromeext.html',
    });
    document.body.appendChild(ext);
    window.dispatchEvent(new CustomEvent('modal:open'));
    clock.tick(1100);
  });

  it('handles clicks on browser extension', async () => {
    clock.restore();
    const browserExt = document.querySelector('.browser-ext');
    const browserExtClose = browserExt.querySelector('.dialog-close');
    const browserExtGetLink = browserExt.querySelector('.browser-extension  a');

    browserExtGetLink.click();

    browserExtClose.click();
    expect(window.localStorage.fricBrowExt).to.be.equal('true');
  });

  it('handles modal:open with MS Edge', async () => {
    window.browser = {
      name: 'Microsoft Edge',
    };
    document.body.innerHTML = await readFile({
      path: './mocks/frictionless.body.html',
    });
    const { default: initEdge } = await import('../../acrobat/scripts/frictionless');
    initEdge('pdf-to-ppt');
    clock.tick(1100);
    const form = document.querySelector('.review');
    const ext = document.createElement('div');
    ext.innerHTML = await readFile({
      path: './mocks/frictionless.edgeext.html',
    });
    document.body.appendChild(ext);
    window.dispatchEvent(new CustomEvent('modal:open'));
    clock.tick(1100);
    expect(window._satellite.track.calledOnce).to.be.true;
  });
});
