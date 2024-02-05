/* eslint-disable */
var routes = [
  { pattern: /^\/acrobat\/online\/.*/, redirect: 'https://acrobat.adobe.com/home/index-browser-eol.html' },
  { pattern: /.*/, redirect: 'https://acrobat.adobe.com/home/index-browser-eol.html' }
];

var redirectToSupportPage = function() {
  var currentPathname = window.location.pathname;
  for (var i = 0; i < routes.length; i++) {
    if (routes[i].pattern.test(currentPathname)) {
      window.location.href = routes[i].redirect;
      break;
    }
  }
};

redirectToSupportPage();
/* eslint-enable */
