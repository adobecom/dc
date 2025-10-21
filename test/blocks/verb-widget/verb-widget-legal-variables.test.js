/* eslint-disable compat/compat */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getConfig, setConfig } from 'https://main--milo--adobecom.aem.live/libs/utils/utils.js'; // eslint-disable-line import/no-unresolved
import { delay } from '../../helpers/waitfor.js';

const { default: init } = await import(
  '../../../acrobat/blocks/verb-widget/verb-widget.js'
);

describe('verb-widget legal text with LIMITS-based AI support', () => {
  let xhr;
  let placeholders;

  beforeEach(async () => {
    sinon.stub(window, 'fetch');
    window.fetch.callsFake((x) => {
      if (x.endsWith('.svg')) {
        return window.fetch.wrappedMethod.call(window, x);
      }
      return Promise.resolve();
    });

    const placeholdersText = await readFile({ path: './mocks/placeholders.json' });
    placeholders = JSON.parse(placeholdersText);

    window.mph = {};
    placeholders.data.forEach((item) => {
      window.mph[item.key] = item.value;
    });

    // Add AI-specific legal text for genAI verbs
    window.mph['verb-widget-legal-2-ai'] = 'AI legal text with Terms of Use, Privacy Policy, and GenAI Guidelines';
    window.mph['verb-widget-genai-guidelines'] = 'GenAI Guidelines';

    xhr = sinon.useFakeXMLHttpRequest();
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body-sign-pdf.html' });
    window.adobeIMS = { isSignedInUser: () => false };
  });

  afterEach(() => {
    xhr.restore();
    sinon.restore();
  });

  it('non-AI verbs use default legal text only', async () => {
    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    // fillsign is not an AI verb, so it uses default placeholders
    const legalElements = block.querySelectorAll('.verb-legal');
    expect(legalElements).to.have.lengthOf(2);

    const legalText = legalElements[0].textContent.trim();
    const legalTwoText = legalElements[1].textContent.trim();

    // Should use default legal text from placeholders.json
    expect(legalText).to.equal('Your file will be securely handled by Adobe servers and deleted unless you sign in to save it.');
    expect(legalTwoText).to.equal('By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');

    // Check default terms and privacy links
    const termsLink = legalElements[1].querySelector('a[href*="legal/terms"]');
    const privacyLink = legalElements[1].querySelector('a[href*="privacy/policy"]');
    const genAILink = legalElements[1].querySelector('a[href*="adobe-gen-ai-user-guidelines"]');

    expect(termsLink).to.exist;
    expect(privacyLink).to.exist;
    // fillsign is not an AI verb, so no GenAI link should exist
    expect(genAILink).to.not.exist;
    expect(termsLink.textContent).to.equal('Terms of Use');
    expect(privacyLink.textContent).to.equal('Privacy Policy');

    // Check default tooltip
    const infoIcon = block.querySelector('.info-icon');
    expect(infoIcon.getAttribute('aria-label')).to.equal('Files are secured using HTTPS w/TLS 1.2 and stored using AES-256 encryption');
  });

  it('uses AI-specific legal text for genAI verbs (chat-pdf)', async () => {
    // Change to chat-pdf verb which has genAI: true in LIMITS
    document.body.innerHTML = `<main>
      <div>
        <div class="verb-widget chat-pdf">
          <div><div><h1>Chat with PDF</h1></div></div>
          <div><div>{{verb-widget-legal}}</div></div>
        </div>
        <div class="unity workflow-acrobat"></div>
      </div>
    </main>`;

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    const legalElements = block.querySelectorAll('.verb-legal');
    expect(legalElements).to.have.lengthOf(2);

    // Should use AI-specific legal text
    const legalTwoText = legalElements[1].textContent.trim();
    expect(legalTwoText).to.equal('AI legal text with Terms of Use, Privacy Policy, and GenAI Guidelines');

    // Should have GenAI guidelines link for AI verbs
    const genAILink = legalElements[1].querySelector('a[href*="adobe-gen-ai-user-guidelines"]');
    expect(genAILink).to.exist;
    expect(genAILink.textContent).to.equal('GenAI Guidelines');
    expect(genAILink.getAttribute('target')).to.equal('_blank');
    expect(genAILink.getAttribute('class')).to.equal('verb-legal-url');
  });

  it('uses custom GenAI URL when provided for AI verbs', async () => {
    // Change to chat-pdf verb which has genAI: true
    document.body.innerHTML = `<main>
      <div>
        <div class="verb-widget chat-pdf">
          <div><div><h1>Chat with PDF</h1></div></div>
          <div><div>{{verb-widget-legal}}</div></div>
        </div>
        <div class="unity workflow-acrobat"></div>
      </div>
    </main>`;

    // Set custom GenAI URL
    window.mph['verb-widget-genai-terms-url'] = 'https://custom.adobe.com/genai-terms';

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    const legalElements = block.querySelectorAll('.verb-legal');
    const genAILink = legalElements[1].querySelector('a[href="https://custom.adobe.com/genai-terms"]');

    expect(genAILink).to.exist;
    expect(genAILink.textContent).to.equal('GenAI Guidelines');
  });

  it('AI verbs fall back to default legal-2 when verb-widget-legal-2-ai not available', async () => {
    // Change to chat-pdf verb which has genAI: true
    document.body.innerHTML = `<main>
      <div>
        <div class="verb-widget chat-pdf">
          <div><div><h1>Chat with PDF</h1></div></div>
          <div><div>{{verb-widget-legal}}</div></div>
        </div>
        <div class="unity workflow-acrobat"></div>
      </div>
    </main>`;

    // Remove AI-specific legal text
    delete window.mph['verb-widget-legal-2-ai'];

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    const legalElements = block.querySelectorAll('.verb-legal');

    // Should fall back to default legal-2 text
    const legalTwoText = legalElements[1].textContent.trim();
    expect(legalTwoText).to.equal('By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');

    // GenAI link won't exist because default text doesn't contain GenAI Guidelines placeholder
    const genAILink = legalElements[1].querySelector('a[href*="adobe-gen-ai-user-guidelines"]');
    expect(genAILink).to.not.exist;
  });

  it('AI verbs without genai-guidelines placeholder do not create GenAI link', async () => {
    // Change to chat-pdf verb which has genAI: true
    document.body.innerHTML = `<main>
      <div>
        <div class="verb-widget chat-pdf">
          <div><div><h1>Chat with PDF</h1></div></div>
          <div><div>{{verb-widget-legal}}</div></div>
        </div>
        <div class="unity workflow-acrobat"></div>
      </div>
    </main>`;

    // Remove GenAI guidelines placeholder
    delete window.mph['verb-widget-genai-guidelines'];

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    const legalElements = block.querySelectorAll('.verb-legal');

    // Should use AI legal text but no GenAI link
    const legalTwoText = legalElements[1].textContent.trim();
    expect(legalTwoText).to.equal('AI legal text with Terms of Use, Privacy Policy, and GenAI Guidelines');

    // No GenAI link should be created without the placeholder
    const genAILink = legalElements[1].querySelector('a[href*="adobe-gen-ai-user-guidelines"]');
    expect(genAILink).to.not.exist;
  });

  it('handles missing placeholders gracefully', async () => {
    // Change to chat-pdf verb which has genAI: true
    document.body.innerHTML = `<main>
      <div>
        <div class="verb-widget chat-pdf">
          <div><div><h1>Chat with PDF</h1></div></div>
          <div><div>{{verb-widget-legal}}</div></div>
        </div>
        <div class="unity workflow-acrobat"></div>
      </div>
    </main>`;

    // Remove some placeholders to test forEach with undefined values
    delete window.mph['verb-widget-terms-of-use'];
    delete window.mph['verb-widget-legal-2-ai'];

    const conf = getConfig();
    setConfig({ ...conf, locale: { prefix: '' } });
    const block = document.body.querySelector('.verb-widget');
    await init(block);
    await delay(100);

    const legalElements = block.querySelectorAll('.verb-legal');

    // Should fall back to default legal-2 when AI text not available
    const legalTwoText = legalElements[1].textContent.trim();
    expect(legalTwoText).to.equal('By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');

    // Privacy link should still work, terms link should not exist
    const termsLink = legalElements[1].querySelector('a[href*="legal/terms"]');
    const privacyLink = legalElements[1].querySelector('a[href*="privacy/policy"]');

    expect(termsLink).to.not.exist; // No terms placeholder
    expect(privacyLink).to.exist; // Privacy placeholder exists
  });
});
