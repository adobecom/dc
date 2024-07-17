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

// eslint-disable-next-line compat/compat
const PAGE_URL = new URL(window.location.href);
const redirect = PAGE_URL.searchParams.get('redirect');

const ErrorType = {
  UNSUPPORTED_FILE_TYPE: 1,
  FILE_SIZE_OVER_LIMIT: 2
}

function initToastDialog(createTag) {
  const toastContainer = createTag('div', { class: 'toast-container' });
  const errorText = createTag('span', { class: 'toast-text' });
  const warningIcon = createTag('div', { class: 'warning-icon' });
  const closeIconWrapper = createTag('div', { class: 'close-icon-wrapper' });
  const closeIcon = createTag('button', { class: 'close-icon' });
  closeIconWrapper.append(closeIcon);
  toastContainer.append(warningIcon, errorText, closeIconWrapper);
  document.querySelector('main').append(toastContainer);
  toastContainer.classList.add('hide');
  closeIconWrapper.addEventListener('click', (e) => closeToastDialog());
}

function showToastDialog(fileName, errorType) {
  const toastContainer = document.querySelector('.toast-container');
  if(errorType === 1)
    document.querySelector('.toast-text').textContent = `"${fileName}" is in a format not supported for AI Assistent`;
  else if(errorType === 2)
    document.querySelector('.toast-text').textContent = 'This tool supports files that are 25MB or less. Upload a smaller PDF.';

  setTimeout(() => {
    toastContainer.classList.remove('hide');
  }, 100);
  setTimeout(() => {
    toastContainer.classList.add('hide');
  }, 5000);
}

function closeToastDialog() {
  document.querySelector('.toast-container').classList.add('hide')
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function processFileUpload(e, createTag) {
  const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
  const progressSection = createProgressSection(createTag);
  if (file) {
    uploadToAdobe(file, progressSection);
  }
}

function setupDragDropListeners(dropzone, createTag) {
  dropzone.addEventListener('dragenter', (e) => {
    preventDefaults(e);
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragover', (e) => {
    preventDefaults(e);
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', (e) => {
    preventDefaults(e);
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    preventDefaults(e);
    dropzone.classList.remove('dragover');
    processFileUpload(e, createTag);
  });
}

const uploadToAdobe = async (file, progressSection) => {
  const { progressBarWrapper, progressBar } = progressSection;
  const statusBar = document.querySelector('.status-bar');
  const cancelButton = document.querySelector('.widget-cancel');
  const filename = file.name;
  const extension = filename.split('.').pop().toLowerCase();
  const fileSize = file.size;
  const fileSizeInMb = fileSize / (1024 * 1024);
  let xhr;

  const contentTypes = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    rtf: 'application/rtf',
  };

  const contentType = contentTypes[extension];
  if (!contentType) {
    showToastDialog(filename, ErrorType.UNSUPPORTED_FILE_TYPE);
    return;
  }

  if(fileSizeInMb > 25) {
    showToastDialog(filename, ErrorType.FILE_SIZE_OVER_LIMIT);
    return;
  }

  // Progress Bar Setup
  document.querySelector('.widget-copy').classList.add('hide');
  document.querySelector('.widget-subCopy').classList.add('hide');
  document.querySelector('.widget-upload-button').classList.add('hide');
  document.querySelector('.demo.widget-upload-button').classList.add('hide');

  statusBar.classList.remove('hide');
  cancelButton.classList.remove('hide');
  document
    .querySelector('.button-wrapper')
    .insertAdjacentElement('beforebegin', progressBarWrapper);
  progressBarWrapper.append(progressBar);
  progressBarWrapper.insertAdjacentElement('beforebegin', statusBar);

  const updateProgressBar = (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      progressBar.style.width = `${percentComplete}%`;
      statusBar.querySelector('.percentage').textContent = `${percentComplete.toFixed(0)}%`;
    }
  };

  const cancelUpload = () => {
    xhr.abort();
    document.querySelector('#file-upload').value = null;
    document.querySelector('.widget-upload-button').classList.remove('hide');
    document.querySelector('.demo.widget-upload-button').classList.remove('hide');
    progressBarWrapper.classList.add('hide');
    progressBar.style.width = '0%';
    cancelButton.classList.add('hide');
    statusBar.classList.add('hide');
    document.querySelector('.widget-copy').classList.remove('hide');
  };

  cancelButton.addEventListener('click', cancelUpload);

  try {
    const { accessToken, discoveryResources } = await initializePdfAssetManager();
    const uploadEndpoint = validateSSRF(discoveryResources.assets.upload.uri);
    const formData = prepareFormData(file, filename);

    xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.upload.addEventListener('progress', updateProgressBar, false);

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
            const createPdfResult = await createPdf(createPdfEndpoint, createPdfPayload, accessToken);
            const jobUri = createPdfResult.job_uri;
            await checkJobStatus(jobUri, accessToken, discoveryResources);
          } catch (error) {
            alert('Failed to create PDF');
            throw new Error('Error creating PDF:', error);
          }
        }

        try {
          const downloadUri = await getDownloadUri(assetUri, accessToken, discoveryResources);
          const blobViewerUrl = validateSSRF(getAcrobatWebLink(filename, assetUri, downloadUri));
          if (redirect !== 'off') {
            window.location = blobViewerUrl;
          } else {
            console.log('Blob Viewer URL:', `<a href="${blobViewerUrl}" target="_blank">View PDF</a>`);
          }
        } catch (error) {
          throw new Error('Error getting download URI:', error);
        }
      }
    };

    xhr.send(formData);
  } catch (error) {
    alert('An error occurred during the upload process. Please try again.');
    throw new Error('Error uploading file:', error);
  }
};

