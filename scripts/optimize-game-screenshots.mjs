import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, ".tmp-game-screenshots");
const outputRoot = path.join(projectRoot, "public", "images", "gameplay");

async function listPngFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listPngFiles(entryPath);
      return entry.name.endsWith(".png") ? [entryPath] : [];
    }),
  );
  return nestedFiles.flat();
}

const sourceFiles = await listPngFiles(sourceRoot);

for (const sourcePath of sourceFiles) {
  const relativePath = path.relative(sourceRoot, sourcePath).replace(/\.png$/i, ".webp");
  const outputPath = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const image = sharp(sourcePath);
  const metadata = await image.metadata();
  await image
    .resize({ width: Math.min(metadata.width ?? 960, 960), withoutEnlargement: true })
    .webp({ quality: 76, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  console.log(relativePath);
}
