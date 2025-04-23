/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable compat/compat */
const { chromium } = require('playwright');
const EdgeGrid = require('akamai-edgegrid');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const {
  _, layout, network, namespace, group, edgekv,
} = yargs(hideBin(process.argv))
  .usage('Usage: $0 <url> [options]')
  .option('layout', {
    alias: 'l',
    describe: 'Layout to use for rendering',
    choices: ['desktop', 'mobile'],
    default: 'desktop',
  })
  .option('network', {
    alias: 'n',
    describe: 'EdgeKV network environment',
    choices: ['staging', 'production'],
    default: 'staging',
  })
  .option('namespace', {
    alias: 'ns',
    describe: 'EdgeKV namespace',
    choices: ['stage', 'prod'],
    default: 'stage',
  })
  .option('group', {
    alias: 'g',
    describe: 'EdgeKV group name',
    default: 'frictionless',
  })
  .option('edgekv', {
    alias: 'e',
    describe: 'Write content to EdgeKV',
    type: 'boolean',
    default: false,
  })
  .demandCommand(1, 'Please provide a URL to prerender')
  .help()
  .argv;

const url = _[0];

// Device configurations
const deviceConfig = {
  desktop: {
    viewport: { width: 1920, height: 1080 },
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ${process.env.USER_AGENT_SUFFIX}`,
  },
  mobile: {
    viewport: { width: 375, height: 667 },
    userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1 ${process.env.USER_AGENT_SUFFIX}`,
  },
};

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: deviceConfig[layout].viewport,
    userAgent: deviceConfig[layout].userAgent,
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 60000 });

    const element = await page.locator('div[daa-lh="s1"]');
    const elementHtml = await element.innerHTML();

    // Get element's position relative to viewport
    const { top, height } = await element.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const { scrollTop } = document.documentElement;
      return {
        top: `${Math.round(rect.top + scrollTop)}px`,
        height: `${Math.round(rect.height)}px`,
      };
    });

    // Extract basename from URL and create filenames with layout suffix
    const urlPath = new URL(url).pathname;
    const pathParts = urlPath.split('/').filter(Boolean);
    const locale = pathParts[0] === 'acrobat' ? '' : `_${pathParts[0]}`;
    const basename = path.basename(urlPath, '.html');
    const outputHtmlPath = path.join(__dirname, `${basename}-${layout}.html`);
    const outputJsonPath = path.join(__dirname, `${basename}-${layout}.json`);

    await fs.writeFile(outputHtmlPath, elementHtml, 'utf8');
    console.log(`HTML content has been saved to ${outputHtmlPath}`);

    // Save both HTML content and top value to JSON
    const jsonContent = {
      html: elementHtml,
      top,
      height,
    };
    await fs.writeFile(outputJsonPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    console.log(`The top position is ${top}`);
    console.log(`The height is ${height}`);
    console.log(`JSON content has been saved to ${outputJsonPath}`);

    if (edgekv) {
      const eg = new EdgeGrid({
        path: path.join(os.homedir(), '.edgerc'),
        section: 'edgekv',
      });

      eg.auth({
        path: `/edgekv/v1/networks/${network}/namespaces/${namespace}/groups/${group}${locale}/items/${basename}_${layout}`,
        method: 'PUT',
        headers: {},
        body: jsonContent,
      });

      eg.send((error, response, body) => {
        if (error) {
          console.warn('Warning: EdgeKV write failed:', error);
        } else {
          console.log('EdgeKV write response:', body);
        }
      });
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})();
