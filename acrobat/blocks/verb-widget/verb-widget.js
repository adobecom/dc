import LIMITS from './limits.js';
import { setLibs } from '../../scripts/utils.js';
import verbAnalytics from '../../scripts/alloy/verb-widget.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const handleError = (err, errTxt, str, strTwo) => {
  err.classList.add('verb-error');
  err.classList.remove('hide');
  errTxt.textContent = `${window.mph[str]} ${strTwo || ''}`;

  setTimeout(() => {
    err.classList.remove('verb-error');
    err.classList.add('hide');
  }, 5000);

  // Add LANA Logs and AA
};

const sendToUnity = async (file, verb, err, errTxt) => {
  // const filename = file.name;
  // let xhr;

  // Error Check: File Empty
  if (file.size < 1) {
    verbAnalytics('error:step01:empty-file', verb);
    handleError(err, errTxt, 'verb-widget-error-empty');
  }

  // Error Check: Supported File Type
  if (LIMITS[verb].acceptedFiles.indexOf(file.type) < 0) {
    verbAnalytics('error:step01:unsupported-file-type', verb);
    handleError(err, errTxt, 'verb-widget-error-unsupported');
    return;
  }

  // Error Check: File Too Large
  if (file.size > LIMITS[verb].maxFileSize) {
    verbAnalytics('error:step01:file-too-large', verb);
    handleError(err, errTxt, 'verb-widget-error-large', LIMITS[verb].maxFileSizeFriendly);
  }

  // try {
  //   const { accessToken, discoveryResources } = await initializePdfAssetManager();
  //   const uploadEndpoint = validateSSRF(discoveryResources.assets.upload.uri);
  //   const formData = prepareFormData(file, filename);

  //   xhr = new XMLHttpRequest();
  //   xhr.open('POST', uploadEndpoint, true);
  //   xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

  //   xhr.onreadystatechange = async () => {
  //     if (xhr.readyState === 4 && xhr.status === 201) {
  //       const uploadResult = JSON.parse(xhr.responseText);
  //       const assetUri = uploadResult.uri;

  //       if (contentType !== 'application/pdf') {
  //         const createPdfEndpoint = validateSSRF(discoveryResources.assets.createpdf.uri);
  //         const createPdfPayload = {
  //           asset_uri: assetUri,
  //           name: filename,
  //           persistence: 'transient',
  //         };
  //         try {
  //           const createPdfResult = await createPdf(
  //             createPdfEndpoint,
  //             createPdfPayload,
  //             accessToken,
  //           );
  //           const jobUri = createPdfResult.job_uri;
  //           await checkJobStatus(jobUri, accessToken, discoveryResources);
  //         } catch (error) {
  //           // eslint-disable-next-line no-alert
  //           alert('Failed to create PDF');
  //           throw new Error('Error creating PDF:', error);
  //         }
  //       }

  //       try {
  //         const downloadUri = await getDownloadUri(assetUri, accessToken, discoveryResources);
  //         const blobViewerUrl = validateSSRF(getAcrobatWebLink(filename, assetUri, downloadUri));
  //         if (redirect !== 'off') {
  //           window.location.href = blobViewerUrl;
  //         } else {
  //           // eslint-disable-next-line no-console
  //           console.log('Blob Viewer URL:', `<a href="${blobViewerUrl}" target="_blank">View PDF</a>`);
  //         }
  //       } catch (error) {
  //         throw new Error('Error getting download URI:', error);
  //       }
  //     }
  //   };

  //   xhr.send(formData);
  // } catch (error) {
  //   // eslint-disable-next-line no-alert
  //   alert('An error occurred during the upload process. Please try again.');
  //   throw new Error('Error uploading file:', error);
  // }
};

const dropFiles = (ev, verb, err, errTxt) => {
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Error Check: File Count
    if ([...ev.dataTransfer.items].length > LIMITS[verb].maxNumFiles) {
      verbAnalytics('error:step01:multiple-files-selected', verb);
      handleError(err, errTxt, 'verb-widget-error-multi');
      return;
    }

    [...ev.dataTransfer.items].forEach((item) => {
      // Add check for multiple files.
      if (item.kind === 'file') {
        const file = item.getAsFile();
        sendToUnity(file, verb, err, errTxt);
      }
    });
  } else {
    [...ev.dataTransfer.files].forEach((file, i) => {
      // copy functionality from dataTransfer.items
    });
  }
};

