export default function handleImsSusi(susiSignUpElems, susiSignInElems) {
    susiSignUpElems.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signUp();
      });
      link.style.display = '';
    });

    susiSignInElems.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signIn();
      });
      link.style.display = '';
    });
}
