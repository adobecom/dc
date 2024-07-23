import { setLibs } from './utils.js';

const miloLibs = setLibs('/libs');
const { loadIms } = import(`${miloLibs}/utils/utils.js`);

export default async function dcLoadIMS() {
  try {
    await loadIms();
    const imsIsReady = new CustomEvent('IMS:Ready');
    window.dispatchEvent(imsIsReady);
  } catch (error) {
    window.lana?.log('IMS load failed:', error);
  }
}
