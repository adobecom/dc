// nala/libs/constants.js

const DEFAULT_REPO = 'milo';
const DEFAULT_ORG = 'adobecom';

// Default fallback BASE_URLS (not project-specific)
const BASE_URLS = {
  local: 'http://localhost:3000',
  stage: `http://stage--${DEFAULT_REPO}--${DEFAULT_ORG}.aem.live`,
  main: `https://main--${DEFAULT_REPO}--${DEFAULT_ORG}.aem.live`,
};

// Utility function to generate branch live URLs dynamically
function getBranchUrl(branch, repo = DEFAULT_REPO, org = DEFAULT_ORG, path = '') {
  return `https://${branch}--${repo}--${org}.aem.live${path.startsWith('/') ? '' : '/'}${path}`;
}

// Optional extras you can extend:
const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const MAX_A11Y_VIOLATIONS = 0;
const SLACK_CHANNEL = '#nala-reports';
const USER_AGENT_DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const USER_AGENT_MOBILE_CHROME = 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36';
const USER_AGENT_MOBILE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1 NALA-Acom';

module.exports = {
  DEFAULT_REPO,
  DEFAULT_ORG,
  BASE_URLS,
  getBranchUrl,
  A11Y_TAGS,
  MAX_A11Y_VIOLATIONS,
  SLACK_CHANNEL,
  USER_AGENT_DESKTOP,
  USER_AGENT_MOBILE_CHROME,
  USER_AGENT_MOBILE_SAFARI,
};
