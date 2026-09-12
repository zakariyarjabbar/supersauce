import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "@playwright/test";
import { prepareMenuPreviews } from "./prepare-menu-assets.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/social");
await fs.mkdir(output, { recursive: true });
const sourceAssets = JSON.parse(
  await fs.readFile(path.join(root, "content/asset-prompts.json"), "utf8"),
);
const fileData = async (name, mime) =>
  `data:${mime};base64,${(await fs.readFile(path.join(root, name))).toString("base64")}`;
const provenance = async (file, sources, note) => {
  await fs.writeFile(
    `${file}.json`,
    JSON.stringify(
      {
        type: "code-rendered-share-asset",
        generator: "scripts/prepare-share-assets.mjs — Chromium / Sharp",
        source: sources,
        origin: "Existing project imagery and supplied identity; no new photograph generated.",
        note,
        sourcePrompts: sourceAssets.filter((asset) =>
          sources.some((name) => name.includes(asset.key)),
        ),
      },
      null,
      2,
    ) + "\n",
  );
};

let html = await fs.readFile(path.join(root, "assets/social/share-card.html"), "utf8");
for (const [key, name, mime] of [
  [
    "FONT",
    "node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2",
    "font/woff2",
  ],
  ["PHOTO", "public/images/hero-burger.webp", "image/webp"],
  ["LOGO", "public/images/logo-original.webp", "image/webp"],
])
  html = html.replaceAll(`{{${key}}}`, await fileData(name, mime));

const browser = await chromium.launch();
try {
  for (const [filename, height] of [
    ["super-sauce-v1.jpg", 630],
    ["super-sauce-x-v1.jpg", 600],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1200, height }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    const file = path.join(output, filename);
    const pixels = await page.screenshot({ type: "png" });
    await sharp(pixels).jpeg({ quality: 88, mozjpeg: true }).toFile(file);
    await provenance(
      file,
      [
        "assets/social/share-card.html",
        "public/images/hero-burger.webp",
        "public/images/logo-original.webp",
      ],
      "Branded Arabic link card using the existing illustrative burger and original logo. Rebuild when the source layout or imagery changes.",
    );
    await page.close();
  }
} finally {
  await browser.close();
}

// Simple JPEG delivery versions let product/branch links show their own image
// without relying on WebP decoding or a JavaScript image-optimization endpoint.
for (const asset of sourceAssets.filter((asset) => asset.key !== "logo-original")) {
  const file = path.join(output, `${asset.key}-v1.jpg`);
  const source = `public/images/${asset.key}.webp`;
  await sharp(path.join(root, source))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(file);
  await provenance(
    file,
    [source],
    "JPEG social-preview crop of the existing illustrative image; not a verified photograph of the restaurant or its products.",
  );
}

// Convert the existing vector favicon, preserving the site's established mark.
const icon = await fs.readFile(path.join(root, "app/icon.svg"));
await fs.mkdir(path.join(root, "public/icons"), { recursive: true });
for (const [name, size] of [
  ["apple-touch-icon.png", 180],
  ["icons/icon-192.png", 192],
  ["icons/icon-512.png", 512],
]) {
  const file = path.join(root, "public", name);
  await sharp(icon).resize(size, size).png().toFile(file);
  await provenance(
    file,
    ["app/icon.svg"],
    "Raster fallback of the existing SVG brand-star favicon.",
  );
}
const iconSizes = [16, 32, 48];
const frames = await Promise.all(
  iconSizes.map((size) => sharp(icon).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (const [index, frame] of frames.entries()) {
  const entry = 6 + index * 16;
  header[entry] = iconSizes[index];
  header[entry + 1] = iconSizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
}
await fs.writeFile(path.join(root, "public/favicon.ico"), Buffer.concat([header, ...frames]));
await provenance(
  path.join(root, "public/favicon.ico"),
  ["app/icon.svg"],
  "16px, 32px and 48px favicon fallbacks of the existing SVG mark.",
);
await prepareMenuPreviews();
console.log("Prepared branded OG/X images, catalog photo previews and platform icons.");
