/* global WebImporter */
export default function createAccordionBlocks(main, document) {
  const accordions = main.querySelectorAll('.accordion');

  // fast return
  if (!accordions.length) {
    return;
  }

  accordions.forEach((accordion) => {
    const parentClasses = accordion.parentElement.classList;
    const items = accordion.querySelectorAll('.spectrum-Accordion-item');
    const cells = [['Accordion (seo)']];

    if (items) {
      items.forEach((item) => {
        const text = document.createElement('p');
        const textContent = item.querySelector('.spectrum-Accordion-itemHeader')?.textContent || 'Title?';
        text.innerHTML = textContent;
        const content = item.querySelector('.spectrum-Accordion-itemContent') || 'Description?';
        cells.push([text]);
        cells.push([content]);
      });
    }
    const accBlockTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );
    if (parentClasses.contains('dexter-FlexContainer-Items')) {
      parentClasses.remove('dexter-FlexContainer-Items');
    }
    accordion.before(document.createElement('hr'));
    accordion.replaceWith(accBlockTable);
  });
}
