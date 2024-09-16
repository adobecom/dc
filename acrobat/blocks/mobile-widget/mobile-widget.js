import mobileAnalytics from '../../scripts/alloy/mobile-widget.js';
import mobileAnalyticsShown from '../../scripts/alloy/mobile-widget-shown.js';
import { getEnv, isOldBrowser } from '../../scripts/utils.js';

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

export default async function init(element) {
  element.closest('main > div').dataset.section = 'widget';
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.dataset.verb;
  content.forEach((con) => con.classList.add('hide'));
  createMobileWidget(element, content, VERB);
  // Listen for the IMS:Ready event and call redDir if user is signed in
  window.addEventListener('IMS:Ready', async () => {
    if (window.adobeIMS.isSignedInUser()) {
      redDir(VERB);
    }
  });
}
