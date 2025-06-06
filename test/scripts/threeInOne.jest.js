/**
 * @jest-environment jsdom
 */

/* eslint-env jest */

import threeInOne from '../../acrobat/scripts/threeInOne.js';

// Mock the commerceOrigin for testing
const mockCommerceOrigin = 'https://commerce.adobe.com';

describe('threeInOne', () => {
  let mockElement;
  let mockParent;

  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = '';

    // Reset any intervals
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Create mock elements
    mockParent = document.createElement('div');
    mockElement = document.createElement('a');
    mockParent.appendChild(mockElement);
    document.body.appendChild(mockParent);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('mas:resolved event listener', () => {
    it('should add threeInOneReady class when target is a checkout link', () => {
      const mockTarget = {
        isCheckoutLink: true,
        classList: { add: jest.fn() },
      };

      const event = new CustomEvent('mas:resolved');
      Object.defineProperty(event, 'target', {
        value: mockTarget,
        writable: false,
      });

      // Dispatch the event
      document.dispatchEvent(event);

      // Fast forward timers to trigger the interval
      jest.advanceTimersByTime(100);

      expect(mockTarget.classList.add).toHaveBeenCalledWith('threeInOneReady');
    });

    it('should not add class immediately if target is not a checkout link', () => {
      const mockTarget = {
        isCheckoutLink: false,
        classList: { add: jest.fn() },
      };

      const event = new CustomEvent('mas:resolved');
      Object.defineProperty(event, 'target', {
        value: mockTarget,
        writable: false,
      });

      document.dispatchEvent(event);
      jest.advanceTimersByTime(100);

      expect(mockTarget.classList.add).not.toHaveBeenCalled();
    });

    it('should eventually add class when target becomes a checkout link', () => {
      const mockTarget = {
        isCheckoutLink: false,
        classList: { add: jest.fn() },
      };

      const event = new CustomEvent('mas:resolved');
      Object.defineProperty(event, 'target', {
        value: mockTarget,
        writable: false,
      });

      document.dispatchEvent(event);

      // Initially not a checkout link
      jest.advanceTimersByTime(100);
      expect(mockTarget.classList.add).not.toHaveBeenCalled();

      // Now becomes a checkout link
      mockTarget.isCheckoutLink = true;
      jest.advanceTimersByTime(100);

      expect(mockTarget.classList.add).toHaveBeenCalledWith('threeInOneReady');
    });
  });

  describe('threeInOne function', () => {
    it('should process elements with data-wcs-osi and data-modal="crm"', async () => {
      // Setup element with required attributes
      mockElement.setAttribute('data-wcs-osi', 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs');
      mockElement.setAttribute('data-modal', 'crm');
      mockElement.setAttribute('data-modal-id', 'some-id');
      mockElement.href = 'original-href';

      // Mock cloneNode to properly copy attributes
      const originalCloneNode = mockElement.cloneNode;
      mockElement.cloneNode = jest.fn().mockImplementation((deep) => {
        const clone = originalCloneNode.call(mockElement, deep);
        // Ensure the clone has a proper classList with contains method
        const mockContains = jest.fn().mockReturnValue(true);
        clone.classList = {
          contains: mockContains,
          add: jest.fn(),
        };
        return clone;
      });

      await threeInOne();

      const processedElement = mockParent.querySelector('a');

      // Check attributes were modified correctly
      expect(processedElement.getAttribute('data-modal')).toBeNull();
      expect(processedElement.getAttribute('data-modal-id')).toBeNull();

      // Restore original cloneNode
      mockElement.cloneNode = originalCloneNode;
    });

    it('should not process elements without data-modal="crm"', async () => {
      mockElement.setAttribute('data-wcs-osi', 'test-offer-1');
      mockElement.setAttribute('data-modal', 'other');
      mockElement.setAttribute('data-modal-id', 'some-id');
      const originalHref = 'original-href';
      mockElement.href = originalHref;

      await threeInOne();

      const element = mockParent.querySelector('a');

      // Attributes should remain unchanged
      expect(element.getAttribute('data-modal')).toBe('other');
      expect(element.getAttribute('data-modal-id')).toBe('some-id');
      expect(element.href).toContain(originalHref);
    });

    it('should not process elements without data-wcs-osi', async () => {
      mockElement.setAttribute('data-modal', 'crm');
      mockElement.setAttribute('data-modal-id', 'some-id');
      const originalHref = 'original-href';
      mockElement.href = originalHref;

      await threeInOne();

      const element = mockParent.querySelector('a');

      // Attributes should remain unchanged
      expect(element.getAttribute('data-modal')).toBe('crm');
      expect(element.getAttribute('data-modal-id')).toBe('some-id');
      expect(element.href).toContain(originalHref);
    });

    it('should handle elements with unknown offer IDs', async () => {
      mockElement.setAttribute('data-wcs-osi', 'unknown-offer-id');
      mockElement.setAttribute('data-modal', 'crm');
      mockElement.setAttribute('data-modal-id', 'some-id');
      const originalHref = 'original-href';
      mockElement.href = originalHref;

      await threeInOne();

      const element = mockParent.querySelector('a');

      // Attributes should be modified but href should remain unchanged
      expect(element.getAttribute('data-modal')).toBeNull();
      expect(element.getAttribute('data-modal-id')).toBeNull();
      expect(element.href).toContain(originalHref);
    });

    it('should process multiple elements correctly', async () => {
      // Create multiple elements
      const element1 = document.createElement('a');
      const element2 = document.createElement('a');
      const element3 = document.createElement('a');

      const parent1 = document.createElement('div');
      const parent2 = document.createElement('div');
      const parent3 = document.createElement('div');

      parent1.appendChild(element1);
      parent2.appendChild(element2);
      parent3.appendChild(element3);

      document.body.appendChild(parent1);
      document.body.appendChild(parent2);
      document.body.appendChild(parent3);

      // Setup first element (should be processed)
      element1.setAttribute('data-wcs-osi', 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs');
      element1.setAttribute('data-modal', 'crm');
      element1.href = 'href1';

      // Setup second element (should not be processed - wrong modal type)
      element2.setAttribute('data-wcs-osi', 'ZZQMV2cU-SWQoDxuznonUFMRdxSyTr4J3fB77YBNakY');
      element2.setAttribute('data-modal', 'other');
      element2.href = 'href2';

      // Setup third element (should be processed)
      element3.setAttribute('data-wcs-osi', 'vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE');
      element3.setAttribute('data-modal', 'crm');
      element3.href = 'href3';

      await threeInOne();

      const processedElement1 = parent1.querySelector('a');
      const processedElement2 = parent2.querySelector('a');
      const processedElement3 = parent3.querySelector('a');

      // First element should be processed
      expect(processedElement1.getAttribute('data-modal')).toBeNull();

      // Second element should not be processed
      expect(processedElement2.getAttribute('data-modal')).toBe('other');

      // Third element should be processed
      expect(processedElement3.getAttribute('data-modal')).toBeNull();
    });

    it('should clone element and wait for threeInOneReady class', async () => {
      mockElement.setAttribute('data-wcs-osi', 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs');
      mockElement.setAttribute('data-modal', 'crm');
      mockElement.classList.add('original-class');

      // Mock cloneNode to track calls
      const originalCloneNode = mockElement.cloneNode;
      const mockClone = document.createElement('a');
      const mockContains = jest.fn().mockReturnValue(false);
      mockClone.classList = {
        contains: mockContains,
        add: jest.fn(),
      };
      // Copy attributes from original element to clone
      Array.from(mockElement.attributes).forEach((attr) => {
        mockClone.setAttribute(attr.name, attr.value);
      });
      mockElement.cloneNode = jest.fn().mockReturnValue(mockClone);

      await threeInOne();

      expect(mockElement.cloneNode).toHaveBeenCalledWith(true);

      // Simulate the clone getting the threeInOneReady class
      mockContains.mockReturnValue(true);
      jest.advanceTimersByTime(100);

      // Restore original method
      mockElement.cloneNode = originalCloneNode;
    });

    it('should handle elements without parent', async () => {
      // Create an element without a parent
      const orphanElement = document.createElement('a');
      // Use an unknown offer ID so it doesn't try to replace the element
      orphanElement.setAttribute('data-wcs-osi', 'unknown-offer-id');
      orphanElement.setAttribute('data-modal', 'crm');

      // Add to document but remove parent reference
      document.body.appendChild(orphanElement);
      Object.defineProperty(orphanElement, 'parentElement', {
        value: null,
        writable: true,
      });

      // Should not throw error since unknown offer ID won't trigger replaceChild
      await expect(threeInOne()).resolves.not.toThrow();
    });

    it('should throw error when trying to replace element with null parent', async () => {
      // Create an element without a parent
      const orphanElement = document.createElement('a');
      // Use a known offer ID that will trigger replaceChild
      orphanElement.setAttribute('data-wcs-osi', 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs');
      orphanElement.setAttribute('data-modal', 'crm');

      // Add to document but remove parent reference
      document.body.appendChild(orphanElement);
      Object.defineProperty(orphanElement, 'parentElement', {
        value: null,
        writable: true,
      });

      // Should throw error when trying to replaceChild on null parent
      await expect(threeInOne()).rejects.toThrow();
    });
  });
});
