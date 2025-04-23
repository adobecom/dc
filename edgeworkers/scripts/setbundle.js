/**
 * Environment variables:
 * - EDGERC: The content of the .edgerc file
 * Command Arguments:
 * - edgeworker name: The name of the EdgeWorker
 *   example: 'Acrobat_DC_web_prod' or 'Acrobat_DC_web_stg' 
 * - description: The description of the bundle

 */
const fs = require('fs');
const os = require('os');
const EdgeGrid = require('akamai-edgegrid');
const { compareVersions } = require('compare-versions');

const egSend = (eg, path, method, body) => {
  eg.auth({ path, method, body });

  return new Promise((resolve, reject) => {
    eg.send(function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};


async function main() {
  const edgeworkerName = process.argv.length > 2 ? process.argv[2] : null;
  const description = process.argv.length > 3 ? process.argv[3] : null;

  if (!edgeworkerName) {
    console.error('Please provide the name of the EdgeWorker');
    process.exit(1);
  }

  if (process.env.EDGERC) {
    fs.writeFileSync('.edgerc', process.env.EDGERC, 'utf8');
  }

  const edgercPath = fs.existsSync('.edgerc') ? '.edgerc' : `${os.homedir()}/.edgerc`;

  const eg = new EdgeGrid({ path: edgercPath, section: 'edgeworkers' });

  let body = await egSend(eg, '/edgeworkers/v1/ids', 'GET');
  const edgeWorkers = body.edgeWorkerIds;
  const edgeWorker = edgeWorkers.find((ew) => ew.name === edgeworkerName);

  if (!edgeWorker) {
    console.error(`EdgeWorker ${edgeworkerName} not found`);
    process.exit(1);
  }

  body = await egSend(
    eg,
    `/edgeworkers/v1/ids/${edgeWorker.edgeWorkerId}/versions`,
    'GET'
  );
  const versions = body.versions.map((x) => x.version).sort(compareVersions);
  const latestVersion = versions[versions.length - 1];

  console.log(`The latest version of ${edgeworkerName} is ${latestVersion}`);

  const bundleJsonPath = `edgeworkers/${edgeworkerName}/bundle.json`;

  if (!fs.existsSync(bundleJsonPath)) {
    console.error(`Bundle file ${bundleJsonPath} not found`);
    process.exit(1);
  }

  let bundleJson = JSON.parse(fs.readFileSync(bundleJsonPath, 'utf8'));

  let versionSegs = latestVersion.split('.').map(x => parseInt(x));
  versionSegs[versionSegs.length - 1] += 1;
  
  bundleJson['edgeworker-version'] = versionSegs.join('.');

  if (description) {
    bundleJson.description = description;
  }

  console.log(`New bundle info: ${JSON.stringify(bundleJson, null, 2)}`);

  fs.writeFileSync(bundleJsonPath, JSON.stringify(bundleJson, null, 2), 'utf8');

  const edgekvTokenPath = `edgeworkers/${edgeworkerName}/edgekv_tokens.js`;

  if (fs.existsSync(edgekvTokenPath)) {
    let edgekvToken = fs.readFileSync(edgekvTokenPath, 'utf8');
    edgekvToken = edgekvToken.replace(/<edgekv-access-token-ref>/g, process.env.EDGEKV_TOKEN_REF);
    fs.writeFileSync(edgekvTokenPath, edgekvToken, 'utf8');
  }
}

main();
