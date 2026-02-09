import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { execSync } from "node:child_process";
import { optimize } from "svgo";

const ROOT = process.cwd();

const SRC = path.join(ROOT, "src", "assets");
const OUT = path.join(ROOT, "public", "assets");
const SVG_CONFIG = path.join(ROOT, "configs", "svgo.config.js");

// ---------- CLEAN ----------
async function cleanAssets() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });
  console.log("public/assets cleaned");
}

// ---------- WALK ----------
function walk(dir) {
  return fsSync.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : path.join(dir, d.name)
  );
}


// ---------- COPY FILE ----------
async function copyFile(file) {
  const outFile = file.replace(SRC, OUT);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.copyFile(file, outFile);
}

// ---------- OPTIMIZE SVG ----------
async function optimizeSVG(files) {
  console.log("Optimizing SVG...");
  for (const file of files) {
    if (path.extname(file) !== ".svg") continue;

    const svgContent = await fs.readFile(file, "utf-8");

    const hasSymbol = /<symbol[\s>]/.test(svgContent);

    const plugins = hasSymbol
      ? [
        "removeComments",
        "removeMetadata",
        "removeTitle",
        "removeDesc",
        "removeDimensions"
      ]
      : [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
              removeUselessDefs: false,   // for sprites
              removeUnknownsAndDefaults: false,
              collapseGroups: false,
              convertShapeToPath: false
            }
          }
        }
      ];
    const result = optimize(svgContent, {
      multipass: true,
      path: file, // for correct nape via notification
      plugins
    });

    const outFile = file.replace(SRC, OUT);
    // copy file to OUT
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, result.data);

    console.log("SVG optimized:", file);
  }
}

// ---------- WEBP ----------
async function convertToWebP(files) {
  console.log("Converting JPG/PNG → WebP...");
  for (const file of files) {
    const ext = path.extname(file);
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const outFile = file
      .replace(SRC, OUT)
      .replace(ext, ".webp");

    // copy file to OUT
    await fs.mkdir(path.dirname(outFile), { recursive: true });

    await sharp(file)
      .webp({ quality: 80 })
      .toFile(outFile);

    console.log("WebP:", outFile);
  }
}

// ---------- RUN ----------
await cleanAssets();
const files = walk(SRC);

await convertToWebP(files);
await optimizeSVG(files);


console.log("DONE");