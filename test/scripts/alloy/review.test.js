import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
    '../../../acrobat/scripts/alloy/review'
);

describe('Alloy review', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initiates Alloy review', () => {
    init();
    expect(window._satellite.track.calledOnce).to.be.true;
    expect(
      window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
        .primaryEvent.eventInfo.eventName
    ).to.equal('productRating');
  });
});