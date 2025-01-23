import { Then } from "@cucumber/cucumber";
import { DcGnavPage } from "../page-objects/dcgnav.page";
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
import { PasswordProtectPdfPage } from "../page-objects/passwordprotectpdf.page";
import { FrictionlessPage } from "../page-objects/frictionless.page";
import { UnityPage } from "../page-objects/unity.page";
import { DCPage } from "../page-objects/dc.page";
import { cardinal } from "../support/cardinal";
import { expect } from "@playwright/test";
const os = require("os");
const path = require("path");
const fs = require("fs");
const YAML = require('js-yaml');
import { getComparator } from 'playwright-core/lib/utils';

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
    "password-protect-pdf": PasswordProtectPdfPage
  }[verb];
  this.page = new pageClass();

  await this.page.open();
});

Then(/^I go to the DC page '([^\"]*)'$/, async function (pageUrl) {
  this.page = new DCPage(pageUrl);
  await this.page.open();
});

Then(/^I go to the .ing site$/, async function () {
  this.page = new FrictionlessPage('/');
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

Then(/^I should see the upload completed$/, async function () {
  await expect.poll(() => this.page.lifecyleComplete.count()).toBeGreaterThan(0, { timeout: 60000 });
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

Then(/^I save rotated files$/, async function () {
  this.context(FrictionlessPage);
  await this.page.mergeButton.click({ timeout: 120000 });
});

Then(/^I rotate right the uploaded files$/, async function () {
  this.context(FrictionlessPage);
  await this.page.rotateRightButton.click({ timeout: 120000 });
});

Then(/^I rotate left first uploaded file$/, async function () {
  let file = "//div[@data-test-id='grid-item-wrapper-0']";
  let fileLeftRotateBtn = `${file}//button[@data-test-id='rotate-left-button']`;
  await this.page.native.locator(file).click({timeout: 2000});
  await this.page.native.locator(fileLeftRotateBtn).click({timeout: 2000});
});

Then(/^I click "Add (signature|initials)"$/, async function (sign) {
  this.context(FrictionlessPage);
  const elementToClick = sign === 'signature' ? this.page.addSignature : this.page.addInitials;
  await elementToClick.click({ timeout: 120000 });
});

Then(/^I fill up signature input$/, async function () {
  let signature = "//input[@data-test-id='type-sign-canvas']";
  await this.page.native.locator(signature).fill('Test signature');
  await this.page.applyButton.click({timeout: 2000});
});

Then(/^I sign up the document$/, async function () {
  let document = '#pageview-current-page';
  await this.page.native.locator(document).click({timeout: 2000});
});

Then(/^I should see (signature|initials)$/, async function (sign) {
  const element = sign === 'signature' ? "//div[@data-testid='fns-field-0']" : "//div[@data-testid='fns-field-1']";
  await expect(this.page.native.locator(element)).toBeVisible();
});

Then(/^I fill up (|confirm )password input$/, async function (confirm) {
  let pw;
  if (confirm) {
    pw = "//input[@type='password'][@data-test-id='protect-settings-confirm-password']";
  } else {
    pw = "//input[@type='password'][@data-test-id='protect-settings-input-password']";
  }
  await this.page.native.locator(pw).fill('Test123');
});

Then (/^I click 'Set password'$/, async function () {
  let btn = await this.page.native.locator("//button[@data-test-id='protect-settings-set-password-button']");
  await btn.click();
});

Then (/^I should see preview description$/, async function () {
  await expect(this.page.previewDescription).toBeVisible();
});

Then(/^I click "Sign in to download"$/, async function () {
  this.context(FrictionlessPage);
  await this.page.signInButton.click({ timeout: 120000 });
});

Then(/^I should see sign-in modal$/, async function () {
  await expect(this.page.signInModal).toBeVisible();
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

Then(/^I should (|not )see eventwrapper onload$/, async function (neg) {
  if (neg) {
    await expect(this.page.eventwrapperOnload).not.toBeVisible();
  } else {
    await expect(this.page.eventwrapperOnload).toBeVisible();
  }
});

Then(/^I should see upsell$/, async function () {
  await expect(this.page.upsellWall).toHaveCount(1, { timeout: 10000 });
});

Then(/^I should see the 2nd conversion how-to$/, async function () {
  await expect(this.page.howTo2ndConversion).toBeVisible({ timeout: 10000 });
});

Then(/^I should (|not )see the verb subfooter$/, async function (neg) {
  if (neg) {
    await expect(this.page.verbSubfooter).not.toBeVisible({ timeout: 10000 });
  } else {
    await expect(this.page.verbSubfooter).toBeVisible({ timeout: 10000 });
    const verbCount = await this.page.verbSubfooter.locator("a").count();
    expect(verbCount).toBeGreaterThan(20);
  }
});

Then(/^I should (|not )see the review component$/, async function (neg) {
  if (neg) {
    await expect(this.page.reviewComponent).not.toBeVisible();
  } else {
    await expect(this.page.reviewComponent).toBeVisible();
  }
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
    await expect(this.page.extensionModal).not.toBeVisible({ timeout: 10000 });
  } else {
    await expect(this.page.extensionModal).toBeVisible({ timeout: 10000 });
  }
});

Then(/^I dismiss the extension modal$/, async function () {
  await this.page.closeExtensionModal.click();
  await expect(this.page.extensionModal).not.toBeVisible();
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

Then(/^I click (.*) nav item in the header$/, async function (item) {
  this.context(FrictionlessPage);
  const index = cardinal(item);
  this.page.clickNavItem(index);
});

Then(/^I click "([^\"]*)" button in the header$/, async function (button) {
  this.context(FrictionlessPage);
  this.page.cta.click()
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

Then(/^I read expected analytics data with replacements "([^"]*)"$/, async function (replacements) {
  const baseDir = this.gherkinDocument.uri.replace('.feature', '');

  let ymlRaw = fs.readFileSync(`${baseDir}/analytics_spec.yml`, 'utf8');

  const kvs = replacements.split(',').map((x) => x.trim());
  for (const kv of kvs) {
    const keyValue = kv.split('=').map((x) => x.trim());
    if (keyValue.length === 1) {
      if (keyValue[0] === 'browser') {
        keyValue.push({chromium: 'Chrome', chrome: 'Chrome', msedge: 'MSFT-Edge'}[global.config.profile.browser]);
      }
    }
    ymlRaw = ymlRaw.replace(new RegExp(`<${keyValue[0]}>`, 'g'), keyValue[1]);
  }

  const events = YAML.load(ymlRaw);
  for (const event in events) {
    const normalizeLogs = [];
    if (events[event]) {
      for (const log of events[event]) {
        const normalizeLog = {};
        for (const key in log) {
          normalizeLog.key = key;
          normalizeLog.value = log[key];
        }
        normalizeLogs.push(normalizeLog);
      }
    }
    events[event] = normalizeLogs;
  }

  this.page.wikiAnalyticsData = events;
});

Then(/^I should see the CaaS block$/, async function () {
  await this.page.caasFragment.scrollIntoViewIfNeeded();
  await expect(this.page.caasFragment).toBeVisible({timeout: 30000});
  await expect(this.page.caas).toBeVisible({timeout: 30000});
});

Then(/^I should see the 'More resources' header$/, async function () {
  const headerContent = await this.page.caasFragment.locator('h2').first().textContent();
  await expect(headerContent).toEqual('More resources');
});

Then(/^I should see the CaaS block cards$/, async function () {
  await expect(this.page.caas.locator('.consonant-Card').first()).toBeVisible({timeout: 30000});
  const cardCount = await this.page.caas.locator('.consonant-Card').count();
  expect(cardCount).toBeGreaterThan(1);
});

Then(/^I click the "Read now" button inside the CaaS card$/, async function () {
  let href = await this.page.caasButton.nth(0).getAttribute('href');
  let target = await this.page.caasButton.nth(0).getAttribute('target');
  let retry = 3;

  while (retry > 0) {
    try {
      if (target === '_blank') {
        const pagePromise = PW.context.waitForEvent("page", { timeout: 5000 });
        await this.page.caasButton.nth(0).scrollIntoViewIfNeeded();
        await this.page.caasButton.nth(0).click();
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        this.page.native = newPage;
      } else {
        await this.page.caasButton.nth(0).click();
      }
      await expect(this.page.native).toHaveURL(href);
      retry = 0;
    } catch {
      retry--;
      await this.page.native.waitForTimeout(2000);
    }
  }
});


Then(/^I reload DocCloud "([^"]*)"$/, async function (path) {
  this.page = new DcGnavPage(path);

  await this.page.open();

  await this.page.native.waitForTimeout(1000);
  await this.page.native.goto(path);
});

Then(/^I should see "Signed in as" text$/, async function () {
  this.context(DCPage);
  await expect(this.page.signInLabel).toBeVisible({timeout: 5000});
});

Then(/^I click a "Commerce" Button$/, async function () {
  this.context(DCPage);
  const commerceButtons = await this.page.commerceButton;
  await this.page.commerceButton.nth(0).click();
});

Then(/^I should see the footer promo elements$/, async function () {
  this.context(DCPage);
  await expect(this.page.footerPromoHeading).toBeVisible({timeout: 5000});
  await expect(this.page.footerPromoBullets).toBeVisible({timeout: 5000});
});

Then(/^I should see that the prices match on checkout from the (.*) merch card(?:|s)$/, {timeout: 120000}, async function (items) {
  this.context(DCPage);

  let products = items.replace(/ and /g, ";").split(';');

  for (let index = 0; index < products.length; index++) {
    let price = await this.page.getInlinePrice(index);

    let checkoutLinks = products[index].split(',');
    checkoutLinks = checkoutLinks.map((x) => x.trim().replace(/[']/g, ""));

    for (let link of checkoutLinks) {
      let retry = 2;
      let checkoutPrice;
      while (retry > 0) {
        try {
          await this.page.clickCheckoutLink(index, link);
          checkoutPrice = await this.page.checkoutPrice.getAttribute("aria-label");
          break;
        } catch {
          retry--;
        }
      }
      await expect(price).toContain(checkoutPrice);

      console.log(`'${price}' matched the checkout price '${checkoutPrice}'`);

      await this.page.native.goBack();
    }
  }
});

Then(/^I scroll to the "([^"]*)" header$/, async function (header) {
  const xpath = `//*[self::h1 or self::h2 or self::h3][text()="${header}"]`;
  await this.page.native.locator(xpath).waitFor({timeout: 5000});
  await this.page.native.evaluate((xpath) => {
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    element.scrollIntoView();
  }, xpath);
});

Then(/^I close Onetrust pop up if present$/, async function () {
  const btnEnableAll = await this.page.native.locator('#onetrust-accept-btn-handler');
  if (btnEnableAll) {
    await expect(btnEnableAll).toBeVisible({timeout: 30000});
    btnEnableAll.click();
  }
});

Then(/^I should see a chat icon$/, async function () {
  const btnChat = await this.page.native.locator('#adbmsgCta');
  await expect(btnChat).toBeVisible({timeout: 30000});
});

Then(/^I click the chat button$/, async function () {
  const btnChat = await this.page.native.locator('#adbmsgCta');
  btnChat.click();
});

Then(/^I should see jarvis popup window$/, async function () {
  const jarvisPopup = await this.page.native.locator('#adbmsgContentContainer');
  await expect(jarvisPopup).toBeVisible({timeout: 8000});
});

Then(/^I should see How can I help you in jarvis popup window$/, async function () {
  const jarvisElement = await this.page.native.frameLocator("iframe[class*='adbmsgContentIframe']").getByText("How can I help you?");
  await expect(jarvisElement).toBeVisible({timeout: 8000});
});

Then(/^I should see inline PDF viewer$/, async function () {
  const element = await this.page.native.frameLocator("iframe[src*='https://acrobatservices.adobe.com/view-sdk']").getByText("SOLUTION BRIEF", {exact: true});
  await expect(element).toBeVisible({timeout: 10000})
})

Then(/^I switch to the new page$/, async function () {
  this.context(DCPage);
  const [newPage] = await Promise.all([
    PW.context.waitForEvent('page'),
  ]);
  await newPage.waitForLoadState();
  await newPage.bringToFront();
  this.page.native = newPage;
})

Then(/^I record phone number on the page$/, async function () {
  this.phoneNumber = await this.page.native.locator("a[daa-ll^='Device Phone']").textContent();
  console.log("Phone number without geo-ip:", this.phoneNumber);
})

Then(/^I go to the page "([^"]*)" with geo-ip spoof "([^"]*)"$/, async function (pageUrl, akamaiLocale) {
  this.page = new DCPage(pageUrl + '?akamaiLocale=' + akamaiLocale);
  await this.page.open();
})

Then(/^I confirm phone number is different and has geo-ip value "([^"]*)"$/, async function (geoIpPhoneNumberValue) {
  const geoIpPhoneNumber = await this.page.native.locator("a[daa-ll^='Device Phone']").textContent();
  console.log("Phone number with geo-ip:", geoIpPhoneNumber);
  expect(this.phoneNumber).not.toEqual(geoIpPhoneNumber);
  expect(geoIpPhoneNumber).toEqual(geoIpPhoneNumberValue);
})

