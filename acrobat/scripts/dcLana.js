export default function lanaLogging() {
  const lanaOptions = {
    sampleRate: 1,
  };
  // DC Converter Logging
  window.addEventListener('DC_Hosted:Ready', () => {
    const LANA_DC_WIDGET = document.querySelectorAll('[class*=ErrorDisplay]');
    LANA_DC_WIDGET.forEach((lanaDcw) => {
      if (lanaDcw.querySelector('[class*=ErrorDisplay]')) {
        lanaOptions.tags = 'Cat=DxDC_Frictionless,origin=milo';
        window.lana.log('DC Widget Failed ¶ Reason: Error', lanaOptions);
      }
    });
  });

  setTimeout(() => {
    if (!window.dc_hosted) {
      lanaOptions.tags = 'Cat=DxDC_Frictionless,origin=milo';
      window.lana.log('DC Widget Didn\'t Load ¶ Reason: DC Hosted did not load', lanaOptions);
    }
  }, 10000);
}
