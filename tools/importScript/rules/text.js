import getStyles from "../utils/getStyles.js";

export const checkText = (element) => {
  const rootElement = element.querySelector(':scope > div > div');
  if(!rootElement){
    return false;
  }

  const positionDiv = rootElement.querySelectorAll(':scope > .position');
  if(positionDiv.length === 1 && rootElement.childElementCount === 1){
    return true;
  }

  if(positionDiv.length === 1 && positionDiv[0]?.nextElementSibling?.classList.contains('dexter-Spacer')){
    return true;
  }

  return false;
}

const createTextSection = (textContainer, document, inset = false) => {
  const lineStyle = 'Text (long form, m spacing bottom, large)';
  let positionDiv = inset ? textContainer : textContainer.querySelector(':scope > div > div > .position');
  const childDiv = positionDiv.querySelector(':scope > div > div');

  if(childDiv?.childElementCount === 2 && childDiv.firstElementChild.classList.contains('title') && childDiv.lastElementChild.classList.contains('position')){
    const title = childDiv.firstElementChild.querySelector('h1, h2, h3, h4, h5, h6');
    const cells = [['Text (long form, m spacing top, xl spacing bottom, large)']];
    cells.push([title]);
    const textBlockTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );
    positionDiv = childDiv.lastElementChild;
    inset = getStyles(positionDiv, 'border-left');
    childDiv.firstElementChild.replaceWith(textBlockTable);
  }

  const textDivs = positionDiv.querySelectorAll(':scope > div > div > div');
  textDivs.forEach((text, index) => {
    const textStyle = `Text (long form, ${index === 0 || index === 1 ? 'm' : 'no'} spacing top, m spacing bottom, large)`;
    let cells = inset ? [[`Text (inset${index === textDivs.length - 1 ? ', m spacing bottom' : ''})`]] : [[textStyle]];
    const textDiv = document.createElement('div');

    const textElement = text.classList.contains('text');
    if(textElement){
      const previous = text.previousElementSibling;
      const next = text.nextElementSibling;
      if(previous?.classList.contains('title')){
        const heading = previous.querySelector('h1, h2, h3, h4, h5, h6');
        if(heading){
          textDiv.appendChild(heading);
        }
        const headingHr = previous.previousElementSibling;
        if(headingHr?.classList.contains('horizontalRule')){
          const hrCells = [[lineStyle], [document.createElement('hr')]];
          const hrBlockTable = WebImporter.DOMUtils.createTable(
            hrCells,
            document,
          );

          headingHr.replaceWith(hrBlockTable);
        }
      }

      const textContent = text.querySelector('.cmp-text');
      if(textContent){
        textDiv.appendChild(textContent);
      }

      let hr = null;

      if(previous?.classList.contains('horizontalRule')){
        hr = previous;
      }

      if(next?.classList.contains('horizontalRule')){
        hr = next;
      }

      if(hr) {
        const hrCells = [[lineStyle], [document.createElement('hr')]];
        const hrBlockTable = WebImporter.DOMUtils.createTable(
          hrCells,
          document,
        );

        hr.replaceWith(hrBlockTable);
      }

      cells.push([textDiv]);
      const textBlockTable = WebImporter.DOMUtils.createTable(
        cells,
        document,
      );

      text.replaceWith(textBlockTable);
    }

    const positionElement = text.classList.contains('position');
    if(positionElement && getStyles(text, 'border-left')){
      createTextSection(text, document, true);
    }
  });

  if(!inset){
    const sectionMetadataCells = [
      ['Section Metadata'],
      ['style', 'center, m spacing'],
    ];
    const backgroundColor = getStyles(textContainer, 'background-color');
    if(backgroundColor){
      sectionMetadataCells.push(['background', backgroundColor]);
    }
    
    const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
      sectionMetadataCells,
      document,
    );

    textContainer.before(document.createElement('hr'));
    textContainer.after(sectionMetaDataTable);
  }
}

export default createTextSection;
