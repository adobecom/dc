import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/reviewFeedback'
);

describe('Alloy reviewFeedback', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initiates Alloy reviewFeedback', () => {
    const verb = 'pdf-to-ppt';
    const rating = 2;
    const comment = 'test comment';

    init(verb, rating, comment);

    expect(window._satellite.track.calledOnce).to.be.true;

    const eventInfo =
      window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
        .primaryEvent.eventInfo;
    const interaction = eventInfo.interaction;
    const feedbackInfo =
      window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
        .feedback.feedbackInfo;
    expect(eventInfo.eventName).to.equal('productRating');
    expect(interaction.rating).to.equal(rating);
    expect(interaction.comment).to.equal(comment);
    expect(interaction.verb).to.equal(`dc/production/${verb}`);
    expect(feedbackInfo.rating).to.equal(rating);
    expect(feedbackInfo.verb).to.equal(`dc/production/${verb}`);
  });
});
