import frictionless from '../../scripts/frictionless.js';
let runOne = false;

export default function init(element) {
  const widget = element;
  let WIDGET_ENV = 'https://dev.acrobat.adobe.com/dc-hosted/2.36.1_1.162.1/dc-app-launcher.js';

  if (window.location.hostname === 'main--dc--adobecom.hlx.page'
    || window.location.hostname === 'main--dc--adobecom.hlx.live'
    || window.location.hostname === 'adobe.com') {
    WIDGET_ENV = 'https://documentcloud.adobe.com/dc-hosted/2.35.2_1.159.3/dc-app-launcher.js';
  }

  if (window.location.hostname === 'stage--dc--adobecom.hlx.page'
    || window.location.hostname === 'www.stage.adobe.com' ) {
    WIDGET_ENV = 'https://stage.acrobat.adobe.com/dc-hosted/2.36.1_1.162.1/dc-app-launcher.js';
  }


  function addIMSShims() {
    console.log('DC Shim');
    console.log(window.adobeIMS);
    if (window.adobeIMS && !window.adobeIMS.isReady) {
        window.adobeIMS.isReady = function () {
            return !!window.adobe_dc_sdk.imsReady;
        };
        window.adobeIMS.getClientID = function () {
            return window.adobeid.client_id;
        };
        window.adobeIMS.getUserProfile = function() {
            return window.adobe_dc_sdk.ims_profile;
        };
        window.adobeIMS.getLocale = function () {
            return window.adobeid.locale;
        };
    }
  }

  widget.querySelector('div').id = 'VERB';
  const VERB = widget.querySelector('div').innerText.trim().toLowerCase();

  // Redir URL
  if (widget.querySelectorAll('div')[2]) {
    widget.querySelectorAll('div')[2].classList.add('hide');
  }

  // Redirect
  const fallBack = 'https://www.adobe.com/go/acrobat-overview';
  const redDir = () => {
    if (window.adobeIMS.isSignedInUser()) {
      window.location = widget.querySelectorAll('div')[2].textContent.trim() || fallBack;
    }
  };

  // Static
  const fakeWidgetContainer = document.createElement('div');
  fakeWidgetContainer.id = 'CID';
  // fakeWidgetContainer.dataset.rendered = 'true';
  fakeWidgetContainer.className = 'fake-dc-wrapper';
  widget.appendChild(fakeWidgetContainer);

  (async () => {
    // TODO: Make dynamic
    const response = await fetch('https://documentcloud.adobe.com/dc-generate-cache/dc-hosted-1.162.1/pdf-to-ppt-en-us.html');
    // eslint-disable-next-line default-case
    switch (response.status) {
      case 200:
        // eslint-disable-next-line no-case-declarations
        const template = await response.text();
        fakeWidgetContainer.innerHTML = template;
        break;
      case 404:
        break;
    }
  })();

  window.addEventListener('IMS:Ready', () => {
    // Redirect Usage
    redDir();
    frictionless(VERB);
  });

  const header = document.querySelector('header')
  header.addEventListener('gnav:init', () => {
    console.log('gnav ready');
    addIMSShims();
    // make sure you only load once! 
    if (!runOne) {
      widget.appendChild(dcScript);
      runOne = true;
    }
  })

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'CID';
  widgetContainer.className = 'dc-wrapper';
  widget.appendChild(widgetContainer);

  const dcScript = document.createElement('script');
  dcScript.id = 'adobe_dc_sdk_launcher';
  dcScript.setAttribute('src', WIDGET_ENV);
  dcScript.dataset.dropzone_id = 'CID';
  dcScript.dataset.locale = 'en-us';
  dcScript.dataset.server_env = 'dev';
  dcScript.dataset.verb = VERB;
  dcScript.dataset.load_typekit = 'false';
  dcScript.dataset.load_imslib = 'false';
  dcScript.dataset.enable_unload_prompt = 'true';

  console.log('shim no wait');
  addIMSShims();
  if (!runOne) {
    widget.appendChild(dcScript);
    runOne = true;
  }

  // DC Personalization
  window.addEventListener('DC_Hosted:Ready', () => {
    const DATA = window.dc_hosted.getUserLimits();
    DATA.then((val) => {
      const doccloudPersonalization = val;
      // if limit for 300 uploads is reached, limit is shared across all verbs,
      // upsell is shown for all verbs
      const canNotUpload = val.upload && !val.upload.can_upload;
      doccloudPersonalization.isUpsellDisplayed = {
        // L2 VERBS
        // convert-pdf, word-pdf, excel-pdf, jpg-pdf, ppt-pdf
        createPDF: canNotUpload || (val.create_pdf && !val.create_pdf.can_process),
        // pdf-word, pdf-excel, pdf-ppt, pdf-jpg (2 conversion allowed, limit is shared across them)
        exportPDF: canNotUpload || (val.export_pdf && !val.export_pdf.can_process),
        // compress-pdf
        compressPDF: canNotUpload || (val.compress_pdf && !val.compress_pdf.can_process),
        // password-protect
        passwordProtectPDF: canNotUpload || (val.protect_pdf && !val.protect_pdf.can_process),
        // merge-pdf
        mergePDF: canNotUpload || (val.combine_pdf && !val.combine_pdf.can_process),
        // L1 VERBS (all of them: request signature, pdf editor, delete pdf pages,
        // rotate pdf, rearrange pdf, split pdf, add pages to pdf, sign pdf, export pdf)
        l1Verbs: canNotUpload,
      };
      window.doccloudPersonalization = doccloudPersonalization;
      // Personalization Ready Event
      const personalizationIsReady = new CustomEvent('Personalization:Ready');

      window.dispatchEvent(personalizationIsReady);
    });
  });
}
