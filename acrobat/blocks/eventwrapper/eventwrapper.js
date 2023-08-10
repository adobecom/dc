import converterAnalytics from '../../scripts/alloy/dc-converter-widget.js';
import browserExtAlloy from '../../scripts/alloy/browserExt.js'

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
const CONVERSION_START = 'conversion-start';
// const UPSELL_DIS = 'upsell-displayed';
const FADE = 'review fade-in';

export default function init(element) {
  const wrapper = element;
  const reviewBlock = document.querySelectorAll('.review');
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

  const extInstalled = (extid, extname, browserName) => {
    const event = new CustomEvent('modal:open', { detail: { hash: extname } });
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(extid, 'version', response => {
        if (!response) {
          window.dispatchEvent(event);
        }else{
          browserExtAlloy('modalExist', browserName);
        }
      });
    } else {
      window.dispatchEvent(event);
    };
  };

  const handleEvents = (e, converter, verb) => {
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
          extInstalled(extID, extName, browserName);
        }

        if (browserName === 'Microsoft Edge' && !window.modalDisplayed) {
          window.modalDisplayed = true;
          extName = '#edgeext';
          extID = 'elhekieabhbkpmcefcoobjddigjcaadp';
          extInstalled(extID, extName, browserName);
        }
      }else{
        browserExtAlloy('modalAlready', browserName);
      }
    }

    const showContent = (widgetCidTopPosition = '70px') => {
      const widget = document.querySelector('#dc-converter-widget');
      widget.style.minHeight = '570px';
      widget.style.height = 'auto';
      const widgetCid = widget.querySelector('#CID');
      widgetCid.style.top = widgetCidTopPosition;
      const main = document.getElementsByTagName('main')[0];
      const sections = Array.from(main.children);
      sections.forEach((section) => section.classList.remove('hide'));
    };

    const hideContent = () => {
      const widget = document.querySelector('#dc-converter-widget');
      const widgetCid = widget.querySelector('#CID');
      const gnav = document.querySelector('header');
      const gnavHeight = gnav ? gnav.offsetHeight : 0;
      setTimeout(() => {
        const footer = document.querySelector('.footer');
        const footerHeight = footer ? footer.offsetHeight : 0;
        widget.style.minHeight = `calc(100vh - ${gnavHeight + footerHeight}px)`;
        widget.style.height = `calc(100vh - ${gnavHeight + footerHeight}px)`;
        const lifecycleOrganizeContainer = widgetCid.querySelector('section');
        lifecycleOrganizeContainer.style.minHeight = `calc(100vh - ${gnavHeight + footerHeight}px)`;
        lifecycleOrganizeContainer.style.height = `calc(100vh - ${gnavHeight + footerHeight}px)`;
      }, 2000);
      widgetCid.style.top = '10px';
      const main = document.getElementsByTagName('main')[0];
      const sections = Array.from(main.children);
      sections.forEach((section) => section.classList.add('hide'));
    };

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
        if (verb === 'rotate-pages') hideContent();
        if (reviewBlock[0]) { reviewBlock[0].classList.add('hide'); };
        break;
      case UPLOAD_COMPLETE:
        setCurrentEvent('uploadcomplete');
        break;
      case PROCESS_CANCELED:
        setCurrentEvent('cancel');
        if (verb === 'rotate-pages') showContent();
        break;
      case TRY_ANOTHER:
        // suppress browser ext;
        document.querySelector('.dialog-close')?.click();
        localStorage.removeItem('fricBrowExt');
        window.modalDisplayed = false;
        break;
      case CONVERSION_START:
        setCurrentEvent('conversion');
        if (verb === 'rotate-pages') hideContent();
        break;
      case CONVERSION_COM:
        setCurrentEvent('complete');
        if (verb === 'rotate-pages') showContent('10px');
        if (reviewBlock[0]) { reviewBlock[0].classList = FADE; };
        break;
      case PREVIEW_GEN:
        setCurrentEvent('preview');
        if (verb === 'rotate-pages') showContent('10px');
        if (reviewBlock[0]) { reviewBlock[0].classList = FADE; };
        break;
      case DROPZONE_DIS:
        setCurrentEvent(DROPZONE_DIS);
        if (verb === 'rotate-pages') showContent();
        if (reviewBlock[0]) { reviewBlock[0].classList = FADE; };
        break;
      case DOWNLOAD_START:
        setCurrentEvent('download');
        break;
      default:
        break;
    }
  };

  window.addEventListener('DC_Hosted:Ready', () => {
    const CONVERTER = document.querySelector('#adobe_dc_sdk_launcher');
    const VERB = CONVERTER.dataset.verb;
    window.dc_hosted.addEventListener((e) => handleEvents(e, CONVERTER, VERB));
  });

  // set data attributes
  wrapper.dataset.eventName = wrapper.classList[1];
}
