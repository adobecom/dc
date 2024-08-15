/**
 * @jest-environment jsdom
 */
/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';
import { userEvent } from '@testing-library/user-event';

const mockFetch = jest.fn(() => Promise.resolve({
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

const xhrMock = {
  abort: jest.fn(),
  open: jest.fn(),
  setRequestHeader: jest.fn(),
  onreadystatechange: jest.fn(),
  progress: jest.fn(),
  upload: new EventTarget(),
  send: jest.fn(),
  readyState: 4,
  responseText: JSON.stringify({
    uri: 'https://www.example.com',
    job_uri: 'https://www.example.com/job_uri',
  }),
  status: 201,
};

describe('acom-widget block', () => {
  beforeEach(() => {
    document.head.innerHTML = fs.readFileSync(path.resolve(__dirname, './mocks/head.html'), 'utf8');
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, './mocks/body.html'), 'utf8');
    window.fetch = mockFetch;
    window.XMLHttpRequest = jest.fn(() => xhrMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('upload PDF', async () => {
    const log = jest.spyOn(console, 'log');

    delete window.location;
    window.location = new URL('https://localhost/acrobat/online/ai-chat-pdf.html?redirect=off');

    const blockModule = await import('../../../acrobat/blocks/acom-widget/acom-widget.js');

    const block = document.querySelector('.acom-widget');
    await blockModule.default(block);

    const input = document.querySelector('input');
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    await userEvent.upload(input, file);
    await xhrMock.onreadystatechange();
    expect(log.mock.calls[0][0]).toContain('Blob Viewer URL:');
  });
});
