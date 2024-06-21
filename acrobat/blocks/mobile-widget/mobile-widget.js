import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

function createGenAiMobileWidget(element, content) {
  const wrapper = createTag('div', { class: 'mobile-widget_wrapper gen-ai' });
  const titleWrapper = createTag('div', { class: 'mobile-widget_title-wrapper gen-ai' });
  const titleImg = createTag('div', { class: 'mobile-widget_title-img gen-ai' });
  const title = createTag('div', { class: 'mobile-widget_title' }, 'Adobe Acrobat');
  const heading = createTag('div', { class: 'mobile-widget_heading gen-ai' }, content[0].textContent);
  const copy = createTag('div', { class: 'mobile-widget_copy gen-ai' }, content[2].textContent);
  const subcopy = createTag('div', { class: 'mobile-widget_subcopy gen-ai' }, content[3].textContent);
  const textWrapper = createTag('div', { class: 'text-wrapper' });
  const innerTextWrapper = createTag('div', { class: 'inner-text-wrapper' });
  const dropZone = createTag('div', { class: 'mobile-widget_dropzone gen-ai' });
  const artwork = createTag('img', { class: 'mobile-widget_artwork gen-ai', src: `${content[1].querySelector('img').src}` });
  const artworkWrapper = createTag('div', { class: 'mobile-widget_artwork-wrapper gen-ai' });
  // TODO: Add check for OS and apply correct href
  const mobileCta = createTag('a', { class: 'mobile-widget_cta gen-ai', href: content[5].textContent.toString().trim() }, content[4].textContent);

  const ctaWrapper = createTag('div', { class: 'acom-converter_cta-wrapper' });

  titleWrapper.append(titleImg, title);
  ctaWrapper.append(mobileCta);

  innerTextWrapper.append(titleWrapper, heading, copy, subcopy, ctaWrapper);
  textWrapper.append(innerTextWrapper);
  wrapper.append(dropZone);
  artworkWrapper.append(artwork);
  dropZone.append(textWrapper, artworkWrapper);
  element.append(wrapper);
}

function createMobileWidget(element, content) {
  const wrapper = createTag('div', { class: 'mobile-widget_wrapper' });
  const titleWrapper = createTag('div', { class: 'mobile-widget_title-wrapper' });
  const titleImg = createTag('div', { class: 'mobile-widget_title-img' });
  const title = createTag('div', { class: 'mobile-widget_title' }, 'Adobe Acrobat');
  const heading = createTag('div', { class: 'mobile-widget_heading' }, content[0].textContent);
  const headerWrapper = createTag('div', { class: 'mobile-widget_header-wrapper' });
  const dropZone = createTag('div', { class: 'mobile-widget_dropzone' });
  const artwork = createTag('img', { class: 'mobile-widget_artwork', src: `${content[1].querySelector('img').src}` });
  const artworkInnerWrapper = createTag('div', { class: 'mobile-widget_artwork-inner-wrapper' });
  const artworkWrapper = createTag('div', { class: 'mobile-widget_artwork-wrapper' });
  const copy = createTag('div', { class: 'mobile-widget_copy' }, content[2].textContent);
  // TODO: Add check for OS and apply correct href
  const mobileCta = createTag('a', { class: 'mobile-widget_cta', href: content[4].textContent.toString().trim() }, content[3].textContent);
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
  if (window.browser.isMobile) {
    if (element.classList.contains('chat-pdf')) {
      createGenAiMobileWidget(element, content);
    } else {
      createMobileWidget(element, content);
    }
  }
}
