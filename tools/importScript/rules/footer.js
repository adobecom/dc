
const createFooterBlock = (main, document) => {
  const footer = main.querySelector('footer');
  if(!footer){
    return;
  }

  const fedsNavListItems = footer.querySelector('.feds-navList').children;
  if(fedsNavListItems.length !== 3){
    return;
  }
  const columnsCells = [['Columns (contained, middle)']];
  const accordionCells = [['Accordion']];
  const columns = [];

  const footerColumns = fedsNavListItems[0].querySelector('.feds-navList');
  Array.from(footerColumns.children).forEach((column) => {
    const navListWrapperItems = column.querySelector('ul').children;
    const columnDiv = document.createElement('div');
    Array.from(navListWrapperItems).forEach((item) => {
      const popupTrigger = item.querySelector('.feds-popup-trigger');

      const popupHeader = popupTrigger.querySelector(':scope > a');
      const header = document.createElement('h3');
      const aheader = document.createElement('h3');
      header.textContent = popupHeader.textContent;
      aheader.textContent = popupHeader.textContent;
      accordionCells.push([aheader]);
      columnDiv.appendChild(header);

      const popup = popupTrigger.querySelector('.feds-popup');
      const popupList = popup.querySelectorAll('li');
      const columnList = document.createElement('ul');
      const accordionList = document.createElement('ul');
      popupList.forEach((listItem) => {
        const itemLink = listItem.querySelector('a');
        const columnItem = document.createElement('li');
        const columnLink = document.createElement('a');
        const accordionItem = document.createElement('li');
        const accordionLink = document.createElement('a');
        columnLink.href = itemLink.href;
        columnLink.textContent = itemLink.textContent;
        columnItem.appendChild(columnLink);
        columnList.appendChild(columnItem);

        accordionLink.href = itemLink.href;
        accordionLink.textContent = itemLink.textContent;
        accordionItem.appendChild(accordionLink);
        accordionList.appendChild(accordionItem);
      });
      columnDiv.appendChild(columnList);
      accordionCells.push([accordionList]);
    });
    columns.push(columnDiv);
  });
  columnsCells.push(columns);

  const footerColumnsBlockTable = WebImporter.DOMUtils.createTable(
    columnsCells,
    document,
  );

  const footerAccordionBlockTable = WebImporter.DOMUtils.createTable(
    accordionCells,
    document,
  );

  main.append(document.createElement('hr'));
  main.append(footerColumnsBlockTable);
  main.append(document.createElement('hr'));
  main.append(footerAccordionBlockTable);
}

export default createFooterBlock;
