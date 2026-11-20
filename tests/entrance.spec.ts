import { test, expect } from "@playwright/test";

// One test per width so each run gets a fresh page, clock and sessionStorage.
for (const width of [1440, 390]) {
  test(`intro counts to 2026, welcomes, and clears at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "dark" });
    await page.setViewportSize({ width, height: 900 });
    // Local noon on 2026-01-01: a UTC midnight start would read as 2025 west of UTC.
    const clockStart = new Date(2026, 0, 1, 12);
    await page.clock.install({ time: clockStart });
    await page.clock.pauseAt(clockStart);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const intro = page.locator(".entrance-overlay");
    await expect(intro).toHaveAttribute("data-phase", "count");
    await expect(page.locator(".entrance-year")).toHaveText("2006");

    // The century prefix must not move while the digits count up.
    const prefix = page.locator(".entrance-year > span").first();
    const initialPosition = await prefix.boundingBox();
    await page.clock.runFor(400);
    expect(await prefix.boundingBox()).toEqual(initialPosition);

    // The count lands on the first animation frame at or after 800 ms. Frames arrive
    // about every 16 ms, so run to 840 ms to be sure that frame has fired.
    await page.clock.runFor(440);
    await expect(page.locator(".entrance-year")).toHaveText("2026");
    await expect(intro).toHaveAttribute("data-phase", "welcome");
    const welcome = ((await intro.textContent()) ?? "").replace(/\s+/g, " ").trim();
    expect(welcome).toContain("Alex Shepherd, building since 2006");
    await page.screenshot({ path: `test-results/entrance-${width}.png` });

    // The overlay is removed on the first frame at or after 1500 ms. Run to 1520 ms
    // so that frame has fired.
    await page.clock.runFor(680);
    await expect(intro).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Alex Shepherd", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("intro skips for reduced motion, dismisses on Tab, and plays once per session", async ({ page }) => {
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

  // Play the intro through to completion in a fresh session, then reload.
  await page.evaluate(() => window.sessionStorage.clear());
  await page.goto("/");
  await expect(page.locator(".entrance-overlay")).toBeAttached();
  await expect(page.locator(".entrance-overlay")).toHaveCount(0, { timeout: 5000 });
  await page.reload();
  await expect(page.locator(".entrance-overlay")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Alex Shepherd", exact: true })).toBeVisible();
});
