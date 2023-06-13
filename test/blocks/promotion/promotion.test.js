import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { waitForElement, delay } from '../../helpers/waitfor.js';

let meta = document.createElement('meta');
meta.name = 'promotion';
meta.content = 'ccx-acrobat-links1';
document.getElementsByTagName('head')[0].appendChild(meta);
let head = await readFile({ path: './mocks/head.html' });
let body = await readFile({ path: './mocks/body.html' });
let bodyEmpty = await readFile({ path: './mocks/body_empty.html' });
await import('../../../acrobat/scripts/scripts');
const { default: init, promotionFromMetadata } = await import(
  '../../../acrobat/blocks/promotion/promotion'
);

describe('promotion block', () => {
  beforeEach(() => {
    document.head.innerHTML = head;    
  });

  afterEach(() => {
    sinon.restore();
  });

  it('shoud creates a promotion block', async () => {
    document.body.innerHTML = body;
    const block = await waitForElement('.promotion');
    const fetchText = await readFile({ path: './mocks/fetch.html' });
    sinon.stub(window, 'fetch');
    var res = new window.Response(fetchText, {
      status: 200
    });
    window.fetch.returns(Promise.resolve(res));
    await init(block);    
    const promotion = await waitForElement('.promotion');
    expect(promotion.textContent).to.contain('Do more with Adobe Creative Cloud.');
  });

  it('has an empty promotion block after fetch empty', async () => {
    document.body.innerHTML = body;
    const block = await waitForElement('.promotion');
    sinon.stub(window, 'fetch');
    var res = new window.Response('', {
      status: 200
    });
    window.fetch.returns(Promise.resolve(res));
    await init(block);    
    const promotion = await waitForElement('.promotion');
    expect(promotion.textContent).to.contain('');
  });

  it('has an empty promotion block after fetch error', async () => {
    document.body.innerHTML = body;
    const block = await waitForElement('.promotion');
    sinon.stub(window, 'fetch');
    var res = new window.Response('File not found', {
      status: 404
    });
    window.fetch.returns(Promise.resolve(res));
    await init(block);    
    const promotion = await waitForElement('.promotion');
    expect(promotion.textContent).to.contain('');
  });

  it('creates a promotion block from metadata', async () => {
    document.body.innerHTML = bodyEmpty;
    await promotionFromMetadata('Abc');    
    const promotion = await waitForElement('.promotion');
    expect(promotion.dataset.promotion).to.eql('abc');
  });    
});
