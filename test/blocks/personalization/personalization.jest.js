/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
import init from '../../../acrobat/blocks/personalization/personalization';

describe('personalization', () => {
  beforeEach(async () => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body.html'),
      'utf8'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows all peronalization contents with query param showAll', async() => {
    delete window.location;
    window.location = new URL('https://www.adobe.com?showAll');
    const block = document.querySelector('.personalization');
    init(block);
    window.dispatchEvent(new CustomEvent('Personalization:Ready'));
    expect(document.body.classList.contains('personalizationShowAll')).toBe(true);
  });
});
