import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/mobile-widget-shown'
);

describe('Alloy mobile-widget-shown', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
    window.adobeIMS = { getAccessToken: () => null, isSignedInUser: () => false };
    window.alloy_getIdentity = Promise.resolve({ identity: { ECID: 'test-ecid' } });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initiates alloy mobile-widget-shown', async () => {
    const verb = 'sign-pdf';

    init(verb);

    await delay(1200);

    expect(window._satellite.track.calledOnce).to.be.true;
  });
});
