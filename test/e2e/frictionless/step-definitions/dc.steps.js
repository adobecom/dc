import { Then } from "@cucumber/cucumber";
import { PdfToPptPage } from "../page-objects/pdftoppt.page";
import { PdfToWordPage } from "../page-objects/pdftoword.page";
import { PdfToExcelPage } from "../page-objects/pdftoexcel.page";
import { PdfToJpgPage } from "../page-objects/pdftojpg.page";
import { WordToPdfPage } from "../page-objects/wordtopdf.page";
import { JpgToPdfPage } from "../page-objects/jpgtopdf.page";
import { ExcelToPdfPage } from "../page-objects/exceltopdf.page";
import { PptToPdfPage } from "../page-objects/ppttopdf.page";
import { ConvertPdfPage } from "../page-objects/convertpdf.page";
import { SignPdfPage } from "../page-objects/signpdf.page";
import { RequestSignaturePage } from "../page-objects/requestsignature.page";
import { CropPdfPage } from "../page-objects/croppdf.page";
import { DeletePdfPagesPage } from "../page-objects/deletepdfpages.page";
import { RotatePdfPage } from "../page-objects/rotatepdf.page";
import { RearrangePdfPage } from "../page-objects/rearrangepdf.page";
import { SplitPdfPage } from "../page-objects/splitpdf.page";
import { AddPagesToPdfPage } from "../page-objects/addpagestopdf.page";
import { ExtractPdfPagesPage } from "../page-objects/extractpdfpages.page";
import { PdfEditorPage } from "../page-objects/pdfeditor.page";
import { MergePdfPage } from "../page-objects/mergepdf.page";
import { CompressPdfPage } from "../page-objects/compresspdf.page";
import { FrictionlessPage } from "../page-objects/frictionless.page";
import { cardinal } from "../support/cardinal";
import { expect } from "@playwright/test";
const os = require("os");
const path = require("path");
const fs = require("fs");
import { getComparator } from 'playwright-core/lib/utils';

async function enableNetworkLogging(page) {
  if (global.config.profile.enableAnalytics) {
    let networklogs = [];
    page.networklogs = networklogs;
    console.log('Before all tests: Enable network logging');
    // Enable network logging
    await page.native.route('**', (route) => {
      const url = route.request().url();
      networklogs.push(route.request());
      route.continue();
    });
  }  
}

Then(/^I have a new browser context$/, async function () {
  PW.context = await PW.browser.newContext(PW.contextOptions);
});

