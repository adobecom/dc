
import Request from "request";
import { responseProvider as replaceResponseProvider } from "../../../edgeworkers/Acrobat_DC_web_prod/main.js";
import { createResponse } from "create-response";
import { httpRequest } from "http-request";
import { HttpResponsePdf } from "response-pdf";
import { HttpResponseWidgetCache } from "response-widget-cache";
import { HttpResponseWidget } from "response-widget";
import { HttpResponseScripts } from "response-scripts";
import { HttpResponseStyles } from "response-styles";
import { HttpResponseMiloStyles } from "response-milo-styles";
import { HttpResponse404 } from "response-404";

describe("EdgeWorker that consumes an HTML document and rewrites it", () => {
  let fetches;

  beforeAll(() => {
    httpRequest.mockImplementation((path) => {
      let response;
      fetches.push(path);

      if (path.includes('/acrobat/online')) {
        response = new HttpResponsePdf();
      } else if (path.includes('dc-generate-cache')) {
        response = new HttpResponseWidgetCache();
      } else if (path.includes('scripts.js')) {
        response = new HttpResponseScripts();
      } else if (path.includes('widget.js')) {
        response = new HttpResponseWidget();
      } else if (path.includes('/libs/styles/styles.css')) {
        response = new HttpResponseMiloStyles();
      } else if (path.includes('/acrobat/styles/styles.css')) {
        response = new HttpResponseStyles();
      } else {
        response = new HttpResponse404();
      }
      return new Promise(function(resolve) {
        resolve(response);
      })
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetches = [];
  });

  test("responseProvider", async () => {
    let requestMock = new Request({path: '/acrobat/online/pdf-to-ppt'});

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(200);
      expect(response.headers['header-to-keep']).toEqual('keep');
      expect(response.headers).not.toHaveProperty('accept-encoding');
      expect(response.headers).not.toHaveProperty('vary');
      expect(fetches).toEqual([
        'https://www.adobe.com/acrobat/online/pdf-to-ppt.html',
        'https://www.adobe.com/acrobat/scripts/scripts.js',
        'https://www.adobe.com/acrobat/blocks/dc-converter-widget/dc-converter-widget.js',
        'https://www.adobe.com/acrobat/styles/styles.css',
        'https://www.adobe.com/libs/styles/styles.css',
        'https://www.adobe.com/dc/dc-generate-cache/dc-hosted-1.0/pdf-to-ppt-en-us.html']);
    });
  });

  test("responseProvider ROW", async () => {
    let requestMock = new Request({path: '/jp/acrobat/online/pdf-to-ppt'});

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(200);
      expect(response.headers['header-to-keep']).toEqual('keep');
      expect(fetches).toEqual([
        'https://www.adobe.com/jp/acrobat/online/pdf-to-ppt.html',
        'https://www.adobe.com/acrobat/scripts/scripts.js',
        'https://www.adobe.com/acrobat/blocks/dc-converter-widget/dc-converter-widget.js',
        'https://www.adobe.com/acrobat/styles/styles.css',
        'https://www.adobe.com/libs/styles/styles.css',
        'https://www.adobe.com/dc/dc-generate-cache/dc-hosted-1.0/pdf-to-ppt-ja-jp.html']);
    });
  });  

  test("404 exception", async () => {
    let requestMock = new Request({path: '/404/online/pdf-to-ppt'});

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(500);
    });
  });  
});
