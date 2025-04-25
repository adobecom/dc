/* eslint-disable no-console */
/* eslint-disable compat/compat */
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

async function processGist(gistId) {
  try {
    // Fetch gist content
    const response = await fetch(`https://api.github.com/gists/${gistId}`);
    const gistData = await response.json();
    const gistContent = gistData.files[Object.keys(gistData.files)[0]].content;

    // Split content into URLs (one per line)
    const urls = gistContent.split('\n').filter((url) => url.trim());

    console.log(`Found ${urls.length} URLs to process`);

    // Process each URL
    for (const url of urls) {
      console.log(`Processing URL: ${url}`);
      const screenshotPath = path.join(__dirname, 'screenshot.js');

      // Process both desktop and mobile layouts
      const layouts = ['desktop', 'mobile'];
      for (const layout of layouts) {
        console.log(`Processing ${layout} layout`);
        try {
          const { stdout, stderr } = await execAsync(
            `node ${screenshotPath} "${url}" --layout ${layout}`,
          );
          console.log(stdout);
          if (stderr) console.error(stderr);
        } catch (error) {
          console.error(`Error processing URL ${url} for ${layout} layout:`, error.message);
        }
      }
    }

    console.log('Finished processing all URLs');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const [gistId] = process.argv.slice(2);

if (!gistId) {
  console.error('Usage: node screenshot-gist.js <gist-id>');
  process.exit(1);
}

processGist(gistId);
