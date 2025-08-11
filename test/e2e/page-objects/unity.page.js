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
      previewDescription: 'div[class*="previewDescription"]',
      verbErrorText: '.verb-errorText:visible',
      widgetCompressButton: '*[data-testid="ls-footer-primary-compress-button"]',
      widgetToast: '*[class$="-Toast-content"]',
      widgetUpsellHeading: 'h1[data-testid$="-upsell-heading"]',
      paywall: 'h2[data-testid="paywall-header-subtitle"]',
      splashLoader: '.splash-loader:visible',
      continueWithAdobeButton: 'button[data-testid="adobe-sign-in-button"]',
      dcWebDownloadButton: 'button[data-test-id="gnav-download-button"]',
      dcWebCancelButton: 'button[data-test-id="gnav-cancel-button"]',
      dcWebContinueButton: 'button[data-test-id="gnav-save-button"]',
      dcWebSplitPageButton: 'button#split-1',
      dcWebSplitPageTooltip: 'div[role="tooltip"][data-test-id="Begin file 2"]',
      dcWebYourDocuments: 'nav[data-testid="asset-list-title"]',
      dcWebFilenameHeader: 'div[class*="FilenameHeader__name___"]',
      dcWebWidgetDownloadButton: 'button[class*="Download__downloadButton"]',
      dcWebWidgetConvertButton: 'button[data-testid="ls-footer-primary-convert-button"]',
      dcWebWidgetUpsell: 'div.verb-upsell-active',
      dcWebWidgetFileReady: 'h1[class*="ReadyText__heading___"]',
    });
  }

  reviewStartInput(rating) {
    return this.native.locator(`.hlx-Review-ratingFields input[value="${rating}"]`);
  }

  dcWebButton(text) {
    return this.native.locator(`.spectrum-Button:has-text("${text}")`);
  }
}
