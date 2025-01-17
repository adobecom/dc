import susiAnalytics from './alloy/susi-auth-handler.js';
import { loadPlaceholders } from './utils.js';

function handleButton(link, action) {
  link.classList.add('susi-cta');
  link.href = window.mph['susi-default-redirect'] || 'https://acrobat.adobe.com/link/home/';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    susiAnalytics(link.text, action, window.browser.isMobile ? 'mobile' : 'desktop');
    if (action === 'sign-up') {
      window.adobeIMS.signUp();
    } else if (action === 'sign-in') {
      window.adobeIMS.signIn();
    }
  });
}

export default async function handleImsSusi(susiElems) {
  await loadPlaceholders();
  susiElems.forEach((link) => {
    const match = link.href.match(/-(sign-up|sign-in)/);
    if (match) {
      handleButton(link, match[1]);
    }
  });
}
