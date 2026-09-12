import { test, expect } from "@playwright/test";
import { getOrderContactLinks } from "../lib/order-contact";
import { menuItems } from "../lib/menu";
import { site } from "../lib/site";

test("Arabic pages, imagery and navigation render without errors or overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/menu",
    "/menu/smoky-burger",
    "/branches",
    "/branches/al-jamia",
    "/about",
    "/contact",
    "/careers",
    "/faq",
    "/order",
    "/privacy",
    "/terms",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `horizontal overflow at ${path}`,
    ).toBe(true);
    for (const img of await page.locator("img:visible").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
  }
  expect(errors).toEqual([]);
});

test("menu keeps categories, Arabic search, sorting and prices without favorites", async ({
  page,
}) => {
  await page.goto("/menu?category=chicken");
  await expect(page.locator(".food-card")).toHaveCount(7);
  await page.getByRole("button", { name: "كل المنيو", exact: true }).click();
  await expect(page.locator(".food-card")).toHaveCount(67);
  await page.getByRole("searchbox").fill("سْمُوكي");
  await expect(page.locator(".food-card")).toHaveCount(2);
  await page.getByRole("searchbox").fill("سموكي برجر");
  await expect(page.locator(".food-card")).toHaveCount(1);
  await expect(page.locator(".food-card .price")).toContainText("5,500");
  await expect(page.getByRole("button", { name: /المفضلة|أضف/ })).toHaveCount(0);
  await page.getByRole("button", { name: "مسح البحث" }).click();
  await page.getByLabel("ترتيب المنيو").selectOption("low");
  const ascending = await page.locator(".food-card .price b").allTextContents();
  const prices = ascending.map((value) => Number(value.replaceAll(",", "")));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await page.getByLabel("ترتيب المنيو").selectOption("high");
  expect(await page.locator(".food-card .price b").allTextContents()).toEqual(ascending.reverse());
  await page.getByRole("searchbox").fill("لايوجدمنتجبهذاالاسم");
  await expect(page.getByText("ما لقينا هالاختيار")).toBeVisible();
  await page.getByRole("button", { name: "شوف كل المنيو", exact: true }).click();
  await expect(page.locator(".food-card")).toHaveCount(67);
});

test("item ordering opens contact choices with the price and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/menu");
  const trigger = page.getByRole("button", { name: "اطلب سموكي برجر", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "شلون تحب تطلب؟" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".order-selected-item")).toContainText("سموكي برجر");
  await expect(dialog.locator(".price")).toContainText("5,500");
  const links = getOrderContactLinks({
    phone: site.orderPhone,
    whatsapp: site.orderWhatsapp,
    item: menuItems.find((item) => item.slug === "smoky-burger"),
  });
  for (const [name, href] of [
    ["اتصال هاتفي", links.phone],
    ["واتساب", links.whatsapp],
  ] as const) {
    if (href)
      await expect(dialog.getByRole("link", { name: new RegExp(name) })).toHaveAttribute(
        "href",
        href,
      );
    else await expect(dialog.getByRole("button", { name: new RegExp(name) })).toBeDisabled();
  }
  const instagram = dialog.getByRole("link", { name: /إنستغرام/ });
  await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/supersauce.iq/");
  await expect(instagram).toHaveAttribute("target", "_blank");
  const close = dialog.getByRole("button", { name: "إغلاق خيارات الطلب" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(instagram).toBeFocused();
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
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "اطلب جيز برجر", exact: true }).click();
  await expect(dialog.locator(".order-selected-item")).toContainText("جيز برجر");
  await expect(dialog.locator(".price")).toContainText("6,000");
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({});
});

test("home, product, header and branch buttons share the contact flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "اعثر على أقرب فرع", exact: true })).toHaveAttribute(
    "href",
    "#branch-map",
  );
  await page.locator(".food-card").first().getByRole("button", { name: /^اطلب/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".order-selected-item")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "اطلب السوبر" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".order-selected-item")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.goto("/menu/smoky-burger");
  await expect(page.locator(".product-price")).toContainText("5,500");
  await expect(page.getByRole("button", { name: /الكمية|أضف/ })).toHaveCount(0);
  await page.getByRole("button", { name: "اطلب سموكي برجر", exact: true }).click();
  await expect(dialog.locator(".order-selected-item")).toContainText("سموكي برجر");
  await page.keyboard.press("Escape");
  await page.goto("/branches/al-jamia");
  await page.getByRole("button", { name: "اطلب من هذا الفرع" }).click();
  await expect(dialog).toContainText("بخصوص فرع حي الجامعة");
});

test("old checkout URLs go to the menu and stored cart data cannot restore removed features", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "supersauce-cart-v1",
      JSON.stringify([{ slug: "smoky-burger", quantity: 2 }]),
    );
    localStorage.setItem("supersauce-favorites", JSON.stringify(["smoky-burger"]));
  });
  await page.goto("/order?branch=al-jamia");
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.locator(".food-card")).toHaveCount(67);
  await expect(page.locator('a[href^="/order"]')).toHaveCount(0);
  await expect(page.locator(".bag-button, .favorite, .cart-line, .quantity-control")).toHaveCount(
    0,
  );
  await expect(page.getByRole("button", { name: /المفضلة|أضف|أكمل الطلب التجريبي/ })).toHaveCount(
    0,
  );
});

