import { ReadableStream } from './streams';

export const mock_HttpResponse_text = jest.fn(); 
export const mock_HttpResponse_json = jest.fn();
export const mock_HttpResponse_getHeader = jest.fn();
export const mock_HttpResponse_getHeaders = jest.fn();
export const mock_HttpResponse_get = jest.fn();

export const HttpResponse404 = jest.fn().mockImplementation(() => {
  return {
    status: 404,
    ok: false,
    headers: {},
    body: new ReadableStream(),
    text: mock_HttpResponse_text,
    json: mock_HttpResponse_json,
    getHeader: mock_HttpResponse_getHeader,
    getHeaders: mock_HttpResponse_getHeaders,
    get: mock_HttpResponse_get,
  };
});
