/* eslint-disable ecmalist/no-object-fromentries */
import reviewAlloy from './alloy/review.js';
import reviewFeedbackAlloy from './alloy/reviewFeedback.js';
import browserExtAlloy from './alloy/browserExt.js';

export default function init(verb) {
  // Review Alloy
  const miloReviewBlock = document.querySelector('.review');
  const rnrBlock = document.querySelector('.rnr');
  /**
   * TODO the milo block related code can be removed once all frictionless
   * pages transition to rnr. For now, handle both.
   */
  if (miloReviewBlock || rnrBlock) {
    reviewAlloy();
    const reviewWait = setInterval(() => {
      // Milo block handling
      const [miloReviewForm] = document.querySelectorAll('.hlx-Review');
      if (miloReviewForm) {
        clearInterval(reviewWait);
        miloReviewForm.addEventListener('submit', (e) => {
          const data = Object.fromEntries(new FormData(e.target).entries());
          // verb, rating, comment
          reviewFeedbackAlloy(verb, data.rating, data['rating-comments']);
        });
        const reviewTooltip = miloReviewForm.querySelectorAll('.tooltip');
        if (reviewTooltip.length > 0) {
          reviewTooltip[3].addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '4');
          });
          reviewTooltip[4].addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '5');
          });
        }
      }
      // Rnr block handling
      const [rnrForm] = document.querySelectorAll('.rnr-form');
      if (rnrForm) {
        clearInterval(reviewWait);
        rnrForm.addEventListener('submit', (e) => {
          const data = Object.fromEntries(new FormData(e.target).entries());
          // verb, rating, comment
          reviewFeedbackAlloy(verb, data.rating, data.comments);
        });
        const stars = rnrForm.querySelectorAll('.rnr-rating-fieldset input');
        if (stars.length > 0) {
          stars[3]?.addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '4');
          });
          stars[4]?.addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '5');
          });
        }
      }
    }, 1000);
  }

  // Browser Ext. Alloy
  window.addEventListener('modal:open', () => {
    let extName;
    const { name: browserName } = window.browser;
    if (browserName === 'Chrome') {
      extName = '#chromeext';
    }

    if (browserName === 'Microsoft Edge') {
      extName = '#edgeext';
    }
    const extensionWait = setInterval(() => {
      const browserExtModal = document.querySelector(extName);
      const browserExtClose = browserExtModal?.querySelector('.dialog-close');
      const browserExtGetLink = browserExtModal?.querySelector('.browser-extension  a');

      if (!browserExtModal || !browserExtClose || !browserExtGetLink) {
        return;
      }
      clearInterval(extensionWait);
      browserExtAlloy('modalGetExtension', browserName, 'impression');

      browserExtClose.addEventListener('click', () => {
        browserExtAlloy('modalClosed', browserName);
        window.localStorage.fricBrowExt = true;
      });

      browserExtGetLink.addEventListener('click', () => {
        browserExtAlloy('modalGetExtension', browserName);
      });
    }, 1000);
  });
}
