import getStyles, {getBackgroundImage} from "../utils/getStyles.js";

export const checkIconBlock = (element) => {
  const rootElement = element.querySelector('.position > div > div') || element.querySelector('.dexter-FlexContainer-items');
  if(!rootElement){
    return false;
  }

  if(rootElement.childElementCount === 4){
    const image = rootElement.querySelectorAll('.image');
    const text = rootElement.querySelectorAll('.text');
    const flex = rootElement.querySelectorAll('.flex');
    const title = rootElement.querySelectorAll('.title');

    if(image.length === 1 && flex.length === 1 && text.length === 2){
      return true;
    }

    if(image.length === 1 && flex.length === 1 && text.length === 1 && title.length === 1){
      return true;
    }
  }

  return false;
};

const createIconBlock = (iconBlock, document) => {
  const cells = [['Icon Block (fullwidth, large, l spacing)']];
  const blockDiv = document.createElement('div');
  let block = null;
  if(iconBlock.querySelector('.position')){
    block = iconBlock.querySelector('.aem-Grid');
  }else{
    block = iconBlock.querySelector('.dexter-FlexContainer-items');
  }

  if(!block){
    return;
  }

  Array.from(block.children).forEach((child) => {
    const image = child.querySelector('.dexter-Image > img');
    if(image){
      blockDiv.appendChild(image);

      return;
    }

    const title = child.querySelector('.cmp-title');
    if(title){
      blockDiv.appendChild(title);

      return;
    }

    const text = child.querySelector('.cmp-text');
    if(text){
      blockDiv.appendChild(text);

      return;
    }

    const buttons = child.querySelectorAll('.spectrum-Button');
    if(buttons.length){
      buttons.forEach((button) => {
        let iconBlockButton = null;
        if(button.classList.contains('doccloud-Button--blue') || button.classList.contains('spectrum-Button--cta')){
          iconBlockButton = document.createElement('b');
        }

        if(button.classList.contains('doccloud-Button--white') || button.classList.contains('spectrum-Button--primary')){
          iconBlockButton = document.createElement('i');
        }

        const iconBlockButtonContent = document.createElement('a');
        iconBlockButtonContent.setAttribute('href', button.getAttribute('href'));
        iconBlockButtonContent.textContent = button.textContent;
        iconBlockButton.appendChild(iconBlockButtonContent);
        blockDiv.appendChild(iconBlockButton);
      });
    }
  });

  cells.push([blockDiv]);

  const iconBlockTable = WebImporter.DOMUtils.createTable(
    cells,
    document,
  );

  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'm spacing'],
  ];

  const backgroundImage = getBackgroundImage(iconBlock);
  const backgroundColor = getStyles(iconBlock, 'background-color');
  if(backgroundImage){
    sectionMetadataCells.push(['background', backgroundImage]);
  }else if(backgroundColor){
    sectionMetadataCells.push(['background', backgroundColor]);
  }

  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );

  iconBlock.before(document.createElement('hr'));
  iconBlock.after(sectionMetaDataTable);
  iconBlock.replaceWith(iconBlockTable);
}

export default createIconBlock;
