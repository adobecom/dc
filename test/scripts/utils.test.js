/* eslint-disable compat/compat */
import { expect } from '@esm-bundle/chai';
import { setLibs } from '../../acrobat/scripts/utils.js';

describe('Test utils.js', () => {
  it('tests setLibs with hlx domain', () => {
    const libs = setLibs('/lib', new URL('https://stage--dc--adobecom.hlx.live?milolibs=test'));
    expect(libs).to.equal('https://test--milo--adobecom.hlx.live/libs');
  });

  it('tests setLibs with aem domain', () => {
    const libs = setLibs('/lib', new URL('https://stage--dc--adobecom.aem.live?milolibs=test'));
    expect(libs).to.equal('https://test--milo--adobecom.aem.live/libs');
  });
});
