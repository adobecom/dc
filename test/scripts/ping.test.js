/* eslint-disable compat/compat */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('PingService', () => {
  let PingService;
  let USER_TYPE;
  let fetchStub;

  // Helper function to create a PingService instance with common defaults
  const createPingService = (overrides = {}) => {
    const defaults = {
      locale: 'en-us',
      config: { serverEnv: 'prod', appName: 'test', appVersion: '1.0', appReferrer: '' },
      userId: '',
      isSignedIn: false,
      userType: USER_TYPE.ANON,
      subscriptionType: 'unspecified',
    };
    return new PingService({ ...defaults, ...overrides });
  };

  // Helper function to stub geo service response (for country detection only)
  const stubGeoService = (country) => {
    fetchStub.resolves({
      ok: country !== null,
      json: async () => ({ country }),
    });
  };

  // Helper function to stub geo service with ping tracking
  const stubGeoServiceWithPings = (country) => {
    let callCount = 0;
    fetchStub.callsFake((url) => {
      callCount += 1;
      if (url === 'https://geo2.adobe.com/json/') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ country }),
        });
      }
      return Promise.resolve({ status: 200 });
    });
    return () => callCount;
  };

  // Helper to test country detection
  const testCountryDetection = async (country, expectedResult) => {
    stubGeoService(country);
    const pingService = createPingService({ locale: country ? `en-${country.toLowerCase()}` : 'en-us' });
    const result = await pingService.getCountryFromGeoService();
    expect(result).to.equal(expectedResult);
  };

  // Helper to test blocked pings for restricted countries
  const testBlockedPings = async (country, locale = 'en-gb') => {
    stubGeoService(country);
    const pingService = createPingService({ locale });
    await pingService.sendPingEvent({ appPath: 'unity-dc-frictionless', schema: {} });

    // Should only call geo service, no ping API calls
    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[0]).to.equal('https://geo2.adobe.com/json/');
  };

  // Helper to test allowed pings for non-restricted countries
  const testAllowedPings = async (country, locale, minCalls = 2) => {
    const getCallCount = stubGeoServiceWithPings(country);
    const pingService = createPingService({ locale });
    await pingService.sendPingEvent({ appPath: 'unity-dc-frictionless', schema: {} });

    const callCount = getCallCount();
    expect(callCount).to.be.at.least(minCalls);
    expect(fetchStub.firstCall.args[0]).to.equal('https://geo2.adobe.com/json/');
  };

  before(async () => {
    const pingModule = await import('../../acrobat/scripts/ping.js');
    PingService = pingModule.PingService;
    USER_TYPE = pingModule.USER_TYPE;
  });

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    fetchStub.restore();
    sinon.restore();
  });

  describe('Country Detection and GB/UK Handling', () => {
    it('should detect GB country correctly', async () => {
      await testCountryDetection('GB', 'gb');
    });

    it('should detect UK country correctly', async () => {
      await testCountryDetection('UK', 'uk');
    });

    it('should return null when geo service fails', async () => {
      await testCountryDetection(null, null);
    });

    it('should return null when geo service throws error', async () => {
      fetchStub.rejects(new Error('Network error'));
      const pingService = createPingService();
      const country = await pingService.getCountryFromGeoService();
      expect(country).to.be.null;
    });

    it('should NOT send pings for GB country', async () => {
      await testBlockedPings('GB');
    });

    it('should NOT send pings for UK country', async () => {
      await testBlockedPings('UK');
    });

    it('should NOT send pings when country is null', async () => {
      await testBlockedPings(null, 'en-us');
    });
  });

  describe('Non-GB/UK Countries', () => {
    it('should attempt to send pings for US country', async () => {
      await testAllowedPings('US', 'en-us', 2);
    });

    it('should attempt to send pings for other countries', async () => {
      await testAllowedPings('DE', 'de-de', 1);
    });
  });

  describe('PingService Configuration', () => {
    it('should initialize with correct config', () => {
      const pingService = createPingService({
        userId: 'test-user-123',
        isSignedIn: true,
        userType: USER_TYPE.SIGNEDIN,
        subscriptionType: 'paid',
      });

      expect(pingService.locale).to.equal('en-us');
      expect(pingService.userId).to.equal('test-user-123');
      expect(pingService.isSignedIn).to.be.true;
      expect(pingService.userType).to.equal(USER_TYPE.SIGNEDIN);
      expect(pingService.subscriptionType).to.equal('paid');
    });

    it('should handle anonymous user config', () => {
      const pingService = createPingService();

      expect(pingService.userId).to.equal('');
      expect(pingService.isSignedIn).to.be.false;
      expect(pingService.userType).to.equal(USER_TYPE.ANON);
    });
  });
});
