import { expect, test } from "@playwright/test";

test("app shell still loads with no network connection", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByText("What's her name?")).toBeVisible();

  // Wait for the Serwist service worker to install, activate, and claim this page.
  await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => true));
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  // Revisit while still online so the now-active service worker's fetch handler
  // has a chance to populate its runtime cache for this route.
  await page.goto("/");
  await expect(page.getByText("What's her name?")).toBeVisible();

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByText("What's her name?")).toBeVisible();
});
