import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const classToastShow = 'prompt-toast--show';
const getPlaceHolder = (x) => (window.mph?.[x] || x);

function copyPrompt(cfg) {
  navigator.clipboard.writeText(cfg.prompt);

  let toast = document.querySelector('.prompt-toast');
  if (!toast) {
    toast = createTag('div', { class: 'prompt-toast' }, cfg.toast);
    const toastClose = createTag('i', { class: 'prompt-close' });
    toast.appendChild(toastClose);
    document.body.appendChild(toast);

    toastClose.addEventListener('click', () => {
      toast.classList.remove(classToastShow);
    });
  }
  toast.childNodes[0].textContent = cfg.toast;
  toast.classList.add(classToastShow);

  setTimeout(() => toast.classList.remove(classToastShow), 5000);
}

async function createBlock(element, cfg) {
  cfg.icon = cfg.icon || '/acrobat/img/icons/aichat.svg';
  cfg.button = cfg.button || getPlaceHolder('Copy');
  cfg.toast = cfg.toast || getPlaceHolder('Copied to clipboard');
  const blade = createTag('div', {
    class: 'prompt-blade',
    title: cfg.prompt,
    'data-toast': cfg.toast,
    'daa-im': true,
    'daa-lh': 'Featured prompts | Executive summary',
  });
  const prefix = createTag('div', { class: 'prompt-prefix' });
  const icon = createTag('img', {
    class: 'prompt-icon',
    alt: 'AI Assistant Icon',
    src: cfg.icon,
    width: 18,
    height: 18,
  });
  const title = createTag('div', { class: 'prompt-title' }, cfg.title);
  const copy = createTag('div', { class: 'prompt-copy' }, cfg.prompt);
  const prompt = createTag('input', { id: 'prompt', value: cfg.prompt });
  const wrapper = createTag('div', { class: 'prompt-copy-btn-wrapper' });
  const copyBtn = createTag('span', { class: 'prompt-copy-btn', role: 'button', tabindex: 0, 'aria-label': 'Copy button' }, cfg.button);
  wrapper.append(copyBtn);
  prefix.appendChild(icon);
  prefix.appendChild(createTag('span', null, cfg.prefix));
  blade.append(prefix, title, copy, prompt, wrapper);
  element.replaceChildren(blade);

  blade.addEventListener('click', () => {
    copyPrompt(cfg);
  });

  copyBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyPrompt(cfg);
    }
  });
}

async function processGroup(element, startIndex, templateCfg) {
  const blockArray = [];
  const keys = [...element.children[startIndex].children].map((x) => x.textContent.toLowerCase());
  [...element.children].slice(startIndex + 1).forEach((x) => {
    const values = [...x.children].map((y) => y.textContent);
    const block = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
    blockArray.push(block);
  });
  for (const cfg of blockArray) {
    const blockEl = createTag('div', { class: 'prompt-card' });
    await createBlock(blockEl, { ...templateCfg, ...cfg });
    element.parentNode.insertBefore(blockEl, element.previousSibling);
  }
  element.remove();
}

function readKeyValueSet(element) {
  const cfg = {};
  for (const x of [...element.children]) {
    if (x.children.length < 2) break;
    cfg[x.children[0].textContent.toLowerCase()] = x.children[1].textContent;
  }
  return cfg;
}

export default async function init(element) {
  if (element.classList.contains('template') && element.classList.contains('group')) {
    const cfg = readKeyValueSet(element);
    await processGroup(element, Object.keys(cfg).length + 1, cfg);
    return;
  }

  if (element.classList.contains('group')) {
    await processGroup(element, 0, window.promptCardTemplate);
    return;
  }

  let cfg = readKeyValueSet(element);

  if (element.classList.contains('template')) {
    window.promptCardTemplate = cfg;
    element.remove();
    return;
  }

  cfg = { ...window.promptCardTemplate, ...cfg };

  await createBlock(element, cfg);
}
