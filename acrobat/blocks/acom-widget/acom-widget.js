import {
  initializePdfAssetManager,
  createPdf,
  checkJobStatus,
  getDownloadUri,
  prepareFormData,
  getAcrobatWebLink,
} from './pdfAssetManager.js';

const createTag = (tag, attributes, html) => {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file.type.includes('pdf') && !file.type.includes('image') && !file.type.includes('video')) {
          alert('Please try a PDF, Image, or Video file');
        } else {
          const loadDC = true;
        }
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file) => {
      if (!file.type.includes('pdf') && !file.type.includes('image') && !file.type.includes('video')) {
        alert('Please try a PDF, Image, or Video file');
      } else {
        const loadDC = true;
      }
    });
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(dm)} ${sizes[i]}`;
};

const uploadToAdobe = async (file, progressBarWrapper, progressBar, statusMessage, retryButton, fileInput) => {
  const filename = file.name;
  const fileSize = file.size;
  const extension = filename.split('.').slice(-1)[0].toLowerCase();
  let contentType;

  switch (extension) {
    case 'png':
      contentType = 'image/png';
      break;
    case 'jpg':
    case 'jpeg':
      contentType = 'image/jpeg';
      break;
    case 'svg':
      contentType = 'image/svg+xml';
      break;
    case 'pdf':
      contentType = 'application/pdf';
      break;
    default:
      alert('This file is invalid');
      return;
  }

  // Progress Bar Setup
  document.querySelector('.widget-button').insertAdjacentElement('afterend', progressBarWrapper);
  document.querySelector('.widget-button').remove();
  progressBarWrapper.appendChild(progressBar);
  progressBarWrapper.appendChild(statusMessage);

  // Display file details
  statusMessage.textContent = `File: ${filename} (${formatBytes(fileSize)}) - Type: ${contentType}`;

  const updateProgressBar = (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      progressBar.style.width = `${percentComplete}%`;
      statusMessage.textContent = `Uploading... ${percentComplete.toFixed(2)}% (${formatBytes(event.loaded)} / ${formatBytes(event.total)})`;
    }
  };

  const resetForm = () => {
    fileInput.value = '';
    progressBar.style.width = '0%';
    statusMessage.textContent = '';
    retryButton.style.display = 'none';
  };

  const showError = (message) => {
    statusMessage.textContent = `Error: ${message}`;
    retryButton.style.display = 'inline';
  };

  try {
    const { accessToken, discoveryResources } = await initializePdfAssetManager();
    const uploadEndpoint = discoveryResources.assets.upload.uri;

    // Step 1: Prepare Form Data and Upload File with Progress Tracking
    const formData = prepareFormData(file, filename);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

    xhr.upload.addEventListener('progress', updateProgressBar, false);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201) {
          const uploadResult = JSON.parse(xhr.responseText);
          const assetUri = uploadResult.uri;
          if (contentType !== 'application/pdf') {
            // Step 2: Create PDF
            const createPdfEndpoint = discoveryResources.assets.createpdf.uri;
            const createPdfPayload = {
              asset_uri: assetUri,
              name: filename,
              persistence: 'transient',
            };
            statusMessage.textContent = 'Creating PDF...';
            createPdf(createPdfEndpoint, createPdfPayload, accessToken).then((createPdfResult) => {
              const jobUri = createPdfResult.job_uri;

              // Step 3: Check Job Status
              checkJobStatus(jobUri, accessToken, discoveryResources).then(() => {
                statusMessage.textContent = 'PDF created successfully!';
              });
            }).catch((error) => {
              showError('Failed to create PDF');
              throw new Error('Error creating PDF:', error);
            });
          }

          getDownloadUri(assetUri, accessToken, discoveryResources).then((downloadUri) => {
            // Generate Blob URL and Display PDF
            const blobViewerUrl = getAcrobatWebLink(filename, assetUri, downloadUri);
            statusMessage.appendChild(document.createElement('br'));
            statusMessage.append(document.createTextNode('Download PDF: '));
            const downloadLink = document.createElement('a');
            downloadLink.href = blobViewerUrl;
            downloadLink.textContent = filename;
            downloadLink.target = '_blank';
            statusMessage.appendChild(downloadLink);
          }).catch((error) => {
            showError('Failed to fetch download URI');
            throw new Error('Error fetching download URI:', error);
          });
        } else {
          showError(`${xhr.statusText} - ${xhr.responseText} - ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => {
      showError('Network error occurred during the upload.');
    };

    xhr.send(formData);
  } catch (error) {
    showError('An error occurred during the upload process. Please try again.');
    throw new Error('Error uploading file:', error);
  }

  retryButton.onclick = () => {
    resetForm();
    uploadToAdobe(file, progressBarWrapper, progressBar, statusMessage, retryButton, fileInput);
  };
};

const upload = (pbw, pb, sm, retryButton, fileInput) => {
  const file = fileInput.files[0];
  if (file) {
    uploadToAdobe(file, pbw, pb, sm, retryButton, fileInput);
  }
};

export default function init(element) {
  const content = element.querySelectorAll(':scope > div');
  Array.from(content).forEach((con) => {
    con.classList.add('hide');
  });

  element.classList.add('ready');

  const wrappernew = createTag('div', { id: 'CIDTWO', class: 'fsw widget-wrapper facade' });
  const wrapper = createTag('div', { id: 'CID', class: 'fsw widget-wrapper' });
  const heading = createTag('h1', { class: 'widget-heading' }, `${content[1].textContent}`);
  const dropZone = createTag('div', { id: 'dZone', class: 'widget-center' });
  const copy = createTag('p', { class: 'widget-copy' }, `${content[2].textContent}`);
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-button' }, `${content[3].textContent}`);
  const legal = createTag('p', { class: 'widget-legal' }, `${content[4].textContent}`);
  const subTitle = createTag('p', { class: 'widget-sub' }, 'Adobe Acrobat');
  const iconLogo = createTag('div', { class: 'widget-icon' });
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const icon = createTag('div', { class: 'widget-big-icon' });
  const footer = createTag('div', { class: 'widget-footer' });
  const progressBarWrapper = createTag('div', { class: 'pBar-wrapper' });
  const progressBar = createTag('div', { class: 'pBar' });
  const statusMessage = createTag('p', { class: 'status-message' });
  const retryButton = createTag('button', { class: 'retry-button', style: 'display: none;' }, 'Retry');

  wrapper.append(subTitle);
  subTitle.prepend(iconLogo);
  wrapper.append(icon);
  wrapper.append(heading);
  wrapper.append(copy);
  wrapper.append(button);
  wrapper.append(buttonLabel);
  footer.append(iconSecurity);
  footer.append(legal);
  element.append(wrapper);
  element.append(footer);
  element.append(wrappernew);
  progressBarWrapper.appendChild(retryButton);
  element.append(statusMessage);

  if (Number(window.localStorage.limit) > 1) {
    const upsell = createTag('div', { class: 'upsell' }, 'You have reached your limit. Please upgrade.');
    wrapper.append(upsell);
    element.append(wrapper);
  }

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);

  document.getElementById('file-upload').addEventListener('change', (e) => {
    upload(progressBarWrapper, progressBar, statusMessage, retryButton, e.target);
  });
}
