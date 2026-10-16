import { expect, test } from "@playwright/test";

test("returns a not-found response for an unknown page", async ({ page }) => {
  const response = await page.goto("/bootstrap-missing-page-729194");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main")).toHaveCount(1);
});

test("serves the public sitemap and robots rules", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("<urlset");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("User-Agent:");
});
