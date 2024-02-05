const fs = require("fs");
import { test, expect, firefox } from "@playwright/test";
import path from "path";

//Initially, some tests may fail due to the absence of a file
//However, after the first run, the file is saved within a subfolder of the 'tests' directory, allowing subsequent comparisons to pass

let browser;

//Launch the browser instance before any test case runs
test.beforeAll(async () => {
  browser = await firefox.launch({
    headless: false,
    slowMo: 50,
    // devtools: true
  });
});

//Close the browser instance after all test cases have finished running
test.afterAll(async () => {
  await browser.close();
});

//Test the comparison between the text content and the snapshot
test("textContentToSnapshotComparisonTest", async ({ page }) => {
  await page.goto("https://playwright.dev");
  expect(await page.textContent(".hero__title")).toMatchSnapshot("hero.txt");
});

//Test for visual comparison
test("visualComparisonTest", async ({ page }) => {
  await page.goto("https://playwright.dev");
  expect(await page.screenshot()).toMatchSnapshot("playwright.png", {
    maxDiffPixels: 200,
  });
});

//Test for comparing the visual appearance of a button element
test("buttonAppearanceComparisonTest", async ({ page }) => {
  await page.goto("https://www.filemail.com/share/upload-file");
  const button = page.locator("text=Add Files");
  await expect(button).toHaveScreenshot("button.png");
});

//Test for comparing the visual appearance of a navbar element
test("navbarAppearanceComparisonTest", async ({ page }) => {
  await page.goto("https://www.filemail.com/share/upload-file");
  const navbar = page.locator("#fmNavbar");
  await expect(navbar).toHaveScreenshot("navbar.png");
});

//Test to compare screenshots with dynamic content
test("compareScreenshotsOfDynamicContents", async ({ page }) => {
  await page.goto("https://www.youtube.com", {
    waitUntil: "load",
  });
  //We are expecting it to be falsy because of the dynamic content
  //try removing 'not' and observe the error in the 'test-results' directory
  await expect(page).not.toHaveScreenshot("dynamicContentOfYoutube.png");
});

//To resolve this dynamic content issue, we are using mask
test("maskedTesting", async ({ page }) => {
  await page.goto("https://www.youtube.com", {
    waitUntil: "load",
  });

  await expect(page).toHaveScreenshot("maskedImage.png", {
    // try removing 'mask' and observe the error in the 'test-results' directory
    mask: [page.locator('//*[@id="page-manager"]')],
    maxDiffPixels: 200,
  });
});

//Ensure the presence of the navigation bar across all pages by masking dynamic body contents
test("isNavbarPresent", async ({ page }) => {
  await page.goto("https://playwright.dev", {
    waitUntil: "load",
  });

  await expect(page).toHaveScreenshot("isNavbarPresentForHomePage.png", {
    mask: [page.locator('//*[@id="__docusaurus_skipToContent_fallback"]')],
    maxDiffPixels: 200,
  });

  await page.getByRole("link", { name: "Docs" }).click();
  await expect(page).toHaveScreenshot("isNavbarPresentForDocsPage.png", {
    mask: [page.locator('//*[@id="__docusaurus_skipToContent_fallback"]')],
    maxDiffPixels: 200,
  });

  await page.getByRole("link", { name: "API", exact: true }).click();
  await expect(page).toHaveScreenshot("isNavbarPresentForAPIPage.png", {
    mask: [page.locator('//*[@id="__docusaurus_skipToContent_fallback"]')],
    maxDiffPixels: 200,
  });

  await page.getByRole("link", { name: "Community" }).click();
  await expect(page).toHaveScreenshot("isNavbarPresentForCommunityPage.png", {
    mask: [page.locator('//*[@id="__docusaurus_skipToContent_fallback"]')],
    maxDiffPixels: 200,
  });
});
