import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("core pages have no automated WCAG A/AA violations", async ({ page }) => {
  for (const path of ["/", "/menu", "/menu/smoky-burger", "/contact", "/branches"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({ target: n.target, failure: n.failureSummary })),
      })),
      path,
    ).toEqual([]);
  }
});

test("contact order dialog has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/menu");
  await page.getByRole("button", { name: "اطلب سموكي برجر", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
