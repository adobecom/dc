import * as sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { delay } from '../../helpers/waitfor.js';

const head = await readFile({ path: './mocks/head.html' });
const body = await readFile({ path: './mocks/body.html' });
const bodyRotatePdf = await readFile({ path: './mocks/body-rotate-pdf.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/eventwrapper/eventwrapper.js'
);

describe('eventwrapper block on Chrome', () => {
  let chromeRuntimeSendMessage = false;

  before(() => {
    window.browser = {
      name: 'Chrome',
      isMobile: false,
    };
    window.dc_hosted = {
      events: [],
      listeners: [],
      addEventListener: function (fn) {
        window.dc_hosted.listeners.push(fn);
        window.dc_hosted.events.forEach((e) => {
          try {
            fn(e.event, e.data);
          } catch (ex) {
            console.error('Error in addEventListener: ', ex, ex.stack);
          }
        });
      },
      dispatchEvent: function (event, data) {
        window.dc_hosted.events.push({ event: event, data: data });
        window.dc_hosted.listeners.forEach((fn) => {
          try {
            fn(event, data);
          } catch (e) {
            console.error('Error in dispatchEvent: ', e, e.stack);
          }
        });
      },
    };
    window.chrome = {
      runtime: {
        sendMessage: function (message, version, callback) {
          callback((() => chromeRuntimeSendMessage)());
        },
      },
    };
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });

  it('shows the ext modal on Chrome when conversion complete and preview displayed', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    window.dc_hosted.listeners = [];
    localStorage.removeItem('fricBrowExt');
    window.modalDisplayed = false;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    expect(window.dc_hosted.listeners).to.have.lengthOf(blocks.length);
    window.dc_hosted.dispatchEvent('conversion-complete', {});
    expect(window.modalDisplayed).to.be.true;

    window.modalDisplayed = false;
    window.dc_hosted.dispatchEvent('preview-displayed', {});
    expect(window.modalDisplayed).to.be.true;
  });

  it('handles modalExist', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    window.dc_hosted.listeners = [];
    localStorage.removeItem('fricBrowExt');
    window.modalDisplayed = false;
    chromeRuntimeSendMessage = true;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('conversion-complete', {});

    window.modalDisplayed = false;
    window.dc_hosted.dispatchEvent('preview-displayed', {});

    // modalExist
    const event = window._satellite.track.args[1][1].data._adobe_corpnew.digitalData.primaryEvent.eventInfo.eventName;
    expect(event).to.eql('Get the extension-1|viewer-extension-exists|Chrome-extension');
  });

  it('handles modalAlready', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    localStorage.fricBrowExt = 'true';
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));

    // modalAlready
    const event = window._satellite.track.args[1][1].data._adobe_corpnew.digitalData.primaryEvent.eventInfo.eventName;
    expect(event).to.eql('Get the extension-1|already-closed-viewer-extension|Chrome-extension');
  });

  it('handles processing-start', async () => {
    window.dc_hosted.dispatchEvent('processing-start', {});
    expect(document.body.dataset.currentEvent).to.eql('start');
  });

  it('handles file-upload-start', async () => {
    window.dc_hosted.dispatchEvent('file-upload-start', {});
    expect(document.body.dataset.currentEvent).to.eql('upload');
  });

  it('handles file-upload-complete', async () => {
    window.dc_hosted.dispatchEvent('file-upload-complete', {});
    expect(document.body.dataset.currentEvent).to.eql('uploadcomplete');
  });

  it('handles processing-cancelled', async () => {
    window.dc_hosted.dispatchEvent('processing-cancelled', {});
    expect(document.body.dataset.currentEvent).to.eql('cancel');
  });

  it('handles processing-complete', async () => {
    window.dc_hosted.dispatchEvent('processing-complete', {});
    expect(document.body.dataset.currentEvent).to.eql('complete');
  });

  it('handles try-another-file-start', async () => {
    window.dc_hosted.dispatchEvent('try-another-file-start', {});
    expect(window.modalDisplayed).to.be.false;
  });

  it('handles preview-generating', async () => {
    window.dc_hosted.dispatchEvent('preview-generating', {});
    expect(document.body.dataset.currentEvent).to.eql('preview');
  });

  it('handles preview-displayed', async () => {
    window.dc_hosted.dispatchEvent('preview-displayed', {});
    expect(document.body.dataset.currentEvent).to.eql('preview');
  });

  it('handles dropzone-displayed', async () => {
    window.dc_hosted.dispatchEvent('dropzone-displayed', {});
    expect(document.body.dataset.currentEvent).to.be.undefined;
  });

  it('handles download-start', async () => {
    window.dc_hosted.dispatchEvent('download-start', {});
    expect(document.body.dataset.currentEvent).to.eql('download');
  });

  it('handles default case', async () => {
    // download is last currentEvent before unknown-event
    window.dc_hosted.dispatchEvent('unknown-event', {});
    expect(document.body.dataset.currentEvent).to.eql('download');
  });

  it('hide content for processing-start on rotate-pdf', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = bodyRotatePdf;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('processing-start', {});
    expect(document.body.dataset.currentEvent).to.eql('start');
    expect(document.body.classList.contains('l2-state')).to.be.equal(true);
    expect(document.body.classList.contains('hide-content')).to.be.equal(true);
    const widget = document.querySelector('[data-section="widget"]');
    expect(widget.classList.contains('widget-default-height')).to.be.equal(false);
    const contentSections = document.querySelectorAll('.section:not([data-section=\'widget\'])');
    contentSections.forEach((section) => expect(section.classList.contains('hide')).to.be.equal(true));
  });
  it('show content for preview-generating on rotate-pdf', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = bodyRotatePdf;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('preview-generating', {});
    expect(document.body.dataset.currentEvent).to.eql('preview');
    expect(document.body.classList.contains('l2-state')).to.be.equal(false);
    expect(document.body.classList.contains('hide-content')).to.be.equal(false);
    const widget = document.querySelector('[data-section="widget"]');
    expect(widget.classList.contains('widget-default-height')).to.be.equal(true);
    const contentSections = document.querySelectorAll('.section');
    contentSections.forEach((section) => expect(section.classList.contains('hide')).to.be.equal(false));
  });
});

