const commerceOrigin = 'https://commerce.adobe.com';
const offerMap = {
  'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs': '/store/commitment?items%5B0%5D%5Bid%5D=7C30A05FE0EC0BA92566737E720C4692&cli=doc_cloud&ctx=fp',
  'ZZQMV2cU-SWQoDxuznonUFMRdxSyTr4J3fB77YBNakY': '/store/commitment?items%5B0%5D%5Bid%5D=1DCDA0FEA46DFD40623D9648765528D3&cli=doc_cloud&ctx=fp',
  'vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE': '/store/email?items%5B0%5D%5Bid%5D=4F5EFB5713F74AFFC5960C031FB24656&items%5B0%5D%5Bq%5D=2&cli=doc_cloud&ctx=fp',
  'nTbB50pS4lLGv_x1l_UKggd-lxxo2zAJ7WYDa2mW19s': '/store/email?items%5B0%5D%5Bid%5D=44C623423443E5D4D7F53719C25F71D7&items%5B0%5D%5Bq%5D=5&cli=doc_cloud&ctx=fp',
  'QgYu51CVY2wKyFEqMuvec4N1tc1OaCypeKJjT5n2-Fc': '/store/commitment?items%5B0%5D%5Bid%5D=04EA56333389C2F1EFD15EB8FCF79E87&cli=doc_cloud&ctx=fp',
  'AW-jV275GNYtPao6Q7XWENqyv_Stkc1BbzF7ak2u1dk': '/store/email?items%5B0%5D%5Bid%5D=CDBBCFE9BF5DB6E20BB77277183BBC3D&items%5B0%5D%5Bq%5D=2&cli=doc_cloud&ctx=fp',
  'nIy-IPGnALw3KNncaqMjOJsMUrqElWi8sdGnBFBAgTw': '/store/commitment?items%5B0%5D%5Bid%5D=6AAD6F9E5234C80BEFDD1FB9A497B29A&cli=doc_cloud&ctx=fp',
  WRe4gUHuyqJgCCr3ZywwU9CDP0ezBaCKoMk4xryVQhs: '/store/commitment?items%5B0%5D%5Bid%5D=345B49512865E389568289AD8AD901A3&cli=doc_cloud&ctx=fp',
  'a2BclUUkea_JeR4CLVkbrsqNFOf3ClN-B8nQ79n7LlE': '/store/commitment?items%5B0%5D%5Bid%5D=951DCCB08194F40B9C79951675547DF5&cli=doc_cloud&ctx=fp',
  '-lYm-YaTSZoUgv1gzqCgybgFotLqRsLwf8CgYdvdnsQ': '/store/commitment?items%5B0%5D%5Bid%5D=5C36A7C7209BE2E09E71BB9E512DF40A&cli=doc_cloud&ctx=fp',
  WJLr3TF4T4qyJIGZTsDf9KPbTfxA7qAgStpaF2IgYao: '/store/commitment?items%5B0%5D%5Bid%5D=AB8E1250740CB06218C53E6745F81005&cli=doc_cloud&ctx=fp',
  '8Lr09qx_PHqAJUwvUNiof4FFFEKjsR1TTbvBUncV2b0': '/store/email?items%5B0%5D%5Bid%5D=4B43CE3C95D80F8C0FE83F6C13E05003&items%5B0%5D%5Bq%5D=2&cli=doc_cloud&ctx=fp',
  ZfP6XPHxvTFnOS_Hd4q9taPkKHinmf6PCozeJEmzqNI: '/store/email?items%5B0%5D%5Bid%5D=04AEF9E2711373902B3235D295DADF70&items%5B0%5D%5Bq%5D=5&cli=doc_cloud&ctx=fp&ss=recommendation&rrItems%5B0%5D%5Bid%5D=04AEF9E2711373902B3235D295DADF70&rrItems%5B0%5D%5Bq%5D=5',
  'OQ1oCm1tZG35Gj7LCrkGeOOdUMfVlC7xx-7ml-CTWIE': '/store/commitment?items%5B0%5D%5Bid%5D=7FD7DFC9269A4AFB9BF24B8C53547DA7&cli=doc_cloud&ctx=fp',
};

document.addEventListener('mas:resolved', (e) => {
  const comCheck = setInterval(() => {
    if (e.target.isCheckoutLink) {
      clearInterval(comCheck);
      e.target.classList.add('threeInOneReady');
    }
  }, 100);
});

export default async function threeInOne() {
  const offers = document.querySelectorAll('[data-wcs-osi]');

  offers.forEach((element) => {
    const offerId = element.getAttribute('data-wcs-osi');
    const modalType = element.getAttribute('data-modal');
    if (offerId && modalType === 'crm') {
      element.removeAttribute('data-modal');
      element.removeAttribute('data-modal-id');
      if (offerMap[offerId]) {
        const clone = element.cloneNode(true);
        const comReady = setInterval(() => {
          if (clone.classList.contains('threeInOneReady')) {
            clearInterval(comReady);
            const href = new URL(clone.href);
            const lang = href.searchParams.get('lang') ?? 'en';
            const co = href.searchParams.get('co') ?? 'US';
            const newHref = `${commerceOrigin}${offerMap[offerId]}&lang=${lang}&co=${co}`;
            clone.href = newHref;
          }
        }, 100);
        element.parentElement.replaceChild(clone, element);
      }
    }
  });
}
