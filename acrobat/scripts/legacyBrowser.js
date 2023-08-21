import { getBrowserData } from './utils.js';

const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
// Check if browser version is compatible with minimal milo / DC widget requirements
function browserRedirect(browserName, majorVersion) {
  if (!browserName || !majorVersion) return false;
  // IE is not supported
  if (/Internet Explorer/i.test(browserName)) return true;
  // EDGE: DC Widget >= 79, Milo >= 86
  if (/Microsoft Edge/i.test(browserName) && majorVersion < 86) return true;
  // Safari: DC Widget > 12, Milo >= 14
  if (/Safari/i.test(browserName) && majorVersion < 14) return true;
  return false;
}

// Redirects to EOL Browser page if browser conditions are not met.
export default function redirectLegacyBrowsers() {
  const { name, majorVersion } = getBrowserData();
  if (browserRedirect(name, majorVersion)) {
    window.location.assign(EOLBrowserPage);
  }
}