test("contact links normalize Iraqi numbers and prepare item and branch details without sending", () => {
  const item = menuItems.find((item) => item.slug === "smoky-burger")!;
  const links = getOrderContactLinks({
    phone: "٠٧٧٠١٢٣٤٥٦٧",
    whatsapp: "+964 (770) 123-4567",
    item,
    branchName: "حي الجامعة",
  });
  expect(links.phone).toBe("tel:+9647701234567");
  const whatsapp = new URL(links.whatsapp!);
  expect(whatsapp.origin + whatsapp.pathname).toBe("https://wa.me/9647701234567");
  expect(whatsapp.searchParams.get("text")).toContain("سموكي برجر");
  expect(whatsapp.searchParams.get("text")).toContain("حي الجامعة");
  expect(getOrderContactLinks({ phone: "", whatsapp: "not-a-number" })).toEqual({
    phone: null,
    whatsapp: null,
  });
  expect(getOrderContactLinks({ phone: "009647701234567", whatsapp: "9647701234567" }).phone).toBe(
    links.phone,
  );
});

test("branch filtering, empty state and map destination", async ({ page }) => {
  await page.goto("/branches");
  await page.getByRole("button", { name: "بابل", exact: true }).click();
  await expect(page.locator(".branch-card")).toHaveCount(1);
  await expect(page.locator(".branch-card")).toContainText("المحاويل");
  await page.getByRole("searchbox").fill("قمر");
  await expect(page.getByText("ما لقينا فرع بهالبحث.")).toBeVisible();
  await page.getByRole("button", { name: "عرض كل الفروع" }).click();
  await expect(page.locator(".branch-card")).toHaveCount(8);
  await page.locator(".branch-card").first().getByRole("link", { name: "تفاصيل الفرع" }).click();
  await expect(page).toHaveURL(/\/branches\/al-jamia$/);
  await expect(page.getByRole("link", { name: "ابحث بالخريطة" })).toHaveAttribute(
    "href",
    /https:\/\/www.google.com\/maps\/search\/\?api=1&query=/,
  );
});

test("contact and careers forms validate and explicitly return demo success", async ({ page }) => {
  for (const path of ["/contact", "/careers"]) {
    await page.goto(path);
    await page.getByRole("button", { name: "جرّب إرسال الرسالة" }).click();
    await expect(page.getByText("اكتب اسمك الكامل", { exact: true })).toBeVisible();
    await page.getByLabel("الاسم الكامل", { exact: false }).fill("مستخدم تجريبي");
    await page.getByLabel("البريد الإلكتروني", { exact: false }).fill("demo@example.com");
    await page.getByLabel("المحافظة", { exact: false }).selectOption("بغداد");
    await page.locator('select[name="topic"]:visible').selectOption({ index: 1 });
    await page
      .locator('textarea[name="message"]:visible')
      .fill("هذه رسالة وهمية لاختبار عمل النموذج فقط.");
    await page.locator('input[name="consent"]:visible').check();
    await page.getByRole("button", { name: "جرّب إرسال الرسالة" }).click();
    await expect(page.getByRole("heading", { name: "اكتملت التجربة!" })).toBeVisible();
    await expect(page.locator(".form-success")).toContainText("ما أرسلنا معلوماتك إلى المطعم");
  }
});

test("FAQ search and keyboard accordion work", async ({ page }) => {
  await page.goto("/faq");
  await page.getByRole("searchbox").fill("حساسية");
  await expect(page.locator("details")).toHaveCount(1);
  const summary = page.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details")).toHaveAttribute("open", "");
  await expect(page.locator("details p")).toBeVisible();
});

test("mobile navigation closes with Escape and routes correctly", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile disclosure only");
  await page.goto("/");
  const toggle = page.locator(".mobile-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator(".mobile-menu").getByRole("link", { name: "فروعنا" }).click();
  await expect(page).toHaveURL(/\/branches$/);
  await expect(page.locator(".mobile-menu")).toHaveCount(0);
});

test("API rejects invalid requests and never sends in demo mode", async ({ request }) => {
  const payload = {
    kind: "contact",
    name: "Demo user",
    email: "demo@example.com",
    phone: "",
    city: "بغداد",
    topic: "اقتراح",
    message: "رسالة تجريبية فقط للتأكد من النموذج",
    portfolio: "",
    consent: true,
    website: "",
  };
  expect(
    (
      await request.post("/api/contact", {
        data: payload,
        headers: { Origin: "https://untrusted.example", "X-Forwarded-Host": "untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/contact", {
        data: "invalid",
        headers: { "Content-Type": "text/plain" },
      })
    ).status(),
  ).toBe(415);
  expect(
    (await request.post("/api/contact", { data: { ...payload, email: "broken" } })).status(),
  ).toBe(422);
  expect(
    (await request.post("/api/contact", { data: { ...payload, consent: false } })).status(),
  ).toBe(422);
  expect(
    (
      await request.post("/api/contact", { data: { ...payload, message: "x".repeat(17000) } })
    ).status(),
  ).toBe(413);
  const valid = await request.post("/api/contact", { data: payload });
  expect(valid.status()).toBe(200);
  expect(await valid.json()).toEqual({ ok: true, demo: true });
  const robots = await request.get("/robots.txt");
  const rules = await robots.text();
  expect(rules).toMatch(/^Allow: \/$/m);
  expect(rules).not.toMatch(/^Disallow: \/$/m);
  expect((await request.get("/menu/not-a-meal")).status()).toBe(404);
  expect((await request.get("/branches/not-a-branch")).status()).toBe(404);
  expect((await request.get("/missing-page")).status()).toBe(404);
});
