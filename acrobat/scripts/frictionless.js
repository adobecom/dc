import reviewAlloy from './analytics/review.js';

const reviewBlock = document.querySelectorAll('.review');

export default function init() {
  // Review Alloy
  console.log('dsgag');
  reviewBlock[0].addEventListener('click', () => {
    reviewAlloy();
  });
}
