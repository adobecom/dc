import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/mobile-widget'
);

describe('Alloy mobile-widget', () => {
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

  it('initiates alloy mobile-widget', () => {
    const verb = 'sign-pdf';

    init(verb);

    expect(window._satellite.track.calledOnce).to.be.true;
  });
});
