import { test, chromium, firefox, webkit, Browser } from "@playwright/test";

let browsers: Browser[] = [];

//Launch the browser instances before any test case runs
test.beforeAll(async () => {
  browsers.push(await chromium.launch({ headless: false, slowMo: 50 }));
  browsers.push(await firefox.launch({ headless: false, slowMo: 50 }));
  browsers.push(await webkit.launch({ headless: false, slowMo: 50 }));
});

//Close the browser instances after all test cases have finished running
test.afterAll(async () => {
  await Promise.all(browsers.map((browser) => browser.close()));
});

// Test for capturing screenshots using multiple browsers
test("capturingScreenshotsUsingMultipleBrowsers", async () => {
  const browserNames = ["chromium", "firefox", "webkit"];

  await Promise.all(
    browsers.map(async (browser, index) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto("https://medium.com/", {
        waitUntil: "load",
      });

      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `screenshots/${browserNames[index]}.png`,
      });

      await context.close();
    })
  );
});
