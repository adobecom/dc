import susiAnalytics from './alloy/susi-auth-handler.js';

async function handleButton(link, action) {
  link.classList.add('susi-cta');
  link.href = window.mph['susi-default-redirect'] || 'https://acrobat.adobe.com/link/home/';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    susiAnalytics(link.text, `${action}`, window.browser.isMobile ? 'mobile' : 'desktop');
    if (action === 'sign-up') {
      window.adobeIMS.signUp();
    } else if (action === 'sign-in') {
      window.adobeIMS.signIn();
    }
  });
}

export default async function handleImsSusi(susiElems) {
  const { setLibs } = await import('./utils.js');
  const miloLibs = setLibs('/libs');
  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const config = getConfig();

  // Ensure placeholders are loaded
  if (!Object.keys(window.mph || {}).length) {
    const placeholdersPath = `${config.locale.contentRoot}/placeholders.json`;
    const response = await fetch(placeholdersPath);
    if (response.ok) {
      const placeholderJson = await response.json();
      placeholderJson.data.forEach((item) => {
        window.mph[item.key] = item.value.replace(/\u00A0/g, ' ');
      });
    }
  }

  susiElems.forEach((link) => {
    if (link.href.includes('-sign-up')) {
      handleButton(link, 'sign-up');
    } else if (link.href.includes('-sign-in')) {
      handleButton(link, 'sign-in');
    }
  });
}