Then(/^I go to the ([^\"]*) page$/, async function (verb) {
  const pageClass = {
    "pdf-to-ppt": PdfToPptPage,
    "pdf-to-word": PdfToWordPage,
    "pdf-to-excel": PdfToExcelPage,
    "pdf-to-jpg": PdfToJpgPage,
    "word-to-pdf": WordToPdfPage,
    "jpg-to-pdf": JpgToPdfPage,
    "excel-to-pdf": ExcelToPdfPage,
    "ppt-to-pdf": PptToPdfPage,
    "convert-pdf": ConvertPdfPage,
    "sign-pdf": SignPdfPage,
    "request-signature": RequestSignaturePage,
    "crop-pdf": CropPdfPage,
    "delete-pdf-pages": DeletePdfPagesPage,
    "rotate-pdf": RotatePdfPage,
    "rearrange-pdf": RearrangePdfPage,
    "split-pdf": SplitPdfPage,
    "add-pages-to-pdf": AddPagesToPdfPage,
    "extract-pdf-pages": ExtractPdfPagesPage,
    "pdf-editor": PdfEditorPage,
    "merge-pdf": MergePdfPage,
    "compress-pdf": CompressPdfPage,
  }[verb];
  this.page = new pageClass();

  this.page.beforeOpen = enableNetworkLogging;

  await this.page.open();
});

Then(/^I upload the (?:PDF|file|files) "([^\"]*)"$/, async function (filePath) {
  this.context(FrictionlessPage);
  const filePaths = filePath.split(",");
  const absPaths = filePaths.map((x) =>
    path.resolve(global.config.profile.site, x)
  );
  let retry = 3;
  while (retry > 0) {
    await expect(this.page.selectButton).toHaveCount(1, { timeout: 15000 });
    await this.page.native.waitForTimeout(2000);
    try {
      await this.page.uploadFiles(absPaths);
      await this.page.native.waitForTimeout(2000);
      await expect(this.page.selectButton).toHaveCount(0, { timeout: 15000 });
      retry = 0;
    } catch {
      retry--;
    }
  }
});

Then(/^I download the converted file$/, { timeout: 200000 }, async function () {
  this.context(FrictionlessPage);

  // Prepare waiting for the download event
  const downloadPromise = this.page.native.waitForEvent("download");

  this.page.download();

  // Behavior diff:
  // Playwright downloads the file to a temp dir with a UUID file name.
  // Chrome downloads to Downloads dir with the new extension of
  // the original file name.
  const download = await downloadPromise;
  console.log("Downloaded file: " + (await download.path()));

  let convertedName = await this.page.filenameHeader.getAttribute("title");

  let saveAsName = path.resolve(
    require("os").homedir(),
    "Downloads",
    convertedName
  );
  await download.saveAs(saveAsName);
  console.log(`Saved as ${saveAsName}`);
});

Then(/^I choose "([^\"]*)" as the output format$/, async function (format) {
  this.context(FrictionlessPage);
  await this.page.selectFormat.waitFor({ timeout: 10000 });
  await this.page.selectImageFormat(format);
  await this.page.convertButton.click();
});

Then(/^I merge the uploaded files$/, async function () {
  this.context(FrictionlessPage);
  await this.page.mergeButton.click({ timeout: 120000 });
});

Then(/^I should not see any browser console errors$/, async function () {
  if (this.page.consoleMessages) {
    const errors = this.page.consoleMessages.filter(
      (x) => x.type() === "error"
    );
    for (let error of errors) {
      console.log(error.text());
    }
    expect(errors).toHaveLength(0);
  }
});

Then(/^I continue with AdobeID$/, { timeout: 120000 }, async function () {
  await this.page.continueWithAdobe.click({ timeout: 100000 });
});

Then(/^I wait for the conversion$/, { timeout: 180000 }, async function () {
  await expect(this.page.pdfIsReady).toBeVisible({ timeout: 150000 });
});

Then(/^I should see the default how-to$/, async function () {
  await expect(this.page.howToDefault).toBeVisible();
});

Then(/^I should see upsell$/, async function () {
  await expect(this.page.upsellWall).toHaveCount(1, { timeout: 10000 });
});

Then(/^I should see the 2nd conversion how-to$/, async function () {
  await expect(this.page.howTo2ndConversion).toBeVisible({ timeout: 10000 });
});

Then(/^I should see the verb subfooter$/, async function () {
  await expect(this.page.verbSubfooter).toBeVisible({ timeout: 10000 });
  const verbCount = await this.page.verbSubfooter.locator("a").count();
  expect(verbCount).toBeGreaterThan(20);
});

Then(/^I submit review feedback$/, async function () {
  this.context(FrictionlessPage);
  await this.page.reviewStartInput(3).click({timeout: 5000});
  await this.page.reviewCommentField.fill("Test");
  await this.page.reviewStartInput(5).click();
  await this.page.reviewCommentSubmit.click();   
});

Then(/^I should see the review stats$/, async function () {
  this.context(FrictionlessPage);
  await expect(this.page.reviewStats).toBeVisible({timeout: 5000});  
});

Then(/^I should see the review submit response$/, async function () {
  this.context(FrictionlessPage);
  await expect(this.page.reviewSubmitResponse).toBeVisible({timeout: 5000});  
});

Then(/^I download the pdf from DC web$/, async function () {
  this.context(FrictionlessPage);
  await this.page.dcWebDownload.waitFor({ timeout: 100000 });
  const downloadPromise = this.page.native.waitForEvent("download");
  await this.page.dcWebDownload.click();
  const download = await downloadPromise;
  console.log("Downloaded file: " + (await download.path()));
});

Then(/^I login to Google$/, async function () {
  let username = "//input[@type='email']";
  let pw = "//input[@type='password'][@aria-label='Enter your password']";

  await this.page.native.locator(username).waitFor();
  await this.page.native.locator(username).fill(process.env.ADOBEID_USERNAME);
  await this.page.native.locator(username).press('Enter');
  await this.page.native.waitForTimeout(2000);
  await this.page.native.locator(pw).waitFor();
  await this.page.native.locator(pw).fill(process.env.ADOBEID_PASSWORD);
  await this.page.native.locator(pw).press('Enter');
});

Then(/^I should see the Google credential picker$/, async function () {
  await expect(this.page.oneTapPrompt).toBeVisible();
});

Then(/^I click the Continue button inside the Google iFrame$/, async function () {
  const element = await this.page.native.frameLocator("iframe[src*='https://accounts.google.com/gsi/iframe']").getByText("Continue as");
  await element.waitFor();
  await element.click();
});

Then(/^I should see the file in DC Web$/, async function () {
  await expect(this.page.dcWebFnsOverlay).toBeVisible({timeout: 30000});
});

Then(/^I click the element "([^\"]*)"$/, async function (selector) {
  await this.page.native.locator(selector).click();
});

Then(/^I should see the element "([^\"]*)"$/, async function (selector) {
  await this.page.native.locator(selector).waitFor();
});

Then(/^I delete the file in DC Web$/, async function () {
  await this.page.dcWebHome.click();
  await this.page.dcWebDocumentsTab.click();
  await this.page.dcWebCheckAllFiles.click();
  await this.page.dcWebDelete.click();
});

Then(/^I should (|not )see a modal promoting the browser extension$/, { timeout: 180000 }, async function (neg) {
  if (neg) {
    await expect(this.page.extensionModal).not.toBeVisible();
  } else {
    await expect(this.page.extensionModal).toBeVisible();
  }
});

Then(/^I dismiss the extension modal$/, async function () {
  await this.page.closeExtensionModal.click();
});

Then(/^I (screenshot|should be able to open) the submenu of the (.*) menu item(?:|s)$/, async function (action, items) {
  this.context(FrictionlessPage);

  let menuItems = items.replace(/ and /g, ",").split(",");
  menuItems = menuItems.map((x) => x.trim()).filter((x) => x.length > 0);
  for (let item of menuItems) {  
    const index = cardinal(item);
    await this.page.openSubMenu(index);
    await expect(this.page.fedsPopup).toBeVisible();
    if (action === 'screenshot') {
      const profile = global.config.profile;
      let outputDir = this.gherkinDocument.uri.split('/features/')[1].replace('.feature', '');
      outputDir = `${profile.reportDir}/screenshots/${outputDir}/${os.platform()}/${profile.browser}`;
      await this.page.fedsPopup.screenshot({path: `${outputDir}/gnav-submenu-${item}.png`});
    }
    await this.page.closeSubMenu(index);
    await expect(this.page.fedsPopup).not.toBeVisible();
  }
});

/***
 * This step is used to compare the current screenshots with the baseline
 * screenshots. 
 * 
 * Baseline Folder: features/${feature-name}/${platform}/${browser}
 * Current Folder: ${report-dir}/screenshots/${feature-name}/${platform}/${browser} 
 * Diff Image: ${report-dir}/${platform}_${browser}_${image-name}.png
 * 
 * Command line options:
 * --baseBrowser: Use a different browser to compare with the current browser
*/
Then(/^I should see the same screenshots as baseline$/, async function () {
  const comparator = getComparator('image/png');
  let baseDir = this.gherkinDocument.uri.replace('.feature', '');

  const profile = global.config.profile;
  let outputDir = this.gherkinDocument.uri.split('/features/')[1].replace('.feature', '');
  outputDir = `${profile.reportDir}/screenshots/${outputDir}/${os.platform()}/${profile.browser}`;
  const images = fs.readdirSync(outputDir).filter(x => x.endsWith('.png'));

  const baseBrowser = profile.baseBrowser || profile.browser;

  const errors = [];
  for (let image of images) {
    const baseImage = fs.readFileSync(`${baseDir}/${os.platform()}/${baseBrowser}/${image}`);
    const currImage = fs.readFileSync(`${outputDir}/${image}`);
    let diffImage = comparator(baseImage, currImage);
    if (diffImage) {
      errors.push(image);
      fs.writeFileSync(`${profile.reportDir}/${os.platform()}_${profile.browser}_${image}`, diffImage.diff);
    }
  }
  if (errors.length > 0) {
    throw `Differences found: ${errors.join(', ')}`;
  }
});

Then(/^I should be able to use the "([^\"]*)" submenu$/, async function (menu) {
  this.context(FrictionlessPage);
  await this.page.openSubMenu(menu);
  await expect(this.page.fedsPopup).toBeVisible();
  await this.page.closeSubMenu(menu);
  await expect(this.page.fedsPopup).not.toBeVisible();
});

Then(/^I select the last item of the submenu of the ([^\"]*) menu item$/, async function (menu) {
  this.context(FrictionlessPage); 
  await this.page.openSubMenu(cardinal(menu));
  await this.page.selectFedsPopupItem(-1);
});

Then(/^I click "Buy now" button in the header$/, async function () {
  this.context(FrictionlessPage);
  this.page.buyNow.click()
});

Then(/^I switch to the new page after clicking "Buy now" button in the header$/, async function () {
  this.context(FrictionlessPage);
  const [newPage] = await Promise.all([
    PW.context.waitForEvent('page'),
    this.page.buyNow.click()
  ]);
  await newPage.waitForLoadState();
  this.page.native = newPage; 
});

