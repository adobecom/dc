export const TransformStream = jest.fn().mockImplementation(() => {
    return {};
});

export const ByteLengthQueuingStrategy = jest.fn().mockImplementation(() => {
    return {};
});

export const CountQueuingStrategy = jest.fn().mockImplementation(() => {
    return {};
});

// ReadableStream mock
export const mock_ReadableStream_cancel = jest.fn();
export const mock_ReadableStream_getReader = jest.fn();
//export const mock_ReadableStream_pipeThrough = jest.fn().mockReturnThis();
export const mock_ReadableStream_pipeThrough = jest.fn().mockImplementation(() => {
    return {
        pipeTo: mock_ReadableStream_pipeTo,
    }});
export const mock_ReadableStream_pipeTo = jest.fn();
//export const mock_ReadableStream_tee = jest.fn();
export const mock_ReadableStream_tee = jest.fn().mockImplementation(() => [new ReadableStream(), new ReadableStream()]);

export const ReadableStream = jest.fn().mockImplementation(() => {
    return {
        locked: false,
        cancel: mock_ReadableStream_cancel,
        getReader: mock_ReadableStream_getReader,
        pipeThrough: mock_ReadableStream_pipeThrough,
        pipeTo: mock_ReadableStream_pipeTo,
        tee: mock_ReadableStream_tee
    };
});

export const WritableStream = jest.fn().mockImplementation(() => {
    return {};
});