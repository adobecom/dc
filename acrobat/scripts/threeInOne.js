const offerToWorkflowStepMap = {
  'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs': 'commitment',
  'ZZQMV2cU-SWQoDxuznonUFMRdxSyTr4J3fB77YBNakY': 'commitment',
  'vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE': 'email',
  'nTbB50pS4lLGv_x1l_UKggd-lxxo2zAJ7WYDa2mW19s': 'email',
  'QgYu51CVY2wKyFEqMuvec4N1tc1OaCypeKJjT5n2-Fc': 'commitment',
  'AW-jV275GNYtPao6Q7XWENqyv_Stkc1BbzF7ak2u1dk': 'email',
  'nIy-IPGnALw3KNncaqMjOJsMUrqElWi8sdGnBFBAgTw': 'commitment',
  WRe4gUHuyqJgCCr3ZywwU9CDP0ezBaCKoMk4xryVQhs: 'commitment',
  Hnk2P6L5wYhnpZLFYTW5upuk2Y3AJXlso8VGWQ0l2TI: 'commitment',
  '-lYm-YaTSZoUgv1gzqCgybgFotLqRsLwf8CgYdvdnsQ': 'commitment',
  WJLr3TF4T4qyJIGZTsDf9KPbTfxA7qAgStpaF2IgYao: 'commitment',
  '8Lr09qx_PHqAJUwvUNiof4FFFEKjsR1TTbvBUncV2b0': 'email',
  lI5NvdLBWJUJEHkP9CAx787kt0uCc3WnoCFVVIjECiA: 'email',
  'OQ1oCm1tZG35Gj7LCrkGeOOdUMfVlC7xx-7ml-CTWIE': 'commitment',
};

document.addEventListener('mas:resolved', (e) => {
  const comCheck = setInterval(() => {
    if (e.target.isCheckoutLink) {
      clearInterval(comCheck);
      e.target.classList.add('threeInOneReady');
    }
  }, 100);
});

function getCommerceOrigin() {
  const commerceStg = 'https://commerce-stg.adobe.com';
  try {
    // eslint-disable-next-line compat/compat
    const params = new URLSearchParams(window.location.search);
    const commerceEnv = params.get('commerce.env');
    if (commerceEnv === 'stage') {
      return commerceStg;
    }
  } catch (error) {
    // fallback for op_mini all browsers that do not support URLSearchParams
    const regex = /commerce\.env=stage/;
    if (regex.test(window.location.search)) {
      return commerceStg;
    }
  }
  return 'https://commerce.adobe.com';
}

export default async function threeInOne() {
  const offers = document.querySelectorAll('[data-wcs-osi]');

  offers.forEach((element) => {
    const offerId = element.getAttribute('data-wcs-osi');
    const modalType = element.getAttribute('data-modal');
    if (offerId && modalType === 'crm') {
      element.removeAttribute('data-modal');
      element.removeAttribute('data-modal-id');
      if (offerToWorkflowStepMap[offerId]) {
        const clone = element.cloneNode(true);
        const comReady = setInterval(() => {
          if (clone.classList.contains('threeInOneReady')) {
            clearInterval(comReady);
            const href = new URL(clone.href, getCommerceOrigin());
            const pathSegments = href.pathname.split('/');
            if (pathSegments.length > 1) {
              pathSegments[pathSegments.length - 1] = offerToWorkflowStepMap[offerId];
              href.pathname = pathSegments.join('/');
            }
            clone.href = href;
          }
        }, 100);
        element.parentElement.replaceChild(clone, element);
      }
    }
  });
}
