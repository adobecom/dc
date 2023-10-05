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

async function main() {
  let outputJson;
  let baseJson;
  if (process.argv.length === 4) {
    outputJson = process.argv[2];
    baseJson = process.argv[3];
  } else if (process.argv.length === 3) {
    outputJson = process.argv[2];    
  } else {
    console.error('Usage: node query_index.js [output.json] [base.json]');
    process.exit(1);
  }

  let baseUrls = [];

  if (baseJson && fs.existsSync(baseJson)) {
    baseUrls = JSON.parse(fs.readFileSync(baseJson));
  }

  const queryIndexUrl =
    'https://www.adobe.com/dc-shared/assets/query-index.json';
  const urls = await queryIndex(queryIndexUrl);
  
  fs.writeFileSync(outputJson, JSON.stringify(urls, null, 2));
  
  const urlMap = {};
  for (const url of urls) {
    urlMap[url.path] = url;
  }

  const baseUrlMap = {};
  for (const url of baseUrls) {
    baseUrlMap[url.path] = url;
  }

  const diff = {
    added: [],
    removed: [],
    changed: [],
  }
  for (const path in urlMap) {
    if (!baseUrlMap[path]) {
      diff.added.push(path);
    } else if (urlMap[path].lastModified !== baseUrlMap[path].lastModified) {
      diff.changed.push(path);
    }
  }
  for (const path in baseUrlMap) {
    if (!urlMap[path]) {
      diff.removed.push(path);
    }
  }

  fs.writeFileSync('diff.json', JSON.stringify(diff, null, 2));
}

main();