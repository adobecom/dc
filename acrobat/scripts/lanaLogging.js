export function lanaLogging(element) {
  const lanaOptions = {
    clientId: 'dxdc',
    sampleRate: 1,
  };
  // Non Production Settings
  if (location.hostname !== 'www.adobe.com') {
    lanaOptions.debug = true;
    lanaOptions.useProd = false;
  }
  if(element) {
    element.forEach((currentWidget) => {
      const DC_WIDGET = currentWidget.querySelectorAll('[class*=ErrorDisplay]');
      DC_WIDGET.forEach((widget) => {
        setTimeout(() => {
          if (widget.querySelector('[class*=ErrorDisplay]')) {
            lanaOptions.tags = 'Cat=DxDC_Frictionless';
            window.lana.log('DC Widget Failed ¶ Reason: Error', lanaOptions);
          }
          if (!window.dc_hosted) {
            lanaOptions.tags = 'Cat=DxDC_Frictionless';
            window.lana.log('DC Widget Didn\'t Load ¶ Reason: DC Hosted did not load', lanaOptions);
          }
        }, 1000);
      });
    });
  } else {
    window.lana.log('Widget not loaded in this page', lanaOptions);
  }
}
