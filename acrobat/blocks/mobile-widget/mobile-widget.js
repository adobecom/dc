import { setLibs } from '../../scripts/utils.js';

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

const EOLBrowserPage = 'https://acrobat.adobe.com/home/index-browser-eol.html';
const fallBack = 'https://www.adobe.com/go/acrobat-overview';

function getEnv() {
  const prodHosts = ['www.adobe.com', 'sign.ing', 'edit.ing'];
  const stageHosts = [
    'stage--dc--adobecom.hlx.page', 'main--dc--adobecom.hlx.page',
    'stage--dc--adobecom.hlx.live', 'main--dc--adobecom.hlx.live',
    'www.stage.adobe.com',
  ];

  if (prodHosts.includes(window.location.hostname)) return 'prod';
  if (stageHosts.includes(window.location.hostname)) return 'stage';
  return 'dev';
}

function isOldBrowser() {
  const { name, version } = window?.browser || {};
  return (
    name === 'Internet Explorer' || (name === 'Microsoft Edge' && (!version || version.split('.')[0] < 86)) || (name === 'Safari' && version.split('.')[0] < 14)
  );
}

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
function analytics(verb) {
  const lh = `verb-${verb}:goto-app:clicked`;

  const event = {
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: lh,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              interaction: {
                click: lh,
                iclick: 'true',
              },
              eventName: lh,
            },
          },
        },
      },
    },
  };
  // eslint-disable-next-line no-underscore-dangle
  window._satellite.track('event', event);
}

function createMobileWidget(createTag, element, content) {
  const wrapper = createTag('div', { class: 'mobile-widget_wrapper' });
  const titleWrapper = createTag('div', { class: 'mobile-widget_title-wrapper' });
  const titleImg = createTag('div', { class: 'mobile-widget_title-img' });
  const title = createTag('div', { class: 'mobile-widget_title' }, 'Adobe Acrobat');
  const heading = createTag('h1', { class: 'mobile-widget_heading' }, content[0].textContent);
  const headerWrapper = createTag('div', { class: 'mobile-widget_header-wrapper' });
  const dropZone = createTag('div', { class: 'mobile-widget_dropzone' });
  const artwork = createTag('img', { class: 'mobile-widget_artwork', src: `${content[1].querySelector('img').src}` });
  const artworkInnerWrapper = createTag('div', { class: 'mobile-widget_artwork-inner-wrapper' });
  const artworkWrapper = createTag('div', { class: 'mobile-widget_artwork-wrapper' });
  const copy = createTag('div', { class: 'mobile-widget_copy' }, content[2].textContent);
  const VERB = element.classList.value.replace('mobile-widget', '').trim();

  let appLink = '';
  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    appLink = content[4].textContent.toString().trim();
  } else if (/android/i.test(window?.browser?.ua)) {
    appLink = content[5].textContent.toString().trim();
  } else {
    appLink = content[4].textContent.toString().trim();
  }

  const mobileCta = createTag('a', { class: 'mobile-widget_cta', href: appLink, 'daa-ll': `acrobat:verb-${VERB}:goto-app:clicked`, target: '_blank' }, content[3].textContent);
  const ctaWrapper = createTag('div', { class: 'mobile-widget_cta-wrapper' });
  mobileCta.addEventListener('click', () => analytics(VERB));

  titleWrapper.append(titleImg, title);
  headerWrapper.append(titleWrapper, heading);
  wrapper.append(headerWrapper, dropZone);
  artworkInnerWrapper.append(artwork);
  artworkWrapper.append(artworkInnerWrapper);
  ctaWrapper.append(mobileCta);
  dropZone.append(artworkWrapper, copy, ctaWrapper);
  element.append(wrapper);
}

export default async function init(element) {
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.classList.value.replace('mobile-widget', '').trim();
  content.forEach((con) => con.classList.add('hide'));
  createMobileWidget(createTag, element, content);
  // Listen for the IMS:Ready event and call redDir if user is signed in
  window.addEventListener('IMS:Ready', async () => {
    if (window.adobeIMS.isSignedInUser()) {
      redDir(VERB);
    }
  });
}
