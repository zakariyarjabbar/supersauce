import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { menuItems } from "../lib/menu";
import { branches } from "../lib/branches";
import { site } from "../lib/site";
import { DEFAULT_SITE_ORIGIN, resolveSiteOrigin } from "../lib/site-origin";

// Read the original response, never the hydrated DOM: sharing clients do not
// run the app's JavaScript, and metadata streamed into the body can be missed.
function readHead(html: string) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  expect(head, "response has a complete HTML head").toBeTruthy();
  const tags = [...head!.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(([tag]) =>
    Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value]),
    ),
  );
  return {
    meta(name: string) {
      const matches = tags.filter((tag) => tag.property === name || tag.name === name);
      expect(matches, `exactly one ${name} in the initial head`).toHaveLength(1);
      return matches[0].content;
    },
    link(rel: string) {
      return tags.filter((tag) => tag.rel === rel);
    },
  };
}

test("public origin survives missing deployment configuration and uses explicit domains", () => {
  expect(resolveSiteOrigin()).toBe(DEFAULT_SITE_ORIGIN);
  expect(new URL(DEFAULT_SITE_ORIGIN).protocol).toBe("https:");
  expect(new URL(DEFAULT_SITE_ORIGIN).hostname).not.toMatch(/localhost|127\.0\.0\.1/);
  expect(
    resolveSiteOrigin({
      siteUrl: " https://supersauce.example/menu?source=share ",
      productionUrl: "production.vercel.app",
    }),
  ).toBe("https://supersauce.example");
  expect(resolveSiteOrigin({ siteUrl: "supersauce.example/" })).toBe("https://supersauce.example");
  expect(
    resolveSiteOrigin({
      siteUrl: " ",
      productionUrl: "production.vercel.app",
      deploymentUrl: "preview.vercel.app",
    }),
  ).toBe("https://production.vercel.app");
  expect(resolveSiteOrigin({ deploymentUrl: "preview.vercel.app" })).toBe(
    "https://preview.vercel.app",
  );
  expect(resolveSiteOrigin({ siteUrl: "http://localhost:3100" })).toBe("http://localhost:3100");
  for (const siteUrl of [
    "ftp://example.com",
    "https://user:password@example.com",
    "javascript:alert(1)",
  ]) {
    expect(() => resolveSiteOrigin({ siteUrl })).toThrow();
  }
});

test("every public page has its own canonical and complete Arabic social metadata", async ({
  request,
}) => {
  const paths = [
    "/",
    "/menu",
    "/branches",
    "/about",
    "/contact",
    "/careers",
    "/faq",
    "/privacy",
    "/terms",
    ...menuItems.map((item) => `/menu/${item.slug}`),
    ...branches.map((branch) => `/branches/${branch.slug}`),
  ];
  for (const path of paths) {
    await test.step(path, async () => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const head = readHead(await response.text());
      const url = new URL(path, site.origin).href;
      expect(head.link("canonical")).toHaveLength(1);
      expect(new URL(head.link("canonical")[0].href).href).toBe(url);
      expect(new URL(head.meta("og:url")).href).toBe(url);
      expect(head.meta("og:type")).toBe("website");
      expect(head.meta("og:locale")).toBe("ar_IQ");
      expect(head.meta("og:site_name")).toBe("سوبر صوص");
      expect(head.meta("og:title")).toMatch(/[\u0600-\u06FF]/);
      expect(head.meta("og:description").length).toBeGreaterThan(20);
      expect(head.meta("twitter:title")).toBe(head.meta("og:title"));
      expect(head.meta("twitter:description")).toBe(head.meta("og:description"));
      expect(head.meta("description")).toBe(head.meta("og:description"));
      expect(head.meta("twitter:card")).toBe("summary_large_image");
      expect(head.meta("og:image:type")).toBe("image/jpeg");
      expect(head.meta("og:image:width")).toBe("1200");
      expect(head.meta("og:image:height")).toBe("630");
      expect(head.meta("og:image:alt").length).toBeGreaterThan(10);
      expect(head.meta("twitter:image:alt")).toBe(head.meta("og:image:alt"));
      for (const key of ["og:image", "twitter:image"]) {
        const image = new URL(head.meta(key));
        expect(image.origin).toBe(site.origin);
        expect(image.pathname).toMatch(/^\/social\/[a-z-]+-v1\.jpg$/);
      }
      if (site.origin.startsWith("https://"))
        expect(head.meta("og:image:secure_url")).toBe(head.meta("og:image"));
      const item = menuItems.find((item) => path === `/menu/${item.slug}`);
      if (item) {
        expect(head.meta("og:title")).toBe(`${item.name} | سوبر صوص`);
        expect(head.meta("og:image")).toContain(
          item.image.split("/").pop()!.replace(".webp", "-v1.jpg"),
        );
      }
      const branch = branches.find((branch) => path === `/branches/${branch.slug}`);
      if (branch) {
        expect(head.meta("og:title")).toBe(`فرع ${branch.name} | سوبر صوص`);
        expect(head.meta("og:description")).toContain(branch.address);
        expect(head.meta("og:image")).toContain("restaurant-v1.jpg");
      }
      if (path === "/menu") expect(head.meta("og:title")).toBe("المنيو | سوبر صوص");
    });
  }
});

