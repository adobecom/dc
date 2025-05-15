const commerceOrigin = ['www.adobe.com', 'main--dc--adobecom.aem.live'].includes(window.location.hostname) ? 'https://commerce.adobe.com' : 'https://commerce-stg.adobe.com';
const offerMap = { ZfP6XPHxvTFnOS_Hd4q9taPkKHinmf6PCozeJEmzqNI: '/store/email?items%5B0%5D%5Bid%5D=04AEF9E2711373902B3235D295DADF70&items%5B0%5D%5Bq%5D=5&cli=doc_cloud&ctx=fp&co=US&lang=en&ss=recommendation&rrItems%5B0%5D%5Bid%5D=04AEF9E2711373902B3235D295DADF70&rrItems%5B0%5D%5Bq%5D=5' };

export default async function threeInOne() {
  const offers = document.querySelectorAll('[data-wcs-osi]');

  offers.forEach((element) => {
    const offerId = element.getAttribute('data-wcs-osi');
    const modalType = element.getAttribute('data-modal');
    if (offerId && modalType === 'crm') {
      element.removeAttribute('data-modal');
      element.removeAttribute('data-modal-id');
      element.setAttribute('data-checkout-workflow-step', 'email');
      if (offerMap[offerId]) {
        element.href = `${commerceOrigin}${offerMap[offerId]}`;
      }
      const clone = element.cloneNode(true);
      element.replaceWith(clone);
    }
  });
}
