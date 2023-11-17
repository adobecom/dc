import { Section } from '@amwp/platform-ui-automation/lib/common/page-objects/section';

export class PdfWidgetSection extends Section {
  constructor() {
    super();
    this.buildProps({
      selectButton: '#lifecycle-nativebutton',
      fileUploadInput: '//input[contains(@class,"FileUpload")]',
      dropZoneInput: '//input[contains(@class,"DropzoneContent")]',
      downloadButton: 'button[data-test-id="download"], button[data-testid*="download"]',
      filenameHeader: '//div[contains(@class, "FilenameHeader__name")]',
      selectFormat: 'button#select-format',
      convertButton: 'button[data-test-id*="convert"]',
      mergeButton: 'button[data-test-id*="merge"]',
      continueWithAdobe: 'button[data-test-id="adobe-social-cta-button"]',
      checkmark: 'svg[data-test-id="checkmark"]',
      pdfIsReady: '[class*="ReadyText__heading___"]',
      cannotDownload: 'div[class*="cannotDownload"]',
      upsellWall: 'div[class^="UpsellWallSocial__upsell___"]',
      oneTapPrompt: '[id="credential_picker_container"]',
      dcWebDownload: 'button[aria-label="Download"]',
      dcWebFnsOverlay: '[data-testid="fns-overlay"]',
      dcWebHome: '[href*="/link/home"]',
      dcWebDocumentsTab: '//div[@role="tab"]//span[text()="Documents"]/..',
      dcWebCheckAllFiles: '//div[contains(@class, "Files")]//input[@title="Select All"]',
      dcWebDelete: '//button[@data-test-id="delete-action-button"]',
      rotateRightButton: 'button[id="rotate-right"]',
      addSignature: 'div[data-testid*="add-signature"]',
      addInitials: 'div[data-testid*="add-initials"]',
      applyButton: 'button[data-test-id="apply-btn"]',
      signInButton: 'button[data-test-id="sign-in-btn"]',
      signInModal: 'div[data-test-id="sign-in-modal-content"]',
      lifecyleComplete: 'div[class*="LifecycleComplete"],div[class*="lifecycle-settings"]',
    });
  }

  imageFormatItem(format) {
    return this.native.locator(`//div[@role="option"]//span[text()="${format}"]/..`);
  }

  async uploadFiles(filePaths) {
    await this.fileUploadInput.setInputFiles(filePaths);
  }

  async download() {
    await this.downloadButton.waitFor({ timeout: 180000 });
    await this.downloadButton.click({ timeout: 180000 });
  }

  async selectImageFormat(format) {
    await this.selectFormat.click();
    await this.imageFormatItem(format).click();
  }
}
