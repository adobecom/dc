/* global WebImporter */
export default function tabsToBlocks(main, document) {
  [...main.querySelectorAll('con-tablist'), ...main.querySelectorAll('spectrum-tablist')].forEach((tablist) => {
    const cells = [['Tabs']];
    const container = tablist.closest('.dexter-FlexContainer-Items') || tablist;
    const row = [];
    const ol = document.createElement('ol');
    let firstElement = '';
    tablist.querySelectorAll('[role="tab"]').forEach((header, index) => {
      if (!index) {
        firstElement = header.textContent;
      }
      const li = document.createElement('li');
      li.innerHTML = header.textContent;
      ol.appendChild(li);
    });
    row.push(ol);
    cells.push(row);
    cells.push(['Active tab', firstElement]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    container.replaceWith(table);
  });
}
