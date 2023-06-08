/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
import init from '../../../acrobat/blocks/eventwrapper/eventwrapper';

describe('eventwrapper', () => {
  beforeEach(async () => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/body.html'),
      'utf8'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows all events with query param eventsAll', () => {
    delete window.location;
    window.location = new URL('https://www.adobe.com?eventsAll=true');
    const blocks = document.body.querySelectorAll('.eventwrapper');
    blocks.forEach((x) => init(x));
    expect(document.body.classList.contains('eventsShowAll')).toBe(true);
  });
});
