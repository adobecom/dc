import reviewAlloy from './analytics/review.js';

const reviewBlock = document.querySelectorAll('.review');

export default function init() {
  // Review Alloy
  reviewBlock[0].addEventListener('click', () => {
    reviewAlloy();
  });
}
