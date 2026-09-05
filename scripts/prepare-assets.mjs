import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assets = JSON.parse(await fs.readFile("content/asset-prompts.json", "utf8"));
await fs.mkdir("public/images", { recursive: true });
for (const asset of assets) {
  const source = path.join("assets/source", `${asset.key}.png`);
  const destination = path.join("public/images", `${asset.key}.webp`);
  await sharp(source)
    .resize({ width: asset.key === "logo-original" ? 600 : 1536, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(destination);
  const provenance =
    JSON.stringify(
      {
        prompt: asset.prompt,
        source,
        type: asset.type || "ai-generated-concept",
        generator: asset.key === "logo-original" ? null : "OpenAI image generation",
        note: "Presentation imagery; not a verified photograph of the restaurant or its products.",
      },
      null,
      2,
    ) + "\n";
  await fs.writeFile(`${destination}.json`, provenance);
  await fs.writeFile(`${source}.json`, provenance);
}
console.log(`Prepared ${assets.length} optimized WebP images with provenance.`);
