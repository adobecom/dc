/**
 * @jest-environment jsdom
 */
/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';

// Mock the workflow module before importing the unity module
const mockWorkflowInit = jest.fn();

// Mock the dynamic import of the workflow module
jest.mock('../../../test/mocks/unitylibs/core/workflow/workflow.js', () => mockWorkflowInit, { virtual: true });

describe('Unity block', () => {
  let init;

  beforeAll(async () => {
    const module = await import('../../../acrobat/blocks/unity/unity.js');
    init = module.default;
  });

  beforeEach(() => {
    document.head.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/head.html'),
      'utf8',
    );
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body-sign-pdf.html'),
      'utf8',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialize', async () => {
    delete window.location;
    window.location = new URL('https://localhost/acrobat/online/sign-pdf.html');

    window.browser = { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };

    const block = document.querySelector('.verb-widget');
    await init(block);

    expect(mockWorkflowInit).toHaveBeenCalledWith(
      block,
      'acrobat',
      expect.stringContaining('/unitylibs'), // unitylibs path
      'v2', // unity version
      'us', // language region
      'en', // language code
    );
  });

  it('initialize with jp', async () => {
    delete window.location;
    window.location = new URL('https://localhost/jp/acrobat/online/sign-pdf.html');

    window.browser = { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };

    const block = document.querySelector('.verb-widget');
    await init(block);

    expect(mockWorkflowInit).toHaveBeenCalledWith(
      block,
      'acrobat',
      expect.stringContaining('/unitylibs'), // unitylibs path
      'v2', // unity version
      'jp', // language region
      'ja', // language code
    );
  });

  it('initialize with mobile', async () => {
    delete window.location;
    window.location = new URL('https://localhost/acrobat/online/sign-pdf.html');

    window.browser = { ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Mobile/15E148 Safari/604.1' };

    const block = document.querySelector('.verb-widget');
    await init(block);

    expect(mockWorkflowInit).not.toHaveBeenCalled();
  });
});
