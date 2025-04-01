const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node take_prerender.js <url> [layout]');
  console.error('layout: desktop (default) or mobile');
  process.exit(1);
}

const url = args[0];
const layout = args[1]?.toLowerCase() === 'mobile' ? 'mobile' : 'desktop';

// Device configurations
const deviceConfig = {
  desktop: {
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  mobile: {
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  }
};

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: deviceConfig[layout].viewport,
    userAgent: deviceConfig[layout].userAgent
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
        top: Math.round(rect.top + scrollTop) + 'px',
        height: Math.round(rect.height) + 'px'
      };
    });

    // Extract basename from URL and create filenames with layout suffix
    const urlPath = new URL(url).pathname;
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
    console.log(`The heigh is ${height}`);
    console.log(`JSON content has been saved to ${outputJsonPath}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})(); 