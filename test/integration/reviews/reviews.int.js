/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  sendMouse,
  sendKeys,
  executeServerCommand,
} from '@web/test-runner-commands';
import { getConfig, setConfig, loadArea } from 'https://main--milo--adobecom.hlx.page/libs/utils/utils.js';
import { waitForElement, waitFor, delay } from '../../helpers/waitfor.js';

function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.scrollX + width / 2),
    y: Math.floor(y + window.scrollY + height / 2),
  };
}

async function click(element) {
  const { x, y } = getMiddleOfElement(element);
  await sendMouse({ type: 'move', position: [x, y] });
  await sendMouse({ type: 'click', position: [x, y] });
}

async function type(element, text) {
  const { x, y } = getMiddleOfElement(element);
  await sendMouse({ type: 'click', position: [x, y] });
  await sendKeys({ type: text });
}

const screenshotFolder = 'test/integration/reviews/screenshots';

describe('reviews', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    await executeServerCommand('page-route', { url: 'https://**/*.json' });

    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    await setViewport({ width: 600, height: 1200 });
    await import('../../../acrobat/scripts/scripts.js');
    await delay(1000);
    const conf = getConfig();
    setConfig({ ...conf, env: { name: 'prod' } });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await loadArea();
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

  it('click 3 stars', async () => {
    const buttonStar = document.querySelectorAll('input[type="radio"]')[2];
    click(buttonStar);
    await waitForElement('#rating-comments');
    const commentArea = document.querySelector('#rating-comments');
    await type(commentArea, 'test');
    const buttonFive = document.querySelectorAll('input[type="radio"]')[4];
    click(buttonFive);
    await executeServerCommand('take-screenshot', { path: screenshotPath });
    const buttonSend = document.querySelector('.hlx-Review-commentFields input[type="submit"]');
    click(buttonSend);
  });
});
