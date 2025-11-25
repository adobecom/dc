import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { decorateButtons } = await import(`${miloLibs}/utils/decorate.js`);
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

const ROTATION_DURATION = 2000;
const ROTATION_TRANSITION = 500;

function createStars(container) {
  const starPositions = [
    { top: '15%', left: '10%', size: '24px', color: '#8B5CF6', rotation: 45 },
    { top: '20%', right: '15%', size: '32px', color: '#7C3AED', rotation: -30 },
    { top: '40%', left: '5%', size: '28px', color: '#EC4899', rotation: 15 },
    { top: '60%', right: '8%', size: '36px', color: '#F97316', rotation: -45 },
    { top: '75%', left: '12%', size: '20px', color: '#EF4444', rotation: 60 },
    { top: '35%', right: '20%', size: '26px', color: '#6366F1', rotation: 20 },
  ];

  const starsContainer = createTag('div', { class: 'stars-container' });

  starPositions.forEach((pos, index) => {
    const star = createTag('div', {
      class: 'decorative-star',
      style: `
        top: ${pos.top};
        ${pos.left ? `left: ${pos.left}` : `right: ${pos.right}`};
        width: ${pos.size};
        height: ${pos.size};
        transform: rotate(${pos.rotation}deg);
        animation-delay: ${index * 0.2}s;
      `,
    });

    star.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${pos.color}">
        <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"/>
      </svg>
    `;

    starsContainer.appendChild(star);
  });

  container.appendChild(starsContainer);
}

function initTextRotation(container, rotationWords) {
  const rotatingWord = container.querySelector('.rotating-word');
  if (!rotatingWord || !rotationWords || rotationWords.length === 0) return;

  const [firstWord] = rotationWords;
  rotatingWord.textContent = firstWord;

  let currentIndex = 0;
  let hasCompletedCycle = false;

  const rotateText = () => {
    if (hasCompletedCycle) return;

    rotatingWord.style.opacity = '0';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % rotationWords.length;
      rotatingWord.textContent = rotationWords[currentIndex];
      rotatingWord.style.opacity = '1';

      if (currentIndex === rotationWords.length - 1) {
        hasCompletedCycle = true;
      }
    }, ROTATION_TRANSITION);
  };

  setTimeout(() => {
    const interval = setInterval(() => {
      if (hasCompletedCycle) {
        clearInterval(interval);
      } else {
        rotateText();
      }
    }, ROTATION_DURATION);
  }, ROTATION_DURATION);
}

function initScrollAnimations(el) {
  const mediaContainer = el.querySelector('.media-container');

  let hasAnimated = false;

  const handleScroll = () => {
    if (hasAnimated) return;

    const rect = el.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.5;

    if (rect.top < triggerPoint && rect.bottom > 0) {
      hasAnimated = true;

      el.classList.add('scrolled');

      if (mediaContainer) {
        setTimeout(() => {
          mediaContainer.classList.add('visible');
        }, 300);
      }

      window.removeEventListener('scroll', handleScroll);
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

export default async function init(el) {
  el.classList.add('dark');

  const children = el.querySelectorAll(':scope > div');

  let darkColor = '';
  let lightColor = '';

  if (children.length > 0) {
    const darkColorText = children[0].textContent.trim();
    if (darkColorText && darkColorText.startsWith('#')) {
      darkColor = darkColorText;
    }
  }

  if (children.length > 1) {
    const lightColorText = children[1].textContent.trim();
    if (lightColorText && lightColorText.startsWith('#')) {
      lightColor = lightColorText;
    }
  }

  el.style.setProperty('--dark-bg-color', darkColor);
  el.style.setProperty('--light-bg-color', lightColor);

  const contentDiv = children.length > 2 ? children[2] : null;
  let headingHTML = '';
  let bodyText = '';
  let ctaLink = null;
  let posterImage = null;
  let videoUrl = '';
  let rotationWords = [];

  if (contentDiv) {
    const contentSections = contentDiv.querySelectorAll(':scope > div');

    if (contentSections.length > 0) {
      const textSection = contentSections[0];
      const heading = textSection.querySelector('h1, h2, h3, h4, h5, h6');
      const paragraphs = textSection.querySelectorAll('p');

      if (heading) {
        const headingText = heading.textContent;
        if (headingText.includes('|')) {
          const parts = headingText.split('|').map((p) => p.trim());

          const firstPart = parts[0];
          const lastSpaceInFirst = firstPart.lastIndexOf(' ');
          const beforeRotation = firstPart.substring(0, lastSpaceInFirst).trim();
          const firstWord = firstPart.substring(lastSpaceInFirst + 1).trim();

          const lastPart = parts[parts.length - 1];
          const firstSpaceInLast = lastPart.indexOf(' ');
          const lastWordEnd = firstSpaceInLast > 0 ? firstSpaceInLast : lastPart.length;
          const lastWord = lastPart.substring(0, lastWordEnd).trim();
          const afterRotation = firstSpaceInLast > 0
            ? lastPart.substring(firstSpaceInLast + 1).trim()
            : '';

          rotationWords = [firstWord];
          if (parts.length > 2) {
            rotationWords.push(...parts.slice(1, -1));
          }
          rotationWords.push(lastWord);

          headingHTML = `${beforeRotation}<br><span class="rotating-word">${rotationWords[0]}</span> ${afterRotation}`;
        } else {
          headingHTML = heading.innerHTML;
        }
      }

      if (paragraphs.length > 0) {
        const bodyParagraph = paragraphs[0];
        if (!bodyParagraph.querySelector('a, em')) {
          bodyText = bodyParagraph.textContent;
        }
      }

      const ctaLinkEl = textSection.querySelector('a');
      if (ctaLinkEl) {
        ctaLink = {
          href: ctaLinkEl.href,
          text: ctaLinkEl.textContent.trim(),
        };
      }
    }

    console.log('contentSections.length:', contentSections.length);
    if (contentSections.length > 1) {
      const mediaSection = contentSections[1];
      console.log('mediaSection:', mediaSection);

      const picture = mediaSection.querySelector('picture');
      console.log('picture found:', !!picture);
      if (picture) {
        posterImage = picture;
      } else {
        const videoElement = mediaSection.querySelector('video[poster]');
        console.log('video with poster found:', !!videoElement);
        if (videoElement && videoElement.poster) {
          const img = createTag('img', { src: videoElement.poster, alt: '' });
          posterImage = img;
        }
      }

      const videoLink = mediaSection.querySelector('a[href*=".mp4"]');
      console.log('videoLink found:', !!videoLink, videoLink?.href);
      if (videoLink) {
        videoUrl = videoLink.href;
      } else {
        const videoWithSource = mediaSection.querySelector('video[data-video-source]');
        console.log('video with data-video-source found:', !!videoWithSource);
        if (videoWithSource) {
          videoUrl = videoWithSource.getAttribute('data-video-source');
        }
      }
    }
  }

  console.log('FINAL - posterImage:', !!posterImage, 'videoUrl:', videoUrl);

  children.forEach((child) => {
    child.remove();
  });

  const foreground = createTag('div', { class: 'foreground container' });

  const textContainer = createTag('div', { class: 'text' });

  if (headingHTML) {
    const heading = createTag('h1', { class: 'heading-xxl' });
    heading.innerHTML = headingHTML;
    textContainer.appendChild(heading);
  }

  if (bodyText) {
    const bodyParagraph = createTag('p', { class: 'body-xl' });
    bodyParagraph.textContent = bodyText;
    textContainer.appendChild(bodyParagraph);
  }

  if (ctaLink) {
    const actionArea = createTag('p', { class: 'action-area' });
    const ctaButton = createTag('a', {
      href: ctaLink.href,
      class: 'con-button blue',
    }, ctaLink.text);
    actionArea.appendChild(ctaButton);
    textContainer.appendChild(actionArea);
  }

  console.log('Creating media container? posterImage:', !!posterImage);
  if (posterImage) {
    console.log('YES - Creating media container now');
    const mediaContainer = createTag('div', { class: 'media-container' });
    const mediaPlaceholder = createTag('div', { class: 'media-placeholder' });
    const mediaContent = createTag('div', { class: 'media-content' });

    mediaContent.appendChild(posterImage);

    const playButton = createTag('div', { class: 'play-button' });
    playButton.innerHTML = `
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" fill="white" fill-opacity="0.9"/>
        <path d="M32 25L55 40L32 55V25Z" fill="#1473E6"/>
      </svg>
    `;

    if (videoUrl) {
      playButton.style.cursor = 'pointer';
      playButton.addEventListener('click', () => {
        const video = createTag('video', {
          src: videoUrl,
          controls: true,
          autoplay: true,
          style: 'width: 100%; height: 100%; object-fit: cover; border-radius: 16px;',
        });
        mediaContent.innerHTML = '';
        mediaContent.appendChild(video);
      });
    }

    mediaContent.appendChild(playButton);
    mediaPlaceholder.appendChild(mediaContent);
    mediaContainer.appendChild(mediaPlaceholder);

    foreground.appendChild(mediaContainer);
  }

  foreground.insertBefore(textContainer, foreground.firstChild);

  el.appendChild(foreground);

  decorateButtons(textContainer, 'button-xl');

  if (rotationWords.length > 0) {
    initTextRotation(textContainer, rotationWords);
  }

  createStars(el);

  initScrollAnimations(el);

  el.classList.add('active');
}
