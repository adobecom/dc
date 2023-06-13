import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';

const { default: init } = await import(
  '../../../acrobat/scripts/alloy/browserExt'
);

describe('Alloy browserExt', () => {
  beforeEach(() => {
    window._satellite = {
      track: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  ['modalClosed', 'modalExist', 'modalAlready', 'modalGetExtension'].forEach(
    (event) => {
      ['Chrome', 'Microsoft Edge'].forEach((browser) => {
        it('initiates Alloy browerExt', () => {
          init(event, browser);
          expect(window._satellite.track.calledOnce).to.be.true;
          const extension = {
            Chrome: 'Chrome-extension',
            'Microsoft Edge': 'MSFT-Edge-extension',
          }[browser];
          expect(
            window._satellite.track.args[0][1].data._adobe_corpnew.digitalData
              .primaryEvent.eventInfo.eventName
          ).to.include(extension);
        });
      });
    }
  );
});
