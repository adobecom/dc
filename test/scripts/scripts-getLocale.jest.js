/**
 * @jest-environment jsdom
 */

describe('Test locale', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('has langstore locale', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.adobe.com/langstore/ar/acrobat/online/ppt-to-pdf.html',
    );
    await require('../../acrobat/scripts/scripts.js');
  });
});

describe('Test Navigator', () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(global.navigator, 'userAgent', {
      value: '',
    });
  });

  it('has no navigator', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.adobe.com/acrobat/online/ppt-to-pdf.html',
    );
    await require('../../acrobat/scripts/scripts.js');
    expect(window.browser).toStrictEqual({});
  });
});
