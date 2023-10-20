var getBrowserData = function (userAgent) {
  if (!userAgent) {
    return {};
  }
  var browser = {
    ua: userAgent,
  };

  var regex = [
    {
      browserReg: /edg([ae]|ios)?/i,
      versionReg: /edg([ae]|ios)?[\s/](\d+(\.?\d+)+)/i,
      name: 'Microsoft Edge',
    },
    {
      browserReg: /chrome|crios|crmo/i,
      versionReg: /(?:chrome|crios|crmo)\/(\d+(\.?\d+)+)/i,
      name: 'Chrome',
    },
    {
      browserReg: /firefox|fxios|iceweasel/i,
      versionReg: /(?:firefox|fxios|iceweasel)[\s/](\d+(\.?\d+)+)/i,
      name: 'Firefox',
    },
    {
      browserReg: /msie|trident/i,
      versionReg: /(?:msie |rv:)(\d+(\.?\d+)+)/i,
      name: 'Internet Explorer',
    },
    {
      browserReg: /safari|applewebkit/i,
      versionReg: /(?:version)\/(\d+(\.?\d+)+)/i,
      name: 'Safari',
    },
  ];

  for (var i=0; i < regex.length; i++) {
    if (regex[i].browserReg.test(userAgent)) {
      var version = userAgent.match(regex[i].versionReg);
      var version = userAgent.match(regex[i].versionReg);
      browser.name = regex[i].name;
      console.log(browser.name);
    }
  }
  return browser;
};

//Get browser data
window.browser = getBrowserData(window.navigator.userAgent);

// Feature checking for old browsers
var EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
if (window.browser.name === 'Internet Explorer' ||
  window.browser.name === 'Microsoft Edge' && window.browser.version.split('.')[0] < 86 ||
  window.browser.name === 'Microsoft Edge' && !window.browser.version ||
  window.browser.name === 'Safari' && window.browser.version.split('.')[0] < 14 ||
  window.browser.name === 'Safari' && !window.browser.version ) {
  window.location.href = EOLBrowserPage;
}
