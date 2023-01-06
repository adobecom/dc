import devCSP from './dev.js';
import stageCSP from './stage.js';
import prodCSP from './prod.js';

let ENV = devCSP;
// temp
let NAME = 'dev';

if (window.location.hostname === 'main--acrobat--adobecom.hlx.page' ||
    window.location.hostname === 'adobe.com') {
  ENV = prodCSP;
  // temp
  NAME = 'prod';
}

if (window.location.hostname === 'stage--acrobat--adobecom.hlx.page') {
  ENV = stageCSP;
  // temp
  NAME = 'stage';
}

export default function ContentSecurityPolicy() {
  const theCSP = `connect-src ${ENV.connect.join(' ')} default-src ${ENV.defaultSrc.join(' ')} font-src ${ENV.font.join(' ')}`;

  // temp
  console.log(`This is the ${NAME} CSP!!`);
  console.log(theCSP);

  const head = document.querySelector('head');
  const cspElement = document.createElement('meta');
  cspElement.setAttribute('http-equiv', 'Content-Security-Policy');
  cspElement.setAttribute('content', 'NO-CSP');
  head.appendChild(cspElement);
}
