import { loadStyle } from '../../scripts/utils.js';
import { localeMap } from '../dc-converter-widget/dc-converter-widget.js';

function getUnityLibs(prodLibs = '/unitylibs') {
  const { hostname } = window.location;
  if (!hostname.includes('hlx.page')
    && !hostname.includes('hlx.live')
    && !hostname.includes('localhost')) {
    return prodLibs;
  }
  const branch = new URLSearchParams(window.location.search).get('unitylibs') || 'main';
  if (branch.indexOf('--') > -1) return `https://${branch}.hlx.live/unitylibs`;
  return `https://${branch}--unity--adobecom.hlx.live/unitylibs`;
}

export default async function init(el) {
  const unitylibs = getUnityLibs();
  const langFromPath = window.location.pathname.split('/')[1];
  const languageCode = localeMap[langFromPath] ? localeMap[langFromPath].split('-')[0] : 'en';
  const languageRegion = localeMap[langFromPath] ? localeMap[langFromPath].split('-')[1] : 'us';
  const stylePromise = new Promise((resolve) => {
    loadStyle(`${unitylibs}/core/styles/styles.css`, resolve);
  });
  await stylePromise;
  const { default: wfinit } = await import(`${unitylibs}/core/workflow/workflow.js`);
  await wfinit(el, 'acrobat', unitylibs, 'v2', languageRegion, languageCode);
}
