import Device from './device';
import UserLocation from './userLocation';
import CacheKey from './cacheKey';
import { ReadableStream } from './streams'

export const mockRespondWith = jest.fn();
export const mockWasTerminated = jest.fn();
export const mockGetHeader = jest.fn();
export const mockSetHeader = jest.fn();
export const mockAddHeader = jest.fn();
export const mockRemoveHeader = jest.fn();
export const mockGetHeaders = jest.fn().mockReturnValue({
  'user-agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'],
});
export const mockGetVariable = jest.fn();
export const mockSetVariable = jest.fn();
export const mockRoute = jest.fn();
export const mockJson = jest.fn();
export const mockText = jest.fn();
export const mockArrayBuffer = jest.fn();

const Request = jest.fn().mockImplementation(({path, device}) => {
  return {
    host: "www.adobe.com",
    method: "GET",
    path,
    scheme: "https",
    query: "param1=value1&param2=value2",
    url: `${path}?param1=value1&param2=value2`,
    userLocation: new UserLocation(),
    device: new Device(device),
    cpCode: 1191398,
    cacheKey: new CacheKey(),
    respondWith: mockRespondWith,
    wasTerminated: mockWasTerminated,
    getHeader: mockGetHeader,
    setHeader: mockSetHeader,
    addHeader: mockAddHeader,
    removeHeader: mockRemoveHeader,
    getHeaders: mockGetHeaders,
    getVariable: mockGetVariable,
    setVariable: mockSetVariable,
    route: mockRoute,
    json: mockJson,
    text: mockText,
    arrayBuffer: mockArrayBuffer,
    body: new ReadableStream()
  };
});

export default Request;