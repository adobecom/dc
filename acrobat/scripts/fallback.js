/* eslint-disable */
var routes = [
  {
    pattern: /^\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\/acrobat\/online\/.*/,
    redirect: function() {
      return 'https://acrobat.adobe.com/home/index-browser-eol.html';
    }
  },
  {
    pattern: /^\/acrobat\/online\/.*/,
    redirect: function() {
      return 'https://acrobat.adobe.com/home/index-browser-eol.html';
    }
  },
  {
    pattern: /^\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\/(.*)/,
    redirect: function(matches) {
      var locale = matches[1];
      var path = matches[2];
      return 'https://helpx.adobe.com/' + locale + '/x-productkb/global/adobe-supported-browsers.html';
    }
  },
  {
    pattern: /.*/,
    redirect: function() {
      return 'https://helpx.adobe.com/x-productkb/global/adobe-supported-browsers.html';
    }
  }
];

var redirectToSupportPage = function() {
  var currentPathname = window.location.pathname;
  for (var i = 0; i < routes.length; i++) {
    var match = currentPathname.match(routes[i].pattern);
    if (match) {
      var redirectUrl = routes[i].redirect(match);
      window.location.href = redirectUrl;
      break;
    }
  }
};
window.routes = routes;
window.redirectToSupportPage = redirectToSupportPage;

window.redirectToSupportPage();
/* eslint-enable */
