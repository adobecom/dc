import getStyles from "../utils/getStyles.js";

export const checkImage = (element) => {
  const rootElement = element.querySelector(':scope > div > div');
  if(!rootElement){
    return false;
  }

  let isImage = true;
  Array.from(rootElement.children).forEach((image) => {
    if(!image.classList.contains('image') && !image.classList.contains('dexter-Spacer')){
      isImage = false; 
    }
  });

  return isImage;
}

const createImageSection = (imageContainer, document) => {
  const images = imageContainer.querySelectorAll(':scope > div > div > .image');
  const cells = [['Columns (contained, middle)']];
  const row = [];
  let newImage = null;
  let imageSectionTable = null;

  images.forEach((image) => {
    const img = image.querySelector('img');
    newImage = document.createElement('img');
    newImage.src = img.src;
    newImage.alt = img.alt;
    row.push(newImage);
  });

  if(row.length > 1) {
    cells.push(row);
    imageSectionTable = WebImporter.DOMUtils.createTable(
      cells,
      document,
    );
  }

  const sectionMetadataCells = [
    ['Section Metadata'],
    ['style', 'center, l spacing'],
  ];

  const backgroundColor = getStyles(imageContainer, 'background-color');
  if(backgroundColor) {
    sectionMetadataCells.push(['background', backgroundColor]);
  }

  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );

  if(imageSectionTable || newImage){
    imageContainer.before(document.createElement('hr'));
    imageContainer.after(sectionMetaDataTable);
    imageContainer.replaceWith(imageSectionTable || newImage);
  }
}

export default createImageSection;


