import getStyles, {getBackgroundImage} from "../utils/getStyles.js";

export const checkMarquee = (element) => {
  const rootElement = element.querySelector(':scope > div > div');
  if(!rootElement){
    return false;
  }
  const flexDiv = rootElement.querySelectorAll(':scope > .flex');
  const positionDiv = rootElement.querySelectorAll(':scope > .position');
  const imageDiv = rootElement.querySelectorAll(':scope > .image');

  if((positionDiv.length === 1 || flexDiv.length === 1) && imageDiv.length === 1){
    return true;
  }

  if(positionDiv.length === 1 && getBackgroundImage(element)){
    return true;
  }

  return false;
}

const createMarqueeSection = (marquee, document) => {
  const flexDivs = marquee.querySelectorAll('.flex');
  let cells = [['Marquee']];
  if(flexDivs.length > 1){
    cells = [['Marquee (split, one-third)']];
  }

  const backgroundImage = getBackgroundImage(marquee);

  const rootElement = marquee.querySelector(':scope > div > div');
  if(rootElement.childElementCount === 1 && rootElement.firstElementChild.classList.contains('position')){
    if(backgroundImage){
      const image = document.createElement('img');
      image.src = backgroundImage;
      image.alt = '';
      cells.push([image, '']);
    }
  }

  const textElement = document.createElement('div');

  const paragraphs = marquee.querySelectorAll('p');
  let paragraphDetail = null;
  let paragraphBody = null;
  paragraphs.forEach((p) => {
    if(p.parentNode.classList.value.includes('detail') && p.textContent){
      paragraphDetail = p;
    }

    if(p.parentNode.classList.value.includes('body') && p.textContent){
      paragraphBody = p;
    }
  });

  paragraphDetail && textElement.appendChild(paragraphDetail);
  const marqueeHeading = marquee.querySelector('h1');
  if (marqueeHeading?.textContent) {
    textElement.appendChild(marqueeHeading);
  }
  paragraphBody && textElement.appendChild(paragraphBody);

  const buttons = marquee.querySelectorAll('.spectrum-Button');
  buttons.forEach((button) => {
    let marqueeButton = null;
    if(button.classList.contains('doccloud-Button--blue') || button.classList.contains('spectrum-Button--cta')){
      marqueeButton = document.createElement('b');
    }

    if(button.classList.contains('doccloud-Button--white') || button.classList.contains('spectrum-Button--primary')){
      marqueeButton = document.createElement('i');
    }

    const marqueeButtonContent = document.createElement('a');
    marqueeButtonContent.setAttribute('href', button.getAttribute('href'));
    marqueeButtonContent.textContent = button.textContent;
    marqueeButton.appendChild(marqueeButtonContent);
    textElement.appendChild(marqueeButton);
  });

  const image = marquee.querySelector('img');
  let marqueeImage = null;
  if(image){
    marqueeImage = document.createElement('img');
    marqueeImage.src = image.src;
    marqueeImage.alt = image.alt;
  }

  cells.push([textElement, marqueeImage || ' ']);
  const marqueeBlockTable = WebImporter.DOMUtils.createTable(
    cells,
    document,
  );

  const sectionMetadataCells = [
    ['Section Metadata'],
  ];
  const styleContainer = rootElement.lastElementChild.classList.contains('flex') ? rootElement.lastElementChild : marquee;
  const backgroundColor = getStyles(styleContainer, 'background-color');
  if(backgroundColor){
    sectionMetadataCells.push(['background', backgroundColor]);
  }

  const sectionMetaDataTable = WebImporter.DOMUtils.createTable(
    sectionMetadataCells,
    document,
  );
  marquee.before(document.createElement('hr'));
  marquee.after(sectionMetaDataTable);
  marquee.replaceWith(marqueeBlockTable);
}

export default createMarqueeSection;
