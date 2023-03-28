const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  meta['Gnav Source'] = '/dc-shared/gnav';
  meta['Footer Source'] = '/dc-shared/footer';

  meta.Chromeext = 'https://main--dc--adobecom.hlx.live/dc-shared/fragments/shared-fragments/browser-extension/browser-extension-chrome';
  meta.Edgeext = 'https://main--dc--adobecom.hlx.live/dc-shared/fragments/shared-fragments/browser-extension/browser-extension-edge'
  meta.Header = 'gnav';
  meta['Product Name'] = 'Product Name ?';
  meta['Prodcut Description'] = 'Product Description ?';

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(document.createElement('hr'));
  main.append(block);

  return meta;
};

export default createMetadata;