describe('eventwrapper block on Microsoft Edge', () => {
  let chromeRuntimeSendMessage = false;

  before(() => {
    window.browser = {
      name: 'Microsoft Edge',
      isMobile: false,
    };
    window.dc_hosted = {
      events: [],
      listeners: [],
      addEventListener: function (fn) {
        window.dc_hosted.listeners.push(fn);
        window.dc_hosted.events.forEach((e) => {
          try {
            fn(e.event, e.data);
          } catch (ex) {
            console.error('Error in addEventListener: ', ex, ex.stack);
          }
        });
      },
      dispatchEvent: function (event, data) {
        window.dc_hosted.events.push({ event: event, data: data });
        window.dc_hosted.listeners.forEach((fn) => {
          try {
            fn(event, data);
          } catch (e) {
            console.error('Error in dispatchEvent: ', e, e.stack);
          }
        });
      },
    };
    window.chrome = {
      runtime: {
        sendMessage: function (message, version, callback) {
          callback((() => chromeRuntimeSendMessage)());
        },
      },
    };
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });

  it('shows the ext modal on MS Edge when conversion complete and preview displayed', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    window.dc_hosted.listeners = [];
    localStorage.removeItem('fricBrowExt');
    window.modalDisplayed = false;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('conversion-complete', {});
    expect(window.modalDisplayed).to.be.true;

    window.modalDisplayed = false;
    window.dc_hosted.dispatchEvent('preview-displayed', {});
    expect(window.modalDisplayed).to.be.true;
  });

  it('handles modalExist', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    window.dc_hosted.listeners = [];
    localStorage.removeItem('fricBrowExt');
    window.modalDisplayed = false;
    chromeRuntimeSendMessage = true;
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('conversion-complete', {});

    window.modalDisplayed = false;
    window.dc_hosted.dispatchEvent('preview-displayed', {});

    // modalExist
    const event = window._satellite.track.args[1][1].data._adobe_corpnew.digitalData.primaryEvent.eventInfo.eventName;
    expect(event).to.eql('Get the extension-1|viewer-extension-exists|MSFT-Edge-extension');
  });

  it('handles modalAlready', async () => {
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    localStorage.fricBrowExt = 'true';
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));

    // modalAlready
    const event = window._satellite.track.args[1][1].data._adobe_corpnew.digitalData.primaryEvent.eventInfo.eventName;
    expect(event).to.eql('Get the extension-1|already-closed-viewer-extension|MSFT-Edge-extension');
  });
});
