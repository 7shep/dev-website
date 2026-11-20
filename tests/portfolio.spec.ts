import { test, expect } from "@playwright/test";

test("desktop: hero artwork, pause, light theme persists, resume and contact", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  // Wait out the entrance intro (about 1.5 s) so it does not swallow clicks.
  await expect(page.locator(".entrance-overlay")).toHaveCount(0);

  await expect(page.getByRole("heading", { name: "Alex Shepherd", exact: true })).toBeVisible();
  await expect(page.locator(".hero-canvas canvas")).toBeVisible();

  const pause = page.locator(".pause-control");
  await expect(pause).toHaveAttribute("aria-pressed", "false");
  await expect(pause).toHaveAttribute("aria-label", "Pause artwork");
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await expect(pause).toHaveAttribute("aria-label", "Resume artwork");
  await page.screenshot({ path: "test-results/desktop-dark.png" });

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator(".portfolio")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#efeee9");
  await page.screenshot({ path: "test-results/desktop-light.png" });

  await page.reload();
  await expect(page.locator(".portfolio")).toHaveAttribute("data-theme", "light");

  const resume = await page.request.get("/assets/Alex_Shepherd_Resume_2026.pdf");
  expect(resume.ok()).toBeTruthy();

  await expect(page.locator('.contact-section a[href="mailto:alshe0644@gmail.com"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("small screens: no overflow, photos load, tap targets, skip link and About nav", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Alex Shepherd", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();

    if (width === 390) {
      for (const img of await page.locator(".exhibit-photo").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
        await expect
          .poll(() => img.evaluate((node: HTMLImageElement) => node.naturalWidth))
          .toBeGreaterThan(0);
      }

      // Every visible target is at least 44 px tall; round controls are also 44 px wide.
      const targets = page.locator(
        ".theme-toggle, .header-github, .pause-control, .site-header nav a, .wordmark, .text-link, .exhibit-links a, .contact-section a, .site-footer a",
      );
      const count = await targets.count();
      expect(count).toBeGreaterThan(0);
      for (let index = 0; index < count; index++) {
        const target = targets.nth(index);
        if (!(await target.isVisible())) continue;
        const box = await target.boundingBox();
        expect(box, `target ${index} has a box`).not.toBeNull();
        expect(box!.height, `target ${index} height`).toBeGreaterThanOrEqual(44);
        const round = await target.evaluate((node) => node.matches(".theme-toggle, .header-github, .pause-control"));
        if (round) expect(box!.width, `round target ${index} width`).toBeGreaterThanOrEqual(44);
      }

      await page.getByRole("heading", { name: "Alex Shepherd", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/mobile-${width}.png`, fullPage: true });
    }
  }

  await page.goto("/");
  // Wait for React to render before the first Tab, or the skip link does not exist yet.
  await expect(page.getByRole("heading", { name: "Alex Shepherd", exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByText("I’m Alex, a Computing", { exact: false })).toBeVisible();
});

test("nav marks Contact at the bottom of the page on tall and wide viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[1440, 900], [820, 1180], [1024, 1366], [2560, 1300]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.getByRole("heading", { name: "Alex Shepherd" }).waitFor();
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect(page.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("aria-current", "location");
    await expect(page.getByRole("link", { name: "About", exact: true })).not.toHaveAttribute("aria-current", /.*/);
  }
});
