const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';

// Check if browser version is compatible with minimal milo / DC widget requirements
export function browserDetection() {
  // Uses Bowser Library (https://lancedikson.github.io/bowser/docs/Parser.html)
  const parser = bowser.getParser(window.navigator.userAgent);
  const browserName = parser.getBrowserName();
  const version = parser.getBrowserVersion();

  if (!browserName) return null;
  let majorVersion = null;

  if (version) {
    const versionElements = version.split('.');
    if (versionElements.length >= 1) {
      majorVersion = parseInt(versionElements[0], 10);
    }
  }

  // IE is not supported
  if (/Internet Explorer/i.test(browserName)) return 'IE';

  if (/Microsoft Edge/i.test(browserName)) {
    // if we cannot determine major version, we should not redirect to be on the safe side
    // EDGE: DC Widget >= 79, Milo >= 86
    if (!majorVersion || majorVersion >= 86) {
      return 'EDGE-CHROMIUM';
    }
    return 'EDGE-LEGACY';
  }

  if (/Chrome/i.test(browserName)) return 'CHROME';

  if (/Firefox/i.test(browserName)) return 'FF';

  if (/Safari/i.test(browserName)) {
    // if we cannot determine major version, we should not redirect to be on the safe side
    // Safari: DC Widget > 12, Milo >= 14
    return (!majorVersion || majorVersion >= 14) ? 'SAFARI' : 'SAFARI-LEGACY';
  }
  return null;
}

// Redirects to EOL Browser page if browser conditions are not met.
export function redirectLegacyBrowsers() {
  const browserType = browserDetection();

  if (browserType === 'IE' || browserType === 'EDGE-LEGACY' || browserType === 'SAFARI-LEGACY') {
    window.location.assign(EOLBrowserPage);
  }
}
