const BASEURL = 'https://www.adobe.com';

const createConverterWidgetBlock = (main, document) => {
  const converter = main.querySelector('.converter_app');
  if(!converter){
    return;
  }

  const cells = [['Dc Converter Widget']];

  const converterType = converter.getAttribute('data-verb');
  cells.push([converterType ? converterType : 'Add converter type']);

  const goLink = converter.getAttribute('data-app-redirecturl');
  cells.push([goLink ? BASEURL + goLink : 'Add go link']);

  const converterWidgetBlockTableComplete = WebImporter.DOMUtils.createTable(
    cells,
    document
  );

  converter.replaceWith(converterWidgetBlockTableComplete);
}

export default createConverterWidgetBlock;
