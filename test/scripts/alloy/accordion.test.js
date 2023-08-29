import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/accordion'
);

describe('Alloy accordion', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });
  [
    ['faq', 'Expand', 1, 'How do I fill out a form?'],
    ['faq', 'Expand', 3, 'How can I upload a photo of my signature?'],
    ['faq', 'Collapse', 1, 'How do I fill out a form?'],
    ['faq', 'Collapse', 3, 'How can I upload a photo of my signature?'],

  ].forEach(
    ([fragmentName, state, ctaNumber, text]) => {
      it('initiates Alloy accordion', () => {
        init(fragmentName, state, ctaNumber, text);
        const customLink = [fragmentName.toUpperCase(), state, `${ctaNumber}-${text}`].join('|');
        expect(
          window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
          .primaryEvent.eventInfo.eventName
        ).to.include(customLink);
      });
    }
  );
});
