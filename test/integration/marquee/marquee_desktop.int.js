/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  executeServerCommand,
} from '@web/test-runner-commands';
import { waitFor, delay } from '../../helpers/waitfor.js';

const screenshotFolder = 'test/integration/marquee/screenshots';

describe('marquee_desktop', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await setViewport({ width: 1200, height: 600 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.marquee.small.light'), 5000, 1000);
  });

  beforeEach(function () {
    testName = this.currentTest.title;
    screenshotPath = `${screenshotFolder}/${suiteName}/$browser/${testName}.png`;
  });

  it('marquee_desktop', async () => {
    await delay(1000);
    await executeServerCommand('diff-screenshot', { path: screenshotPath });
  });
});
