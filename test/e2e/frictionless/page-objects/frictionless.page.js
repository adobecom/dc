import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { PdfWidgetSection } from "./pdfwidget.section";

export class FrictionlessPage extends classes(DcGnavPage, PdfWidgetSection) {
  constructor(contentPath) {
    let locContentPath = contentPath;
    // if locale is specified, add to the path
    if (global.config.profile.locale) {
      locContentPath = locContentPath.replace(/^\/*|\/*$/g, '');
      if (global.config.profile.locale === 'us') {
        locContentPath = `/${locContentPath}`;
      } else {
        locContentPath = `/${global.config.profile.locale}/${locContentPath}`;
      }
    }
    super({
      super: DcGnavPage,
      arguments: [locContentPath],
    });
    this.buildProps({
      howToDefault: 'div[data-path*="how-to/default"]',
      howTo2ndConversion: '[data-tag="2nd conversion"] div[data-path*="how-to/2nd-conversion"]',
      verbSubfooter: '.verb-subfooter',
      reviewStats: '.hlx-ReviewStats',
      reviewSubmitResponse: '.hlx-submitResponse',
      reviewDisabled: '.hlx-Review-ratingFields[disabled]',
      reviewCommentField: '.hlx-Review-commentFields textarea',
      reviewCommentSubmit: '.hlx-Review-commentFields input[type="submit"]',
      reviewInputField: 'fieldset.hlx-Review-ratingFields input',
      signUp: '[href*="https://auth.services.adobe.com"][href*="signup"]',
      extensionModal: '#chromeext',
      closeExtensionModal: '#chromeext .dialog-close',
    });
  }

  reviewStartInput(rating) {
    return this.native.locator(`.hlx-Review-ratingFields input[value="${rating}"]`); 
  }
}
