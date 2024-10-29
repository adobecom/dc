export const mockHtmlRewritingStream = jest.fn();
export const mockOnElement = jest.fn().mockImplementation((elem, fn) => {
  let el =  {
    getAttribute: jest.fn().mockImplementation(() => '1.0'),
    append: jest.fn(),
    replaceWith: jest.fn(),
  };
  if (elem !== '.unity.workflow-acrobat') {
    fn(el);
  }  
  return {
    selector: String,
    handler: Element()
  };
});
export const mockReadableStream = jest.fn().mockReturnThis();
export const mockWritableStream = jest.fn().mockReturnThis();
export const mockWritableStreamPipeThrough = jest.fn().mockReturnThis();
export const mockAfter = jest.fn();
export const mockAppend = jest.fn();
export const mockBefore = jest.fn();
export const mockGetAttribute = jest.fn();
export const mockPrepend = jest.fn();
export const mockRemoveAttribute = jest.fn();
export const mockReplaceChildren = jest.fn();
export const mockReplaceWith = jest.fn();
export const mockSetAttribute = jest.fn();

export const Element = jest.fn().mockImplementation(() => {
  return {
    after: mockAfter,
    append: mockAppend,
    before: mockBefore,
    getAttribute: mockGetAttribute,
    prepend: mockPrepend,
    removeAttribute: mockRemoveAttribute,
    replaceChildren: mockReplaceChildren,
    replaceWith: mockReplaceWith,
    setAttribute: mockSetAttribute
  };
});

export const HtmlRewritingStream = mockHtmlRewritingStream.mockImplementation(
  () => {
    return {
      readableStream: mockReadableStream,
      writableStream: mockWritableStream,
      onElement: mockOnElement
    };
  }
);

export const ReadableStream = jest.fn().mockImplementation(() => {
  return {
    pipeThrough: mockWritableStreamPipeThrough
  };
});

export const WritableStream = jest.fn().mockImplementation(() => {
  return {
    pipeThrough: mockWritableStreamPipeThrough
  };
});