export const checkJumpSection = (element) => {
  const rootElement = element.querySelector(':scope > div > div');
  if(!rootElement){
    return false;
  }

  const positionDivs = rootElement.querySelectorAll(':scope > .position');
  const spacerDiv = rootElement.querySelectorAll(':scope > .dexter-Spacer');
  if(positionDivs.length === 2 && spacerDiv.length === 1){
    return true;
  }

  return false;
}

const createJumpSection = (jumpSectionAndCard, document) => {
  const cells = [['Columns (contained, middle)']];

  const jumpSectionContainer = jumpSectionAndCard.querySelectorAll('.position')[0];
  const cardContainer = jumpSectionAndCard.querySelectorAll('.position')[1];
  const jumpSectionDiv = document.createElement('div');
  const jumpSectionText = jumpSectionContainer.querySelectorAll('.text');

  const jumpSectionHeader = jumpSectionText[0];
  const jumpSectionBody = jumpSectionText[1];

  const jumpHeader = document.createElement('p');
  jumpHeader.textContent = jumpSectionHeader.textContent.toUpperCase();
  jumpSectionDiv.appendChild(jumpHeader);

  const jumpSectionLinks = jumpSectionBody.querySelectorAll('a');
  jumpSectionLinks.forEach((link) => {
    const p = document.createElement('p');
    const newLink = document.createElement('a');
    const realLink = link.href.split('#').slice(-1);
    newLink.setAttribute('href', `#${realLink}`);
    newLink.textContent = link.textContent;
    p.appendChild(newLink);
    jumpSectionDiv.appendChild(p);
  });

  const cardContainerText = cardContainer.querySelectorAll('.text');
  let cardContainerHeader = cardContainerText[0];
  let cardContainerBody = cardContainerText[1];
  if(cardContainerText.length === 1){
    cardContainerHeader = cardContainer.querySelector('.title');
    cardContainerBody = cardContainerText[0];
  }
  const cardDiv = document.createElement('div');
  const cardHeader = document.createElement('h3');
  const cardBody = document.createElement('p');
  cardHeader.textContent = cardContainerHeader.textContent;
  cardBody.textContent = cardContainerBody.textContent;
  cardDiv.appendChild(cardHeader);
  cardDiv.appendChild(cardBody);

  cells.push([jumpSectionDiv, cardDiv]);


  const jumpSectionTable = WebImporter.DOMUtils.createTable(
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

  jumpSectionAndCard.before(document.createElement('hr'));
  jumpSectionAndCard.after(sectionMetaDataTable);
  jumpSectionAndCard.replaceWith(jumpSectionTable);
}

export default createJumpSection;
