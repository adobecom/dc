(function RedirectLegacyBrowsers() {
  var location = getLocation();
  var userAgent = navigator.userAgent;
  var isLegacy = false;
  var browserName;
  
  if(userAgent.match(/chrome|chromium|crios/i)){
      browserName = "Chrome";
      isLegacy = true;
    }else if(userAgent.match(/firefox|fxios/i)){
      browserName = "Firefox";
    }  else if(userAgent.match(/safari/i)){
      browserName = "Safari";
    }else if(userAgent.match(/opr\//i)){
      browserName = "Opera";
    } else if(userAgent.match(/edg/i)){
      browserName = "Chrome";
      isLegacy = true;
    } else{
      browserName="No browser detection";
    }
    if (isLegacy === true) {
      const url = '/legacy-browser-redirects.json';
      var req = new XMLHttpRequest();
      req.overrideMimeType("application/json");
      req.open('GET', url, true);
      req.onload  = function() {
         var jsonResponse = JSON.parse(req.responseText);
        console.log(jsonResponse.data[0].Source);
        if (location === jsonResponse.data[0].Source) {
          alert(browserName);
          if (browserName === "Chrome") {
            window.location.href = jsonResponse.data[0].IE11
          }
        }
      };
      req.send(null);
    }
})();

function getLocation() {
  var location = window.location.href.toString().split(window.location.host)[1];
    if (location.match('/')) {
      location = '/index';
    }
    return location
}
