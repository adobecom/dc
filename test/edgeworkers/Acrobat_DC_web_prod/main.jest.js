
import Request from "request";
import { responseProvider as replaceResponseProvider } from "../../../edgeworkers/Acrobat_DC_web_prod/main.js";
import { onClientRequest } from "../../../edgeworkers/Acrobat_DC_web_prod/main.js";
import { createResponse } from "create-response";
import { httpRequest } from "http-request";
import { HttpResponsePdf } from "response-pdf";
import { HttpResponseWidgetCache } from "response-widget-cache";
import { HttpResponseWidget } from "response-widget";
import { HttpResponseScripts } from "response-scripts";
import { HttpResponseStyles } from "response-styles";
import { HttpResponseMiloStyles } from "response-milo-styles";
import { HttpResponse404 } from "response-404";
import { mockOnElement } from "html-rewriter";


describe("EdgeWorker that consumes an HTML document and rewrites it", () => {
  let fetches;
  let resource404 = false

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
        if (resource404 === true) {
          response = new HttpResponse404();
        } else {
          response = new HttpResponseMiloStyles();
        }
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
    resource404 = false;
  });

  it("responseProvider", async () => {
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
        'https://www.adobe.com/dc/dc-generate-cache/dc-hosted-1.0/pdf-to-ppt-en-us.html'
      ]);
    });
  });

  it("responseProvider ROW", async () => {
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
        'https://www.adobe.com/dc/dc-generate-cache/dc-hosted-1.0/pdf-to-ppt-ja-jp.html'
      ]);
    });
  });  

  it("responseProvider Mobile", async () => {
    let requestMock = new Request({path: '/acrobat/online/pdf-to-ppt', device: 'Mobile'});

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
        'https://www.adobe.com/libs/styles/styles.css'
      ]);
    });
  });

  it("404 exception", async () => {
    let requestMock = new Request({path: '/404/online/pdf-to-ppt'});

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(404);
    });
  });

  it("resource 404 exception", async () => {
    let requestMock = new Request({path: '/acrobat/online/pdf-to-ppt'});
    resource404 = true;

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(500);
      expect(response.body).toContain('Failed to fetch resource: /libs/styles/styles.css status: 404');
    });
  });    

  it("missing metadata exception", async () => {
    let requestMock = new Request({path: '/acrobat/online/pdf-to-ppt'});
    mockOnElement.mockImplementation((elem, fn) => {
      let el =  {
        getAttribute: jest.fn().mockImplementation(() => undefined),
      };
    });

    const responsePromise = replaceResponseProvider(requestMock);
    responsePromise.then(response => {
      expect(response.status).toEqual(500);
      expect(response.body).toContain('Missing metadata');
    });
  });

  it("onClientReqest", async () => {
    let requestMock = new Request({path: '/acrobat/online/pdf-to-ppt'});

    onClientRequest(requestMock);
    expect(requestMock.setVariable).toBeCalledWith('PMUSER_DEVICETYPE', 'Desktop');
    expect(requestMock.cacheKey.includeVariable).toBeCalledWith('PMUSER_DEVICETYPE');

    requestMock = new Request({path: '/acrobat/online/pdf-to-ppt', device: 'Mobile'});

    onClientRequest(requestMock);
    expect(requestMock.setVariable).toBeCalledWith('PMUSER_DEVICETYPE', 'Mobile');

    requestMock = new Request({path: '/acrobat/online/pdf-to-ppt', device: 'Tablet'});

    onClientRequest(requestMock);
    expect(requestMock.setVariable).toBeCalledWith('PMUSER_DEVICETYPE', 'Tablet');    
  });  
});
