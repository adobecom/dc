export default function init(element) {
  const widget = element;
  widget.querySelector('div').id = 'VERB';

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'CID';
  widgetContainer.className = 'dc-wrapper';
  widget.appendChild(widgetContainer);

  const dcScript = document.createElement('script');
  dcScript.id = 'adobe_dc_sdk_launcher';
  dcScript.setAttribute('src','https://dc.dev.dexilab.acrobat.com/dc-hosted/2.22.8_1.118.2/dc-app-launcher.js');
  dcScript.dataset.dropzone_id = 'CID';
  dcScript.dataset.locale = 'en-us';
  dcScript.dataset.server_env = 'dev';
  dcScript.dataset.verb = document.querySelector('#VERB').innerText.trim().toLowerCase();
  dcScript.dataset.load_typekit = 'false';
  dcScript.dataset.load_imslib = 'false';
  dcScript.dataset.enable_unload_prompt = 'true';

  widget.appendChild(dcScript);

  // setTimeout ( () => {
  //   widget.appendChild(dcScript)
  // }, 200)
}
