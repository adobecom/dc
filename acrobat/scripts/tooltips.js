/**
 * Tooltip accessibility implementation for WCAG 1.4.13 Content on Hover or Focus
 * and WCAG 4.1.2 Name, Role, Value
 */

/**
 * Shows a tooltip by removing the hide-tooltip class
 * @param {HTMLElement} tooltip - The tooltip element to show
 */
export const showTooltip = (tooltip) => {
  tooltip.classList.remove('hide-tooltip');
};

/**
 * Adds an event listener to an element with proper type safety
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 */
export const addListener = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
};

/**
 * Hides a tooltip and sets up reset handlers
 * @param {HTMLElement} tooltip - The tooltip element to hide
 */
export const hideTooltip = (tooltip) => {
  tooltip.classList.add('hide-tooltip');
  tooltip.classList.remove('tooltip-active');

  // Add one-time reset handlers
  const resetHideClass = () => showTooltip(tooltip);

  // Add event listeners with once option to reset visibility when user interacts again
  ['mouseleave', 'blur'].forEach((eventType) => {
    addListener(tooltip, eventType, resetHideClass, { once: true });
  });
};

/**
 * Initializes tooltips with keyboard accessibility
 * - Makes tooltips keyboard navigable
 * - Makes tooltips dismissible with Escape key
 * - Ensures proper state management between keyboard and mouse interactions
 */
export const initTooltips = () => {
  document.querySelectorAll('.milo-tooltip:not([data-a11y-initialized])').forEach((tooltip) => {
    tooltip.setAttribute('data-a11y-initialized', 'true');

    // Show tooltip on focus or mouseenter
    ['focus', 'mouseenter'].forEach((eventType) => {
      addListener(tooltip, eventType, () => showTooltip(tooltip));
    });

    // Handle keyboard interactions
    addListener(tooltip, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showTooltip(tooltip);
        tooltip.classList.toggle('tooltip-active');
      }

      if (e.key === 'Escape' && (
        tooltip.classList.contains('tooltip-active')
        || getComputedStyle(tooltip, ':before').display === 'block'
      )) {
        e.preventDefault();
        hideTooltip(tooltip);
      }
    });
  });

  // Add document-level Escape key handler (once only)
  if (!document.documentElement.dataset.escapeInitialized) {
    document.documentElement.dataset.escapeInitialized = 'true';
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.milo-tooltip').forEach(hideTooltip);
      }
    });
  }
};

// Export default for direct import
export default initTooltips;
