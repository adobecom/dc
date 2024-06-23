import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

function createMobileWidget(element, content) {
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
  // TODO: Add check for OS and apply correct href
  let appLink = '';
  if (/iPad|iPhone|iPod/.test(window?.browser?.ua) && !window.MSStream) {
    appLink = content[4].textContent.toString().trim();
  } else if (/android/i.test(window?.browser?.ua)) {
    appLink = content[5].textContent.toString().trim();
  } else {
    // default to iOS App Store
    appLink = content[4].textContent.toString().trim();
  }
  const mobileCta = createTag('a', { class: 'mobile-widget_cta', href: appLink }, content[3].textContent);
  const ctaWrapper = createTag('div', { class: 'mobile-widget_cta-wrapper' });

  // construction of Widget
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
  await createTag();
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.classList.value.replace('mobile-widget', '');
  content.forEach((con) => con.classList.add('hide'));
  element.dataset.verb = VERB.trim();
  createMobileWidget(element, content);
}
