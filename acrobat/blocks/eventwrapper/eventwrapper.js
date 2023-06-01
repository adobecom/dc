import converterAnalytics from '../../scripts/alloy/dc-converter-widget.js';

//TODO: Only have run one time
window.addEventListener('Bowser:Ready', ()=> {
  let parser = bowser.getParser(window.navigator.userAgent);
  let browserName = parser.getBrowserName();
})

const UPLOAD_START = 'file-upload-start';
const PROCESS_START = 'processing-start';
const UPLOAD_COMPLETE = 'file-upload-complete';
const PROCESS_CANCELED = 'processing-cancelled';
const PROCESS_COMPLETE = 'processing-complete';
const DOWNLOAD_START = 'download-start';
const CONVERSION_COM = 'conversion-complete';
const PREVIEW_GEN = 'preview-generating';
const DROPZONE_DIS = 'dropzone-displayed';
const PREVIEW_DIS = 'preview-displayed';
const TRY_ANOTHER = 'try-another-file-start';
// const UPSELL_DIS = 'upsell-displayed';

export default function init(element) {
  const wrapper = element;
  const setCurrentEvent = (event) => {
    if (document.querySelectorAll(`[data-event-name="${event}"]`).length > 0) {
      document.body.dataset.currentEvent = event;
    } else if (event === DROPZONE_DIS) {
      document.body.removeAttribute('data-current-event')
    }
  };

  const params = new Proxy(new URLSearchParams(window.location.search),{
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (typeof (params.eventsAll) === 'string') {
    document.body.classList.add('eventsShowAll');
    wrapper.dataset.eventName = 'onload';
    return;
  }

  const extInstalled = (extid, extname) => {
    const event = new CustomEvent('modal:open', { detail: { hash: extname } });
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(extid, 'version', response => {
        if (!response) {
          window.dispatchEvent(event);
        }

      });
    } else {
      window.dispatchEvent(event);
    };

  };

  const handleEvents = (e, jobData, converter, verb) => {
    let parser = bowser.getParser(window.navigator.userAgent);
    let browserName = parser.getBrowserName();
    let extID;
    if (e === PROCESS_START) converterAnalytics();

    if (e === CONVERSION_COM && parser.parsedResult.platform.type === 'desktop'
        || e === PREVIEW_DIS && parser.parsedResult.platform.type === 'desktop') {
      // Browser Extension
      if (!localStorage.fricBrowExt) {
        let extName;
        if (browserName === 'Chrome' && !window.modalDisplayed) {
          window.modalDisplayed = true;
          extName = '#chromeext';
          extID = 'efaidnbmnnnibpcajpcglclefindmkaj';
          extInstalled(extID, extName);
        }
    
        if (browserName === 'Microsoft Edge' && !window.modalDisplayed) {
          window.modalDisplayed = true;
          extName = '#edgeext';
          extID = 'elhekieabhbkpmcefcoobjddigjcaadp';
          extInstalled(extID, extName);
        }
      }
    }

    switch (e) {
      case PROCESS_START:
        setCurrentEvent('start');
        // eslint-disable-next-line no-case-declarations
        const clsPopIn = document.querySelector('#CLS_POPIN');
        if (clsPopIn) {
          clsPopIn.remove();
        }
        break;
      case UPLOAD_START:
        setCurrentEvent('upload');
        break;
      case UPLOAD_COMPLETE:
        setCurrentEvent('uploadcomplete');
        break;
      case PROCESS_CANCELED:
        setCurrentEvent('cancel');
        break;
      case TRY_ANOTHER:
        // suppress browser ext;
        document.querySelector('.dialog-close')?.click();
        localStorage.removeItem('fricBrowExt');
        window.modalDisplayed = false;
        break;
      case CONVERSION_COM:
        setCurrentEvent('complete');
        break;
      case PREVIEW_GEN:
        setCurrentEvent('preview');
        break;
      case DROPZONE_DIS:
        setCurrentEvent(DROPZONE_DIS);
        break;
      case DOWNLOAD_START:
        setCurrentEvent('download');
        break;
      default:
        break;
    }
  };

  window.addEventListener('DC_Hosted:Ready', () => {
    // const CONVERTER = document.querySelector('#adobe_dc_sdk_launcher');
    // const VERB = CONVERTER.dataset.verb;
    window.dc_hosted.addEventListener((e, jobData) => handleEvents(e, jobData));
  });

  // set data attributes
  wrapper.dataset.eventName = wrapper.classList[1];
}
