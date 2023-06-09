import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/dc-converter-widget'
);

describe('Alloy dc-converter-widget', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initiates Alloy dc-converter-widget', () => {
    init();
    expect(window._satellite.track.calledOnce).to.be.true;
    expect(
      window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
        .primaryEvent.eventInfo.eventName
    ).to.equal('marquee|verb');
  });
});
