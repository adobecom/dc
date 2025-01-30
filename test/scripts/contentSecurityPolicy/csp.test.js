import { expect } from '@esm-bundle/chai';

const { default: ContentSecurityPolicy } = await import('../../../acrobat/scripts/contentSecurityPolicy/csp.js');

describe('contentSecurityPolicy csp', () => {
  it('handles securitypolicyviolation event', async () => {
    await ContentSecurityPolicy();
    const event = new CustomEvent('securitypolicyviolation');
    event.blockedURI = 'www.adobe.com';
    event.violatedDirective = 'test';
    document.dispatchEvent(event);
    expect(window.cspErrors[0]).to.eql(
      `${event.violatedDirective} violation ¶ Refused to load content from ${event.blockedURI}, Script location: ${event.sourceFile} Line: ${event.lineNumber} Column: ${event.columnNumber}`,
    );
  });
});
