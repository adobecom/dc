import {
  initializePdfAssetManager,
  createPdf,
  checkJobStatus,
  getDownloadUri,
  prepareFormData,
  getAcrobatWebLink,
} from './pdfAssetManager.js';

// eslint-disable-next-line compat/compat
const PAGE_URL = new URL(window.location.href);
const redirect = PAGE_URL.searchParams.get('redirect');

const createTag = (tag, attributes, html) => {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment
    ) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => el.setAttribute(key, val));
  }
  return el;
};

const uploadToAdobe = async (file, progressSection) => {
  const { progressBarWrapper, progressBar } = progressSection;
  const statusBar = document.querySelector('.status-bar');
  const cancelButton = document.querySelector('.widget-cancel');
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
    alert('This file is invalid');
    return;
  }

  // Progress Bar Setup
  document.querySelector('.widget-copy').classList.add('hide');
  document.querySelector('.widget-button').classList.add('hide');
  statusBar.classList.remove('hide');
  cancelButton.classList.remove('hide');
  document
    .querySelector('.action-area')
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
    document.querySelector('.widget-button').classList.remove('hide');
    progressBarWrapper.classList.add('hide');
    progressBar.style.width = '0%';
    cancelButton.classList.add('hide');
    statusBar.classList.add('hide');
    document.querySelector('.widget-copy').classList.remove('hide');
    document.querySelector('.widget-button').classList.remove('hide');
  };

  cancelButton.addEventListener('click', cancelUpload);

  try {
    const { accessToken, discoveryResources } = await initializePdfAssetManager();
    const uploadEndpoint = discoveryResources.assets.upload.uri;
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
          const createPdfEndpoint = discoveryResources.assets.createpdf.uri;
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
          const blobViewerUrl = getAcrobatWebLink(filename, assetUri, downloadUri);
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

const createProgressSection = () => ({
  progressBarWrapper: createTag('div', { class: 'pBar-wrapper' }),
  progressBar: createTag('div', { class: 'pBar' }),
  cancelButton: document.querySelector('.cancel-button'),
});

export default function init(element) {
  const content = Array.from(element.querySelectorAll(':scope > div'));
  content.forEach((con) => con.classList.add('hide'));

  element.classList.add('ready');

  const wrapperNew = createTag('div', { id: 'CIDTWO', class: 'fsw widget-wrapper facade' });
  const wrapper = createTag('div', { id: 'CID', class: 'fsw widget-wrapper' });
  const heading = createTag('h1', { class: 'widget-heading' }, content[1].textContent);
  const copy = createTag('p', { class: 'widget-copy' }, content[2].textContent);
  const actionArea = createTag('p', { class: 'action-area' });
  const statusBar = createTag('p', { class: 'status-bar hide' });
  const statusMessage = createTag('span', { class: 'message' }, 'Uploading file to acrobat.adobe.com');
  const statusPercentage = createTag('span', { class: 'percentage' }, '0%');

  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const cancelButton = createTag('button', { class: 'widget-cancel con-button outline button-xl hide' }, 'Cancel');
  const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-button' }, content[3].textContent);
  const legal = createTag('p', { class: 'widget-legal' }, content[4].textContent);
  const subTitle = createTag('p', { class: 'widget-sub' }, 'Adobe Acrobat');
  const iconLogo = createTag('div', { class: 'widget-icon' });
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const icon = createTag('div', { class: 'widget-big-icon' });
  const footer = createTag('div', { class: 'widget-footer' });

  wrapper.append(subTitle);
  subTitle.prepend(iconLogo);
  wrapper.append(icon, heading, copy, statusBar);
  statusBar.append(statusMessage, statusPercentage);
  actionArea.append(button, cancelButton, buttonLabel);
  wrapper.append(actionArea);
  footer.append(iconSecurity, legal);
  element.append(wrapper, footer, wrapperNew);

  if (Number(window.localStorage.limit) > 1) {
    const upsell = createTag('div', { class: 'upsell' }, 'You have reached your limit. Please upgrade.');
    wrapper.append(upsell);
    element.append(wrapper);
  }

  button.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const progressSection = createProgressSection();
    if (file) {
      uploadToAdobe(file, progressSection);
    }
  });
}
