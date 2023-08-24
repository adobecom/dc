import converterAnalytics from '../../scripts/alloy/dc-converter-widget.js';
import browserExtAlloy from '../../scripts/alloy/browserExt.js'

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

  let footer;
  let gnav;
  let widget;
  let sections;
  let converterWidget;
  let body;
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

  const handleEvents = (e, jobData, converter, verb) => {
    const { name: browserName, isMobile } = window.browser;
    let extID;
    if (e === PROCESS_START) converterAnalytics();
    if (e === CONVERSION_COM && !isMobile
        || e === PREVIEW_DIS && !isMobile) {
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

    if (verb === 'rotate-pages') {
      gnav = document.querySelector('header');
      widget = document.querySelector('[data-section="widget"]');
      body = document.querySelector('body');
      sections = document.querySelectorAll('main > div');
      converterWidget = widget.querySelector('#dc-converter-widget');
    }

    function handleResize() {
      const gnavHeight = gnav ? gnav.offsetHeight : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      widget.style.minHeight = `calc(100vh - ${gnavHeight + footerHeight}px)`;
      widget.style.height = `calc(100vh - ${gnavHeight + footerHeight}px)`;
      converterWidget.style.minHeight = 'auto';
    };

    const showContent = () => {
      body.classList.remove('hide-content');
      widget.classList.add('widget-default-height');
      sections?.forEach((section) => section.classList.remove('hide'));
    };

    const hideContent = () => {
      body.classList.add('hide-content');
      widget.classList.remove('widget-default-height');
      setTimeout(() => {
        footer = document.querySelector('.global-footer');
        handleResize();
      }, 5000);
      sections?.forEach((section) => {
        if (section.getAttribute('data-section') === 'widget') return;
        section.classList.add('hide');
      });
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
      case PROCESS_COMPLETE:
        setCurrentEvent('complete');
        break;
      case TRY_ANOTHER:
        // suppress browser ext;
        document.querySelector('.dialog-close')?.click();
        localStorage.removeItem('fricBrowExt');
        window.modalDisplayed = false;
        break;
      case CONVERSION_START:
        if (verb === 'rotate-pages') handleResize();
        break;
      case CONVERSION_COM:
        setCurrentEvent('complete');
        if (reviewBlock[0]) { reviewBlock[0].classList = FADE; };
        break;
      case PREVIEW_GEN:
        setCurrentEvent('preview');
        if (verb === 'rotate-pages') showContent();
        if (reviewBlock[0]) { reviewBlock[0].classList = FADE; };
        break;
      case PREVIEW_DIS:
        setCurrentEvent('preview');
        if (verb === 'rotate-pages') showContent();
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
