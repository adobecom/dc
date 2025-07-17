export default function lanaLogging() {
  const fricPage = document.querySelector('meta[name="dc-widget-version"]');
  const lanaOptions = { sampleRate: 1 };

  const lanaCspOptions = { sampleRate: 0.001 };

  window.dcwErrors?.forEach((error) => {
    lanaOptions.tags = 'DC_Milo,Frictionless';
    window.lana?.log(error, lanaOptions);
  });

  // Content Security Policy Logging
  if (fricPage) {
    window.cspErrors?.forEach((error) => {
      lanaCspOptions.tags = 'DC_Milo,Frictionless,CSP';
      window.lana?.log(error, lanaCspOptions);
    });
    document.addEventListener('securitypolicyviolation', (e) => {
      lanaCspOptions.tags = 'DC_Milo,Frictionless,CSP';
      window.lana?.log(`${e.violatedDirective} violation ¶ Refused to load content from ${e.blockedURI}`, lanaCspOptions);
    });
  }
}
