import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.CAPTURE_URL || "http://localhost:3000";
await fs.mkdir(".impeccable/review", { recursive: true });
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = "eager";
      await image.decode().catch(() => {});
    }
  });
  await page.screenshot({
    path: `.impeccable/review/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
  await page.screenshot({ path: `.impeccable/review/${name}-hero.png`, animations: "disabled" });
  for (const route of ["menu", "about", "branches", "contact"]) {
    await page.goto(`${base}/${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.images) {
        image.loading = "eager";
        await image.decode().catch(() => {});
      }
    });
    await page.screenshot({
      path: `.impeccable/review/${name}-${route}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.goto(`${base}/menu/smoky-burger`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "اطلب سموكي برغر", exact: true }).click();
  await page.screenshot({
    path: `.impeccable/review/${name}-order-options.png`,
    animations: "disabled",
  });
  await page.close();
}
await browser.close();
console.log("Desktop and mobile captures saved to .impeccable/review.");
