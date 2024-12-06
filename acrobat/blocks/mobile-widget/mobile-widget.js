import mobileAnalytics from '../../scripts/alloy/mobile-widget.js';
import mobileAnalyticsShown from '../../scripts/alloy/mobile-widget-shown.js';
import { setLibs, getEnv, isOldBrowser } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');

const verbRedirMap = {
  createpdf: 'createpdf',
  'crop-pages': 'crop',
  'delete-pages': 'deletepages',
  'extract-pages': 'extract',
  'combine-pdf': 'combine',
  'protect-pdf': 'protect',
  'add-comment': 'addcomment',
  'pdf-to-image': 'pdftoimage',
  'reorder-pages': 'reorderpages',
  sendforsignature: 'sendforsignature',
  'rotate-pages': 'rotatepages',
  fillsign: 'fillsign',
  'split-pdf': 'split',
  'insert-pdf': 'insert',
  'compress-pdf': 'compress',
  'png-to-pdf': 'jpgtopdf',
  'number-pages': 'number',
  'ocr-pdf': 'ocr',
  'chat-pdf': 'chat',
};

const verbRedirMapAnalytics = {
  ...verbRedirMap,
  'add-comment': 'add-comment', // Adjust for analytics map
};

const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
const fallBack = 'https://www.adobe.com/go/acrobat-overview';

// Redirect Logic
function redDir(verb) {
  if (isOldBrowser()) {
    window.location.href = EOLBrowserPage;
    return;
  }
  const hostname = window?.location?.hostname;
  const ENV = getEnv();
  const VERB = verb;
  let newLocation;
  if (hostname !== 'www.adobe.com' && hostname !== 'sign.ing' && hostname !== 'edit.ing') {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}-${ENV}`;
  } else {
    newLocation = `https://www.adobe.com/go/acrobat-${verbRedirMap[VERB] || VERB.split('-').join('')}` || fallBack;
  }
  window.location.href = newLocation;
}

// Helper to Create HTML Tags
function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    el.insertAdjacentHTML('beforeend', html);
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

// Mobile Widget Creation
function createMobileWidget(element, content, verb) {
  const aaVerbName = `${verbRedirMapAnalytics[verb] || verb}`;
  const artID = content[1].querySelector('a')?.href || content[1].querySelector('img')?.src;

  const wrapper = createTag('div', { class: 'mobile-widget_wrapper' });
  const titleWrapper = createTag('div', { class: 'mobile-widget_title-wrapper' });
  const titleImg = createTag('div', { class: 'mobile-widget_title-img' });
  const title = createTag('div', { class: 'mobile-widget_title' }, 'Adobe Acrobat');
  const heading = createTag('h1', { class: 'mobile-widget_heading' }, content[0].textContent);
  const headerWrapper = createTag('div', { class: 'mobile-widget_header-wrapper' });
  const dropZone = createTag('div', { class: 'mobile-widget_dropzone' });
  const artwork = createTag('img', { class: 'mobile-widget_artwork', src: artID });
  const artworkInnerWrapper = createTag('div', { class: 'mobile-widget_artwork-inner-wrapper' });
  const artworkWrapper = createTag('div', { class: 'mobile-widget_artwork-wrapper' });
  const copy = createTag('div', { class: 'mobile-widget_copy' }, content[2].textContent);

  let appLink = '';
  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    appLink = content[4].textContent.toString().trim();
  } else if (/android/i.test(window?.browser?.ua)) {
    appLink = content[5].textContent.toString().trim();
  } else {
    appLink = content[4].textContent.toString().trim();
  }

  const mobileCta = createTag('a', { class: 'mobile-widget_cta', href: appLink }, content[3].textContent);
  const ctaWrapper = createTag('div', { class: 'mobile-widget_cta-wrapper' });

  titleWrapper.append(titleImg, title);
  headerWrapper.append(titleWrapper, heading);
  wrapper.append(headerWrapper, dropZone);
  artworkInnerWrapper.append(artwork);
  artworkWrapper.append(artworkInnerWrapper);
  ctaWrapper.append(mobileCta);
  dropZone.append(artworkWrapper, copy, ctaWrapper);
  element.append(wrapper);

  // Adobe Analytics
  mobileAnalyticsShown(aaVerbName);
  mobileCta.addEventListener('click', () => {
    mobileAnalytics(aaVerbName);
  });
}
window.addEventListener('custom:modal:close', (e) => {
  console.log('Modal was closed!');
  console.log(e);
});

