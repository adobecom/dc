import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

function setupEventListener(dropzone, cta) {
  dropzone.addEventListener('click', (e) => {
    e.preventDefault();
    cta.click();
  });

  cta.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function setupDragDropListeners(dropzone) {
  dropzone.addEventListener('dragenter', (e) => {
    preventDefaults(e);
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragover', (e) => {
    preventDefaults(e);
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', (e) => {
    preventDefaults(e);
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    preventDefaults(e);
    dropzone.classList.remove('dragover');
    // TODO: handle drop
  });
}

function createGenAiWidget(element, content) {
  const wrapper = createTag('div', { class: 'acom-converter_wrapper gen-ai' });
  const titleWrapper = createTag('div', { class: 'acom-converter_title-wrapper gen-ai' });
  const titleImg = createTag('div', { class: 'acom-converter_title-img' });
  const title = createTag('div', { class: 'acom-converter_title' }, 'Adobe Acrobat');
  const heading = createTag('div', { class: 'acom-converter_heading gen-ai' }, content[0].textContent);
  const copy = createTag('div', { class: 'acom-converter_copy gen-ai' }, content[2].textContent);
  const textWrapper = createTag('div', { class: 'text-wrapper' });
  const innerTextWrapper = createTag('div', { class: 'inner-text-wrapper' });
  const dropZone = createTag('div', { class: 'acom-converter_dropzone gen-ai' });
  const artwork = createTag('img', { class: 'acom-converter_artwork gen-ai', src: `${content[1].querySelector('img').src}` });
  const artworkWrapper = createTag('div', { class: 'acom-converter_artwork-wrapper gen-ai' });
  const cta = createTag('input', { class: 'hide', type: 'file', id: 'file-upload' });
  const ctaLabel = createTag('label', { for: 'file-upload', class: 'acom-converter_cta gen-ai' }, content[3].textContent);
  const ctaWrapper = createTag('div', { class: 'acom-converter_cta-wrapper' });
  const converterFooter = createTag('div', { class: 'acom-converter_footer' });
  const converterSecureIcon = createTag('i', { class: 'acom-converter_secure-icon' });
  const converterLegalWrapper = createTag('div', { class: 'acom-converter_legal-wrapper' });
  const converterLegalIcon = createTag('p', { class: 'acom-converter_legal_info-icon' }, 'Your files will be securely handled by Adobe servers and deleted unless you sign in to save them.');
  const converterLegal = createTag('p', { class: 'acom-converter_legal' }, 'By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');
  titleWrapper.append(titleImg, title);
  ctaWrapper.append(ctaLabel, cta);

  innerTextWrapper.append(titleWrapper, heading, copy, ctaWrapper);
  textWrapper.append(innerTextWrapper);
  wrapper.append(dropZone, converterFooter);
  artworkWrapper.append(artwork);
  dropZone.append(textWrapper, artworkWrapper);
  converterFooter.append(converterSecureIcon, converterLegalWrapper);
  converterLegalWrapper.append(converterLegalIcon, converterLegal);
  element.append(wrapper);

  return { dropZone, cta };
}

function createAcomWidget(element, content) {
  const wrapper = createTag('div', { class: 'acom-converter_wrapper' });
  const titleWrapper = createTag('div', { class: 'acom-converter_title-wrapper' });
  const titleImg = createTag('div', { class: 'acom-converter_title-img' });
  const title = createTag('div', { class: 'acom-converter_title' }, 'Adobe Acrobat');
  const heading = createTag('div', { class: 'acom-converter_heading' }, content[0].textContent);
  const dropZone = createTag('div', { class: 'acom-converter_dropzone' });
  const artwork = createTag('img', { class: 'acom-converter_artwork', src: `${content[1].querySelector('img').src}` });
  const artworkWrapper = createTag('div', { class: 'acom-converter_artwork-wrapper' });
  const copy = createTag('div', { class: 'acom-converter_copy' }, 'Select a Microsoft Word document (DOCX or DOC) to convert to PDF.');
  const cta = createTag('input', { class: 'hide', type: 'file', id: 'file-upload' });
  const ctaLabel = createTag('label', { for: 'file-upload', class: 'acom-converter_cta' }, content[3].textContent);
  const ctaWrapper = createTag('div', { class: 'acom-converter_cta-wrapper' });

  const converterFooter = createTag('div', { class: 'acom-converter_footer' });
  const converterSecureIcon = createTag('i', { class: 'acom-converter_secure-icon' });
  const converterLegalWrapper = createTag('div', { class: 'acom-converter_legal-wrapper' });
  const converterLegalIcon = createTag('p', { class: 'acom-converter_legal_info-icon' }, 'Your files will be securely handled by Adobe servers and deleted unless you sign in to save them.');
  const converterLegal = createTag('p', { class: 'acom-converter_legal' }, 'By using this service, you agree to the Adobe Terms of Use and Privacy Policy.');

  // Consutruction of Widget
  titleWrapper.append(titleImg, title);
  wrapper.append(titleWrapper, heading, dropZone, converterFooter);
  artworkWrapper.append(artwork);
  ctaWrapper.append(ctaLabel, cta);
  dropZone.append(artworkWrapper, copy, ctaWrapper);
  converterFooter.append(converterSecureIcon, converterLegalWrapper);
  converterLegalWrapper.append(converterLegalIcon, converterLegal);
  element.append(wrapper);

  return {dropZone, cta};
}

export default async function init(element) {
  await createTag();
  const content = Array.from(element.querySelectorAll(':scope > div'));
  const VERB = element.classList.value.replace('acom-converter', '');
  content.forEach((con) => con.classList.add('hide'));
  element.dataset.verb = VERB.trim();

  const { dropZone, cta } = element.classList.contains('chat-pdf') ? createGenAiWidget(element, content) : createAcomWidget(element, content);
  // Setup listeners
  setupEventListener(dropZone, cta);
  setupDragDropListeners(dropZone);
}
