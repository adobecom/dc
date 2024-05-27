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

const uploadToAdobe = async (file, progressSection) => {
  const { progressBarWrapper, progressBar } = progressSection;
  const statusBar = document.querySelector('.status-bar');
  const cancelButton = document.querySelector('.widget-cancel');

  const filename = file.name;
  const fileSize = file.size;
  const extension = filename.split('.').slice(-1)[0].toLowerCase();
  let contentType;
  let xhr;

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
  document.querySelector('.widget-copy').classList.add('hide');
  document.querySelector('.widget-button').classList.add('hide');
  statusBar.classList.remove('hide');
  cancelButton.classList.remove('hide');
  document.querySelector('.action-area').insertAdjacentElement('beforebegin', progressBarWrapper);
  progressBarWrapper.appendChild(progressBar);
  progressBarWrapper.insertAdjacentElement('beforebegin', statusBar);

  // Display file details
  // statusMessage.textContent = `File: ${filename} (${formatBytes(fileSize)}) - Type: ${contentType}`;

  const updateProgressBar = (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      progressBar.style.width = `${percentComplete}%`;
      statusBar.querySelector('.percentage').textContent = `${percentComplete.toFixed(2)}%`;

      // statusMessage.textContent = `Uploading ${formatBytes(fileSize)} file... ${percentComplete.toFixed(2)}% (${formatBytes(event.loaded)} / ${formatBytes(event.total)})`;
    }
  };

  const cancelUpload = () => {
    xhr.abort();
    document.querySelector('#file-upload').value = null;
    document.querySelector('.widget-button').classList.remove('hide');
    progressBarWrapper.classList.add('hide');
    progressBar.style.width = '0%';
    cancelButton.classList.add('hide');
    statusBar.classList.add('hide');
    // Reset the UI for a new upload
    document.querySelector('.widget-copy').classList.remove('hide');
    document.querySelector('.widget-button').classList.remove('hide');
  };

  cancelButton.addEventListener('click', cancelUpload);

  try {
    const { accessToken, discoveryResources } = await initializePdfAssetManager();
    const uploadEndpoint = discoveryResources.assets.upload.uri;

    // Step 1: Prepare Form Data and Upload File with Progress Tracking
    const formData = prepareFormData(file, filename);

    xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

    xhr.upload.addEventListener('progress', updateProgressBar, false);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201) {
          const uploadResult = JSON.parse(xhr.responseText);
          console.log('Upload Result:', uploadResult);
          const assetUri = uploadResult.uri;

          if (contentType !== 'application/pdf') {
            // Step 2: Create PDF
            const createPdfEndpoint = discoveryResources.assets.createpdf.uri;
            const createPdfPayload = {
              asset_uri: assetUri,
              name: filename,
              persistence: 'transient',
            };
            createPdf(createPdfEndpoint, createPdfPayload, accessToken).then((createPdfResult) => {
              console.log('Create PDF result:', createPdfResult);
              const jobUri = createPdfResult.job_uri;
              console.log('Job URI:', jobUri);

              // Step 3: Check Job Status
              checkJobStatus(jobUri, accessToken, discoveryResources).then(() => {
                cancelButton.classList.add('hide');
              });
            }).catch((error) => {
              console.error('Error creating PDF:', error);
              alert('Failed to create PDF');
              cancelButton.classList.add('hide');
            });
          }

          getDownloadUri(assetUri, accessToken, discoveryResources).then((downloadUri) => {
            console.log('Download URI:', downloadUri);

            // Generate Blob URL and Display PDF
            const blobViewerUrl = getAcrobatWebLink(filename, assetUri, downloadUri);
            console.log('Blob URL:', blobViewerUrl);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobViewerUrl;
            downloadLink.textContent = filename;
            downloadLink.target = '_blank';
            cancelButton.classList.add('hide');
          }).catch((error) => {
            console.error('Error fetching download URI:', error);
            alert('Failed to fetch download URI');
            cancelButton.classList.add('hide');
          });
        } else {
          // statusBar.appendChild(document.createTextNode(`${xhr.statusText} - ${xhr.responseText} - ${xhr.status}`));
          cancelButton.classList.add('hide');
        }
      }
    };

    xhr.send(formData);
  } catch (error) {
    console.error('Error during upload:', error);
    alert('An error occurred during the upload process. Please try again later.');
    cancelButton.classList.add('hide');
  }
};

const createProgressSection = () => {
  const progressBarWrapper = createTag('div', { class: 'pBar-wrapper' });
  const progressBar = createTag('div', { class: 'pBar' });
  const cancelButton = document.querySelector('.cancel-button');
  return {
    progressBarWrapper,
    progressBar,
    cancelButton,
  };
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
  const actionArea = createTag('p', { class: 'action-area' });
  const statusBar = createTag('p', { class: 'status-bar hide' });
  const statusMessage = createTag('span', { class: 'message' }, 'Uploading file to acrobat.adobe.com');
  const statusPercentage = createTag('span', { class: 'percentage' }, '0%');

  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const cancelButton = createTag('button', { class: 'widget-cancel con-button outline button-xl hide' }, 'Cancel');
  const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-button' }, `${content[3].textContent}`);
  const legal = createTag('p', { class: 'widget-legal' }, `${content[4].textContent}`);
  const subTitle = createTag('p', { class: 'widget-sub' }, 'Adobe Acrobat');
  const iconLogo = createTag('div', { class: 'widget-icon' });
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const icon = createTag('div', { class: 'widget-big-icon' });
  const footer = createTag('div', { class: 'widget-footer' });

  wrapper.append(subTitle);
  subTitle.prepend(iconLogo);
  wrapper.append(icon);
  wrapper.append(heading);
  wrapper.append(copy);
  statusBar.append(statusMessage);
  statusBar.append(statusPercentage);
  wrapper.append(statusBar);
  actionArea.append(button);
  actionArea.append(cancelButton);
  actionArea.append(buttonLabel);
  wrapper.append(actionArea);
  footer.append(iconSecurity);
  footer.append(legal);
  element.append(wrapper);
  element.append(footer);
  element.append(wrappernew);

  if (Number(window.localStorage.limit) > 1) {
    const upsell = createTag('div', { class: 'upsell' }, 'You have reached your limit. Please upgrade.');
    wrapper.append(upsell);
    element.append(wrapper);
  }

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);

  button.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const progressSection = createProgressSection();
    if (file) {
      uploadToAdobe(file, progressSection);
    }
  });
}