// Dynamically Load and Show Modal
async function showModal() {
  const { getModal } = await import(`${miloLibs}/blocks/modal/modal.js`);
  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const config = getConfig();

  // Ensure placeholders are loaded
  if (!Object.keys(window.mph || {}).length) {
    const placeholdersPath = `${config.locale.contentRoot}/placeholders.json`;
    const response = await fetch(placeholdersPath);
    if (response.ok) {
      const placeholderJson = await response.json();
      placeholderJson.data.forEach((item) => {
        window.mph[item.key] = item.value.replace(/\u00A0/g, ' ');
      });
    }
  }

  const acrobatIcon = createTag('img', { class: 'modal-icon', src: '/acrobat/img/icons/widget-icon.png' });
  const acrobatLabel = createTag('p', { class: 'modal-label' }, 'Adobe Acrobat');
  const acrobatLogo = createTag('div', { class: 'modal-logo' });
  acrobatLogo.append(acrobatIcon, acrobatLabel);
  const modalTitle = createTag('h2', { class: 'modal-title' }, window.mph['mobile-widget-modal-tile'] || 'Before you go, get the free mobile app.');
  const modalMessage = createTag('p', { class: 'modal-message' }, window.mph['mobile-widget-modal-message'] || 'Quickly comment, sign, and share PDFs — all from your phone.');
  const modalCta = createTag('a', { class: 'modal-cta', href: window.mph['mobile-widget-modal-url'] || '/acrobat/mobile-app.html' }, window.mph['mobile-widget-modal-cta'] || 'Download app');
  const modalContent = createTag('div', { class: 'modal-content' });
  modalContent.append(acrobatLogo, modalTitle, modalMessage, modalCta);
  await getModal(null, { class: 'exit-modal', id: 'exit-modal', content: modalContent, closeEvent: 'custom:modal:close' });
}

// Check if `?showmodal=true` is in the URL and Remove Modal Dismissal
function shouldForceShowModal() {
  // eslint-disable-next-line compat/compat
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('showmodal') === 'true') {
    sessionStorage.removeItem('modalDismissed'); // Clear dismissal for testing
    showModal(); // Trigger modal directly
    return true;
  }
  return false;
}

// Main Initialization Function
export default async function init(element) {
  // Ensure Widget Section and Default State
  element.closest('main > div').dataset.section = 'widget';
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.dataset.verb;

  content.forEach((con) => con.classList.add('hide'));

  // Create Mobile Widget
  if (!element.querySelector('.mobile-widget_wrapper')) {
    createMobileWidget(element, content, VERB);
  }

  // Redirect if User is Signed In
  window.addEventListener('IMS:Ready', async () => {
    if (window.adobeIMS.isSignedInUser()) {
      redDir(VERB);
    }
  });

  // Check and Trigger Modal on `?showmodal=true`
  if (shouldForceShowModal()) return;

  // Idle Detection
  const idleTimeLimit = 20000; // 20 seconds
  let idleTimer;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(async () => {
      if (!sessionStorage.getItem('modalDismissed')) {
        await showModal();
      }
    }, idleTimeLimit);
  }

  // Attach Activity Listeners for Idle Detection
  ['mousemove', 'click', 'keypress', 'scroll', 'touchstart'].forEach((event) => {
    document.addEventListener(event, resetIdleTimer);
  });

  // Start the Idle Timer
  resetIdleTimer();
}
