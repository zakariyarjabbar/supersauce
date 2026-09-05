import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Explicit source allowlist keeps dependencies, private env files and user reference screenshots out.
const entries = [
  "app",
  "components",
  "lib",
  "public",
  "assets",
  "content",
  "scripts",
  "tests",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "next.config.ts",
  "eslint.config.mjs",
  "playwright.config.ts",
  ".env.example",
  ".gitignore",
  ".prettierrc.json",
  ".prettierignore",
  "README.md",
  "PRODUCT.md",
  "DESIGN.md",
  "VALIDATION.md",
  "DEMO-GUIDE.md",
  ".impeccable/design.json",
];
const files = [];
async function collect(entry) {
  const stat = await fs.stat(entry);
  if (stat.isDirectory()) {
    for (const child of await fs.readdir(entry)) {
      if (child !== ".DS_Store") await collect(path.join(entry, child));
    }
  } else files.push(entry);
}
for (const entry of entries) await collect(entry);
await fs.mkdir("deliverables", { recursive: true });
const archive = path.resolve("deliverables/supersauce-website.zip");
const result = spawnSync("zip", ["-q", "-X", archive, "-@"], {
  input: files.join("\n") + "\n",
  encoding: "utf8",
});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(result.stderr || "Could not create source archive");
console.log(`Packaged ${files.length} source and asset files into ${archive}`);
