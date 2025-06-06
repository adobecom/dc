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

      await threeInOne();

      const processedElement = mockParent.querySelector('a');

      // Check attributes were modified correctly
      expect(processedElement.getAttribute('data-modal')).toBeNull();
      expect(processedElement.getAttribute('data-modal-id')).toBeNull();
      expect(processedElement.getAttribute('data-checkout-workflow-step')).toBe('email');

      // Check href was updated
      const expectedHref = `${mockCommerceOrigin}/store/commitment?items%5B0%5D%5Bid%5D=7C30A05FE0EC0BA92566737E720C4692&cli=doc_cloud&ctx=fp&co=US&lang=en`;
      expect(processedElement.href).toBe(expectedHref);
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
      expect(element.getAttribute('data-checkout-workflow-step')).toBeNull();
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
      expect(element.getAttribute('data-checkout-workflow-step')).toBeNull();
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
      expect(element.getAttribute('data-checkout-workflow-step')).toBe('email');
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
      expect(processedElement1.getAttribute('data-checkout-workflow-step')).toBe('email');
      expect(processedElement1.href).toContain('commerce.adobe.com');

      // Second element should not be processed
      expect(processedElement2.getAttribute('data-modal')).toBe('other');
      expect(processedElement2.getAttribute('data-checkout-workflow-step')).toBeNull();
      expect(processedElement2.href).toContain('href2');

      // Third element should be processed
      expect(processedElement3.getAttribute('data-modal')).toBeNull();
      expect(processedElement3.getAttribute('data-checkout-workflow-step')).toBe('email');
      expect(processedElement3.href).toContain('commerce.adobe.com');
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

  describe('offerMap integration', () => {
    it('should use correct URLs from offerMap', async () => {
      const testCases = [
        {
          offerId: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
          expectedPath: '/store/commitment?items%5B0%5D%5Bid%5D=7C30A05FE0EC0BA92566737E720C4692&cli=doc_cloud&ctx=fp&co=US&lang=en',
        },
        {
          offerId: 'vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE',
          expectedPath: '/store/email?items%5B0%5D%5Bid%5D=4F5EFB5713F74AFFC5960C031FB24656&items%5B0%5D%5Bq%5D=2&cli=doc_cloud&ctx=fp&co=US&lang=en',
        },
      ];

      for (const testCase of testCases) {
        // Clear previous elements
        document.body.innerHTML = '';

        const parent = document.createElement('div');
        const element = document.createElement('a');
        parent.appendChild(element);
        document.body.appendChild(parent);

        element.setAttribute('data-wcs-osi', testCase.offerId);
        element.setAttribute('data-modal', 'crm');

        await threeInOne();

        const processedElement = parent.querySelector('a');
        const expectedHref = `${mockCommerceOrigin}${testCase.expectedPath}`;
        expect(processedElement.href).toBe(expectedHref);
      }
    });
  });
});