const createProgressSection = (createTag) => ({
  progressBarWrapper: createTag('div', { class: 'pBar-wrapper' }),
  progressBar: createTag('div', { class: 'pBar' }),
  cancelButton: document.querySelector('.cancel-button'),
});

export default async function init(element) {
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);
  const content = Array.from(element.querySelectorAll(':scope > div'));
  content.forEach((con) => con.classList.add('hide'));

  element.classList.add('ready');

  const wrapperNew = createTag('div', { id: 'CIDTWO', class: 'fsw widget-wrapper facade' });
  const wrapper = createTag('div', { id: 'CID', class: 'fsw acom-widget-wrapper' });
  const wrapperInner = createTag('div', { class: 'wrapper-inner' });
  const textWrapper = createTag('div', { class: 'text-wrapper' });
  const headerWrapper = createTag('div', { class: 'header-wrapper' });
  const subTitle = createTag('p', { class: 'widget-sub' }, 'Adobe Acrobat');
  const iconLogo = createTag('div', { class: 'widget-icon' });
  const artworkWrapper = createTag('div', { class: 'artwork-wrapper' });
  const artworkWrapperInner = createTag('div', { class: 'artwork-wrapper-inner' });
  const buttonWrapper = createTag('div', { class: 'button-wrapper' });
  const heading = createTag('h1', { class: 'widget-heading' }, content[1].textContent);
  const copy = createTag('p', { class: 'widget-copy' }, content[3].textContent);
  const subCopy = createTag('div', { class: 'widget-subCopy' }, content[4].textContent);
  const demoButton = createTag('button', { class: 'demo widget-upload-button' }, 'Try with demo file');
  const statusBar = createTag('p', { class: 'status-bar hide' });
  const statusMessage = createTag('span', { class: 'message' }, 'Uploading file to acrobat.adobe.com');
  const statusPercentage = createTag('span', { class: 'percentage' }, '0%');
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const cancelButton = createTag('button', { class: 'widget-cancel con-button outline button-xl hide' }, 'Cancel');
  const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-upload-button' }, content[5].textContent);
  const legal = createTag('span', { class: 'widget-legal' }, content[6].textContent);
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const iconInformation = createTag('div', { class: 'information-icon' });
  const artwork = createTag('img', { class: 'widget-image', src: `${content[2].querySelector('img').src}` });
  const svgArtwork = createTag('svg', { class: 'widget-big-icon' });
  const footer = createTag('div', { class: 'widget-footer' });

  headerWrapper.append(iconLogo, subTitle);
  buttonWrapper.append(button, buttonLabel, demoButton, cancelButton);
  textWrapper.append(headerWrapper, heading, copy, subCopy, buttonWrapper, statusBar);
  statusBar.append(statusMessage, statusPercentage);
  svgArtwork.append(artwork);
  artworkWrapperInner.append(svgArtwork);
  artworkWrapper.append(artworkWrapperInner);
  wrapperInner.append(textWrapper, artworkWrapper);
  footer.append(iconSecurity, legal, iconInformation);
  wrapper.append(wrapperInner);
  element.append(wrapper, footer, wrapperNew);

  initToastDialog(createTag);

  if (Number(window.localStorage.limit) > 1) {
    const upsell = createTag('div', { class: 'upsell' }, 'You have reached your limit. Please upgrade.');
    wrapper.append(upsell);
    element.append(wrapper);
  }

  setupDragDropListeners(wrapper, createTag);

  button.addEventListener('change', (e) => {
    processFileUpload(e, createTag);
  });
}
