
const BASEURL = 'https://www.adobe.com';

const createReviewBlocks = (main, document) => {
  const reviews = main.querySelectorAll('.review');
  if(!reviews.length){
    return;
  }


  reviews.forEach((review) => {
    const cells = [['Review']];
    const acomReview = review.querySelector('acom-review');

    const postUrl = acomReview?.getAttribute('data-post-url');
    const reviewPath = acomReview?.getAttribute('data-review-path');
    const reviewLink = document.createElement('a');
    reviewLink.href = BASEURL + postUrl + '/' + reviewPath;
    reviewLink.textContent = BASEURL + postUrl + '/' + reviewPath;
    cells.push(['Review url', (postUrl && reviewPath) ? reviewLink : 'Review url ?']);

    const title = acomReview?.getAttribute('data-title');
    cells.push(['Title', title ? title : 'Title ?']);

    const hideTitle = acomReview?.getAttribute('data-title-hide');
    cells.push(['Hide title', hideTitle !== null ]);

    const verbSingular = acomReview?.getAttribute('data-rating-verb-singular');
    const verbPlural = acomReview?.getAttribute('data-rating-verb-plural');
    cells.push(['Rating verb', (verbSingular && verbPlural) ? `${verbSingular}, ${verbPlural}` : 'Rating verb ?']);

    const nounSingular = acomReview?.getAttribute('data-rating-noun-singular');
    const nounPlural = acomReview?.getAttribute('data-rating-noun-plural');
    cells.push(['Rating noun', (nounSingular && nounPlural) ? `${nounSingular}, ${nounPlural}` : 'Rating noun ?']);

    const commentPlaceholder = acomReview?.getAttribute('data-comment-placeholder');
    cells.push(['Comment placeholder', commentPlaceholder ? commentPlaceholder : 'Comment placeholder ?']);

    const commentFieldLabel = acomReview?.getAttribute('data-comment-label');
    cells.push(['Comment field label', commentFieldLabel ? commentFieldLabel : 'Comment field label ?']);

    const submitText = acomReview?.getAttribute('data-submit-text');
    cells.push(['Submit text', submitText ? submitText : 'Submit text ?']);

    const thankYouText = acomReview?.getAttribute('data-thank-you-text');
    cells.push(['Thank you text', thankYouText ? thankYouText : 'Thank you text ?']);

    const tooltips = acomReview?.getAttribute('data-tooltips');
    cells.push(['Tooltips', tooltips ? tooltips : 'Tooltips ?']);

    const tooltipDelay = acomReview?.getAttribute('data-tooltip-delay');
    cells.push(['Tooltip delay', tooltipDelay ? tooltipDelay : 'Tooltip delay ?']);
    cells.push(['Initial value', 0]);

    const reviewBlockTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );

    const sectionMetadataCells = [['Section Metadata']];
    sectionMetadataCells.push(['style', 'Center, Xxl-spacing, divider']);
    sectionMetadataCells.push(['background', '#fbfbfb']);

    const sectionMetadataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    );

    review.before(document.createElement('hr'));
    review.after(sectionMetadataTable);
    review.replaceWith(reviewBlockTable);
  });

}

export default createReviewBlocks;
