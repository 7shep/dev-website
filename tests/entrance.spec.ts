import { test, expect } from "@playwright/test";

test("intro counts, welcomes, and clears on desktop and mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "dark" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const clockStart = new Date("2026-01-01T00:00:00Z");
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(clockStart);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const intro = page.locator(".entrance-overlay");
    await expect(intro).toHaveAttribute("data-phase", "count");
    await expect(page.locator(".entrance-year")).toHaveText("2006");
    const prefix = page.locator(".entrance-year > span").first();
    const initialPosition = await prefix.boundingBox();
    await page.clock.runFor(1000);
    const midpoint = Number(await page.locator(".entrance-year").textContent());
    expect(midpoint).toBeGreaterThanOrEqual(2008);
    expect(midpoint).toBeLessThanOrEqual(2009);
    expect(await prefix.boundingBox()).toEqual(initialPosition);
    await page.clock.runFor(1100);
    await expect(page.locator(".entrance-year")).toHaveText("2026");
    await expect(intro).toHaveAttribute("data-phase", "welcome");
    await page.clock.runFor(700);
    await page.screenshot({ path: `test-results/entrance-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.clock.runFor(1100);
    await expect(intro).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Alex Shepherd" })).toBeVisible();
  }
});

test("intro skips for reduced motion and keyboard navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".entrance-overlay")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".entrance-overlay")).toBeAttached();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator(".entrance-overlay")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Alex Shepherd home" })).toBeFocused();
});
