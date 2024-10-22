import { setLibs, getLibs } from '../../acrobat/scripts/utils';
import * as sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

describe('Test utils.js', async () => {
  it('tests setLibs', async () => {
    const libs = setLibs('/lib');
    expect(libs).to.equal('https://main--milo--adobecom.hlx.live/libs');
  });
});
