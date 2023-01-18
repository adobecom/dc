import reviewAlloy from './analytics/review.js';
import reviewFeedbackAlloy from './analytics/reviewFeedback.js';

const reviewBlock = document.querySelectorAll('.review');

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
}
