const UPLOAD_START = 'file-upload-start';
const PROCESS_START = 'processing-start';
const UPLOAD_COMPLETE = 'file-upload-complete';
const PROCESS_CANCELED = 'processing-cancelled';
const PROCESS_COMPLETE = 'processing-complete';
const DOWNLOAD_START = 'download-start';
const CONVERSION_COM = 'conversion-complete';
const PREVIEW_GEN = 'preview-generating';
const DROPZONE_DIS = 'dropzone-displayed';
const UPSELL_DIS = 'upsell-displayed';


export default function init(element) {
  const wrapper = element;
  const setCurrentEvent = (event) => {
    console.log('set it to ' + event);

    if (document.querySelectorAll(`[data-event-name="${event}"]`).length > 0) {
        document.body.dataset.currentEvent = event;
      }
    };

  const handleEvents = (e, jobData, converter, verb) => {
    console.log(e);
    switch (e) {
      case PROCESS_START:
          setCurrentEvent('start');
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
      case PROCESS_COMPLETE:
          setCurrentEvent('complete');
          break;
      case CONVERSION_COM:
          setCurrentEvent('conversion');
          break;
      case PREVIEW_GEN:
          setCurrentEvent('preview');
          break;
      case DOWNLOAD_START:
          setCurrentEvent('download');
          break;
      default:
          break;
    }
  }
  const CONVERTER = document.querySelector('#adobe_dc_sdk_launcher');
  const VERB = CONVERTER.dataset.verb;
  window.dc_hosted.addEventListener((e, jobData) => handleEvents(e, jobData, CONVERTER, VERB));




  //set data attributes
  console.log(wrapper.classList[1]);
  wrapper.dataset.eventName = wrapper.classList[1];
}
