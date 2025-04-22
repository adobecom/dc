import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

/**
 * Decorates the block
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  // Get content from the fragment
  const { children } = block;

  if (!children.length) return {};

  // In this structure:
  // - First div contains title
  // - Second div contains subtitle
  // - Third div contains both CTA links
  const title = children[0]?.querySelector('div')?.textContent.trim() || 'Title';
  const subtitle = children[1]?.querySelector('div')?.textContent.trim() || 'Subtitle';

  // Get all links from the third div
  const ctaLinks = children[2]?.querySelector('div')?.querySelectorAll('a') || [];

  // Create the main container with hero-marquee classes
  const container = createTag('div', { class: 'blockname-container hero-marquee center s-min-height static-links con-block has-bg' });

  // Create foreground div that will contain the copy content
  const foreground = createTag('div', { class: 'foreground' });
  const copyContainer = createTag('div', { class: 'copy' });
  const mainCopy = createTag('div', { class: 'main-copy' });

  // Create heading elements with adobe classes
  const heading = createTag('h2', { class: 'heading-xl' }, title);
  mainCopy.append(heading);

  const subheading = createTag('p', { class: 'body-m' }, subtitle);
  mainCopy.append(subheading);

  // Create CTA container
  const ctaContainer = createTag('div', { class: 'action-area' });

  // Process all CTA links
  if (ctaLinks.length > 0) {
    Array.from(ctaLinks).forEach((link, index) => {
      const linkText = link.textContent.trim();
      const linkHref = link.getAttribute('href') || '#';

      // Create paragraph wrapper for the button
      const paragraph = createTag('p', { class: 'body-m' });

      if (index === 0) {
        // Primary CTA - use con-button blue
        const button = createTag('a', {
          class: 'con-button blue button-xl button-justified-mobile',
          href: linkHref,
        }, linkText);
        paragraph.append(button);
      } else {
        // Secondary CTA - use supplemental text with a regular link
        paragraph.classList.add('supplemental-text', 'body-xl');

        // Check if link text has an arrow
        if (linkText.includes('→')) {
          const textWithoutArrow = linkText.replace('→', '').trim();
          const secondaryLink = createTag('a', { href: linkHref });

          secondaryLink.append(
            createTag('span', {}, textWithoutArrow),
            createTag('span', { class: 'blockname-button-arrow' }, '→'),
          );

          // Special checkout-link attribute if the URL contains commerce.adobe.com
          if (linkHref.includes('commerce.adobe.com')) {
            secondaryLink.setAttribute('is', 'checkout-link');
          }

          paragraph.append(secondaryLink);
        } else {
          const secondaryLink = createTag('a', { href: linkHref }, linkText);

          // Special checkout-link attribute if the URL contains commerce.adobe.com
          if (linkHref.includes('commerce.adobe.com')) {
            secondaryLink.setAttribute('is', 'checkout-link');
          }

          paragraph.append(secondaryLink);
        }
      }

      ctaContainer.append(paragraph);
    });
  }

  // Assemble the structure
  mainCopy.append(ctaContainer);
  copyContainer.append(mainCopy);
  foreground.append(copyContainer);
  container.append(foreground);

  return { container };
}

/**
 * Handles click events
 * @param {Event} e Click event
 */
function handleClick(e) {
  const button = e.target.closest('a');
  if (button) {
    // Add any click handling logic here
    // eslint-disable-next-line no-console
    console.log('Link clicked:', button.textContent);
  }
}

/**
 * Adds interactivity to the block
 * @param {Element} block The block element
 * @param {Object} elements The decorated elements
 */
function addInteractivity(block, elements) {
  const { container } = elements;
  if (!container) return;

  // Add event listeners for buttons
  const ctaContainer = container.querySelector('.action-area');
  if (ctaContainer) {
    ctaContainer.addEventListener('click', handleClick);
  }
}

/**
 * Loads and initializes the block
 * @param {Element} block The block element
 */
export default async function init(block) {
  try {
    // Add hero-marquee class to the block
    block.classList.add('blockname', 'hero-marquee', 'center', 's-min-height', 'static-links', 'con-block', 'has-bg');

    // Decorate the block
    const elements = decorateBlock(block);

    // Clear block and add new content
    block.textContent = '';
    if (elements.container) {
      block.append(elements.container);
    }

    // Add interactivity
    addInteractivity(block, elements);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error initializing block:', error);

    // Fallback content
    block.textContent = 'Block is currently unavailable.';
  }
}
