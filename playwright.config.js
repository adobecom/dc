/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

const { devices } = require('@playwright/test');

let PROJECT; let ORG; let
  BASE_URLS;
try {
  ({ PROJECT, ORG, BASE_URLS } = require('./nala/libs/config.js'));
} catch {
  const { DEFAULT_REPO, DEFAULT_ORG, BASE_URLS: DEFAULT_URLS } = require('./nala/libs/constants.js');
  PROJECT = DEFAULT_REPO;
  ORG = DEFAULT_ORG;
  BASE_URLS = DEFAULT_URLS;
}

const USER_AGENT_DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.18 Safari/537.36 NALA-Acom';
const USER_AGENT_MOBILE_CHROME = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36 NALA-Acom';
const USER_AGENT_MOBILE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1 NALA-Acom';

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './nala',
  outputDir: './test-results',
  globalSetup: './nala/utils/global.setup.js',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  testMatch: '**/*.test.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 7 : 3,
  reporter: process.env.CI
    ? [['github'], ['list'], ['./nala/utils/base-reporter.js']]
    : [['html', { outputFolder: 'test-html-results' }], ['list'], ['./nala/utils/base-reporter.js']],
  use: {
    actionTimeout: 60000,
    trace: 'on-first-retry',
    baseURL:
      process.env.PR_BRANCH_LIVE_URL
      || process.env.LOCAL_TEST_LIVE_URL
      || BASE_URLS.main,
  },
  projects: [
    {
      name: `${PROJECT}-live-chromium`,
      use: {
        ...devices['Desktop Chrome'],
        userAgent: USER_AGENT_DESKTOP,
      },
    },
    {
      name: `${PROJECT}-live-firefox`,
      use: {
        ...devices['Desktop Firefox'],
        userAgent: USER_AGENT_DESKTOP,
      },
    },
    {
      name: `${PROJECT}-live-webkit`,
      use: {
        ...devices['Desktop Safari'],
        userAgent: USER_AGENT_DESKTOP,
      },
    },
    {
      name: 'mobile-chrome-pixel5',
      use: {
        ...devices['Pixel 5'],
        userAgent: USER_AGENT_MOBILE_CHROME,
      },
    },
    {
      name: 'mobile-safari-iPhone12',
      use: {
        ...devices['iPhone 12'],
        userAgent: USER_AGENT_MOBILE_SAFARI,
      },
    },
  ],
};

module.exports = config;