Then(/^I (try to |)choose the (?:PDF|file|files) "([^\"]*)" to upload$/, async function (tryTo, filePath) {
  this.context(UnityPage);
  const filePaths = filePath.split(",");
  const absPaths = filePaths.map((x) => {
    const absPath = path.resolve(global.config.profile.site, x);
    // git hack to make the file empty
    if (/empty\.[a-zA-Z]*/.test(x)) {
      fs.writeFileSync(absPath, ''); 
    } else if (/bad\.[a-zA-Z]*/.test(x)) {
      fs.writeFileSync(absPath, 'bad'); 
    }
    return absPath;
  });
  let retry = 3;
  while (retry > 0) {
    try {
      if (retry < 3) {
        await this.page.native.reload({waitUntil: 'load'});
      }      
      await expect(this.page.selectButton).toHaveCount(1, { timeout: 15000 });
      await this.page.chooseFiles(absPaths);
      if (tryTo !== '') {
        break;
      }
      await this.page.native.waitForTimeout(2000);
      await expect(this.page.selectButton).toHaveCount(0, { timeout: 5000 });
      retry = 0;
    } catch {
      retry--;
    }
  }
});

Then(/^I drag-and-drop the (?:PDF|file|files) "([^\"]*)" to upload$/, async function (filePath) {
  this.context(UnityPage);
  const filePaths = filePath.split(",");
  const absPaths = filePaths.map((x) =>
    path.resolve(global.config.profile.site, x)
  );
  let retry = 3;
  while (retry > 0) {
    await expect(this.page.selectButton).toHaveCount(1, { timeout: 15000 });
    await this.page.native.waitForTimeout(2000);
    try {
      await this.page.dragndropFiles(absPaths);
      await this.page.native.waitForTimeout(2000);
      await expect(this.page.selectButton).toHaveCount(0, { timeout: 15000 });
      retry = 0;
    } catch {
      retry--;
    }
  }
});

