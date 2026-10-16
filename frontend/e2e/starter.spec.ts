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

if (process.env.PLAYWRIGHT_REQUIRE_SEED) {
  test("keeps the migrated button destination", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("link", { name: "Migration example link" }),
    ).toHaveAttribute("href", "https://example.com/");
  });
}

test("serves the branded sharing fallback and favicon", async ({ request }) => {
  const card = await request.get("/api/og/default");
  expect(card.ok()).toBe(true);
  expect(card.headers()["content-type"]).toBe("image/png");
  expect([...(await card.body()).subarray(0, 8)]).toEqual([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  const mark = await request.get("/brand/mark.svg");
  expect(mark.ok()).toBe(true);
  expect(mark.headers()["content-type"]).toContain("image/svg+xml");
});
