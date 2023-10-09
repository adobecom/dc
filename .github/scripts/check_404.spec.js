import { test, expect } from '@playwright/test';

test.use({
  contextOptions: {
    userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 ${process.env.USER_AGENT_SUFFIX}`,
  },
});

test('Check links in a page', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto(process.env.TEST_URL, { waitUntil: 'networkidle' });

  const allHrefs = await page.evaluate(() => {
    return Array.from(document.links).map((item) => item.href);
  });

  const hrefs = [...new Set(allHrefs)].sort();

  let output = [];
  for (let i = 0; i < hrefs.length; i++) {
    try {
      const response = await page.goto(hrefs[i]);

      for (
        let request = response.request();
        request;
        request = request.redirectedFrom()
      ) {
        const message = `${(
          await request.response()
        ).status()} ${request.url()}`;
        console.log(message);
        output.push(message);
      }
    } catch {
      const message = `999 ${hrefs[i]} no errorcode, offline?`;
      console.log(message);
      output.push(message);
    }
  }

  await page.close();

  const errors999 = output.filter((item) => item.startsWith('999'));
  if (errors999.length > 0) {
    console.log('\n999 errors:');
    for (let i = 0; i < errors999.length; i++) {
      console.log(errors999[i]);
    }
  }
  const errors404 = output.filter((item) => item.startsWith('404'));
  if (errors404.length > 0) {
    console.log('\n404 errors:');
    for (let i = 0; i < errors404.length; i++) {
      console.log(errors404[i]);
    }
  }
  expect(errors404).toHaveLength(0);
});
