import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init, sendAnalyticsToSplunk } = await import(
  '../../../acrobat/scripts/alloy/verb-widget'
);

describe('Alloy verb-widget', () => {
  let xhr;

  beforeEach(() => {
    sinon.stub(window, 'fetch');
    window.fetch.callsFake((x) => {
      if (x.startsWith('https://splunk.adobe.com/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      if (x.startsWith('https://failed.adobe.com/')) {
        throw new Error('Failed to send analytics to Splunk');
      }
      return window.fetch.wrappedMethod.call(window, x);
    });
    xhr = sinon.useFakeXMLHttpRequest();
    window._satellite = {
      track: sinon.stub(),
    };
    window.lana = { log: sinon.stub() };
    window.adobeIMS = { getAccessToken: () => null, isSignedInUser: () => false };
    window.alloy_getIdentity = Promise.resolve({ identity: { ECID: 'test-ecid' } });
  });

  afterEach(() => {
    xhr.restore();
    sinon.restore();
  });

  it('initiates alloy verb-widget', () => {
    const eventName = 'verb-widget-show';
    const verb = 'sign-pdf';
    const metaData = 'test comment';
    const documentUnloading = false;

    init(eventName, verb, metaData, documentUnloading);

    expect(window._satellite.track.calledOnce).to.be.true;
  });

  it('test sendAnalyticsToSplunk', () => {
    const eventName = 'verb-widget-show';
    const verb = 'sign-pdf';
    const metaData = 'test comment';
    const splunkEndpoint = 'https://splunk.adobe.com/';

    sendAnalyticsToSplunk(eventName, verb, metaData, splunkEndpoint);

    expect(window.fetch.calledOnce).to.be.true;
    expect(window.lana.log.calledOnce).to.be.false;
  });

  it('test sendAnalyticsToSplunk failure', () => {
    const eventName = 'verb-widget-show';
    const verb = 'sign-pdf';
    const metaData = 'test comment';
    const splunkEndpoint = 'https://failed.adobe.com/';

    sendAnalyticsToSplunk(eventName, verb, metaData, splunkEndpoint);

    expect(window.fetch.calledOnce).to.be.true;
    expect(window.lana.log.calledOnce).to.be.true;
  });
});
