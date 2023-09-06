import reviewAlloy from './alloy/review.js';
import reviewFeedbackAlloy from './alloy/reviewFeedback.js';
import browserExtAlloy from './alloy/browserExt.js'

const reviewBlock = document.querySelectorAll('.review')

export default function init(verb) {

  // Review Alloy
  if (reviewBlock) {
    reviewAlloy();
    const reviewWait = setInterval(() => {
      const reviewForm = document.querySelectorAll('.hlx-Review');
      if (reviewForm.length > 0) {
        clearInterval(reviewWait);
        reviewForm[0].addEventListener('submit', (e) => {
          const data = Object.fromEntries(new FormData(e.target).entries());
          // verb, rating, comment
          reviewFeedbackAlloy(verb, data.rating, data['rating-comments']);
        });
        const reviewTooltip = reviewBlock[0].querySelectorAll('.tooltip');
        if (reviewTooltip.length > 0) {
          reviewTooltip[3].addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '4');
          })
          reviewTooltip[4].addEventListener('click', () => {
            reviewFeedbackAlloy(verb, '5');
          })
        }
      }
    }, 1000);
  }

  // Browser Ext. Alloy
  window.addEventListener('modal:open', ()=> {
    let extName;
    const { name: browserName } = window.browser;
    if (browserName === 'Chrome') {
      extName = '#chromeext';
    }

    if (browserName === 'Microsoft Edge') {
      extName = '#edgeext';
    }
    const extensionWait = setInterval( ()=> {
      const browserExtModal = document.querySelector(extName);
      const browserExtClose = browserExtModal?.querySelector('.dialog-close');
      const browserExtGetLink = browserExtModal?.querySelector('.browser-extension  a');

      if(!browserExtModal || !browserExtClose || !browserExtGetLink){
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
