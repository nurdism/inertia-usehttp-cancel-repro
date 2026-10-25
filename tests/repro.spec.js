import { expect, test } from "@playwright/test";

const log = (page) => page.locator("#log");

test("cancel() stops B after A has finished", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Start A then B").click();
  await expect(log(page)).toHaveText("1: done");
  await page.getByText("Cancel", { exact: true }).click();
  // Expected: B is cancelled. With the bug, B finishes.
  await expect(log(page)).toHaveText("1: done\n2: HttpCancelledError", { timeout: 5000 });
});

test("the token of A cancels A, not B", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Start A (keep token) then B").click();
  await page.getByText("Cancel A by its token").click();
  // Expected: A is cancelled and B finishes. With the bug, B is cancelled and A finishes.
  await expect(log(page)).toHaveText(/^1: HttpCancelledError\n2: done$|^2: done\n1: HttpCancelledError$/, { timeout: 5000 });
});
