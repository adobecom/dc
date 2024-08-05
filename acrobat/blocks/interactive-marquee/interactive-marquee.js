import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { decorateButtons, getBlockSize, decorateBlockBg } = await import(`${miloLibs}/utils/decorate.js`);
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// [headingSize, bodySize, detailSize]
const blockTypeSizes = {
  marquee: {
    small: ['xl', 'm', 'm'],
    medium: ['xl', 'm', 'm'],
    large: ['xxl', 'xl', 'l'],
    xlarge: ['xxl', 'xl', 'l'],
  },
};

const getImage = (el) => {
  const img = el.querySelector('picture') || el.querySelector('.icon');
  if (img) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('icon-wrapper');
    wrapper.appendChild(img);
    return wrapper;
  }
  return null;
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const config = blockTypeSizes.marquee[size];
  const decorate = (headingEl, typeSize) => {
    headingEl.classList.add(`heading-${typeSize[0]}`);
    headingEl.nextElementSibling?.classList.add(`body-${typeSize[1]}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      const className = sib.querySelector('img, .icon') ? 'icon-area' : `detail-${typeSize[2]}`;
      sib.classList.add(className);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  if (!heading) {
    const paragraphs = el.querySelectorAll('p');
    if (paragraphs.length > 0 && paragraphs[0].querySelector('img, .icon')) {
      paragraphs[0].classList.add('icon-area');
    }
  } else {
    decorate(heading, config);
  }
}

function goToSlide(slideIndex, tabs, deck) {
  const tabElements = tabs.querySelectorAll('li');
  tabElements.forEach((tab, index) => {
    const isActive = index === slideIndex;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive.toString());
  });
  const activeSlide = deck.querySelector('.active');
  activeSlide?.classList.remove('active');
  const newActiveSlide = deck.children[slideIndex];
  newActiveSlide.classList.add('active');
}

function handleSlideChange(tabs, deck) {
  [...tabs.querySelectorAll('li')].forEach((tab, index, tabElements) => {
    tab.setAttribute('tabindex', '0');

    tab.addEventListener('click', (event) => {
      const slide = parseInt(event.currentTarget.dataset.index, 10);
      goToSlide(slide, tabs, deck);
    });

    // Keyboard events for navigation
    tab.addEventListener('keydown', (event) => {
      let newIndex;
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          tab.click();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          newIndex = index - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          newIndex = index + 1;
          break;
        default:
          return;
      }

      // Change focus to new tab, if it exists
      if (newIndex !== undefined && newIndex >= 0 && newIndex < tabElements.length) {
        tabElements[newIndex].focus();
      }
    });
  });
}

function createTitleElement(title) {
  const titleContainer = createTag('div', { class: 'slider-title-container' });
  const text = createTag('p', { class: 'slider-title heading-l' }, title.text);
  const iconContainer = createTag('div', { class: 'slider-arrow' });
  iconContainer.innerHTML = title.icon;
  titleContainer.append(iconContainer, text);
  return titleContainer;
}

function createTab(slide, index, isFirst) {
  const li = createTag('li', {
    class: `slider-tab${isFirst ? ' active' : ''}`,
    role: 'tab',
    tabindex: isFirst ? 0 : -1,
    'data-index': index,
    'aria-selected': isFirst ? 'true' : 'false',
    'aria-labelledby': `Viewing ${slide.label}`,
    'daa-ll': `btn-${index + 1}`,
  }, slide.icon);

  const tabLabel = createTag('p', { class: 'slider-label' }, slide.label);
  li.append(tabLabel);
  return li;
}

function createSlide(slide) {
  const slideEl = createTag('div', { class: 'slide' });
  const content = (typeof slide.video === 'object') ? [...slide.video] : [slide.video];
  slideEl.append(...content);
  return slideEl;
}

function createSlideComponents(slides) {
  const nav = createTag('div', { class: 'slider-nav' });
  const tabs = createTag('ul', { class: 'slider-tabs', role: 'tablist' });
  const deck = createTag('div', { class: 'slider-deck' });
  let firstSlideActive = true;
  // track the index of the slide
  tabs.setAttribute('daa-lh', 'marquee-nav');

  slides.forEach((slide, index) => {
    const tab = createTab(slide, index, firstSlideActive);
    const slideElement = createSlide(slide);
    if (firstSlideActive) {
      slideElement.classList.add('active');
      firstSlideActive = false;
    }
    tabs.append(tab);
    nav.append(tabs);
    deck.append(slideElement);
  });

  return { nav, deck, tabs };
}

function addDarkClassIfNecessary(element) {
  const exclusionClasses = ['light', 'quiet'];
  if (!exclusionClasses.some((className) => element.classList.contains(className))) {
    element.classList.add('dark');
  }
}

export default async function init(el) {
  addDarkClassIfNecessary(el);
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  foreground.classList.add('foreground', 'container');
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0], { useHandleFocalpoint: true });
  }

  const background = children[0].classList.contains('background') ? children[0] : null;
  const slides = [];
  const title = {};
  for (const child of children) {
    if (child !== foreground && child !== background) {
      const info = child.querySelectorAll('div');
      if ((info[0]?.textContent.toLowerCase().includes('title'))) {
        title.text = info[1].textContent;
        title.icon = info[2].innerHTML;
      } else {
        const data = {
          icon: getImage(info[0]),
          label: info[1].innerHTML !== '' ? info[1].innerHTML : null,
          video: info[2].querySelectorAll('a').length > 0 ? info[2].querySelectorAll('a') : null,
        };
        if (data.video && data.icon && data.label) {
          slides.push(data);
        }
      }
      child.remove(); // Remove the child from the DOM
    }
  }
  if (slides.length > 0) {
    const interactive = createTag('div', { class: 'interactive-container' });
    const slider = createTag('div', { class: 'slider' });
    const text = createTitleElement(title);
    const { nav, deck, tabs } = createSlideComponents(slides);
    if (text) nav.append(text);
    slider.append(deck, nav);
    handleSlideChange(tabs, deck);
    interactive.append(slider);
    foreground.append(interactive);
    document.querySelector('.interactive-marquee').classList.add('active');
  }

  const text = foreground?.querySelector(':scope > div');
  text?.classList.add('text');
  const size = getBlockSize(el, 3);
  decorateButtons(text, size === 'large' ? 'button-xl' : 'button-xl');
  decorateText(text, size);
}
