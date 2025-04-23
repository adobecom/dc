/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable compat/compat */
const { chromium } = require('playwright');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Device viewport configurations
const LAYOUTS = {
  desktop: {
    viewport: { width: 1920, height: 1080 },
    userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ${process.env.USER_AGENT_SUFFIX}`,
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1 ${process.env.USER_AGENT_SUFFIX}`,
  },
};

function getFilenameFromUrl(url, layout) {
  const urlObj = new URL(url);
  const basename = path.basename(urlObj.pathname, '.html');
  return path.join(__dirname, `${basename}_${layout}.png`);
}

async function takeScreenshot({ url, layout }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: LAYOUTS[layout].viewport,
    userAgent: LAYOUTS[layout].userAgent,
  });
  const page = await context.newPage();

  try {
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle' });

    // Generate output filename based on URL and layout
    const outputPath = getFilenameFromUrl(url, layout);

    // Take the screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    console.log(`Screenshot saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Command line interface setup
if (require.main === module) {
  const { _: [url], layout } = yargs(hideBin(process.argv))
    .usage('Usage: $0 <url> [options]')
    .positional('url', {
      describe: 'URL to take screenshot of',
      type: 'string',
    })
    .options({
      layout: {
        description: 'Layout to use (desktop or mobile)',
        type: 'string',
        choices: Object.keys(LAYOUTS),
        default: 'desktop',
      },
    })
    .example('$0 https://example.com')
    .example('$0 https://example.com --layout mobile')
    .demandCommand(1, 'Please provide a URL to take a screenshot of')
    .help()
    .argv;

  takeScreenshot({ url, layout }).catch((error) => {
    console.error('Failed to take screenshot:', error);
    process.exit(1);
  });
}

module.exports = takeScreenshot;