const setDraggingClass = (widget, shouldToggle) => {
  shouldToggle ? widget.classList.add('dragging') : widget.classList.remove('dragging');
};

export default async function init(element) {
  const children = element.querySelectorAll(':scope > div');
  const VERB = element.classList[1];
  const widgetHeading = createTag('h1', { class: 'verb-heading' }, children[0].textContent);
  let mobileLink = null;
  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    mobileLink = window.mph['verb-widget-apple-fillsign'];
  } else if (/android/i.test(window?.browser?.ua)) {
    mobileLink = window.mph['verb-widget-google-fillsign'];
  }

  children.forEach((child) => {
    child.remove();
  });

  const widget = createTag('div', { id: 'drop-zone', class: 'verb-wrapper' });
  const widgetContainer = createTag('div', { class: 'verb-container' });
  const widgetRow = createTag('div', { class: 'verb-row' });
  const widgetLeft = createTag('div', { class: 'verb-col' });
  const widgetRight = createTag('div', { class: 'verb-col right' });
  const widgetHeader = createTag('div', { class: 'verb-header' });
  const widgetIcon = createTag('div', { class: 'verb-icon' });
  const widgetTitle = createTag('div', { class: 'verb-title' }, 'Acrobat');
  const widgetCopy = createTag('p', { class: 'verb-copy' }, window.mph[`verb-widget-description-${VERB}`]);
  const widgetButton = createTag('label', { for: 'file-upload', class: 'verb-cta' }, window.mph['verb-widget-cta']);
  const widgetMobileButton = createTag('a', { class: 'verb-mobile-cta', href: mobileLink }, window.mph['verb-widget-cta-mobile']);
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' });
  const widgetImage = createTag('img', { class: 'verb-image', src: children[1].querySelector('img')?.src });
  // Since we're using placeholders we need a solution for the hyperlinks
  const legal = createTag('p', { class: 'verb-legal' }, window.mph['verb-widget-legal']);
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const footer = createTag('div', { class: 'verb-footer' });

  const errorState = createTag('div', { class: 'hide' });
  const errorStateText = createTag('p', { class: 'verb-errorText' });
  const errorIcon = createTag('div', { class: 'verb-errorIcon' });
  const errorCloseBtn = createTag('div', { class: 'verb-errorBtn' });

  widget.append(widgetContainer);
  widgetContainer.append(widgetRow);
  widgetRight.append(widgetImage);
  widgetRow.append(widgetLeft, widgetRight);
  widgetHeader.append(widgetIcon, widgetTitle);
  errorState.append(errorIcon, errorStateText, errorCloseBtn);
  if (mobileLink && LIMITS[VERB].mobileApp) {
    widgetLeft.append(widgetHeader, widgetHeading, widgetCopy, errorState, widgetMobileButton);
  } else {
    widgetLeft.append(widgetHeader, widgetHeading, widgetCopy, errorState, widgetButton, button);
  }
  footer.append(iconSecurity, legal);

  element.append(widget, footer);

  verbAnalytics('landing:shown', VERB);

  button.addEventListener('click', () => {
    verbAnalytics('dropzone:choose-file-clicked', VERB);
  });

  button.addEventListener('change', (e) => {
    verbAnalytics('choose-file:open', VERB);
    const file = e.target.files[0];
    if (file) {
      sendToUnity(file, VERB, errorState, errorStateText);
    }
    // Clear file so it 'changes' on multiple tries
    e.target.value = '';
  });

  button.addEventListener('cancel', () => {
    verbAnalytics('choose-file:close', VERB);
  });

  widget.addEventListener('dragover', (e) => {
    e.preventDefault();
    setDraggingClass(widget, true);
  });

  widget.addEventListener('dragleave', () => {
    setDraggingClass(widget, false);
  });

  widget.addEventListener('drop', (e) => {
    verbAnalytics('files-dropped', VERB);
    dropFiles(e, VERB, errorState, errorStateText);
    setDraggingClass(widget, false);
  });

  errorCloseBtn.addEventListener('click', () => {
    errorState.classList.remove('verb-error');
    errorState.classList.add('hide');
  });
}
