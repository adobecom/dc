import reviewAlloy from './alloy/review.js';
import reviewFeedbackAlloy from './alloy/reviewFeedback.js';
import browserExtAlloy from './alloy/browserExt.js'

const reviewBlock = document.querySelectorAll('.review')
const browserExt = document.querySelectorAll("meta[name='-bext']");

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
      }
    }, 1000);
  }

  // Browser Ext. Alloy
  if (browserExt) {
    addEventListener('hashchange', (event) => {
    if (window.location.hash === '#bext') {
      //Modal Ready...
      const findModal = setInterval(() => {
        if (document.querySelectorAll('#bext').length > 0) {
          clearInterval(findModal);
          console.log('BX event');
          const browserExtModal = document.querySelector('#bext')
          console.log('_______________browserExtModal');
          console.log(browserExtModal);
          const browserExtClose = browserExtModal.querySelector('.dialog-close');
          // const browserExtBtn = browserExtModal.querySelector('a');
          browserExtAlloy('modalExist', 'Chrome');


          browserExtClose.addEventListener('click', () => {
            browserExtAlloy('modalClosed', 'Chrome');
          })
        }

      }, 1000);
    }
    });



  }
}
