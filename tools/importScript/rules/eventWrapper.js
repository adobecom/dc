/* global WebImporter */


const getFragmentPath = (page, type) => {
  if(type === 'create-an-account'){
    return 'https://main--dc--adobecom.hlx.page/dc-shared/fragments/shared-fragments/frictionless/create-an-account/summary-frag-create-an-account'
  }

  return `https://main--dc--adobecom.hlx.page/dc-shared/fragments/personalization-summary-frags/${page}/summary-frag-${type}`
}

const createEventWrapperBlocks = (main, document, url) => {
  const eventWrappers = main.querySelectorAll('.eventWrapper');
  const fragmentTypes = ['how-to', 'seo', 'faq', 'create-an-account'];

  if(!eventWrappers.length){
    return;
  }

  const eventWrapper = Array.from(eventWrappers).filter((wrapper) => wrapper.querySelector(':scope > div').getAttribute('data-event-name') === 'onload' ? wrapper : wrapper.remove());

  if(!eventWrapper[0]){
    return;
  }

  const fragments = eventWrapper[0].querySelectorAll('.dxf');
  fragments.forEach((fragment) => {
    const dataPath = fragment.getAttribute('data-lazy-load-path');
    if(dataPath && dataPath.includes('caas')){
      fragmentTypes.splice(3, 0, 'caas');
    }
  });

  const cells = [['Eventwrapper (onload)']];
  const urlObject = new URL(url);
  const pageName = urlObject.pathname
    .split('/')
    .pop()
    .split('.')[0];
  fragmentTypes.forEach((type) => {
    const fragmentPath = getFragmentPath(pageName, type);
    cells.push([fragmentPath, '']);
  });

  const eventWrapperBlockTable = WebImporter.DOMUtils.createTable(
    cells,
    document,
  );

  const cellsComplete = [['Eventwrapper (complete)'], ['']];
  const eventWrapperBlockTableComplete = WebImporter.DOMUtils.createTable(
    cellsComplete,
    document
  );

  const sectionLine1 = document.createElement('hr');
  const sectionLine2 = document.createElement('hr');
  eventWrapper[0].before(sectionLine1);
  eventWrapper[0].after(sectionLine2);
  eventWrapper[0].replaceWith(eventWrapperBlockTable);
  sectionLine2.after(eventWrapperBlockTableComplete);
}

export default createEventWrapperBlocks;
