import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await fs.readFile(path.join(root, "content/menu-catalog.json"), "utf8"));

export async function prepareMenuPreviews({ partial = false } = {}) {
  await fs.mkdir(path.join(root, "public/social"), { recursive: true });
  let count = 0;
  for (const item of catalog) {
    const source = path.join(root, `public/images/menu/${item.slug}.webp`);
    if (
      partial &&
      !(await fs.access(source).then(
        () => true,
        () => false,
      ))
    )
      continue;
    await sharp(source)
      .resize(1200, 630, { fit: "contain", background: "#f5ede2" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(root, `public/social/menu-${item.slug}-v2.jpg`));
    count++;
  }
  return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const partial = process.argv.includes("--partial");
  await fs.mkdir(path.join(root, "public/images/menu"), { recursive: true });
  const missing = [];
  for (const item of catalog) {
    const source = path.join(root, `assets/menu-generated/${item.slug}.png`);
    if (
      !(await fs.access(source).then(
        () => true,
        () => false,
      ))
    ) {
      missing.push(item.slug);
      continue;
    }
    // Delivery optimization only: preserve the generated composition and mark.
    await sharp(source)
      .resize(1200, 800, { fit: "contain", background: "#f5ede2" })
      .webp({ quality: 83, effort: 6 })
      .toFile(path.join(root, `public/images/menu/${item.slug}.webp`));
  }
  if (missing.length && !partial) throw new Error(`Missing product images: ${missing.join(", ")}`);
  const count = await prepareMenuPreviews({ partial });
  console.log(`Prepared ${count}/${catalog.length} branded product images and JPEG link previews.`);
  if (missing.length) console.log(`Still generating: ${missing.join(", ")}`);
}
