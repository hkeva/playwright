import { test, expect, chromium } from "@playwright/test";

// Attempting to log in to GitHub with invalid credentials to validate error handling
test("logInToGithubWithWrongCredentials", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://github.com/login");

  await page.waitForSelector("[id=login_field]");
  await page.fill("[id=login_field]", "user@gmail.com");
  await page.fill("[id=password]", "12345");

  await page.locator("[type=submit]").click();

  await page.waitForSelector("text=Incorrect username or password.");
  await expect(
    page.locator("text=Incorrect username or password.")
  ).toBeVisible();
});
