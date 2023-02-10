import devCSP from './dev.js';
import stageCSP from './stage.js';
import prodCSP from './prod.js';

let ENV;
let NAME;

if (window.location.hostname === 'main--dc--adobecom.hlx.live'
  || window.location.hostname === 'www.adobe.com') {
  ENV = prodCSP;
  // temp
  NAME = 'prod';
} else if (window.location.hostname === 'stage--dc--adobecom.hlx.page'
  || window.location.hostname === 'main--dc--adobecom.hlx.page'
  || window.location.hostname === 'www.stage.adobe.com') {
  ENV = stageCSP;
  // temp
  NAME = 'stage';
} else {
  ENV = devCSP;
  // temp
  NAME = 'dev';
}

export default function ContentSecurityPolicy() {
  const theCSP = `connect-src ${ENV.connectSrc.join(' ')}\
  default-src ${ENV.defaultSrc.join(' ')}\
  font-src ${ENV.fontSrc.join(' ')}\
  form-action ${ENV.formAction.join(' ')}\
  frame-src ${ENV.frameSrc.join(' ')}\
  img-src ${ENV.imgSrc.join(' ')}\
  manifest-src ${ENV.manifestSrc.join(' ')}\
  script-src ${ENV.scriptSrc.join(' ')}\
  style-src ${ENV.styleSrc.join(' ')}\
  prefetch-src ${ENV.preSrc.join(' ')}\
  worker-src ${ENV.workerSrc.join(' ')}`;

  const head = document.querySelector('head');
  const cspElement = document.createElement('meta');
  cspElement.setAttribute('http-equiv', 'Content-Security-Policy');
  cspElement.setAttribute('content', theCSP);
  head.appendChild(cspElement);

  // Content Security Policy Logging
  window.cspErrors = [];
  document.addEventListener("securitypolicyviolation", (e) => {
    cspErrors.push(`${e.violatedDirective} violation ¶ Refused to load content from ${e.blockedURI}`);
  });
}
