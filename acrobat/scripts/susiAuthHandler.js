export default function handleImsSusi(susiElems) {
  susiElems.forEach((link) => {
    if(link.href.includes('-sign-up')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signUp();
      });
    }
    else if(link.href.includes('-sign-in')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signIn();
      });
    }
    link.style.pointerEvents = 'auto';
    link.style.cursor = 'pointer';
  });
}
