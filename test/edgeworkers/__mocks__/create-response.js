export const createResponse = jest.fn().mockImplementation((status, headers, body) => {
    return {
      status,
      headers,
      body,
    };
  });
