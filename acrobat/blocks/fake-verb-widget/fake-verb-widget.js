/* eslint-disable compat/compat */
import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag, loadBlock } = await import(`${miloLibs}/utils/utils.js`);

function runWhenDocumentIsReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
  window.addEventListener('load', () => {
    // Additional code that needs all resources loaded
    console.log('All resources loaded 1');
  });
}

export default async function init(element) {
  // Store the original content for hydration
  const originalContent = element.innerHTML;

  // Set prerendered HTML in the original element
  element.innerHTML = '<div class="fillsign prerendered-verb-widget verb-widget"><div class=verb-wrapper id=drop-zone><div class=verb-container><div class=verb-row><div class=verb-col><div class=verb-header><div class=verb-icon></div><div class=verb-title>Adobe Acrobat</div></div><h1 class=verb-heading>Fill and sign a PDF</h1><p class=verb-copy>Drag and drop a PDF to use Acrobat as a PDF form filler.</p><button class=verb-cta for=file-upload tabindex=0><span class=verb-cta-label>Select a file</span></button> <input accept=application/pdf aria-hidden=true class=hide id=file-upload type=file><div class="hide error"><div class=verb-errorIcon></div><p class=verb-errorText><div class=verb-errorBtn></div></div></div><div class="verb-col right"><div class=verb-image></div></div></div></div></div><div class=verb-footer><div class=security-icon></div><div class=verb-legal-wrapper><p class=verb-legal>Your file will be securely handled by Adobe servers and deleted unless you sign in to save it.<p class="verb-legal verb-legal-two"><p class="verb-legal verb-legal-two"><p class="verb-legal verb-legal-two">By using this service, you agree to the Adobe <a class=verb-legal-url href=https://www.adobe.com/legal/terms.html target=_blank>Terms of Use</a> and <a class=verb-legal-url href=https://www.adobe.com/privacy/policy.html target=_blank>Privacy Policy</a>.<p></div></div></div>';

  runWhenDocumentIsReady(async () => {
    const parent = element.parentElement;

    // Create the dynamic widget that will replace the prerendered one
    const verbWidget = createTag('div', { class: 'verb-widget fillsign' });
    const unityBlock = createTag('div', { class: 'unity workflow-acrobat fillsign' });
    verbWidget.style.display = 'none';
    verbWidget.innerHTML = originalContent;
    unityBlock.style.display = 'none';
    // Setup mutation observer to watch for the 'loaded' status
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-block-status') {
          const newValue = verbWidget.getAttribute('data-block-status');
          if (newValue === 'loaded') {
            // Replace the prerendered element with the hydrated one
            if (element) {
              element.remove();
            }
            parent.append(verbWidget);
            verbWidget.style.display = '';
            parent.setAttribute('data-hydration-state', 'hydrated');
            parent.append(unityBlock);
            unityBlock.style.display = '';

            // Cleanup the observer as it's no longer needed
            observer.disconnect();
          }
        }
      });
    });

    // Start observing before loading the block
    observer.observe(verbWidget, {
      attributes: true,
      attributeFilter: ['data-block-status'],
    });

    if (verbWidget.getAttribute('data-block-status') === 'loaded') {
      if (element) {
        element.remove();
      }
      parent.append(verbWidget);
      verbWidget.style.display = '';
      parent.setAttribute('data-hydration-state', 'hydrated');
    }

    // Load the block to trigger hydration
    console.log('Before loadBlock:', verbWidget);
    // await 2 sec
    await new Promise((resolve) => setTimeout(resolve, 50));
    await loadBlock(verbWidget);
    await loadBlock(unityBlock);
    console.log('After loadBlock:', verbWidget);
  });
}
