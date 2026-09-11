import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { branches, branchDirectionsUrl } from "../lib/branches";

test.beforeEach(async ({ page }) => {
  await page.goto("/#branch-map");
  await expect(page.getByRole("heading", { name: "اعثر على أقرب فرع" })).toBeVisible();
});

test("cluster pins expand, map zooms by keyboard and reset restores Iraq", async ({ page }) => {
  const map = page.getByRole("group", { name: "خريطة فروع سوبر صوص في العراق", exact: true });
  await expect(map).toHaveAttribute("data-zoom", "1.00");
  await expect(map.getByRole("button", { name: /^عرض فرع/ })).toHaveCount(3);
  await expect(map.getByRole("button", { name: "تكبير تجمع 5 فروع", exact: true })).toBeVisible();
  await map
    .getByRole("button", { name: /^تكبير تجمع/ })
    .first()
    .click();
  await expect(map).not.toHaveAttribute("data-zoom", "1.00");
  await expect(map.getByRole("button", { name: /^عرض فرع/ }).first()).toBeVisible();
  await map.getByRole("button", { name: "عرض العراق", exact: true }).click();
  await expect(map).toHaveAttribute("data-zoom", "1.00");
  await map.focus();
  await page.keyboard.press("+");
  await expect(map).toHaveAttribute("data-zoom", "1.70");
  const drawing = map.locator("svg > g").first();
  const before = await drawing.getAttribute("transform");
  await page.keyboard.press("ArrowRight");
  await expect(drawing).not.toHaveAttribute("transform", before!);
  await page.keyboard.press("Home");
  await expect(map).toHaveAttribute("data-zoom", "1.00");
});

test("city and Arabic search reveal branch information and its exact directions", async ({
  page,
  isMobile,
}) => {
  const section = page.locator("#branch-map");
  await section.getByRole("button", { name: "كربلاء", exact: true }).click();
  await expect(section.getByText("1 فرع في دليل العرض")).toBeVisible();
  await section.getByRole("button", { name: "عرض فرع كربلاء، كربلاء", exact: true }).click();
  const details = isMobile ? page.getByRole("dialog") : section.locator("aside");
  await expect(details.getByRole("heading", { name: "فرع كربلاء" })).toBeVisible();
  await expect(details).toContainText(branches.find((branch) => branch.slug === "karbala")!.hours);
  await expect(details.getByRole("link", { name: /افتح الاتجاهات/ })).toHaveAttribute(
    "href",
    branchDirectionsUrl(branches.find((branch) => branch.slug === "karbala")!),
  );
  await expect(details.getByText("يُضاف رقم الفرع قريباً")).toBeVisible();
  await expect(details.getByRole("button", { name: "اتصل بالفرع", exact: true })).toBeDisabled();
  await expect(details.getByRole("button", { name: "واتساب", exact: true })).toBeDisabled();
  await expect(details.getByRole("link", { name: /تواصل عبر إنستغرام/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/supersauce.iq/",
  );
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  if (isMobile) await page.keyboard.press("Escape");
  await section.getByRole("button", { name: "كل المحافظات", exact: true }).click();
  await section.getByRole("searchbox").fill("الْكَاظِمِيَّة");
  await expect(section.getByText("1 فرع في دليل العرض")).toBeVisible();
  await expect(section.getByRole("button", { name: "عرض فرع الكاظمية، بغداد" })).toBeVisible();
  await section.getByRole("searchbox").fill("منطقةغيرموجودة");
  await expect(section.getByRole("status").getByText("ما لقينا فرع بهالبحث.")).toBeVisible();
  await section.getByRole("status").getByRole("button", { name: "عرض كل الفروع" }).click();
  await expect(section.getByText("8 فروع في دليل العرض")).toBeVisible();
});

test("list view reaches every example branch and stays synchronized with the map", async ({
  page,
  isMobile,
}) => {
  const section = page.locator("#branch-map");
  await section.getByRole("button", { name: "القائمة", exact: true }).click();
  const list = section.getByLabel("قائمة فروع الخريطة");
  await expect(list.getByRole("button")).toHaveCount(branches.length);
  await list.getByRole("button", { name: /فرع النجف/ }).click();
  const details = isMobile ? page.getByRole("dialog") : section.locator("aside");
  await expect(details.getByRole("heading", { name: "فرع النجف" })).toBeVisible();
  if (isMobile) await page.keyboard.press("Escape");
  await expect(list.getByRole("button", { name: /فرع النجف/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await section.getByRole("button", { name: "الخريطة", exact: true }).click();
  await expect(section.getByRole("button", { name: "عرض فرع النجف، النجف" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("location is requested only by the customer and chooses the closest demo branch", async ({
  page,
  context,
  isMobile,
}) => {
  const permission = await page.evaluate(
    async () => (await navigator.permissions.query({ name: "geolocation" })).state,
  );
  expect(permission).toBe("prompt");
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 32.002, longitude: 44.339 });
  await page.getByRole("button", { name: "استخدم موقعي", exact: true }).click();
  const details = isMobile ? page.getByRole("dialog") : page.locator("#branch-map aside");
  await expect(details.getByRole("heading", { name: "فرع النجف" })).toBeVisible();
  await expect(page.locator("#branch-map").getByRole("status")).toHaveText(
    "أقرب موقع في دليل العرض: فرع النجف.",
  );
});

test("denied location permission gives a useful recovery without blocking search", async ({
  page,
}) => {
  await page.evaluate(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) =>
      error?.({
        code: 1,
        message: "Denied for test",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
  });
  await page.getByRole("button", { name: "استخدم موقعي", exact: true }).click();
  await expect(page.locator("#branch-map").getByRole("status")).toContainText(
    "لم تسمح بتحديد موقعك",
  );
  await page.locator("#branch-map").getByRole("searchbox").fill("المحاويل");
  await expect(page.getByRole("button", { name: "عرض فرع المحاويل، بابل" })).toBeVisible();
  await expect(page.getByRole("button", { name: "استخدم موقعي", exact: true })).toBeEnabled();
});

test("mobile sheet contains focus, closes, and adapts to a desktop resize", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile bottom sheet only");
  const section = page.locator("#branch-map");
  await section.getByRole("button", { name: "بابل", exact: true }).click();
  const trigger = section.getByRole("button", { name: "عرض فرع المحاويل، بابل" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "تفاصيل فرع المحاويل" });
  const close = dialog.getByRole("button", { name: "إغلاق تفاصيل الفرع" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: /تواصل عبر إنستغرام/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await close.click();
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(dialog).not.toBeVisible();
  await expect(
    section.locator("aside").getByRole("heading", { name: "فرع المحاويل" }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});
