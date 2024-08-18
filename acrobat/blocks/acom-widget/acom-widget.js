import {
  initializePdfAssetManager,
  validateSSRF,
  createPdf,
  checkJobStatus,
  getDownloadUri,
  prepareFormData,
  getAcrobatWebLink,
} from './pdfAssetManager.js';

import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// eslint-disable-next-line compat/compat
const PAGE_URL = new URL(window.location.href);
const redirect = PAGE_URL.searchParams.get('redirect');

const uploadToAdobe = async (file) => {
  const filename = file.name;
  const extension = filename.split('.').pop().toLowerCase();
  let xhr;

  const contentTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
  };

  const contentType = contentTypes[extension];
  if (!contentType) {
    // eslint-disable-next-line no-alert
    alert('This file is invalid');
    return;
  }
  try {
    const { accessToken, discoveryResources } = await initializePdfAssetManager();
    const uploadEndpoint = validateSSRF(discoveryResources.assets.upload.uri);
    const formData = prepareFormData(file, filename);

    xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        const uploadResult = JSON.parse(xhr.responseText);
        const assetUri = uploadResult.uri;

        if (contentType !== 'application/pdf') {
          const createPdfEndpoint = validateSSRF(discoveryResources.assets.createpdf.uri);
          const createPdfPayload = {
            asset_uri: assetUri,
            name: filename,
            persistence: 'transient',
          };
          try {
            const createPdfResult = await createPdf(
              createPdfEndpoint,
              createPdfPayload,
              accessToken,
            );
            const jobUri = createPdfResult.job_uri;
            await checkJobStatus(jobUri, accessToken, discoveryResources);
          } catch (error) {
            // eslint-disable-next-line no-alert
            alert('Failed to create PDF');
            throw new Error('Error creating PDF:', error);
          }
        }

        try {
          const downloadUri = await getDownloadUri(assetUri, accessToken, discoveryResources);
          const blobViewerUrl = validateSSRF(getAcrobatWebLink(filename, assetUri, downloadUri));
          if (redirect !== 'off') {
            window.location.href = blobViewerUrl;
          } else {
            // eslint-disable-next-line no-console
            console.log('Blob Viewer URL:', `<a href="${blobViewerUrl}" target="_blank">View PDF</a>`);
          }
        } catch (error) {
          throw new Error('Error getting download URI:', error);
        }
      }
    };

    xhr.send(formData);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert('An error occurred during the upload process. Please try again.');
    throw new Error('Error uploading file:', error);
  }
};

export default async function init(element) {
  const children = element.querySelectorAll(':scope > div');
  children.forEach((child) => {
    child.remove();
  });

  const widget = createTag('div', { class: 'acom-wrapper' });
  const widgetContainer = createTag('div', { class: 'acom-container' });
  const widgetRow = createTag('div', { class: 'acom-row' });
  const widgetLeft = createTag('div', { class: 'acom-col' });
  const widgetRight = createTag('div', { class: 'acom-col' });
  const widgetIcon = createTag('div', { class: 'acom-icon' });
  const widgetHeading = createTag('h1', { class: 'acom-heading' }, 'Fill and sign a PDF');
  const widgetCopy = createTag('p', { class: 'acom-copy' }, 'Drag and drop a PDF to use the Acrobat PDF form filler.');
  const widgetButton = createTag('lavel', { for: 'file-upload', class: 'acom-cta' }, 'Select a file');
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });

  const legal = createTag('p', { class: 'acom-legal' }, 'Your file will be securely handled by Adobe servers and deleted unless you sign in to save it. By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const footer = createTag('div', { class: 'acom-footer' });
  footer.append(iconSecurity, legal);

  widget.append(widgetContainer);
  widgetContainer.append(widgetRow);
  widgetRow.append(widgetLeft, widgetRight);
  widgetLeft.append(widgetIcon, widgetHeading, widgetCopy, widgetButton);

  element.append(widget, footer);

  button.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadToAdobe(file);
    }
  });
}