Then(/^I sign in as a (type1|type2) user$/, async function (type) {
  const accounts = JSON.parse(fs.readFileSync(".auth/accounts.json", "utf8"));
  const account = accounts[type];
  this.page = new DCPage("https://www.stage.adobe.com");
  await this.page.open();
  await this.page.native.locator(".profile-comp").click();
  await this.page.native.locator("#EmailPage-EmailField").type(account.email + '\n');
  await this.page.native.waitForTimeout(2000);
  await this.page.native.locator(".spectrum-Button--cta").click();
  await this.page.native.locator("#PasswordPage-PasswordField").type(account.password + '\n');
  await this.page.native.waitForTimeout(2000);
  try {
    await this.page.native.locator(".spectrum-Button--cta").click();
  } catch {
  }
});

Then(/^I should see "([^"]*)" in the dropzone$/, async function (text) {
  this.context(UnityPage);
  await expect(this.page.native.locator('h1#lifecycle-drop-zone')).toHaveText(text);
});

Then(/^I have tried "compress-pdf" twice$/, async function () {
  this.context(UnityPage);
  const token = '2';
  await this.page.native.evaluate(token => localStorage.setItem('compress-pdf_trial', token), token);
  await this.page.native.reload({waitUntil: 'load'});
});

Then(/^I sign in as a (type1|type2) user using SUSI Light$/, async function (type) {
  const accounts = JSON.parse(fs.readFileSync(".auth/accounts.json", "utf8"));
  const account = accounts[type];
  await this.page.native.locator('susi-sentry-light #sentry-email-field').click();
  await this.page.native.locator('susi-sentry-light #sentry-email-field').type(account.email + '\n');
  await this.page.native.waitForTimeout(2000);
  await this.page.native.locator("#PasswordPage-PasswordField").type(account.password + '\n');
  await this.page.native.waitForTimeout(2000);
  try {
    await this.page.native.locator(".spectrum-Button--cta").click();
  } catch {
  }
});

Then(/^I should see "([^"]*)" in the error message$/, async function (text) {
  this.context(UnityPage);
  await expect(this.page.verbErrorText).toHaveText(text);
});

Then(/^I click the "([^"]*)" button on the feedback$/, async function (button) {
  this.context(UnityPage);
  await this.page.widgetCompressButton.click();
});

Then(/^I should see "([^"]*)" in the widget error toast$/, async function (text) {
  this.context(UnityPage);
  await expect(this.page.widgetToast).toHaveText(text);
});

Then(/^I should see "([^"]*)" in the widget upsell heading$/, async function (text) {
  this.context(UnityPage);
  await expect(this.page.widgetUpsellHeading).toHaveText(text);
});