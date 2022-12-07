import verbMap from './verbMap.js';

const reviewBlock = document.querySelectorAll('.review');
console.log(reviewBlock);

export default function init(element) {
  const container = element;
  const frags = Array.from(container.children);

  let showAll = false;
  let secondConversion;
  let upsell;

  const params = new Proxy(new URLSearchParams(window.location.search),{
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const getPageType = (() => {
    const pageVerb = document.querySelector('#adobe_dc_sdk_launcher').dataset.verb;
    const pageTypeMapped = verbMap.typeMap[pageVerb] || 'organize_pdf';
    return pageTypeMapped;
  });

  const getUpsellType = (() => {
    const pageVerb = document.querySelector('#adobe_dc_sdk_launcher').dataset.verb;
    const upsellTypeMapped = verbMap.upsellMap[pageVerb] || 'l1Verbs';
    return upsellTypeMapped;
  });

  if (document.querySelectorAll('#adobe_dc_sdk_launcher').length > 0 && window.doccloudPersonalization) {
    const pageType = getPageType();
    const upsellType = getUpsellType();
    // Conditons
    secondConversion = doccloudPersonalization[pageType].can_process && doccloudPersonalization[pageType].has_processed;
    upsell = doccloudPersonalization.isUpsellDisplayed[upsellType] ||
                 !doccloudPersonalization[pageType].can_process && doccloudPersonalization[pageType].has_processed;
  }

  // Tags
  const DEFAULT = 'default';
  const SECOND_CONVERSION = '2nd conversion';
  const UPSELL = 'upsell';

  // DC Converter Widget did not load or preview
  if (!window.doccloudPersonalization) {
    frags.forEach((ele) => {
      const tag = ele.firstElementChild.textContent.trim();

      // Default
      if (tag === DEFAULT) {
        ele.dataset.tag = ele.firstElementChild.textContent;
      }
    });
  }

  if (typeof (params.showAll) === 'string') {
    showAll = true;
    document.body.classList.add('personalizationShowAll');
  }

  frags.forEach((ele) => {
    const tag = ele.firstElementChild.textContent.trim();

    // Default
    if (tag === DEFAULT && !secondConversion && !upsell || showAll) {
      ele.dataset.tag = ele.firstElementChild.textContent;
    }

    // 2nd Conversion
    if (tag === SECOND_CONVERSION && secondConversion || showAll) {
      ele.dataset.tag = ele.firstElementChild.textContent;
    }

    // Upsell
    if (tag === UPSELL && upsell || showAll) {
      ele.dataset.tag = ele.firstElementChild.textContent;
      reviewBlock.forEach((reviewEle) => {
        reviewEle.classList.add('hide');
      });
    }
  });
}
