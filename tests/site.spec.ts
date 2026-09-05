import { test, expect } from "@playwright/test";

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
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
  }
  expect(errors).toEqual([]);
});

test("menu filters, Arabic search, favorites and persistence work", async ({ page }) => {
  await page.goto("/menu?category=chicken");
  await expect(page.locator(".food-card")).toHaveCount(4);
  await page.getByRole("button", { name: "كل المنيو", exact: true }).click();
  await expect(page.locator(".food-card")).toHaveCount(18);
  await page.getByRole("searchbox").fill("سْمُوكي");
  await expect(page.locator(".food-card")).toHaveCount(3);
  await page.getByRole("searchbox").fill("سموكي برغر");
  await expect(page.locator(".food-card")).toHaveCount(1);
  await page.getByRole("button", { name: "حفظ سموكي برغر في المفضلة" }).click();
  await page.reload();
  await page.getByRole("button", { name: "المفضلة (1)", exact: true }).click();
  await expect(page.locator(".food-card")).toHaveCount(1);
  await page.getByRole("button", { name: "إزالة سموكي برغر من المفضلة" }).click();
  await expect(page.getByText("بعدك ما اخترت مفضلتك")).toBeVisible();
  await page.getByRole("button", { name: "شوف كل المنيو", exact: true }).click();
  await page.getByRole("searchbox").fill("لايوجدمنتجبهذاالاسم");
  await expect(page.getByText("ما لقينا هالاختيار")).toBeVisible();
});

test("product quantities, stored cart and validated demo checkout", async ({ page }) => {
  await page.goto("/menu/smoky-burger");
  await page.getByRole("button", { name: "زيادة الكمية", exact: true }).click();
  await page.getByRole("button", { name: /أضف لطلبك/ }).click();
  await page.goto("/order");
  await expect(page.getByRole("status").filter({ hasText: "نحضّر" })).toHaveCount(0);
  await expect(page.getByLabel("كمية سموكي برغر", { exact: true })).toHaveText("2");
  await expect(page.locator(".summary-total")).toContainText("15,000");
  await page.reload();
  await expect(page.getByLabel("كمية سموكي برغر", { exact: true })).toHaveText("2");
  await page.getByRole("button", { name: "أكمل الطلب التجريبي" }).click();
  await expect(page.getByText("اكتب اسمك الكامل", { exact: true })).toBeVisible();
  await page.getByLabel("الاسم", { exact: false }).fill("مستخدم تجريبي");
  await page.getByLabel("رقم الموبايل", { exact: false }).fill("٠٧٧٠١٢٣٤٥٦٧");
  await page.getByLabel("اختار الفرع", { exact: false }).selectOption("al-jamia");
  await page.getByRole("button", { name: "أكمل الطلب التجريبي" }).click();
  await expect(
    page.getByText("اكتب المنطقة والشارع وأقرب نقطة دالة", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /استلام من الفرع مرّ/ }).click();
  await expect(page.getByLabel("عنوان التوصيل", { exact: false })).toHaveCount(0);
  await expect(page.locator(".summary-total")).toContainText("13,000");
  await page.getByRole("button", { name: "أكمل الطلب التجريبي" }).click();
  await expect(page.getByRole("heading", { name: "طلبك التجريبي جاهز!" })).toBeVisible();
  await expect(page.locator(".demo-callout")).toContainText("لم يُرسل هذا الطلب إلى المطعم");
  await expect(page.locator(".receipt-total")).toContainText("13,000");
  await page.goto("/order");
  await expect(page.getByText("طلبك ينتظر أول لقمة.")).toBeVisible();
});

test("cart deletion and corrupt stored values are handled", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "supersauce-cart-v1",
      JSON.stringify([
        { slug: "not-real", quantity: 1 },
        { slug: "smoky-burger", quantity: -2 },
        { slug: "cheesy-burger", quantity: 3 },
      ]),
    ),
  );
  await page.goto("/order");
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByRole("button", { name: "إزالة تشيزي برغر من الطلب" }).click();
  await expect(page.getByText("طلبك ينتظر أول لقمة.")).toBeVisible();
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
        headers: { Origin: "https://untrusted.example" },
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
  expect(await robots.text()).toContain("Disallow: /");
  expect((await request.get("/menu/not-a-meal")).status()).toBe(404);
  expect((await request.get("/branches/not-a-branch")).status()).toBe(404);
  expect((await request.get("/missing-page")).status()).toBe(404);
});
