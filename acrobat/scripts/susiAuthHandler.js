import susiAnalytics from './alloy/susi-auth-handler.js';

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
  const { setLibs } = await import('./utils.js');
  const miloLibs = setLibs('/libs');
  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const config = getConfig();

  if (!Object.keys(window.mph || {}).length) {
    const placeholdersPath = `${config.locale.contentRoot}/placeholders.json`;
    try {
      const response = await fetch(placeholdersPath);
      if (response.ok) {
        const placeholderData = await response.json();
        placeholderData.data.forEach(({ key, value }) => {
          window.mph[key] = value.replace(/\u00A0/g, ' ');
        });
      }
    } catch (error) {
      window.lana?.log(`Failed to load placeholders: ${error?.message}`);
    }
  }

  susiElems.forEach((link) => {
    const match = link.href.match(/-(sign-up|sign-in)/);
    if (match) {
      handleButton(link, match[1]);
    }
  });
}
