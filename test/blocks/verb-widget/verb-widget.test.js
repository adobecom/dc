/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay, waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);

const uploadFile = (input, file) => {
  const changeEvent = new Event('change');
  Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
  input.dispatchEvent(changeEvent);
};

describe('verb-widget block', () => {
  let xhr;

  beforeEach(async () => {
    sinon.stub(window, 'fetch');
    window.fetch.callsFake((x) => {
      if (x === 'https://pdfnow-dev.adobe.io/status') {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({
        json: () => Promise.resolve({
          access_token: '123',
          discovery: {
            resources: {
              jobs: { status: { uri: 'https://pdfnow-dev.adobe.io/status' } },
              assets: {
                upload: { uri: 'https://pdfnow-dev.adobe.io/upload' },
                download_uri: { uri: 'https://pdfnow-dev.adobe.io/download' },
                createpdf: { uri: 'https://pdfnow-dev.adobe.io/createpdf' },
              },
            },
          },
        }),
        ok: true,
      });
    });
    window.mph = {
      'verb-widget-description-compress-pdf': 'Description of Compress-PDF',
      'verb-widget-error-unsupported': 'Unsupported',
      'verb-widget-error-empty': 'Empty file',
      'verb-widget-error-multi': 'Over the limit',
    };
    xhr = sinon.useFakeXMLHttpRequest();
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    delete window.localStorage.limit;
  });

  afterEach(() => {
    xhr.restore();
    sinon.restore();
  });

  it.skip('reach limit', async () => {
    window.localStorage.limit = 2;

    const block = document.body.querySelector('.acom-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    uploadFile(input, file);

    expect(document.querySelector('.upsell')).to.exist;
  });

  it.skip('upload invalid file', async () => {
    const block = document.querySelector('.verb-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    uploadFile(input, file);

    const error = document.querySelector('.verb-error');
    expect(error.textContent).to.eq('Unsupported ');
  });

  it.skip('upload an empty file', async () => {
    const block = document.querySelector('.verb-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File([''], 'hello.pdf', { type: 'application/pdf' });

    uploadFile(input, file);

    await delay(1000);

    const error = document.querySelector('.verb-error');
    expect(error.textContent).to.eq('Empty file ');
  });

  it.skip('dismiss an error', async () => {
    const block = document.querySelector('.verb-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File([''], 'hello.pdf', { type: 'application/pdf' });

    uploadFile(input, file);

    await delay(1000);

    const errorBtn = document.querySelector('.verb-errorBtn');
    errorBtn.click();
    const error = document.querySelector('.verb-error');
    expect(error).to.not.be.exist;
  });

  it.skip('cancel upload', async () => {
    sinon.stub(window, 'alert').callsFake(() => {});

    const block = document.querySelector('.acom-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    uploadFile(input, file);

    await delay(1000);

    document.querySelector('.widget-cancel').click();

    const upload = await waitForElement('#file-upload');
    expect(upload).to.be.exist;
  });

  it.skip('SSRF check', async () => {
    window.fetch.restore();
    sinon.stub(window, 'fetch');
    window.fetch.returns(Promise.resolve({
      json: () => Promise.resolve({
        access_token: '123',
        discovery: { resources: { assets: { upload: { uri: 'https://example.com/upload' } } } },
      }),
      ok: true,
    }));
    sinon.stub(window, 'alert').callsFake(() => {});

    const block = document.querySelector('.acom-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    uploadFile(input, file);

    await delay(500);

    expect(alert.getCall(0).args[0]).to.eq('An error occurred during the upload process. Please try again.');
  });

  it.skip('upload PNG and fail at job status', async () => {
    sinon.stub(window, 'alert').callsFake(() => {});

    const requests = [];

    xhr.onCreate = (x) => {
      requests.push(x);
    };

    const block = document.body.querySelector('.acom-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    uploadFile(input, file);

    await delay(500);

    requests[0].respond(
      201,
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        uri: 'https://www.example.com/product',
        job_uri: 'https://www.example.com/job_uri',
      }),
    );

    await delay(500);

    expect(alert.getCall(0).args[0]).to.eq('Failed to create PDF');
  });
});
