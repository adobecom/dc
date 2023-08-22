import * as sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { delay } from '../../helpers/waitfor.js';

const head = await readFile({ path: './mocks/head.html' });
const body = await readFile({ path: './mocks/body.html' });
const { default: init } = await import(
  '../../../acrobat/blocks/eventwrapper/eventwrapper'
);

describe('eventwrapper block', () => {
  let browserName = 'Chrome';
  let chromeRuntimeSendMessage = false;

  before(() => {
    window.browser = {
      name: browserName,
      isMobile: false,
    };
    window.dc_hosted = {
      events: [],
      listeners: [],
      addEventListener: function (fn) {
        window.dc_hosted.listeners.push(fn);
        window.dc_hosted.events.forEach(function (e) {
          try {
            fn(e.event, e.data);
          } catch (ex) {
            console.error('Error in addEventListener: ', ex, ex.stack);
          }
        });
      },
      dispatchEvent: function (event, data) {
        window.dc_hosted.events.push({ event: event, data: data });
        window.dc_hosted.listeners.forEach(function (fn) {
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

  it('shows the ext modal on Chrome when conversion complete and preview displayed', async function () {
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

  it('handles modalExist', async function () {
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

  it('handles modalAlready', async function () {
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

  it('shows the ext modal on MS Edge when conversion complete and preview displayed', async function () {
    browserName = 'Microsoft Edge';
    document.head.innerHTML = head;
    document.body.innerHTML = body;
    window.dc_hosted.listeners = [];
    localStorage.removeItem('fricBrowExt');  
    window.modalDisplayed = false;
    window.chrome = {
      runtime: {},
    };
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    window.dispatchEvent(new CustomEvent('DC_Hosted:Ready'));
    window.dc_hosted.dispatchEvent('conversion-complete', {});
    expect(window.modalDisplayed).to.be.true;

    window.modalDisplayed = false;
    window.dc_hosted.dispatchEvent('preview-displayed', {});
    expect(window.modalDisplayed).to.be.true;
  });

  it('handles processing-start', async function () {
    window.dc_hosted.dispatchEvent('processing-start', {});
    expect(document.body.dataset.currentEvent).to.eql('start');
  });

  it('handles file-upload-start', async function () {
    window.dc_hosted.dispatchEvent('file-upload-start', {});
    expect(document.body.dataset.currentEvent).to.eql('upload');
  });

  it('handles file-upload-complete', async function () {
    window.dc_hosted.dispatchEvent('file-upload-complete', {});
    expect(document.body.dataset.currentEvent).to.eql('uploadcomplete');
  });

  it('handles processing-cancelled', async function () {
    window.dc_hosted.dispatchEvent('processing-cancelled', {});
    expect(document.body.dataset.currentEvent).to.eql('cancel');
  });

  it('handles try-another-file-start', async function () {
    window.dc_hosted.dispatchEvent('try-another-file-start', {});
    expect(window.modalDisplayed).to.be.false;  
  });

  it('handles preview-generating', async function () {
    window.dc_hosted.dispatchEvent('preview-generating', {});
    expect(document.body.dataset.currentEvent).to.eql('preview');   
  });

  it('handles preview-displayed', async function () {
    window.dc_hosted.dispatchEvent('preview-displayed', {});
    expect(document.body.dataset.currentEvent).to.eql('preview');
  });

  it('handles dropzone-displayed', async function () {
    window.dc_hosted.dispatchEvent('dropzone-displayed', {});
    expect(document.body.dataset.currentEvent).to.be.undefined;
  });

  it('handles download-start', async function () {
    window.dc_hosted.dispatchEvent('download-start', {});
    expect(document.body.dataset.currentEvent).to.eql('download');
  });
});
