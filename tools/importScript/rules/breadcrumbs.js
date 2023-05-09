/* global WebImporter */

const BASEURL = 'https://www.adobe.com';

const createBreadcrumbsBlocks = (main, document)=> {
  const breadcrumbs = document.querySelector('.feds-breadcrumbs-items');

  if(!breadcrumbs) {
    return;
  }

  const isFrictionless = document.body.classList.contains('frictionlessredesign');
  const breadcrumbsElements  = breadcrumbs.querySelectorAll('.feds-breadcrumbs-element');

  const cells = [['Breadcrumbs']];
  breadcrumbsElements.forEach((element, index) => {
    const elementLink  = element.querySelector('a');
    if(element.classList.contains('feds-hideOnDesktop')){
      element.remove();
    }

    if(elementLink && !elementLink.href.includes(BASEURL)){
      elementLink.href = BASEURL + elementLink.href;
    }

    if(index === breadcrumbsElements.length - 1 && isFrictionless){
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = element.textContent;
      link.href = 'https://www.adobe.com/acrobat/online.html';
      listItem.appendChild(link);
      element.replaceWith(listItem);
    }
  });

  if(isFrictionless){
    const currentPageLabel = document.createElement('li');
    currentPageLabel.textContent = 'Add current page';
    breadcrumbs.appendChild(currentPageLabel);
  }

  cells.push([breadcrumbs]);
  const breadcrumbsBlockTableComplete = WebImporter.DOMUtils.createTable(
    cells,
    document
  );

  main.insertBefore(breadcrumbsBlockTableComplete, main.firstChild);
}

export default createBreadcrumbsBlocks;
