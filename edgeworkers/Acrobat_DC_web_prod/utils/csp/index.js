import stage from './stage.js';
import prod from './prod.js';

export default function ContentSecurityPolicy(isProd, scriptSrc = []) {
  const ENV = isProd ? prod : stage;

  return `child-src ${ENV.childSrc.join(' ')}\
  connect-src ${ENV.connectSrc.join(' ')}\
  default-src ${ENV.defaultSrc.join(' ')}\
  font-src ${ENV.fontSrc.join(' ')}\
  form-action ${ENV.formAction.join(' ')}\
  frame-src ${ENV.frameSrc.join(' ')}\
  img-src ${ENV.imgSrc.join(' ')}\
  manifest-src ${ENV.manifestSrc.join(' ')}\
  script-src ${[...scriptSrc, ...ENV.scriptSrc].join(' ')}\
  style-src ${ENV.styleSrc.join(' ')}\
  worker-src ${ENV.workerSrc.join(' ')}`;
}
