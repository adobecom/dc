import devCSP from './dev.js';
import stageCSP from './stage.js';
import prodCSP from './prod.js';

let ENV = devCSP;
// temp
let NAME = 'dev';

if (window.location.hostname === 'main--dc--adobecom.hlx.live'
  || window.location.hostname === 'adobe.com') {
  ENV = prodCSP;
  // temp
  NAME = 'prod';
}

if (window.location.hostname === 'stage--dc--adobecom.hlx.page'
  || window.location.hostname === 'main--dc--adobecom.hlx.page'
  || window.location.hostname === 'www.stage.adobe.com') {
  ENV = stageCSP;
  // temp
  NAME = 'stage';
}

export default function ContentSecurityPolicy() {
  const theCSP = `connect-src ${ENV.connectSrc.join(' ')}\
  default-src ${ENV.defaultSrc.join(' ')}\
  font-src ${ENV.fontSrc.join(' ')}\
  form-action ${ENV.formAction.join(' ')}\
  frame-src ${ENV.frameSrc.join(' ')}\
  manifest-src ${ENV.manifestSrc.join(' ')}\
  script-src ${ENV.scriptSrc.join(' ')}\
  style-src ${ENV.styleSrc.join(' ')}\
  worker-src ${ENV.workerSrc.join(' ')}`;

  // temp
  console.log(`This is the ${NAME} CSP!!`);

  const head = document.querySelector('head');
  const cspElement = document.createElement('meta');
  cspElement.setAttribute('http-equiv', 'Content-Security-Policy');
  cspElement.setAttribute('content', theCSP);
  head.appendChild(cspElement);
}
