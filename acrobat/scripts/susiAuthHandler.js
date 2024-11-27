import { setLibs } from './utils.js';
import susiAnalytics from './alloy/susi-auth-handler.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

async function handleButton(link, action) {
  const originalClasses = Array.from(link.classList);
  const button = createTag('button', { class: `susi-cta ${originalClasses.join(' ')}` }, link.text);
  link.replaceWith(button);
  button.addEventListener('click', (e) => {
    e.preventDefault();
    susiAnalytics(link.text, `${action}`, window.browser.isMobile ? 'mobile' : 'desktop');
    if (action === 'sign-up') {
      window.adobeIMS.signUp();
    } else if (action === 'sign-in') {
      window.adobeIMS.signIn();
    }
  });
}

export default function handleImsSusi(susiElems) {
  susiElems.forEach((link) => {
    if (link.href.includes('-sign-up')) {
      handleButton(link, 'sign-up');
    } else if (link.href.includes('-sign-in')) {
      handleButton(link, 'sign-in');
    }
  });
}
