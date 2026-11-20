import { test, expect } from "@playwright/test";

test("each exhibit opens its note, focuses Close, and closes on Escape or backdrop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const exhibits = page.locator(".exhibit-button");
  await expect(exhibits).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    const exhibit = exhibits.nth(index);
    const title = ((await exhibit.locator(".placard-title").textContent()) ?? "").trim();
    await exhibit.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(title);
    const photo = dialog.locator("img.note-photo");
    await expect(photo).toHaveJSProperty("complete", true);
    await expect
      .poll(() => photo.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);
    await expect(dialog.getByRole("link").first()).toHaveAttribute("href", /^https:/);
    await expect(page.getByRole("button", { name: "Close project" })).toBeFocused();
    if (index === 0) await page.screenshot({ path: "test-results/project-note.png" });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(exhibit).toBeFocused();
  }
  await exhibits.first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("exhibits, about and stack reveal on scroll, with no overflow and visit links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.keyboard.press("Escape");

    const exhibits = page.locator(".exhibit");
    await expect(exhibits).toHaveCount(3);
    for (const exhibit of await exhibits.all()) {
      await exhibit.scrollIntoViewIfNeeded();
      await expect(exhibit).toHaveClass(/visible/);
    }
    for (const selector of [".about-grid", ".stack-section"]) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toHaveClass(/visible/);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();

    for (const photo of await page.locator(".exhibit-photo").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveCSS("opacity", "1");
    }

    const visitLinks = page.locator(".exhibit-links a", { hasText: "Visit project" });
    await expect(visitLinks).toHaveCount(3);
    for (const link of await page.locator(".exhibit-links a").all()) {
      await expect(link).toHaveAttribute("target", "_blank");
    }

    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/collage-${width}.png` });
  }
});
