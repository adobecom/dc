/* eslint-disable */

var routes = [
  { pattern: /^\/acrobat\/online\/.*/, redirect: 'https://acrobat.adobe.com/home/index-browser-eol.html' },
  { pattern: /.*/, redirect: 'https://helpx.adobe.com/x-productkb/global/adobe-supported-browsers.html' }
];

export function getRedirectURL(currentPath) {
  if (currentPath == null) {
    return null;
  }

  for (var i = 0; i < routes.length; i++) {
    if (routes[i].pattern.test(currentPath)) {
      console.log('Redirecting to: ' + currentPath);
      return routes[i].redirect;
    }
  }
  return null;
}

export function redirectToURL(url) {
  window.location.href = url;
}

function initiateRedirect() {
  if (pathname = getRedirectURL(window.location.pathname)) {
    redirectToURL(pathname);
  }
}

window.onload = initiateRedirect;
/* eslint-enable */
