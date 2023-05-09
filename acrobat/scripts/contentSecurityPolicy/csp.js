const PROD_ENVS = [
  'www.adobe.com'
];

const STAGE_ENVS = [
  'www.stage.adobe.com',
  'main--dc--adobecom.hlx.page',
  'main--dc--adobecom.hlx.live',
  'stage--dc--adobecom.hlx.page'
];

async function getCspEnv() {
  const { hostname } = window.location;
  const cspEnv =
    (PROD_ENVS.includes(hostname)) ? 'prod'
    : (STAGE_ENVS.includes(hostname)) ? 'stage'
    : 'dev';
  return import(`./${cspEnv}.js`);
}

export default async function ContentSecurityPolicy() {
  const { default: ENV } = await getCspEnv();

  const theCSP = `connect-src ${ENV.connectSrc.join(' ')}\
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
  document.addEventListener("securitypolicyviolation", (e) => {
    cspErrors.push(`${e.violatedDirective} violation ¶ Refused to load content from ${e.blockedURI}`);
  });
}
