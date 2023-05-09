export default function lanaLogging() {
  const fricPage = document.querySelector('meta[name="dc-widget-version"]');
  const lanaOptions = {
    sampleRate: 1,
  };

  const lanaCspOptions = {
    sampleRate: 0.1,
  };

  // DC Converter Logging
  window.addEventListener('DC_Hosted:Ready', () => {
    const LANA_DC_WIDGET = document.querySelectorAll('[class*=ErrorDisplay]');
    LANA_DC_WIDGET.forEach((lanaDcw) => {
      if (fricPage && lanaDcw.querySelector('[class*=ErrorDisplay]')) {
        lanaOptions.tags = 'Cat=DxDC_Frictionless,origin=milo';
        window.lana.log('DC Widget Failed ¶ Reason: Error', lanaOptions);
      }
    });
  });

  setTimeout(() => {
    if (fricPage && !window.dc_hosted) {
      lanaOptions.tags = 'Cat=DxDC_Frictionless,origin=milo';
      window.lana.log('DC Widget Didn\'t Load ¶ Reason: DC Hosted did not load', lanaOptions);
    }
  }, 10000);

  // Content Security Policy Logging
  if (fricPage) {
    window.cspErrors.forEach((error) => { 
      lanaCspOptions.tags = 'Cat=DxDC_Frictionless_CSP,origin=milo';
      window.lana.log(error, lanaCspOptions);
    })
  
    document.addEventListener("securitypolicyviolation", (e) => {
      lanaCspOptions.tags = 'Cat=DxDC_Frictionless_CSP,origin=milo';
      window.lana.log(`${e.violatedDirective} violation ¶ Refused to load content from ${e.blockedURI}`, lanaCspOptions);
    }); 
  }
}
