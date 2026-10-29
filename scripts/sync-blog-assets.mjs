import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const srcDir = path.join(process.cwd(), "content", "blog");
const outDir = path.join(process.cwd(), "public", "blog");
const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

await rm(outDir, { recursive: true, force: true });

let entries = [];
try {
  entries = await readdir(srcDir, { recursive: true, withFileTypes: true });
} catch {
  process.exit(0);
}

let copied = 0;
for (const entry of entries) {
  if (!entry.isFile() || !IMAGE.test(entry.name)) continue;
  const dir = entry.parentPath ?? entry.path;
  const rel = path.relative(srcDir, path.join(dir, entry.name));
  const dest = path.join(outDir, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(path.join(srcDir, rel), dest);
  copied++;
}

console.log(`[blog] copied ${copied} image(s) to public/blog`);
