#!/usr/bin/env node
/* eslint-disable default-param-last */
const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const { processUrlsFromCommand, processUrlsFromFile } = require('./a11y-bot.js');

// Dynamic config loader
let PROJECT; let ORG; let BASE_URLS; let
  getBranchUrl;
try {
  ({ PROJECT, ORG, BASE_URLS } = require('../libs/config.js'));
  ({ getBranchUrl } = require('../libs/constants.js'));
} catch {
  ({ DEFAULT_REPO: PROJECT, DEFAULT_ORG: ORG, BASE_URLS, getBranchUrl } = require('../libs/constants.js'));
}

const program = new Command();

program
  .name('nala-a11y-bot')
  .description('Nala Accessibility Testing Bot')
  .version('1.0.0');

program
  .command('a11y [env] [path]')
  .description('Run an accessibility test on an environment with optional path or a file with URLs')
  .option('-f, --file <filePath>', 'Specify a file with multiple URLs')
  .option('-s, --scope <scope>', 'Specify the test scope (default: body)', 'body')
  .option('-t, --tags <tags>', 'Specify the tags to include', (val) => val.split(','))
  .option('-m, --max-violations <maxViolations>', 'Max allowed violations before failing (default: 0)', (val) => parseInt(val, 10), 0)
  .option('-o, --output-dir <outputDir>', 'Directory to save HTML report (default: ./test-a11y-results)', './test-a11y-results')
  .action(async (env, path = '', options) => {
    const urls = [];

    try {
      if (options.file) {
        if (!fs.existsSync(options.file)) {
          console.error(chalk.red(`Error: The file path "${options.file}" does not exist.`));
          process.exit(1);
        }
        await processUrlsFromFile(options.file, options);
        return;
      }

      if (env && BASE_URLS[env]) {
        const fullUrl = `${BASE_URLS[env]}${path.startsWith('/') ? '' : '/'}${path}`;
        urls.push(fullUrl);
      } else if (env && (env.startsWith('http://') || env.startsWith('https://'))) {
        urls.push(env);
      } else if (env) {
        const branchUrl = getBranchUrl(env, PROJECT, ORG, path);
        urls.push(branchUrl);
      } else if (!options.file) {
        console.error(chalk.red('Error: Invalid environment, URL, or file provided.'));
        process.exit(1);
      }

      const validUrls = urls.filter((url) => url.startsWith('http://') || url.startsWith('https://'));

      if (validUrls.length > 0) {
        console.log(chalk.green(`Running accessibility tests on:\n${validUrls.join('\n')}\n`));
        await processUrlsFromCommand(validUrls, options);
      } else {
        console.error(chalk.red('No valid URLs to test.'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`An error occurred during processing: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
