import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { CaaSSection } from "./caas.section";
import { VerbWidgetSection } from "./verbwidget.section";

export class UnityPage extends classes(DcGnavPage, VerbWidgetSection, CaaSSection) {
  constructor(contentPath) {
    super({
      super: DcGnavPage,
      arguments: [contentPath],
    });
    this.buildProps({
      howToDefault: 'div[data-path*="how-to/default"]',
      howTo2ndConversion: '[data-tag="2nd conversion"] div[data-path*="how-to/2nd-conversion"]',
      verbSubfooter: '.verb-subfooter',
      reviewComponent: '.review',
      reviewStats: '.hlx-ReviewStats',
      reviewSubmitResponse: '.hlx-submitResponse',
      reviewDisabled: '.hlx-Review-ratingFields[disabled]',
      reviewCommentField: '.hlx-Review-commentFields textarea',
      reviewCommentSubmit: '.hlx-Review-commentFields input[type="submit"]',
      reviewInputField: 'fieldset.hlx-Review-ratingFields input',
      signUp: '[href*="https://auth.services.adobe.com"][href*="signup"]',
      extensionModal: '#chromeext, #edgeext',
      closeExtensionModal: '#chromeext .dialog-close, #edgeext .dialog-close',
      eventwrapperOnload: '.eventwrapper.onload',
      previewDescription: 'div[class*="previewDescription"]',
    });
  }

  reviewStartInput(rating) {
    return this.native.locator(`.hlx-Review-ratingFields input[value="${rating}"]`);
  }
}
