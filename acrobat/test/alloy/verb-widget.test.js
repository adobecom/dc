import { sendDirect } from '../../scripts/alloy/verb-widget.js';

describe('sendDirect', () => {
  let originalFetch;
  let originalLana;
  let mockFetch;

  beforeEach(() => {
    // Store original fetch and lana
    originalFetch = global.fetch;
    originalLana = window.lana;
    
    // Mock fetch
    mockFetch = jest.fn(() => Promise.resolve({ ok: true }));
    global.fetch = mockFetch;
    
    // Mock window properties
    window.ecid = 'test-ecid';
    window.lana = { log: jest.fn() };
  });

  afterEach(() => {
    // Restore original fetch and lana
    global.fetch = originalFetch;
    window.lana = originalLana;
  });

  it('should send analytics event to staging environment by default', () => {
    const eventName = 'test-event';
    const verb = 'test-verb';
    const metaData = {
      type: 'pdf',
      size: 1000,
      count: 1
    };

    sendDirect(eventName, verb, metaData);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://sstats.adobe.com/ee/v2/interact?dataStreamId=e065836d-be57-47ef-b8d1-999e1657e8fd',
      expect.objectContaining({
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
    );

    // Verify the request body contains expected data
    const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(requestBody.event.xdm.web.webPageDetails.name).toBe('acrobat:verb-test-verb:test-event');
    expect(requestBody.event.xdm.identityMap.ECID[0].id).toBe('test-ecid');
  });

  it('should send analytics event to production environment', () => {
    const eventName = 'test-event';
    const verb = 'test-verb';
    const metaData = {
      type: 'pdf',
      size: 1000,
      count: 1
    };

    sendDirect(eventName, verb, metaData, 'prod');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://sstats.adobe.com/ee/v2/interact?dataStreamId=913eac4d-900b-45e8-9ee7-306216765cd2',
      expect.any(Object)
    );
  });

  it('should log error when fetch fails', async () => {
    // Mock fetch to fail
    mockFetch = jest.fn(() => Promise.resolve({ ok: false }));
    global.fetch = mockFetch;

    const eventName = 'test-event';
    const verb = 'test-verb';
    const metaData = {
      type: 'pdf',
      size: 1000,
      count: 1
    };

    await sendDirect(eventName, verb, metaData);

    expect(window.lana.log).toHaveBeenCalledWith(
      'File Uploaded did not POST',
      { sampleRate: 100, tags: 'DC_Milo,Project Unity (DC)' }
    );
  });

  it('should include metadata in the event payload', () => {
    const eventName = 'test-event';
    const verb = 'test-verb';
    const metaData = {
      type: 'pdf',
      size: 1024,
      count: 1,
      errorInfo: 'test-error',
      noOfFiles: 3,
      uploadTime: 1000
    };

    sendDirect(eventName, verb, metaData);

    const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    const digitalData = requestBody.event.data._adobe_corpnew.digitalData;
    
    expect(digitalData.dcweb.content).toEqual({
      type: 'pdf',
      size: 1024,
      count: 1,
      fileType: 'pdf',
      totalSize: 1024
    });
    expect(digitalData.primaryEvent.eventInfo.eventName)
      .toBe('acrobat:verb-test-verb:test-event test-error');
  });
}); 