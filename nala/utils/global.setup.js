/* eslint-disable import/no-extraneous-dependencies, no-console */

const { execSync } = require('child_process');
const { isBranchURLValid } = require('../libs/baseurl.js');

// Dynamically load PROJECT, ORG, BASE_URLS
let PROJECT; let ORG; let BASE_URLS; let getBranchUrl;
try {
  ({ PROJECT, ORG, BASE_URLS } = require('../libs/config.js'));
  ({ getBranchUrl } = require('../libs/constants.js'));
} catch {
  ({ DEFAULT_REPO: PROJECT, DEFAULT_ORG: ORG, BASE_URLS, getBranchUrl } = require('../libs/constants.js'));
}

async function getGitHubPRBranchLiveUrl() {
  const prReference = process.env.GITHUB_REF;
  const prHeadReference = process.env.GITHUB_HEAD_REF;

  const prNumber = prReference.startsWith('refs/pull/')
    ? prReference.split('/')[2]
    : null;

  const prBranch = prHeadReference
    ? prHeadReference.replace(/\//g, '-')
    : prReference.split('/')[2].replace(/\//g, '-');

  const repository = process.env.GITHUB_REPOSITORY;
  const repoParts = repository.split('/');
  const toRepoOrg = repoParts[0];
  const toRepoName = repoParts[1];

  const prFromOrg = process.env.prOrg || toRepoOrg;
  const prFromRepoName = process.env.prRepo || toRepoName;

  let prBranchLiveUrl;
  if (prBranch === 'main') {
    prBranchLiveUrl = BASE_URLS.main;
  } else {
    prBranchLiveUrl = `https://${prBranch}--${prFromRepoName}--${prFromOrg}.aem.live`;
  }

  try {
    if (await isBranchURLValid(prBranchLiveUrl)) {
      process.env.PR_BRANCH_LIVE_URL = prBranchLiveUrl;
    }
    console.info('GH Ref        : ', prReference);
    console.info('GH Head Ref   : ', prHeadReference);
    console.info('PR Repository : ', repository);
    console.info('PR TO ORG     : ', toRepoOrg);
    console.info('PR TO REPO    : ', toRepoName);
    console.info('PR From ORG   : ', prFromOrg);
    console.info('PR From REPO  : ', prFromRepoName);
    console.info('PR Branch(U)  : ', prBranch);
    console.info('PR Number     : ', prNumber || 'Auto-PR');
    console.info('PR Branch live url : ', prBranchLiveUrl);
  } catch (err) {
    console.error(`Error => Error in setting PR Branch test URL : ${prBranchLiveUrl}`);
    console.info(`Note: PR branch test url ${prBranchLiveUrl} is not valid, Exiting test execution.`);
    process.exit(1);
  }
}

async function getCircleCIBranchLiveUrl() {
  const stageBranchLiveUrl = BASE_URLS.stage;
  try {
    if (await isBranchURLValid(stageBranchLiveUrl)) {
      process.env.PR_BRANCH_LIVE_URL = stageBranchLiveUrl;
    }
    console.info('Stage Branch Live URL : ', stageBranchLiveUrl);
  } catch (err) {
    console.error('Error => Error in setting Stage Branch test URL : ', stageBranchLiveUrl);
    process.exit(1);
  }
}

async function getLocalNonGitBranchLiveUrl() {
  const localTestLiveUrl = process.env.LOCAL_TEST_LIVE_URL || BASE_URLS.local;
  console.info(`✅ Using Non-Git Local Test URL: ${localTestLiveUrl}`);
  process.env.PR_BRANCH_LIVE_URL = localTestLiveUrl;
}

async function getLocalBranchLiveUrl() {
  try {
    const localGitRootDir = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
    const gitRemoteOriginUrl = execSync('git config --get remote.origin.url', {
      cwd: localGitRootDir,
      encoding: 'utf-8',
    }).trim();

    const match = gitRemoteOriginUrl.match(/github\.com\/(.*?)\/(.*?)\.git/);
    if (match) {
      const [localOrg, localRepo] = match.slice(1, 3);
      const localBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: localGitRootDir,
        encoding: 'utf-8',
      }).trim();
      const localTestLiveUrl = process.env.LOCAL_TEST_LIVE_URL || BASE_URLS.local;
      console.info(`✅ Git ORG: ${localOrg}, REPO: ${localRepo}, Branch: ${localBranch}`);
      console.info(`✅ Local Test Live URL: ${localTestLiveUrl}`);
      process.env.PR_BRANCH_LIVE_URL = localTestLiveUrl;
      return;
    }
  } catch (err) {
    console.info('⚠️ Git not detected, falling back to non-Git local flow.');
    await getLocalNonGitBranchLiveUrl();
  }
}

async function globalSetup() {
  console.info('---- Executing Nala Global setup ----\n');

  if (process.env.GITHUB_ACTIONS === 'true') {
    console.info('---- Running Nala Tests in the GitHub environment ----\n');
    await getGitHubPRBranchLiveUrl();
  } else if (process.env.CIRCLECI) {
    console.info('---- Running Nala Tests in the CircleCI environment ----\n');
    await getCircleCIBranchLiveUrl();
  } else {
    console.info('---- Running Nala Tests in the Local environment ----\n');
    await getLocalBranchLiveUrl();
  }
}

module.exports = globalSetup;
