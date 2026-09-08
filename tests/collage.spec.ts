import { test, expect } from "@playwright/test";

test("collage opens project notes and restores keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const photos = page.locator(".project-photo");
  await expect(photos).toHaveCount(6);
  for (let index = 0; index < 6; index++) {
    const photo = photos.nth(index);
    await photo.click();
    const note = page.getByRole("dialog");
    await expect(note).toBeVisible();
    await expect(note.getByRole("heading", { level: 2 })).toHaveText(await photo.locator("strong").innerText());
    await expect(note.getByRole("link").first()).toHaveAttribute("href", /^https:/);
    await expect(page.getByRole("button", { name: "Close project" })).toBeFocused();
    if (index === 0) await page.screenshot({ path: "test-results/project-note.png" });
    await page.keyboard.press("Escape");
    await expect(note).toHaveCount(0);
    await expect(photo).toBeFocused();
  }
  await photos.first().click();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("collage is responsive and scroll reveals finish", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.keyboard.press("Escape");
    for (const photo of await page.locator(".collage-item").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveClass(/visible/);
    }
    for (const section of [".about-grid", ".stack-section", ".contact-section"]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await expect(page.locator(section)).toHaveClass(/visible/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/collage-${width}.png` });
  }
});
