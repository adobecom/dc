const fs = require('fs');

async function queryIndex(url) {
  let results = [];
  let data = {
    offset: 0,
    limit: 0,
    total: 1,
  }
  while (data.offset + data.limit < data.total) {
    const resp = await fetch(
      url + `?offset=${data.offset + data.limit}`
    );
    if (!resp.ok) break;
    data = await resp.json();
    results = results.concat(data.data);
  }
  return results;
}

function diffKeys(a, b) {
  const diffs = [];
  const keys = new Set(Object.keys(a).concat(Object.keys(b)));
  for (const key of keys) {
    if (a[key] !== b[key]) {
      diffs.push(key);
    }
  }
  return diffs;
}

async function main() {
  let outputJson;
  let baseJson;
  let filename;
  if (process.argv.length === 5) {
    filename = process.argv[2];
    outputJson = process.argv[3];
    baseJson = process.argv[4];
  } else if (process.argv.length === 4) {
    filename = process.argv[2];    
    outputJson = process.argv[3];    
  } else {
    console.error('Usage: node query_metadata.js [filename] [output.json] [base.json]');
    process.exit(1);
  }

  let baseUrls = [];

  if (baseJson && fs.existsSync(baseJson)) {
    baseUrls = JSON.parse(fs.readFileSync(baseJson));
  }

  filename = filename.replace(/^\/+/, '');

  const queryIndexUrl =
    `https://main--dc--adobecom.hlx.live/${filename}`;
  const urls = await queryIndex(queryIndexUrl);
  
  fs.writeFileSync(outputJson, JSON.stringify(urls, null, 2));
  
  const urlMap = {};
  for (const url of urls) {
    urlMap[url.URL] = url;
  }

  const baseUrlMap = {};
  for (const url of baseUrls) {
    baseUrlMap[url.URL] = url;
  }

  const diff = {
    added: [],
    removed: [],
    changed: [],
  }
  for (const path in urlMap) {
    if (!baseUrlMap[path]) {
      diff.added.push(path);
    } else if (JSON.stringify(urlMap[path]) !== JSON.stringify(baseUrlMap[path])) {
      const keys = diffKeys(urlMap[path], baseUrlMap[path]);
      diff.changed.push(`${path} (${keys.join(', ')})`);
    }
  }
  for (const path in baseUrlMap) {
    if (!urlMap[path]) {
      diff.removed.push(path);
    }
  }

  fs.writeFileSync(`diff_${filename}`, JSON.stringify(diff, null, 2));
}

main();