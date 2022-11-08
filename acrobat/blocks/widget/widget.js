export default function init(element) {
  const widget = element;
  widget.querySelector('div').id = 'VERB';

  // ADD IF FOR REDIR
  // widget.querySelectorAll('div')[2].classList.add('hide');


  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'CID';
  widgetContainer.className = 'dc-wrapper';
  widget.appendChild(widgetContainer);

  const dcScript = document.createElement('script');
  dcScript.id = 'adobe_dc_sdk_launcher';
  dcScript.setAttribute('src', 'https://dc.dev.dexilab.acrobat.com/dc-hosted/2.22.8_1.118.2/dc-app-launcher.js');
  dcScript.dataset.dropzone_id = 'CID';
  dcScript.dataset.locale = 'en-us';
  dcScript.dataset.server_env = 'dev';
  dcScript.dataset.verb = document.querySelector('#VERB').innerText.trim().toLowerCase();
  dcScript.dataset.load_typekit = 'false';
  dcScript.dataset.load_imslib = 'false';
  dcScript.dataset.enable_unload_prompt = 'true';

  widget.appendChild(dcScript);

  // DC Personalization
  setTimeout(() => {
    if (window !== 'undefined' && window.dc_hosted) {
      const DATA = window.dc_hosted.getUserLimits();
      DATA.then((val) => {
        const doccloudPersonalization = val;
        // if limit for 300 uploads is reached, limit is shared across all verbs, upsell is shown for all verbs
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
          // L1 VERBS (all of them: request signature, pdf editor, delete pdf pages, rotate pdf, rearrange pdf,
          // split pdf, add pages to pdf, sign pdf, export pdf)
          l1Verbs: canNotUpload,
        };
        window.doccloudPersonalization = doccloudPersonalization;
      });
    }

    // Redirect Usage
    redDir();
  }, 200);

  // Redirect
  const fallBack = 'https://acrobat.adobe.com/link/acrobat/jpg-to-pdf?x_api_client_id=adobe_com&x_api_client_location=jpg_to_pdf';
  const redDir = () => {
    const signInBtn = document.querySelectorAll('.gnav-signin');
    if (!signInBtn) {
      console.log('redir.....');
      window.location = widget.querySelectorAll('div')[2].textContent.trim() || testRedirURL;
    }
  };
}
