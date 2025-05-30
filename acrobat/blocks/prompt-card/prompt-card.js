/* eslint-disable prefer-template */
/* eslint-disable compat/compat */
import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
let createTag;
let processTrackingLabels;

const classToastShow = 'prompt-toast--show';
const getPlaceHolder = (x) => (window.mph?.[x] || x);

function copyPrompt(cfg, a11yActionUpdate) {
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
  if (a11yActionUpdate) {
    if (a11yActionUpdate.textContent.trim() === cfg.toast) {
      // Screen Reader will not read the same message again so it has to be changed
      a11yActionUpdate.textContent = `${cfg.toast}.`;
    } else {
      a11yActionUpdate.textContent = cfg.toast;
    }
  }

  setTimeout(() => toast.classList.remove(classToastShow), 5000);
}

function createBlock(el, cfg, a11yActionUpdate) {
  const element = el || createTag('div', { class: 'prompt-card' });
  cfg.icon = cfg.icon || '/acrobat/img/icons/aichat.svg';
  cfg.button = cfg.button || getPlaceHolder('Copy');
  cfg.toast = cfg.toast || getPlaceHolder('Copied to clipboard');
  const blade = createTag('div', {
    class: 'prompt-blade',
    title: cfg.prompt,
    'data-toast': cfg.toast,
    'daa-im': true,
    'daa-lh': 'Featured prompts | Executive summary',
    'daa-ll': 'promptcard-' + processTrackingLabels(cfg.prefix) + '-' + processTrackingLabels(cfg.title),
  });
  const prefix = createTag('div', { class: 'prompt-prefix' });
  const icon = createTag('img', {
    class: 'prompt-icon',
    alt: 'AI Assistant Icon',
    src: cfg.icon,
    width: 18,
    height: 18,
  });
  const title = createTag('h3', { class: 'prompt-title' }, cfg.title);
  const copy = createTag('div', { class: 'prompt-copy' }, cfg.prompt);
  const prompt = createTag('input', { id: 'prompt', value: cfg.prompt });
  const wrapper = createTag('div', { class: 'prompt-copy-btn-wrapper' });
  const copyBtn = createTag('span', { class: 'prompt-copy-btn', role: 'button', tabindex: 0, 'aria-label': `${cfg.button} ${cfg.prompt}` }, cfg.button);  wrapper.append(copyBtn);
  prefix.appendChild(icon);
  prefix.appendChild(createTag('span', null, cfg.prefix));
  blade.append(prefix, title, copy, prompt, wrapper);
  element.replaceChildren(blade);

  blade.addEventListener('click', () => {
    copyPrompt(cfg, a11yActionUpdate);
  });

  copyBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyPrompt(cfg, a11yActionUpdate);
    }
  });

  return element;
}

function createBlocks(element, blockArray, templateCfg) {
  const { parentNode } = element;
  const a11yActionUpdate = createTag('div', { class: 'prompt-a11y-action', 'aria-live': 'polite' });
  parentNode.append(a11yActionUpdate);
  for (const [idx, cfg] of blockArray.entries()) {
    const blockEl = createBlock(null, { ...templateCfg, ...cfg }, a11yActionUpdate);
    if (templateCfg?.rows && idx > 0) blockEl.classList.add('hidden');
    parentNode.insertBefore(blockEl, element.previousSibling);
  }
  element.remove();

  if (templateCfg?.rows && parentNode.classList.contains('section')) {
    const resizeObserver = new ResizeObserver(() => {
      const computedStyle = window.getComputedStyle(parentNode);
      if (/^(\d+(\.\d+)?(px|fr|em|rem|%))( (\d+(\.\d+)?(px|fr|em|rem|%)))*$/.test(computedStyle.gridTemplateColumns)) {
        const visibleCnt = computedStyle.gridTemplateColumns.split(' ').length * templateCfg.rows;
        const promptcards = [...parentNode.querySelectorAll('.prompt-card')];
        if (promptcards.length <= visibleCnt) {
          parentNode.querySelector('.view-all')?.remove();
          resizeObserver.disconnect();
        }
        promptcards.forEach(
          (x, i) => (i < visibleCnt ? x.classList.remove('hidden') : x.classList.add('hidden')),
        );
      }
    });
    resizeObserver.observe(parentNode);

    const viewMore = createTag('div', { class: 'view-all' });
    const moreBtn = createTag('div', { class: 'con-button outline' }, getPlaceHolder('View all'));
    moreBtn.addEventListener('click', (e) => {
      resizeObserver.disconnect();
      [...parentNode.querySelectorAll('.prompt-card')].forEach((x) => x.classList.remove('hidden'));
      e.target.parentNode.remove();
    });
    viewMore.appendChild(moreBtn);
    parentNode.appendChild(viewMore);
  }
}

async function processGroup(element, cfg, startIndex) {
  let blockArray;
  if (startIndex > -1) {
    blockArray = [];
    const keys = [...element.children[startIndex].children].map((x) => x.textContent.toLowerCase());
    [...element.children].slice(startIndex + 1).forEach((x) => {
      const values = [...x.children].map((y) => y.textContent);
      const block = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
      blockArray.push(block);
    });
  } else {
    const resp = await fetch(cfg.json);
    if (!resp.ok) {
      element.remove();
      return;
    }
    const json = await resp.json();
    const keys = Object.keys(cfg).filter((k) => !['json', 'rows'].includes(k));
    blockArray = json.data.filter(
      (x) => keys.reduce((a, k) => a && cfg[k] === x[k], true),
    );
  }
  createBlocks(element, blockArray, cfg);
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
  const { createTag: createTagfn } = await import(`${miloLibs}/utils/utils.js`);
  const { processTrackingLabels: processTrackingLabelsfn } = await import(`${miloLibs}/martech/attributes.js`);
  createTag = createTagfn;
  processTrackingLabels = processTrackingLabelsfn;

  if (element.classList.contains('template') && element.classList.contains('group')) {
    const cfg = readKeyValueSet(element);
    await processGroup(element, cfg, Object.keys(cfg).length + 1);
    return;
  }

  if (element.classList.contains('group')) {
    await processGroup(element, window.promptCardTemplate, 0);
    return;
  }

  let cfg = readKeyValueSet(element);

  if (element.classList.contains('template')) {
    window.promptCardTemplate = cfg;
    element.remove();
    return;
  }

  if (element.classList.contains('json')) {
    await processGroup(element, cfg, -1);
    return;
  }

  cfg = { ...window.promptCardTemplate, ...cfg };

  createBlock(element, cfg);
}
