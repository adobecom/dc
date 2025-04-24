/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  executeServerCommand,
} from '@web/test-runner-commands';
import { waitFor, delay } from '../../helpers/waitfor.js';

const screenshotFolder = 'test/integration/table/screenshots';

describe('table_mobile', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await setViewport({ width: 500, height: 600 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.table'), 5000, 1000);
  });

  beforeEach(function () {
    testName = this.currentTest.title;
    screenshotPath = `${screenshotFolder}/${suiteName}/$browser/${testName}.png`;
  });

  it('table_mobile', async () => {
    await delay(2000);
    await executeServerCommand('diff-screenshot', { path: screenshotPath });
  });
});
