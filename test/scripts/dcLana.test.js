import * as sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import lanaLogging from '../../acrobat/scripts/dcLana.js';

describe('Test dcLana script', async () => {
  let clock;

  before(() => {
    window.lana = { log: sinon.stub() };
    window.cspErrors = ['Fake Error'];
    clock = sinon.useFakeTimers();
    const mTag = document.createElement('meta');
    mTag.setAttribute('name', 'dc-widget-version');
    document.head.appendChild(mTag);
    lanaLogging();
  });

  after(() => {
    clock.restore();
  });

  it('should log errors in cspError', async () => {
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.getCall(0).args[0]).to.eq('Fake Error');
    expect(window.lana.log.getCall(0).args[1].tags).to.eq(
      'DC_Milo,Frictionless,CSP',
    );
  });

  it('should log the event securitypolicyviolation', async () => {
    const event = new CustomEvent('securitypolicyviolation');
    event.blockedURI = 'www.adobe.com';
    event.violatedDirective = 'test';
    document.dispatchEvent(event);
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.getCall(0).args[0]).to.eq(
      'test violation ¶ Refused to load content from www.adobe.com',
    );
    expect(window.lana.log.getCall(0).args[1].tags).to.eq(
      'DC_Milo,Frictionless,CSP',
    );
  });

  afterEach(() => {
    window.lana.log.resetHistory();
  });
});
