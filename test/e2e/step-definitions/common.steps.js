const { request } = require('@playwright/test');
import { Then } from "@cucumber/cucumber";

Then(/^I load test data from sharepoint "([^\"]*)" under this path "([^\"]*)"$/, async function (url, path) {
    const context = await request.newContext({ baseURL: url });
    const res = await context.fetch(path);
    this.page.testData = await res.json();
});

Then(/^I enable network logging$/, async function () {
    let networklogs = [];
    this.networklogs = networklogs;
    console.log('Before all tests: Enable network logging');
    // Enable network logging
    await this.page.native.route('**', (route) => {
      const url = route.request().url();
      if (url.includes('sstats.adobe.com/ee/or2/v1/interact') || url.includes('sstats.adobe.com/ee/or2/v1/collect')) {
        networklogs.push(url);
        // eslint-disable-next-line max-len, no-underscore-dangle
        networklogs.push(JSON.stringify(route.request().postDataJSON().events[0].data._adobe_corpnew.digitalData.primaryEvent));
      }
      route.continue();
    });
});

Then(/^I disable network logging$/, async function () {
    console.log(this.networklogs);
    console.log('After all tests: Disable network logging');
    // Disable network logging
    await this.page.native.unroute('**');
    await this.page.native.close();
});