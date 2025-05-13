import { expect } from '@esm-bundle/chai';
import * as sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';

/**
 * Helper to create tooltip elements for testing
 * @param {number} count - Number of tooltip elements to create
 * @returns {NodeListOf<Element>} - NodeList of created tooltip elements
 */
function createTooltipElements(count = 1) {
  // Remove any existing tooltip elements
  document.querySelectorAll('.milo-tooltip').forEach((el) => el.remove());

  for (let i = 0; i < count; i += 1) {
    const tooltip = document.createElement('button');
    tooltip.classList.add('milo-tooltip', 'hide-tooltip');
    tooltip.setAttribute('aria-label', `Tooltip ${i + 1}`);
    tooltip.textContent = `Tooltip ${i + 1}`;
    document.body.appendChild(tooltip);
  }

  return document.querySelectorAll('.milo-tooltip');
}

describe('Tooltips Module', () => {
  let tooltipsModule;
  let clock;

  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/tooltips.head.html' });
    clock = sinon.useFakeTimers();
    tooltipsModule = await import('../../acrobat/scripts/tooltips.js');
  });

  afterEach(() => {
    // Clean up any tooltips
    document.querySelectorAll('.milo-tooltip').forEach((el) => el.remove());
    sinon.resetHistory();
  });

  after(() => {
    clock.restore();
    sinon.restore();
  });

  describe('showTooltip function', () => {
    it('should remove the hide-tooltip class', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

      tooltipsModule.showTooltip(tooltip);

      expect(tooltip.classList.contains('hide-tooltip')).to.be.false;
    });
  });

  describe('hideTooltip function', () => {
    it('should add the hide-tooltip class and remove tooltip-active class', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      tooltip.classList.remove('hide-tooltip');
      tooltip.classList.add('tooltip-active');

      tooltipsModule.hideTooltip(tooltip);

      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;
      expect(tooltip.classList.contains('tooltip-active')).to.be.false;
    });

    it('should set up event listeners to reset visibility', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      // Spy on the element's addEventListener method instead of the module method
      const addEventListenerSpy = sinon.spy(tooltip, 'addEventListener');

      tooltipsModule.hideTooltip(tooltip);

      // Verify event listeners were added
      expect(addEventListenerSpy.calledTwice).to.be.true;
      expect(addEventListenerSpy.firstCall.args[0]).to.equal('mouseleave');
      expect(addEventListenerSpy.secondCall.args[0]).to.equal('blur');
      expect(addEventListenerSpy.firstCall.args[2]).to.deep.include({ once: true });

      addEventListenerSpy.restore();
    });

    it('should reset tooltip visibility when mouseleave event is triggered after hiding', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      // First hide the tooltip
      tooltipsModule.hideTooltip(tooltip);

      // Verify tooltip is hidden
      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

      // Simulate mouseleave event which should trigger the resetHideClass callback
      const mouseleaveEvent = new Event('mouseleave');
      tooltip.dispatchEvent(mouseleaveEvent);

      // Verify the tooltip is now visible (hide-tooltip class removed)
      expect(tooltip.classList.contains('hide-tooltip')).to.be.false;
    });

    it('should reset tooltip visibility when blur event is triggered after hiding', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      // First hide the tooltip
      tooltipsModule.hideTooltip(tooltip);

      // Verify tooltip is hidden
      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

      // Simulate blur event which should trigger the resetHideClass callback
      const blurEvent = new Event('blur');
      tooltip.dispatchEvent(blurEvent);

      // Verify the tooltip is now visible (hide-tooltip class removed)
      expect(tooltip.classList.contains('hide-tooltip')).to.be.false;
    });
  });

  describe('addListener function', () => {
    it('should add an event listener to the element', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];
      const handler = sinon.spy();

      const addEventListenerSpy = sinon.spy(tooltip, 'addEventListener');

      tooltipsModule.addListener(tooltip, 'click', handler, { capture: true });

      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(addEventListenerSpy.firstCall.args[0]).to.equal('click');
      expect(addEventListenerSpy.firstCall.args[1]).to.equal(handler);
      expect(addEventListenerSpy.firstCall.args[2]).to.deep.include({ capture: true });

      addEventListenerSpy.restore();
    });
  });

  describe('initTooltips function', () => {
    it('should initialize tooltips that are not already initialized', () => {
      const tooltips = createTooltipElements(2);

      // Mark one tooltip as already initialized
      tooltips[0].setAttribute('data-a11y-initialized', 'true');

      // Spy on the tooltips' addEventListener methods instead of the module method
      const addEventListenerSpy1 = sinon.spy(tooltips[0], 'addEventListener');
      const addEventListenerSpy2 = sinon.spy(tooltips[1], 'addEventListener');

      tooltipsModule.initTooltips();

      // Should only initialize the tooltip that wasn't already initialized
      expect(tooltips[1].getAttribute('data-a11y-initialized')).to.equal('true');

      // First tooltip should not have event listeners added (already initialized)
      expect(addEventListenerSpy1.called).to.be.false;

      // Second tooltip should have 3 event listeners: focus, mouseenter, keydown
      expect(addEventListenerSpy2.callCount).to.equal(3);
      expect(addEventListenerSpy2.args.map((arg) => arg[0])).to.include.members(['focus', 'mouseenter', 'keydown']);

      addEventListenerSpy1.restore();
      addEventListenerSpy2.restore();
    });

    it('should add document-level Escape key handler once', () => {
      // Clear any previous escape initialization
      delete document.documentElement.dataset.escapeInitialized;

      createTooltipElements(1);

      const addEventListenerSpy = sinon.spy(document, 'addEventListener');

      tooltipsModule.initTooltips();

      expect(document.documentElement.dataset.escapeInitialized).to.equal('true');
      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(addEventListenerSpy.firstCall.args[0]).to.equal('keydown');

      // Should not add event listener again
      tooltipsModule.initTooltips();
      expect(addEventListenerSpy.calledOnce).to.be.true;

      addEventListenerSpy.restore();
    });

    it('should handle Enter/Space key presses on tooltips', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      tooltipsModule.initTooltips();

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = sinon.spy(enterEvent, 'preventDefault');

      tooltip.dispatchEvent(enterEvent);

      expect(preventDefaultSpy.calledOnce).to.be.true;
      expect(tooltip.classList.contains('hide-tooltip')).to.be.false;
      expect(tooltip.classList.contains('tooltip-active')).to.be.true;

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      const spacePreventDefaultSpy = sinon.spy(spaceEvent, 'preventDefault');

      tooltip.dispatchEvent(spaceEvent);

      expect(spacePreventDefaultSpy.calledOnce).to.be.true;
      expect(tooltip.classList.contains('tooltip-active')).to.be.false;
    });

    it('should hide tooltips on Escape key when tooltip-active class is present', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      tooltipsModule.initTooltips();

      // Add active class to tooltip
      tooltip.classList.add('tooltip-active');
      tooltip.classList.remove('hide-tooltip');

      // Create escape event
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = sinon.spy(escapeEvent, 'preventDefault');

      tooltip.dispatchEvent(escapeEvent);

      expect(preventDefaultSpy.calledOnce).to.be.true;
      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;
      expect(tooltip.classList.contains('tooltip-active')).to.be.false;
    });

    it('should hide tooltips on Escape key when pseudo-element is displayed', () => {
      const tooltips = createTooltipElements(1);
      const tooltip = tooltips[0];

      // Mock getComputedStyle to simulate the :before pseudo-element being displayed
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = sinon.stub().callsFake((element, pseudo) => {
        if (element === tooltip && pseudo === ':before') {
          return { display: 'block' };
        }
        return originalGetComputedStyle(element, pseudo);
      });

      tooltipsModule.initTooltips();

      // Remove hide-tooltip class but don't add tooltip-active
      // This tests the second condition in the if statement
      tooltip.classList.remove('hide-tooltip');

      // Create escape event
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = sinon.spy(escapeEvent, 'preventDefault');

      tooltip.dispatchEvent(escapeEvent);

      expect(preventDefaultSpy.calledOnce).to.be.true;
      expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

      // Restore original getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
    });

    it('should hide all tooltips on document-level Escape key press', () => {
      // Create multiple tooltips
      const tooltips = createTooltipElements(3);

      tooltipsModule.initTooltips();

      // Make all tooltips visible
      tooltips.forEach((tooltip) => {
        tooltip.classList.remove('hide-tooltip');
      });

      // Verify all tooltips are visible
      expect(document.querySelectorAll('.milo-tooltip.hide-tooltip').length).to.equal(0);

      // Create and dispatch escape event at document level
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      // Verify all tooltips are now hidden
      expect(document.querySelectorAll('.milo-tooltip.hide-tooltip').length).to.equal(3);
    });
  });

  describe('Default export', () => {
    it('should export initTooltips as default', () => {
      expect(tooltipsModule.default).to.equal(tooltipsModule.initTooltips);
    });
  });
});
