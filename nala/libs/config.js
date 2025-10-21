// CommonJS Config (.js with module.exports)
const PROJECT = 'dc';
const ORG = 'adobecom';
const BRANCHES = { main: 'main', stage: 'stage' };
const MAIN_BRANCH_LIVE_URL = `https://${BRANCHES.main}--${PROJECT}--${ORG}.aem.live`;
const STAGE_BRANCH_URL = `https://${BRANCHES.stage}--${PROJECT}--${ORG}.aem.live`;
const BASE_URLS = { local: 'http://localhost:3000', stage: STAGE_BRANCH_URL, main: MAIN_BRANCH_LIVE_URL };

module.exports = { PROJECT, ORG, BRANCHES, MAIN_BRANCH_LIVE_URL, STAGE_BRANCH_URL, BASE_URLS };
