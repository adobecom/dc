import reviewAlloy from './alloy/review.js';
import reviewFeedbackAlloy from './alloy/reviewFeedback.js';
import browserExtAlloy from './alloy/browserExt.js'

const reviewBlock = document.querySelectorAll('.review')
const browserExt = document.querySelectorAll("meta[name='-bext']");
const parser = bowser.getParser(window.navigator.userAgent);
const browserName = parser.getBrowserName();

console.log('browserName ext');
console.log(browserName);

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
  if (browserExt && browserName === 'Chrome'
     || browserExt && browserName === 'Edge') {
    addEventListener('hashchange', (event) => {
    if (window.location.hash === '#bext') {
      //Modal Ready...
      const findModal = setInterval(() => {
        if (document.querySelectorAll('#bext').length > 0) {
          clearInterval(findModal);
          const browserExtModal = document.querySelector('#bext')
          const browserExtClose = browserExtModal.querySelector('.dialog-close');
          browserExtAlloy('modalExist', browserName);

          browserExtClose.addEventListener('click', () => {
            browserExtAlloy('modalClosed', browserName);
            localStorage.fricBrowExt = true;
          })
        }

      }, 1000);
    }
    });



  }
}
