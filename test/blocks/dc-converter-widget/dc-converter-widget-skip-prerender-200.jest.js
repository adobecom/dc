/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable compat/compat */

import path from 'path';
import fs from 'fs';
import init from '../../../acrobat/blocks/dc-converter-widget/dc-converter-widget.js';

const skippedPreRenderCases = [
  {
    mockFilePath: './mocks/body-variants/body-compress-pdf.html',
    url: 'https://www.adobe.com/acrobat/online/compress-pdf.html',
    cookieValue: 'p_ac_cm_p_ops=true',
  },
  {
    mockFilePath: './mocks/body-variants/body-convert-pdf.html',
    url: 'https://www.adobe.com/acrobat/online/convert-pdf.html',
    cookieValue: 'p_ac_cr_p_c=true',
  },
  {
    mockFilePath: './mocks/body-variants/body-word-to-pdf.html',
    url: 'https://www.adobe.com/acrobat/online/word-to-pdf.html',
    cookieValue: 'p_ac_cr_p_c=true',
  },
  {
    mockFilePath: './mocks/body-variants/body-pdf-to-word.html',
    url: 'https://www.adobe.com/acrobat/online/pdf-to-word.html',
    cookieValue: 'p_ac_ex_p_c=true',
  },
  {
    mockFilePath: './mocks/body-variants/body-pdf-to-word.html',
    url: 'https://www.adobe.com/acrobat/online/pdf-to-word.html',
    cookieValue: 'p_ac_ex_p_c_st=true',
  },
];

describe('DC Converter Widget Skip Prerender Verbs', () => {
  window.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    text: () => Promise.resolve(
      fs.readFileSync(path.resolve(__dirname, './mocks/widget.html')),
    ),
  }));
  window.browser = { isMobile: true };
  window.performance.mark = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = '';
    jest.useFakeTimers();
  });

  it.each(skippedPreRenderCases)(
    'render widget when pre-render is skipped from limit exhausted cookie condition',
    async ({ url, mockFilePath, cookieValue }) => {
      document.cookie = cookieValue;
      document.body.innerHTML = fs.readFileSync(
        path.resolve(__dirname, mockFilePath),
        'utf8',
      );

      delete window.location;
      window.location = new URL(url);

      const block = document.querySelector('.dc-converter-widget');
      await init(block);
      jest.runAllTimers();
    },
  );

  afterAll(() => {
    jest.clearAllMocks();
    document.cookie = '';
  });
});
