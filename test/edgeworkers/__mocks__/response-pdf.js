import { ReadableStream } from './streams';

export const mock_HttpResponse_text = jest.fn();
export const mock_HttpResponse_json = jest.fn();
export const mock_HttpResponse_getHeader = jest.fn();
export const mock_HttpResponse_getHeaders = jest.fn().mockReturnValue({
    'accept-encoding': 'gone',
    'cache-control': 'gone',
    'content-encoding': 'gone',
    'content-length': 'gone',
    'connection': 'gone', 
    'keep-alive': 'gone',
    'link': 'gone',
    'proxy-authenticate': 'gone',
    'proxy-authorization': 'gone',
    'te': 'gone',
    'trailers': 'gone',
    'transfer-encoding': 'gone',
    'upgrade': 'gone',
    'vary': 'gone',
    'header-to-keep': 'keep'
});
export const mock_HttpResponse_get = jest.fn();

export const HttpResponsePdf = jest.fn().mockImplementation(() => {
  return {
    status: 200,
    ok: true,
    headers: {},
    body: new ReadableStream(),
    text: mock_HttpResponse_text,
    json: mock_HttpResponse_json,
    getHeader: mock_HttpResponse_getHeader,
    getHeaders: mock_HttpResponse_getHeaders,
    get: mock_HttpResponse_get,
  };
});