test("known and unrecognized preview clients receive metadata before the body on a dynamic page", async ({
  request,
}) => {
  for (const agent of [
    "facebookexternalhit/1.1",
    "WhatsApp/2.0",
    "Twitterbot/1.0",
    "TelegramBot (like TwitterBot)",
    "LinkedInBot/1.0",
    "Slackbot-LinkExpanding 1.0",
    "Discordbot/2.0",
    "Applebot/0.1",
    "UnknownLinkPreview/1.0",
  ]) {
    await test.step(agent, async () => {
      const response = await request.get("/contact?subject=partnership", {
        headers: { "User-Agent": agent },
      });
      expect(response.status()).toBe(200);
      const head = readHead(await response.text());
      expect(head.meta("og:title")).toBe("نسمعك | سوبر صوص");
      expect(head.meta("og:url")).toBe(`${site.origin}/contact`);
      expect(head.meta("og:image")).toBe(`${site.origin}/social/super-sauce-v1.jpg`);
      expect(head.meta("twitter:image")).toBe(`${site.origin}/social/super-sauce-x-v1.jpg`);
    });
  }
});

test("preview JPEGs are directly downloadable, correctly sized and compact", async ({
  request,
}) => {
  const photos = new Set([
    "hero-burger",
    "chicken-burger",
    "loaded-fries",
    "sharing-meal",
    "fried-chicken",
    "sauces",
    "restaurant",
  ]);
  const files = [
    "super-sauce-v1.jpg",
    "super-sauce-x-v1.jpg",
    ...[...photos].map((photo) => `${photo}-v1.jpg`),
  ];
  for (const file of files) {
    const response = await request.get(`/social/${file}`, {
      headers: { "User-Agent": "facebookexternalhit/1.1" },
    });
    expect(response.status(), file).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/jpeg");
    const pixels = await response.body();
    expect(pixels.length, `${file} under 300KB`).toBeLessThan(300 * 1024);
    const image = await sharp(pixels).metadata();
    expect(image.format).toBe("jpeg");
    expect(image.width).toBe(1200);
    expect(image.height).toBe(file === "super-sauce-x-v1.jpg" ? 600 : 630);
  }
});

test("crawlers can index pages and fetch previews, with Apple and browser icon fallbacks", async ({
  request,
}) => {
  const homepage = await (await request.get("/")).text();
  const head = readHead(homepage);
  expect(homepage).not.toMatch(/<meta[^>]+name="robots"/i);
  const rules = await (await request.get("/robots.txt")).text();
  expect(rules).toMatch(/^Allow: \/$/m);
  expect(rules).not.toMatch(/^Disallow: \/$/m);
  expect(rules).toMatch(/^Disallow: \/api\/$/m);
  expect(rules).toContain(`Sitemap: ${site.origin}/sitemap.xml`);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${site.origin}</loc>`);
  expect(sitemap).toContain(`<loc>${site.origin}/menu</loc>`);
  expect(head.link("apple-touch-icon").map((icon) => icon.href)).toContain("/apple-touch-icon.png");
  expect(head.link("icon").map((icon) => icon.href)).toContain("/favicon.ico");
  expect(head.link("manifest").map((link) => link.href)).toContain("/manifest.webmanifest");
  for (const [path, size] of [
    ["/apple-touch-icon.png", 180],
    ["/icons/icon-192.png", 192],
    ["/icons/icon-512.png", 512],
  ] as const) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const icon = await sharp(await response.body()).metadata();
    expect([icon.width, icon.height]).toEqual([size, size]);
  }
  const favicon = await request.get("/favicon.ico");
  expect(favicon.status()).toBe(200);
  const bytes = await favicon.body();
  expect(bytes.readUInt16LE(2)).toBe(1);
  expect(bytes.readUInt16LE(4)).toBe(3);
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  expect(await manifest.json()).toMatchObject({
    name: "سوبر صوص | Super Sauce",
    lang: "ar-IQ",
    dir: "rtl",
    display: "browser",
  });
});
