import { test, expect } from "@playwright/test";

test("desktop portfolio, objects, theme and project archive", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Alex Shepherd" }),
  ).toBeVisible();
  await expect(page.locator(".personal-objects canvas")).toBeVisible();
  await expect(page.locator(".personal-objects")).not.toHaveAttribute(
    "data-fallback",
    "true",
  );
  for (const name of ["The gym", "Music", "Football", "Baseball"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(
      page.getByRole("button", { name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "Pause 3D motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume 3D motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: "test-results/desktop-dark.png" });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator(".portfolio")).toHaveAttribute(
    "data-theme",
    "light",
  );
  await page.screenshot({ path: "test-results/desktop-light.png" });
  await page.getByRole("button", { name: "Read about Project: Andromeda", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Andromeda", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  const resume = await page.request.get("/assets/Alex_Shepherd_Resume.pdf");
  expect(resume.ok()).toBeTruthy();
  expect(errors).toEqual([]);
});

test("small screens, keyboard navigation and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Alex Shepherd" }),
    ).toBeVisible();
    await expect(page.locator(".personal-objects canvas")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(
      page.getByRole("button", { name: "Baseball", exact: true }),
    ).toBeVisible();
    if (width === 390) {
      for (const img of await page.locator(".project-image img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
        expect(
          await img.evaluate((node: HTMLImageElement) => node.naturalWidth),
        ).toBeGreaterThan(0);
      }
      await page
        .getByRole("heading", { name: "Alex Shepherd" })
        .scrollIntoViewIfNeeded();
    }
    await page.screenshot({
      path: `test-results/mobile-${width}.png`,
      fullPage: width === 390,
    });
  }
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(
    page.getByText("I’m Alex, a Computing", { exact: false }),
  ).toBeVisible();
});

test("contact handles success and failure without sending email", async ({
  page,
}) => {
  await page.goto("/");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    }),
  );
  await page.getByLabel("Your name").fill("Portfolio test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("What are you thinking?")
    .fill("Local browser verification only.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText("Thanks! Your message is on its way."),
  ).toBeVisible();
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 500, body: "Unavailable" }),
  );
  await page.getByLabel("Your name").fill("Portfolio test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("What are you thinking?")
    .fill("Keep this draft after an error.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText("Couldn’t send. Try again or use my email above."),
  ).toBeVisible();
  await expect(page.getByLabel("What are you thinking?")).toHaveValue(
    "Keep this draft after an error.",
  );
});
