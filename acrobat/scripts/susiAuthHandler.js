import susiAnalytics from './alloy/susi-auth-handler.js';

export default function handleImsSusi(susiElems) {
  susiElems.forEach((link) => {
    if (link.href.includes('-sign-up')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        susiAnalytics(link.text, 'sign-up', window.browser.isMobile ? 'mobile' : 'desktop');
        window.adobeIMS.signUp();
      });
    } else if (link.href.includes('-sign-in')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        susiAnalytics(link.text, 'sign-in', window.browser.isMobile ? 'mobile' : 'desktop');
        window.adobeIMS.signIn();
      });
    }
    link.style.pointerEvents = 'auto';
    link.style.cursor = 'pointer';
  });
}
