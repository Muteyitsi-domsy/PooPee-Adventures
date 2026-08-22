import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("e.g. Amara").fill("Amara");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "See readiness" }).click();
  await page.getByRole("button", { name: /Start tracking with Amara/ }).click();

  await page.getByRole("button", { name: "+ Log a moment" }).click();
  await page.getByRole("button", { name: "Save log" }).click();

  await page.getByRole("button", { name: "Profile" }).click();
  await page.getByRole("button", { name: "Export data" }).click();
});

test("downloads the potty logs CSV", async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Potty logs \(CSV\)/ }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/^amara-potty-logs-\d{4}-\d{2}-\d{2}\.csv$/);
});

test("downloads the sleep sessions CSV", async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Sleep sessions \(CSV\)/ }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/^amara-sleep-sessions-\d{4}-\d{2}-\d{2}\.csv$/);
});

test("downloads the full JSON backup", async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Full backup \(JSON\)/ }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/^amara-full-backup-\d{4}-\d{2}-\d{2}\.json$/);
});
