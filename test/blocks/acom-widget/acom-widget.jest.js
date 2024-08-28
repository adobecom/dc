/**
 * @jest-environment jsdom
 */
/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';
import { userEvent } from '@testing-library/user-event';
import { delay } from '../../helpers/waitfor.js';
//import init from '../../../acrobat/blocks/acom-widget/acom-widget.js';

const mockfetch = jest.fn(() => Promise.resolve({
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
}));

const mockXhr = {
  abort: jest.fn(),
  open: jest.fn(),
  setRequestHeader: jest.fn(),
  onreadystatechange: jest.fn(),
  progress: jest.fn(),
  upload: new EventTarget(),
  send: jest.fn(),
  readyState: 4,
  responseText: JSON.stringify({
    uri: 'https://www.example.com/asseturi/',
    job_uri: 'https://www.example.com/job_uri',
  }),
  status: 201,
};

describe.skip('acom-widget block', () => {
  beforeEach(() => {
    document.head.innerHTML = fs.readFileSync(path.resolve(__dirname, './mocks/head.html'), 'utf8');
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, './mocks/body.html'), 'utf8');
    window.fetch = mockfetch;
    window.XMLHttpRequest = jest.fn(() => mockXhr);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('upload PDF', async () => {
    window.alert = jest.fn();

    delete window.localStorage.limit;

    delete window.location;
    window.location = new URL('https://localhost/acrobat/online/ai-chat-pdf.html');

    const block = document.querySelector('.acom-widget');
    await init(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    window.location = { assign: jest.fn() };

    await userEvent.upload(input, file);

    await mockXhr.onreadystatechange();

    await delay(100);

    expect(window.location.href).toMatch(/pdfNowAssetUri=https:\/\/www.example.com\/asseturi\//);
  });
});
