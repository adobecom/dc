export const checkColumns = (element) => {
  const columnsContainer = element.querySelector('.aem-Grid > .flex > .dexter-FlexContainer > .dexter-FlexContainer-Items');
  if(columnsContainer) {
    return true;
  }

  return false;
}

const createColumnsSection = (element, document) => {
  const cells = [['Columns (container, center)']];
  const textContainer = document.createElement('div');

  const columnsContainer = element.querySelector('.aem-Grid > .flex > .dexter-FlexContainer > .dexter-FlexContainer-Items');
  const flexContainer = columnsContainer.querySelector(':scope > .flex');
  const columns = flexContainer ? flexContainer.querySelector('.dexter-FlexContainer-Items') : columnsContainer;

  if(!columns.children.length){
    return;
  }

  element.before(document.createElement('hr'));

  const text = element.querySelector('.text');
  if(text){
    const textDiv = document.createElement('div');
    textDiv.innerHTML = text.innerHTML;
    textContainer.appendChild(textDiv);
    text.remove();
  }
  const title = element.querySelector('.title');
  if(title){
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = title.innerHTML
    textContainer.appendChild(titleDiv);
    title.remove();
  }

  if(text || title){
    cells.push([textContainer]);
  }

  let row = [];
  Array.from(columns.children).forEach((column, index) => {
    row.push(column.innerHTML);
    if(row.length === 3){
      cells.push(row);
      row = [];
    }

    if(index === columns.children.length - 1){
      row.push('');
      cells.push(row);
    }
  });


  const columnBlockTable = WebImporter.DOMUtils.createTable(
    cells,
    document,
  );

  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'm spacing'],
  ];

  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );

  element.after(sectionMetaDataTable);
  element.replaceWith(columnBlockTable);
}

export default createColumnsSection;
