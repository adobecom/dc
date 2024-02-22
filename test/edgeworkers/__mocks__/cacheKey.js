export const mockExcludeQueryString = jest.fn();
export const mockIncludeQueryString= jest.fn();
export const mockIncludeQueryArgument = jest.fn();
export const mockIncludeCookie = jest.fn();
export const mockIncludeHeader = jest.fn();
export const mockIncludeVariable = jest.fn();

const CacheKey = jest.fn().mockImplementation(() => {
  return {
    excludeQueryString: mockExcludeQueryString,
    includeQueryString: mockIncludeQueryString,
    includeQueryArgument: mockIncludeQueryArgument,
    includeCookie: mockIncludeCookie,
    includeHeader: mockIncludeHeader,
    includeVariable: mockIncludeVariable
    };
});

export default CacheKey;