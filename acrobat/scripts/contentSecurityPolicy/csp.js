const PROD_ENVS = [
  'www.adobe.com',
  'sign.ing',
  'edit.ing',
];
const STAGE_ENVS = [
  'www.stage.adobe.com',
  'main--dc--adobecom.hlx.page',
  'main--dc--adobecom.hlx.live',
  'stage--dc--adobecom.hlx.page',
  'main--dc--adobecom.aem.page',
  'main--dc--adobecom.aem.live',
  'stage--dc--adobecom.aem.page',
];

async function getCspEnv() {
  const { hostname } = window.location;
  let cspEnv;
  if (PROD_ENVS.includes(hostname)) {
    cspEnv = 'prod';
  } else if (STAGE_ENVS.includes(hostname)) {
    cspEnv = 'stage';
  } else {
    cspEnv = 'dev';
  }
  return import(`./${cspEnv}.js`);
}

export default async function ContentSecurityPolicy() {
  const { default: ENV } = await getCspEnv();

  const theCSP = `child-src ${ENV.childSrc.join(' ')}\
  connect-src ${ENV.connectSrc.join(' ')}\
  default-src ${ENV.defaultSrc.join(' ')}\
  font-src ${ENV.fontSrc.join(' ')}\
  form-action ${ENV.formAction.join(' ')}\
  frame-src ${ENV.frameSrc.join(' ')}\
  img-src ${ENV.imgSrc.join(' ')}\
  manifest-src ${ENV.manifestSrc.join(' ')}\
  script-src ${ENV.scriptSrc.join(' ')}\
  style-src ${ENV.styleSrc.join(' ')}\
  worker-src ${ENV.workerSrc.join(' ')}`;

  const head = document.querySelector('head');
  const cspElement = document.createElement('meta');
  cspElement.setAttribute('http-equiv', 'Content-Security-Policy');
  cspElement.setAttribute('content', theCSP);
  head.appendChild(cspElement);

  // Content Security Policy Logging
  window.cspErrors = [];
  document.addEventListener('securitypolicyviolation', (e) => {
    window.cspErrors.push(`${e.violatedDirective} violation ¶ Refused to load content from ${e.blockedURI}, Script location: ${e.sourceFile} Line: ${e.lineNumber} Column: ${e.columnNumber}`);
  });
}
