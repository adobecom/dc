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

let aaVerbName = '';
let appLink = '';
let modalCtaLink = '';
let externalLinkHref = null;
let isAcrobatExitOpen = false;
let inactivityTimer;
const inactivityInterval = 20000;

// Mobile Widget Creation
function createMobileWidget(element, content, verb) {
  aaVerbName = `${verbRedirMapAnalytics[verb] || verb}`;
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

  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    appLink = content[4].textContent.toString().trim();
  } else if (/android/i.test(window?.browser?.ua)) {
    appLink = content[5].textContent.toString().trim();
  } else {
    appLink = content[4].textContent.toString().trim();
  }

  const mobileCta = createTag('a', { class: 'mobile-widget_cta', href: appLink, target: '_blank' }, content[3].textContent);
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

window.addEventListener('milo:modal:closed', () => {
  if (!isAcrobatExitOpen) return;
  mobileAnalytics(aaVerbName, 'acrobat-exit-modal:closed');
  isAcrobatExitOpen = false;
  sessionStorage.setItem('modalDismissed', 'true');
  if (externalLinkHref) {
    window.location.href = externalLinkHref;
    externalLinkHref = '';
  }
});

const getPlaceHolders = async () => {
  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const config = await getConfig();

  if (!Object.keys(window.mph || {}).length) {
    const placeholdersPath = `${config.locale.contentRoot}/placeholders.json`;
    try {
      const response = await fetch(placeholdersPath);
      if (response.ok) {
        const placeholderData = await response.json();
        placeholderData.data.forEach(({ key, value }) => {
          window.mph[key] = value.replace(/\u00A0/g, ' ');
        });
      }
    } catch (error) {
      window.lana?.log(`Failed to load placeholders: ${error?.message}`);
    }
  }
};

async function showModal(event = 'shown') {
  const mph = window.mph || {};
  await getPlaceHolders();
  const { getModal } = await import(`${miloLibs}/blocks/modal/modal.js`);
  const acrobatIcon = createTag('img', { class: 'modal-icon', src: '/acrobat/img/icons/widget-icon.png' });
  const acrobatLabel = createTag('p', { class: 'modal-label' }, 'Adobe Acrobat');
  const acrobatLogo = createTag('div', { class: 'modal-logo' });
  acrobatLogo.append(acrobatIcon, acrobatLabel);
  const modalTitle = createTag('h2', { class: 'modal-title' }, mph['acrobat-exit-modal-title'] || 'Before you go, get the free mobile app.');
  const modalMessage = createTag('p', { class: 'modal-message' }, mph['acrobat-exit-modal-message'] || 'Quickly comment, sign, and share PDFs — all from your phone.');
  const modalCta = createTag('a', { class: 'modal-cta', href: mph['acrobat-exit-modal-cta-url'] || '/acrobat/mobile-app.html' }, mph['acrobat-exit-modal-cta-label'] || 'Download app');
  modalCtaLink = modalCta.href;
  const modalContent = createTag('div', { class: 'modal-content' });
  modalContent.append(acrobatLogo, modalTitle, modalMessage, modalCta);
  isAcrobatExitOpen = true;
  await getModal(null, {
    id: 'acrobat-exit',
    content: modalContent,
    closeEvent: 'Closed',
    class: 'acrobat-exit',
  });
  mobileAnalyticsShown(aaVerbName, `acrobat-exit-modal:shown-${event}`);
}

const internalDomains = [
  'adobe.com',
  'www.adobe.com',
  'www.stage.adobe.com',
];

const internalPatterns = [
  '**--dc--adobecom.aem.page',
  '**--dc--adobecom.aem.live',
  '**--dc--adobecom.hlx.page',
  '**--dc--adobecom.hlx.live',
];

function isInternalDomain(hostname) {
  if (internalDomains.includes(hostname)) return true;
  return internalPatterns.some((pattern) => hostname.includes(pattern));
}

function isExternalLink(link) {
  // eslint-disable-next-line compat/compat
  const linkHost = new URL(link.href).hostname;
  return !(
    linkHost === window.location.hostname
    || isInternalDomain(linkHost)
  );
}

function shouldOpenModal(link) {
  return (
    link && link.href !== appLink && link.href !== modalCtaLink && isExternalLink(link)
  );
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (shouldOpenModal(link)) {
    event.preventDefault();
    externalLinkHref = link.href;
    if (!isAcrobatExitOpen) {
      showModal('external-link');
    } else {
      window.location.href = link.href;
    }
  }
});

window.addEventListener('beforeunload', async (event) => {
  if (sessionStorage.getItem('modalDismissed') === 'true') {
    return;
  }
  event.preventDefault();
  event.returnValue = '';
  if (!isAcrobatExitOpen) {
    await showModal('before-unload');
  }
});

export default async function init(element) {
  element.closest('main > div').dataset.section = 'widget';
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.dataset.verb;
  content.forEach((con) => con.classList.add('hide'));

  if (!element.querySelector('.mobile-widget_wrapper')) {
    createMobileWidget(element, content, VERB);
  }

  window.addEventListener('IMS:Ready', async () => {
    if (window.adobeIMS.isSignedInUser()) {
      redDir(VERB);
    }
  });
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(async () => {
    if (!sessionStorage.getItem('modalDismissed') && !isAcrobatExitOpen) {
      await showModal('idle');
    }
  }, inactivityInterval);
}

['mousemove', 'click', 'keypress', 'scroll', 'touchstart'].forEach((event) => {
  document.addEventListener(event, resetInactivityTimer);
});

resetInactivityTimer();
