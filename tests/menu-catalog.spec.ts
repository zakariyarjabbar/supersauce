import { test, expect } from "@playwright/test";
import { menuItems } from "../lib/menu";
import { getOrderDetails, getOrderContactLinks } from "../lib/order-contact";

test("catalog matches all 67 source-menu prices and deduplicates the sandwich pages", () => {
  // Independent price transcription, in printed order within each category.
  const prices = {
    krisket: [7500, 11500, 9000, 7500, 7500, 5500, 5500, 7500],
    burgers: [5500, 5500, 6000, 7000, 7500, 8000, 8500, 4500],
    sandwiches: [4500, 5500, 6000, 5500, 7000, 4500, 6000, 7500, 7500, 7000, 5500, 6000],
    chicken: [7500, 9000, 25000, 33000, 9000, 17500, 25000],
    fries: [2500, 2500, 4500, 4500, 5500, 5500],
    sides: [5000, 5000, 5000, 5000, 4000],
    rezo: [6000, 6000, 6500, 6000],
    sauces: [750, 750, 750, 500, 500, 1000, 1000, 500, 750, 750, 500, 750],
    drinks: [1000, 500, 500, 500, 250],
  };
  expect(menuItems).toHaveLength(67);
  expect(new Set(menuItems.map((item) => item.slug)).size).toBe(67);
  expect(new Set(menuItems.map((item) => item.image)).size).toBe(67);
  for (const [category, expected] of Object.entries(prices)) {
    expect(
      menuItems.filter((item) => item.category === category).map((item) => item.price),
      category,
    ).toEqual(expected);
  }
  expect(menuItems.filter((item) => item.mealUpgrade).map((item) => item.mealUpgrade)).toEqual(
    Array(20).fill(2000),
  );
  expect(
    menuItems.filter((item) => item.cheeseExtra).map((item) => [item.slug, item.cheeseExtra]),
  ).toEqual([
    ["ayam-zaman-burger", 500],
    ["zinger", 500],
  ]);
  expect(menuItems.filter((item) => item.sizes)).toHaveLength(3);
});

test("wing sizes, meal upgrades and cheese extras retain the right price and message", async ({
  page,
}) => {
  await page.goto("/menu?category=sides");
  await expect(page.locator(".food-card")).toHaveCount(5);
  await expect(page.locator(".food-card").first()).toContainText("9,000");
  await page.getByRole("button", { name: "اطلب هني مسترد ونكز", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: /١٢ قطعة/ }).check();
  await expect(dialog.locator(".price")).toHaveText(/9,000/);
  await page.keyboard.press("Escape");
  await page.goto("/menu/zinger");
  await expect(page.locator(".product-price-options")).toContainText("6,500");
  await page.getByRole("button", { name: "اطلب زنجر", exact: true }).click();
  await dialog.getByRole("radio", { name: /^وجبة/ }).check();
  await dialog.getByRole("checkbox", { name: /إضافة جبن/ }).check();
  await expect(dialog.locator(".price")).toHaveText(/7,000/);
  await dialog.getByRole("link", { name: /إنستغرام/ }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("heading", { name: "شلون تحب تطلب؟" })).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "إغلاق خيارات الطلب" })).toBeInViewport();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "اطلب زنجر", exact: true }).click();
  await expect(dialog.locator(".price")).toHaveText(/4,500/);
  await expect(dialog.getByRole("checkbox")).not.toBeChecked();
  await page.keyboard.press("Escape");

  const item = menuItems.find((item) => item.slug === "zinger")!;
  const options = { meal: true, cheese: true };
  expect(getOrderDetails(item, options)).toEqual({ price: 7000, label: "وجبة، إضافة جبن" });
  const links = getOrderContactLinks({ item, options, phone: "", whatsapp: "+9647701234567" });
  const message = new URL(links.whatsapp!).searchParams.get("text");
  expect(message).toContain("زنجر");
  expect(message).toContain("وجبة، إضافة جبن");
  const wing = menuItems.find((item) => item.slug === "buffalo-wings")!;
  expect(getOrderDetails(wing, { sizeIndex: 1 })).toEqual({ price: 9000, label: "١٢ قطعة" });
});

test("all categories remain reachable on mobile and English search finds the confirmed prices", async ({
  page,
}) => {
  await page.goto("/menu");
  await page.getByRole("button", { name: "المشروبات", exact: true }).click();
  await expect(page.locator(".food-card")).toHaveCount(5);
  await page.getByRole("button", { name: "كل المنيو", exact: true }).click();
  await page.getByRole("searchbox").fill("NASHVILLE");
  await expect(page.locator(".food-card")).toHaveCount(1);
  await expect(page.locator(".food-card .price")).toContainText("7,500");
  await page.getByRole("searchbox").fill("Boomber");
  await expect(page.locator(".food-card")).toHaveCount(1);
  await expect(page.locator(".food-card .price")).toContainText("7,000");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test("removed sample meals no longer appear in the catalog or sitemap", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const slug of [
    "super-box",
    "family-box",
    "duo-box",
    "crispy-chicken",
    "chicken-bucket",
    "super-sauce",
  ]) {
    expect((await request.get(`/menu/${slug}`)).status(), slug).toBe(404);
    expect(sitemap).not.toContain(`/menu/${slug}</loc>`);
  }
});
