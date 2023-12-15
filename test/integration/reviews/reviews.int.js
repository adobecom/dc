/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  sendMouse,
  executeServerCommand,
} from '@web/test-runner-commands';
import { waitForElement, waitFor, delay } from '../../helpers/waitfor.js';

function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.scrollX + width / 2),
    y: Math.floor(y + window.scrollY + height / 2),
  };
}

const screenshotFolder = 'test/integration/reviews/screenshots';

describe('reviews', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    await executeServerCommand('page-route', { url: 'https://**/*.json' });

    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await setViewport({ width: 600, height: 1200 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.hlx-ReviewStats-total'), 10000, 1000);
    const total = await waitForElement('.hlx-ReviewStats-total');
    console.log(total.textContent);
    await delay(1000);
  });

  after(async () => {
    await executeServerCommand('page-unroute', { url: 'https://**/*.json' });
  });

  beforeEach(function () {
    testName = this.currentTest.title;
    screenshotPath = `${screenshotFolder}/${suiteName}/$browser/${testName}.test.png`;
  });

  it('click 2 stars', async () => {
    const button = document.querySelectorAll('input[type="radio"]')[1];
    const { x, y } = getMiddleOfElement(button);
    await sendMouse({ type: 'move', position: [x, y] });
    await sendMouse({ type: 'click', position: [x, y] });
    await waitForElement('#rating-comments');
    await executeServerCommand('take-screenshot', { path: screenshotPath });
  });
});
