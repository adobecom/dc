/* eslint-disable compat/compat */
import sinon from 'sinon';
import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../acrobat/blocks/rnr/rnr.js');

describe('rnr - Ratings and reviews', () => {
  beforeEach(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    localStorage.removeItem('rnr-snapshot');
    window.mph = { 'rnr-rating-tooltips': 'Poor, Below Average, Good, Very Good, Outstanding' };
    window.adobeIMS = { getAccessToken: () => {} };
    window.lana = { log: () => {} };
    const rnr = document.querySelector('.rnr');
    init(rnr);
  });

  afterEach(() => {
    if (window.fetch.restore) window.fetch.restore();
    if (window.lana.log.restore) window.lana.log.restore();
  });

  // #region General

  it('should display rnr', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    expect(containerElement).to.exist;
    expect(ratingFieldsetElement).to.exist;
  });

  it('should display rnr with missing verb', async () => {
    sinon.stub(window.lana, 'log');
    document.body.innerHTML = await readFile({ path: './mocks/body_missing_verb.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    expect(window.lana.log.getCall(0).args[0]).to.equal('Verb not configured for the rnr widget');
  });

  it('should submit form and display message', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const formElement = containerElement.querySelector('.rnr-form');
    const oneStarElement = formElement.querySelector('.rnr-rating-fieldset input');
    oneStarElement.click();
    formElement.dispatchEvent(new Event('submit'));
    const thankYouElement = containerElement.querySelector('.rnr-thank-you');
    expect(thankYouElement).to.exist;
  });

  it('should not display message on form submit with no rating', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const formElement = containerElement.querySelector('.rnr-form');
    formElement.dispatchEvent(new Event('submit'));
    const thankYouElement = containerElement.querySelector('.rnr-thank-you');
    expect(thankYouElement).to.not.exist;
  });

  it('should handle empty response', async () => {
    sinon.stub(window, 'fetch');
    sinon.stub(window.lana, 'log');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve(null),
        ok: true,
      }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    expect(window.lana.log.getCall(0).args[0]).to.equal(
      "Could not load review data: Received empty ratings data for asset 'word-to-pdf'.",
    );
  });

  it('should handle aggregate data missing', async () => {
    sinon.stub(window, 'fetch');
    sinon.stub(window.lana, 'log');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({ assetType: 'ADOBE_COM' }),
        ok: true,
      }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    expect(window.lana.log.getCall(0).args[0]).to.equal(
      "Could not load review data: Missing aggregated rating data in response for asset 'word-to-pdf'.",
    );
  });

  it('should handle failed response', async () => {
    sinon.stub(window, 'fetch');
    sinon.stub(window.lana, 'log');
    window.fetch.returns(
      Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'Failed!' }) }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    expect(window.lana.log.getCall(0).args[0]).to.equal('Could not load review data: Failed!');
  });

  it('should handle uninteractive action', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body_uninteractive.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    const star = containerElement.querySelector('input');
    expect(star.getAttribute('disabled')).to.equal('disabled');
  });

  // #endregion

  // #region Rating

  it('should handle mouseover, mouseout, and mousedown', async () => {
    const ratingFieldsetElement = await waitForElement('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    const forth = stars[3];
    const fifth = stars[4];
    forth.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 150);
    });
    expect(forth.classList.contains('is-hovering')).to.be.true;
    forth.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    forth.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 150);
    });
    expect(forth.classList.contains('is-hovering')).to.be.false;
    fifth.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    fifth.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 150);
    });
    expect(fifth.classList.contains('is-active')).to.be.true;
    forth.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    forth.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  });

  it('should apply keyboard focus class', async () => {
    const ratingFieldsetElement = await waitForElement('.rnr-rating-fieldset');
    const star = ratingFieldsetElement.querySelector('input');
    await sendKeys({ press: 'Tab' });
    expect(star.classList.contains('has-keyboard-focus')).to.be.true;
  });

  it('should select rating with keypresses', async () => {
    const ratingFieldsetElement = await waitForElement('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[0].focus();
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(stars[1]);
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(stars[2]);
    await sendKeys({ press: 'ArrowLeft' });
    expect(document.activeElement).to.equal(stars[1]);
    await sendKeys({ press: 'Enter' });
    expect(stars[1].getAttribute('aria-checked')).to.equal('true');
  });

  it('should reset stars active state on blur with no selection', async () => {
    const ratingFieldsetElement = await waitForElement('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[0].focus();
    await sendKeys({ press: 'ArrowRight' });
    await sendKeys({ press: 'ArrowRight' });
    await sendKeys({ press: 'ArrowRight' });
    expect(stars[0].classList.contains('is-active')).to.be.true;
    expect(stars[3].classList.contains('is-active')).to.be.true;
    stars[3].blur();
    expect(stars[0].classList.contains('is-active')).to.be.false;
  });

  it('should not reset stars active state on blur with selection', async () => {
    const ratingFieldsetElement = await waitForElement('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[3].focus();
    stars[3].click();
    expect(stars[0].classList.contains('is-active')).to.be.true;
    stars[3].blur();
    expect(stars[0].classList.contains('is-active')).to.be.true;
  });

  it('should submit form when a rating above the comments threshold is picked', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[4].focus();
    await sendKeys({ press: 'Enter' });
    const thankYouElement = containerElement.querySelector('.rnr-thank-you');
    expect(thankYouElement).to.exist;
  });

  it('should set data-is-mouse-down attribute on mousedown and reset on star focus', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    ratingFieldsetElement.dispatchEvent(new Event('mousedown'));
    expect(ratingFieldsetElement.getAttribute('data-is-mouse-down')).to.equal('true');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[4].focus();
    expect(ratingFieldsetElement.getAttribute('data-is-mouse-down')).to.equal('false');
  });

  // #endregion

  // #region Comments

  it('should show and focus comments when selecting a rating under the comments threshold', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[2].focus();
    await sendKeys({ press: 'Enter' });
    const commentsFieldsetElement = containerElement.querySelector('.rnr-comments-fieldset');
    expect(commentsFieldsetElement).to.exist;
    const textareaElement = commentsFieldsetElement.querySelector('textarea');
    expect(document.activeElement).to.equal(textareaElement);
  });

  it('should focus comments textarea when focusing the footer', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[2].focus();
    await sendKeys({ press: 'Enter' });
    const commentsFieldsetElement = containerElement.querySelector('.rnr-comments-fieldset');
    const textareaElement = commentsFieldsetElement.querySelector('textarea');
    const footerElement = commentsFieldsetElement.querySelector('.rnr-comments-footer');
    textareaElement.blur();
    footerElement.click();
    expect(document.activeElement).to.equal(textareaElement);
  });

  it('should update comments character counter', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[2].focus();
    await sendKeys({ press: 'Enter' });
    await sendKeys({ press: 'a' });
    await sendKeys({ press: 'a' });
    await sendKeys({ press: 'a' });
    const commentsCharacterCounterElement = containerElement.querySelector(
      '.rnr-comments-character-counter',
    );
    expect(commentsCharacterCounterElement.textContent).to.equal('497 / 500');
  });

  it('should submit form on comments send button press', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[2].focus();
    await sendKeys({ press: 'Enter' });
    expect(stars[2].getAttribute('aria-checked')).to.equal('true');
    await sendKeys({ press: 'a' });
    await sendKeys({ press: 'a' });
    await sendKeys({ press: 'a' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Enter' });
    const thankYouElement = containerElement.querySelector('.rnr-thank-you');
    expect(thankYouElement).to.exist;
  });

  it('should enable and disable submit button on typing and clearing', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const ratingFieldsetElement = containerElement.querySelector('.rnr-rating-fieldset');
    const stars = ratingFieldsetElement.querySelectorAll('input');
    stars[2].focus();
    await sendKeys({ press: 'Enter' });
    const submitElement = containerElement.querySelector('.rnr-comments-submit');
    expect(submitElement).to.exist;
    expect(submitElement.getAttribute('disabled')).to.equal('disabled');
    await sendKeys({ press: 'a' });
    expect(submitElement.hasAttribute('disabled')).to.be.false;
    await sendKeys({ press: 'Backspace' });
    expect(submitElement.getAttribute('disabled')).to.equal('disabled');
  });

  // #endregion

  // #region Summary

  it('should render summary', async () => {
    const containerElement = await waitForElement('.rnr-container');
    const averageElement = containerElement.querySelector('.rnr-summary-average');
    expect(averageElement).to.exist;
    const outOfElement = containerElement.querySelector('.rnr-summary-outOf');
    expect(outOfElement).to.exist;
    const votesElement = containerElement.querySelector('.rnr-summary-votes');
    expect(votesElement).to.exist;
  });

  it('should render correct aggregate data summary', async () => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({
          overallRating: 2.6,
          ratingHistogram: { rating1: 1, rating2: 5, rating3: 2, rating4: 1, rating5: 1 },
        }),
        ok: true,
      }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    const averageElement = containerElement.querySelector('.rnr-summary-average');
    expect(averageElement.textContent).to.equal('2.6');
    const outOfElement = containerElement.querySelector('.rnr-summary-outOf');
    expect(outOfElement.textContent).to.equal('5');
    const votesElement = containerElement.querySelector('.rnr-summary-votes');
    expect(votesElement.textContent).to.equal('10');
  });

  it('should render round average', async () => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({
          overallRating: 2.666666666666667,
          ratingHistogram: { rating1: 0, rating2: 5, rating3: 10, rating4: 0, rating5: 0 },
        }),
        ok: true,
      }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    const averageElement = containerElement.querySelector('.rnr-summary-average');
    expect(averageElement.textContent).to.equal('2.7');
  });

  it('should render should display integer averages without decimals', async () => {
    sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve({
        json: () => Promise.resolve({
          overallRating: 2,
          ratingHistogram: { rating1: 0, rating2: 2, rating3: 0, rating4: 0, rating5: 0 },
        }),
        ok: true,
      }),
    );
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const rnr = document.querySelector('.rnr');
    await init(rnr);
    const containerElement = await waitForElement('.rnr-container');
    expect(containerElement).to.exist;
    const averageElement = containerElement.querySelector('.rnr-summary-average');
    expect(averageElement.textContent).to.equal('2');
  });

  // #endregion
});
