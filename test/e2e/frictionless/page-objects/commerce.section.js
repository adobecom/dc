import { Section } from '@amwp/platform-ui-automation/lib/common/page-objects/section';

export class CommerceSection extends Section {
  constructor() {
    super();
    this.buildProps({
      checkoutPrice: '[class*=CartItemView__item-price] > span',
    });
  }

  async getInlinePrice(productCard) {
    let selector;
    if (typeof productCard === 'number') {
      selector = `.merch-card:nth-child(${productCard + 1}) [is="inline-price"] .price`;
    } else if (typeof menu === 'string') {
      selector = `.merch-card #${productCard} ~ .consonant-PlansCard-description .price`;
    }

    return await this.native.locator(selector).getAttribute('aria-label');
  }

  async clickCheckoutLink(productCard, link) {
    let selector;
    if (typeof productCard === 'number') {
      selector = `.merch-card:nth-child(${productCard + 1}) [is="checkout-link"][daa-ll^='${link}']`;
    } else if (typeof menu === 'string') {
      selector = `.merch-card #${productCard} ~ .consonant-CardFooter [is="checkout-link"][daa-ll^='${link}']`;
    }
    await this.native.locator(selector).click();
  }
}
