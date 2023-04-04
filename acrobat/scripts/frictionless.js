import reviewAlloy from './alloy/review.js';
import reviewFeedbackAlloy from './alloy/reviewFeedback.js';
import browserExtAlloy from './alloy/browserExt.js'

const reviewBlock = document.querySelectorAll('.review')
const chromeBrowserExt = document.querySelectorAll("meta[name='-chromeext']");
const edgeBrowserExt = document.querySelectorAll("meta[name='-edgeext']");
let parser;
let browserName;

export default function init(verb) {

  // Review Alloy
  if (reviewBlock) {
    const reviewWait = setInterval(() => {
      const reviewForm = document.querySelectorAll('.hlx-Review');
      if (reviewForm.length > 0) {
        clearInterval(reviewWait);
        reviewForm[0].addEventListener('submit', (e) => {
          const data = Object.fromEntries(new FormData(e.target).entries());
          // verb, rating, comment
          reviewAlloy();
          reviewFeedbackAlloy(verb, data.rating, data['rating-comments']);
        });
        parser = bowser.getParser(window.navigator.userAgent);
        browserName = parser.getBrowserName();
      }
    }, 1000);
  }

  // Browser Ext. Alloy
  window.addEventListener('modal:open', ()=> {
    let extName;
    if (browserName === 'Chrome') {
      extName = '#chromeext';
    }

    if (browserName === 'Microsoft Edge') {
      extName = '#edgeext';
    }
    setTimeout( ()=> {
      const browserExtModal = document.querySelector(extName);
      const browserExtClose = browserExtModal.querySelector('.dialog-close');
      browserExtAlloy('modalExist', browserName);

      browserExtClose.addEventListener('click', () => {
        browserExtAlloy('modalClosed', browserName);
        window.localStorage.fricBrowExt = true;
      })
    }, 1000);
  });
}
