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

const isProd = true;

// Start with the hash value for the IE/Trident inline script
const scriptHashes = ['\'sha256-ppkx2kFovnKNr1hP8XV2hWwWaRR9Gz5JRHa4/dY8xzg=\''];

const origin = isProd ? 'https://www.adobe.com' : 'https://www.stage.adobe.com';
const acrobat = isProd ? 'https://acrobat.adobe.com' : 'https://stage.acrobat.adobe.com';
const pdfnow = isProd ? 'https://pdfnow-stage.adobe.io' : 'https://pdfnow.adobe.io';

export async function responseProvider(request) {
  const path = request.path.split('/');
  const first = path.splice(1, 1);
  const locale = localeMap[first];
  const last = path.splice(-1)[0].split('.')[0];
  const verb = verbMap[last] || last;
  const rewriter = new HtmlRewritingStream();
  let incomingHeaderLength = -1;
  let trimmedHeaderLength = -1;
  let csp = '';

  const fetchFrictionlessPage = async () => {
    // Setup: Fetch a stream containing HTML
    const path = `${origin}${request.path}.html`;
    const headers = {'X-EW-Frictionless-Page': ['true']};
    const htmlResponse = await httpRequest(
      path,
      headers,
    );
    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch doc: ${path} status=${htmlResponse?.status}`);
    }

    // Make preliminary pass through the content to capture version metadata
    const firstPassRewriter = new HtmlRewritingStream();
    let version, widgetVersion;
    const prefix = isProd ? '' : 'stg-';
    firstPassRewriter.onElement(`meta[name="${prefix}dc-widget-version"]`, el => {
      widgetVersion = el.getAttribute('content');
    });
    firstPassRewriter.onElement(`meta[name="${prefix}dc-generate-cache-version"]`, el => {
      version = el.getAttribute('content');
    });

    const nullWriter = new WritableStream({
      write() {},
      close() {},
    });

    const [preParseStream, responseStream] = htmlResponse.body.tee();
    await preParseStream.pipeThrough(firstPassRewriter).pipeTo(nullWriter);

    // Strip headers which should not be forwarded
    const responseHeaders = htmlResponse.getHeaders();
    incomingHeaderLength = JSON.stringify(responseHeaders).length;
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
    trimmedHeaderLength = JSON.stringify(responseHeaders).length;

    return [responseStream, responseHeaders, version, widgetVersion];
  };

  const fetchResource = async path => {
    const response = await httpRequest(origin + path);
    if (response.ok) {
      return response.text();
    }
    throw new Error(`Failed to fetch resource: ${path} status: ${response.status}`);
  };

  const fetchFrictionlessPageAndInlineSnippet = async () => {
    const [responseStream, responseHeaders, version, widgetVersion] = await fetchFrictionlessPage();

    if (!verb || !locale || !version || !widgetVersion) {
      throw new Error('Missing metadata');
    }

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

    const dcCoreVersion = widgetVersion.split("_")[0];

    return [responseStream, responseHeaders, dcCoreVersion];
  };

  const fetchAndInlineScripts = async () => {
    const [
      scripts,
      dcConverter,
    ] = await Promise.all([
      fetchResource('/acrobat/scripts/scripts.js'),
      fetchResource('/acrobat/blocks/dc-converter-widget/dc-converter-widget.js'),
    ])

    // Inline dc-converter-widget.js and scripts.js. Remove modular definition and import.
    // Change relative paths to absolute. Remove JS-driven CSP in favor of HTTP header.
    const inlineScript = dcConverter
      .replace('export default', 'const dcConverter = ')
      .replace('import(\'../../scripts/frictionless.js\')', 'import(\'/acrobat/scripts/frictionless.js\')')
    + scripts
      .replace('const { default: dcConverter } = await import(`../blocks/${blockName}/${blockName}.js`);', '')
      .replace('await import(\'./contentSecurityPolicy/csp.js\')', '{default:()=>{}}')
      .replace('await import(\'./dcLana.js\')', 'await import(\'/acrobat/scripts/dcLana.js\')')

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

  const fetchAndInlineStyles = async () => {
    const [
      dcStyles,
      miloStyles
    ] = await Promise.all([
      fetchResource('/acrobat/styles/styles.css'),
      fetchResource('/libs/styles/styles.css'),
    ]);

    rewriter.onElement('head', el => {
      el.append(`<style id="inline-milo-styles">${miloStyles}</style>`)
      el.append(`<style id="inline-dc-styles">${dcStyles}</style>`)
    });
  };

  let debugCount = 0;
  try {
    const [
      [responseStream, responseHeaders, dcCoreVersion],
    ] = await Promise.all([
      fetchFrictionlessPageAndInlineSnippet(),
      fetchAndInlineScripts(),
      fetchAndInlineStyles(),
    ]);

    // TODO: revisit cache TTL, TTL and handling on error

    csp = contentSecurityPolicy(isProd, scriptHashes);
    debugCount++;
    const headers = {
      ...responseHeaders,
      'Content-Security-Policy': csp,
      Link: `<${acrobat}>;rel="preconnect",\
      <https://auth.services.adobe.com>;rel="preconnect",\
      <${pdfnow}>;rel="preconnect",\
      <https://assets.adobedtm.com>;rel="preconnect",\
      <https://use.typekit.net>;rel="preconnect",\
      <${acrobat}/dc-core/${dcCoreVersion}/dc-core.js>;rel="preload";as="script",\
      <${acrobat}/dc-core/${dcCoreVersion}/dc-core.css>;rel="preload";as="style",\
      `
    };

    return createResponse(
      200,
      headers,
      responseStream.pipeThrough(rewriter),
    );
  } catch (error) {
    return createResponse(500, {}, `Error: ${error.toString()} message=${error.message} stack=${error.stack} debugCount=${debugCount}\nincoming header length is ${incomingHeaderLength} trimmed header length is ${trimmedHeaderLength} csp length is ${csp.length}`);
  }
}
