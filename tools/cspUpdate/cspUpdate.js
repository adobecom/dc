const fs = require('fs');
const url = require('url');

const BRANCH = 'csp-update-branch';
const REPO = 'dc';
const OWNER = 'adobecom';
const URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/acrobat/scripts/contentSecurityPolicy`;
const URL_REF = `?ref=${BRANCH}`;
const URL_PULL = `https://api.github.com/repos/${OWNER}/${REPO}/pulls`;
const FILES = ['dev.js', 'stage.js', 'prod.js']
const nodeVersion = process.version.split('.')[0].replace('v', '');

if(nodeVersion < 20){
  console.log("Please use Node version 20 or newer");
  process.exit(1);
}

const { GITHUB_TOKEN } = JSON.parse(fs.readFileSync('tools/cspUpdate/token.json', 'utf8'));
if(!GITHUB_TOKEN){
  console.log('GITHUB_TOKEN is not defined');
  process.exit(1);
}
const headers = {
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

const importData = (filePath) => {
  const data = [];
  fs.readFileSync(filePath)
    .toString()
    .split('\n')
    .forEach((line) => {
      const keys = line.split(',')
      data.push(keys[3]);
    });

  return data.slice(1);
}

const getSrcType = (srcType) => {
  if(srcType.includes('-')){
    const typeSplited = srcType.split('-');

    return typeSplited[0] + typeSplited[1].charAt(0).toUpperCase() + typeSplited[1].slice(1);
  }

  return srcType;
}

const populateLinks = (data) => {
  const src = {
    "connectSrc": new Set(),
    "defaultSrc": new Set(),
    "fontSrc": new Set(),
    "formAction": new Set(),
    "frameSrc": new Set(),
    "imgSrc": new Set(),
    "manifestSrc": new Set(),
    "scriptSrc": new Set(),
    "styleSrc": new Set(),
    "workerSrc": new Set(),
  }

  data.forEach((msg) => {
    if(msg) {
      const msgSplited = msg.split(' ');
      const srcType = getSrcType(msgSplited[0]);
      const link = url.parse(msgSplited.pop(), true);

      link.host && src[srcType].add(link.host);
    }
  });

  return src;
}

const changeFile = (file, srcLinks) => {
  for(const [key, value] of Object.entries(srcLinks)){
    if(!value.size){
      continue;
    }
    const startIndex = file.indexOf(key);
    const firstLinkIndex = file.slice(startIndex).indexOf("'") + startIndex;
    const endIndex = file.slice(startIndex).indexOf(']') - 3 + startIndex;
    const oldLinks = file.
      slice(firstLinkIndex, endIndex + 2).
      split(',').
      map((link) => link.replace(/[\n]/gm, '').
      trim()).
      filter(link => link)
    const lastEl = oldLinks.pop();
    const newLinks = Array.from(value).map((v) => `'${v}'`).filter((link) => /[a-zA-Z]/.test(link) && !link.includes('localhost'));
    const allLinks = new Set([...oldLinks, ...newLinks, lastEl]);
    const bracketIndex = file.slice(startIndex).indexOf('[') + 1 + startIndex;
    const changes = Array.from(allLinks).map((c) => `  ${c}`).join(',\n');

    file = file.slice(0, bracketIndex) + "\n" + changes + file.slice(endIndex + 1);
  }

  return file;
}

const commitChanges = async (file) => {
  const requestBody = {
    message: `Update CSP: ${file.name}`,
    content: file.content,
    branch: BRANCH,
    sha: file.sha
  };
  const commitRequest = await fetch(URL + `/${file.name}`, {headers, body: JSON.stringify(requestBody), method: 'PUT'});
  if(commitRequest.status !== 200){
    const message = await commitRequest.text();
    console.log(`
Changes to file: ${file.name} were not commited!
Response message: ${message}.
    `);
    return;
  }
  console.log(`Commited ${file.name}`);
}

const raisePR = async () => {
  const pullBody = {
    title: 'CSP Update',
    body: '',
    head: `${OWNER}:${BRANCH}`,
    base: 'stage',
  }
  const pullRequest = await fetch(URL_PULL, {headers, body: JSON.stringify(pullBody), method: 'POST'});
  if(pullRequest.status !== 201){
    const message = await pullRequest.text();
    console.log(`
PR was not raised!
Response message: ${message}.
    `);
    return;
  }
  console.log('PR was raised successfully!');
}

const main = async() => {
  try {
    if(!process.argv[2] || process.argv[2].split('.').pop() !== 'csv'){
      throw new Error('Please specify csv file path');
    }
    const data = importData(process.argv[2]);
    const srcLinks = populateLinks(data);
    const filesRequest = await fetch(URL + URL_REF, {headers});
    if(filesRequest.status !== 200){
      throw new Error('Unable to fetch files data');
    }
    const files = await filesRequest.json();
    for(const file of files) {
      if(!FILES.includes(file.name)){
        continue;
      }
      const fileRequest = await fetch(file.download_url, {headers});
      if(fileRequest.status !== 200){
        console.log(`Error while fetching ${file.name}`);
        continue;
      }
      const fileContent = await fileRequest.text();
      const changedFile = changeFile(fileContent, srcLinks);
      await commitChanges({
        name: file.name,
        sha: file.sha,
        content: Buffer.from(changedFile, 'utf-8').toString('base64'),
      });
    }
    await raisePR();
  } catch (e) {
    console.log(e);
  }
}

main();
