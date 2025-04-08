import { crypto } from 'crypto';
import { HtmlRewritingStream } from 'html-rewriter';
import { TextEncoder, btoa } from 'encoding';
import { WritableStream } from 'streams';
import { createResponse } from 'create-response';
import { httpRequest } from 'http-request';
//import { logger } from 'log';
import localeMap from './utils/locales.js';
import verbMap from './utils/verbs.js';
import contentSecurityPolicy from './utils/csp/index.js';

export async function responseProvider(request) {
  const path = request.path.split('/');
  const first = path.splice(1, 1);
  const locale = localeMap[first];
  const last = path.splice(-1)[0].split('.')[0];
  const verb = verbMap[last] || last;
  const origin = `${request.scheme}://${request.host}`;
  const isProd = request.host === 'www.adobe.com';
  const rewriter = new HtmlRewritingStream();

  const fetchFrictionlessPage = async () => {
    // Setup: Fetch a stream containing HTML
    const path = `${origin}${request.path}.html`;
    const headers = {'X-EW-Frictionless-Page': ['true']};
    const htmlResponse = await httpRequest(
      path,
      {headers},
    );
    if (!htmlResponse.ok) {
      const err = new Error(`Failed to fetch doc: ${path}`);
      err.body = htmlResponse.body;
      err.status = htmlResponse.status;
      throw err;
    }

    // Make preliminary pass through the content to capture version metadata
    const firstPassRewriter = new HtmlRewritingStream();
    let version, widgetVersion, mobileWidget, unityWorkflow;
    const prefix = isProd ? '' : 'stg-';
    firstPassRewriter.onElement(`meta[name="${prefix}dc-widget-version"]`, el => {
      widgetVersion = el.getAttribute('content');
    });
    firstPassRewriter.onElement(`meta[name="${prefix}dc-generate-cache-version"]`, el => {
      version = el.getAttribute('content');
    });
    firstPassRewriter.onElement('meta[name="mobile-widget"]', el => {
      mobileWidget = el.getAttribute('content');
    });
    firstPassRewriter.onElement('.unity.workflow-acrobat', el => {
      unityWorkflow = true;
    });    
    const nullWriter = new WritableStream({
      write() {},
      close() {},
    });

    const [preParseStream, responseStream] = htmlResponse.body.tee();
    await preParseStream.pipeThrough(firstPassRewriter).pipeTo(nullWriter);

    // Strip headers which should not be forwarded
    const responseHeaders = htmlResponse.getHeaders();
    for (const prop of [
      'accept-encoding',
      'cache-control',
      'content-encoding',
      'content-length',
      'connection',
      'keep-alive',
      'link',
      'proxy-authenticate',
      'proxy-authorization',
      'te',
      'trailers',
      'transfer-encoding',
      'upgrade',
      'vary',
    ]) {
      delete responseHeaders[prop];
    }

    return [responseStream, responseHeaders, version, widgetVersion, mobileWidget, unityWorkflow];
  };

  const fetchResource = async path => {
    const response = await httpRequest(origin + path);
    if (response.ok) {
      return response.text();
    }
    throw new Error(`Failed to fetch resource: ${path} status: ${response.status}`);
  };

  const fetchFrictionlessPageAndInlineSnippet = async () => {
    const [responseStream, responseHeaders, version, widgetVersion, mobileWidget, unityWorkflow] = await fetchFrictionlessPage();

    if (!verb || !locale || !version || !widgetVersion) {
      throw new Error('Missing metadata');
    }

    if (!(mobileWidget && request.device.isMobile) && !unityWorkflow) {
      const snippet =
        await fetchResource(`/dc/dc-generate-cache/dc-hosted-${version}/${verb}-${locale}.html`);
      const snippetHead = snippet.substring(snippet.indexOf('<head>')+6, snippet.indexOf('</head>'));
      const snippetBody = snippet.substring(snippet.indexOf('<body>')+6, snippet.indexOf('</body>'));

      rewriter.onElement('head', el => {
        el.append(snippetHead);
      });
      rewriter.onElement('div.dc-converter-widget', el => {
        el.append(`<section id="edge-snippet">${snippetBody}</section>`);
      });
    }
    const dcCoreVersion = widgetVersion.split("_")[0];

    return [responseStream, responseHeaders, dcCoreVersion, mobileWidget, unityWorkflow];
  };

  const scriptHashes = [];

  const inlineScripts = async (unityWorkflow, mobileWidget, scripts, dcConverter) => {
    // Inline dc-converter-widget.js and scripts.js. Remove modular definition and import.
    // Change relative paths to absolute. Remove JS-driven CSP in favor of HTTP header.
    let inlineScript = scripts
      .replace('await import(\'./contentSecurityPolicy/csp.js\')', '{default:()=>{}}')
      .replace('await import(\'./dcLana.js\')', 'await import(\'/acrobat/scripts/dcLana.js\')');

    if (!(mobileWidget && request.device.isMobile) && !unityWorkflow) {
      inlineScript = dcConverter
        .replace('export default', 'const dcConverter = ')
        .replace('import(\'../../scripts/frictionless.js\')', 'import(\'/acrobat/scripts/frictionless.js\')')
      + inlineScript
        .replace('const { default: dcConverter } = await import(`../blocks/${blockName}/${blockName}.js`);', '')
    } 

    // Generate hash of inlined script and add to our CSP policy
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(inlineScript));
    const hash64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    scriptHashes.push(`'sha256-${hash64}'`);

    // Remove external script reference
    rewriter.onElement('script[src="/acrobat/scripts/scripts.js"]', el => {
      el.replaceWith('');
    });
    // Can't put scripts.js in HEAD, loadPage needs the BODY to be parsed.
    rewriter.onElement('body"]', el => {
      // TODO: Make more explicit markers in code
      el.append(`<script>${inlineScript}</script>`);
    });
  };

  const inlineStyles = (dcStyles, miloStyles) => {
    rewriter.onElement('head', el => {
      el.append(`<style id="inline-milo-styles">${miloStyles}</style>`)
      el.append(`<style id="inline-dc-styles">${dcStyles}</style>`)
    });
  };

  try {
    const [
      [responseStream, responseHeaders, dcCoreVersion, mobileWidget, unityWorkflow],
      scripts,
      dcConverter,
      dcStyles,
      miloStyles
    ] = await Promise.all([
      fetchFrictionlessPageAndInlineSnippet(),
      fetchResource('/acrobat/scripts/scripts.js'),
      fetchResource('/acrobat/blocks/dc-converter-widget/dc-converter-widget.js'),
      fetchResource('/acrobat/styles/styles.css'),
      fetchResource('/libs/styles/styles.css'),
    ]);

    await inlineScripts(unityWorkflow, mobileWidget, scripts, dcConverter);
    inlineStyles(dcStyles, miloStyles);

    const csp = contentSecurityPolicy(isProd, scriptHashes);
    const acrobat = isProd ? 'https://acrobat.adobe.com' : 'https://stage.acrobat.adobe.com';
    const pdfnow = isProd ? 'https://pdfnow.adobe.io' : 'https://pdfnow-stage.adobe.io';
    const adobeid = isProd ? 'https://adobeid-na1.services.adobe.com' : 'https://adobeid-na1-stg1.services.adobe.com';

    let headerLink = [
        `<${adobeid}>;rel="preconnect"`,
        '<https://assets.adobedtm.com>;rel="preconnect"',
        '<https://use.typekit.net>;rel="preconnect"',
        `</libs/deps/imslib.min.js>;rel="preload";as="script"`,
    ];
    if (!(mobileWidget && request.device.isMobile)) {
      if (unityWorkflow) {
        headerLink = [...headerLink,
          `</unitylibs/core/workflow/workflow.js>;rel="preload";as="script";crossorigin="anonymous"`,
          `</unitylibs/scripts/utils.js>;rel="preload";as="script";crossorigin="anonymous"`,
          `</unitylibs/core/workflow/workflow-acrobat/action-binder.js>;rel="preload";as="script";crossorigin="anonymous"`,
          `</acrobat/blocks/unity/unity.js>;rel="preload";as="script";crossorigin="anonymous"`,
          `</acrobat/blocks/unity/unity.css>;rel="preload";as="style"`,
        ];
      } else {
        headerLink = [...headerLink,
          `<${acrobat}>;rel="preconnect"`,
          `<${pdfnow}>;rel="preconnect"`,
          `<${acrobat}/dc-core/${dcCoreVersion}/dc-core.js>;rel="preload";as="script"`,
          `<${acrobat}/dc-core/${dcCoreVersion}/dc-core.css>;rel="preload";as="style"`,
        ];
      }
    }
    headerLink = headerLink.join();

    const headers = {
      ...responseHeaders,
      'Content-Security-Policy': csp,
      Link: headerLink
    };

    return createResponse(
      200,
      headers,
      responseStream.pipeThrough(rewriter),
    );
  } catch (error) {
    return createResponse(error.status ?? 500, {}, error.body ?? error.message);
  }
}

export function onClientRequest (request) {
  request.setVariable('PMUSER_DEVICETYPE', 'Desktop');
  if (request.device.isMobile) {
    request.setVariable('PMUSER_DEVICETYPE', 'Mobile');
  } else if (request.device.isTablet) {
    request.setVariable('PMUSER_DEVICETYPE', 'Tablet');
  }
  request.cacheKey.includeVariable('PMUSER_DEVICETYPE');
}