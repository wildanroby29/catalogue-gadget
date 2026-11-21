// USB Toaster — catalogue photo of an impossible gadget.
// This script is the entrypoint: it hands the finished photo to the
// harness by copying assets/entry.png into the output directory,
// but only after checking the file really is a PNG.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Every PNG file opens with these eight bytes.
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const repoRoot = dirname(fileURLToPath(import.meta.url));
const photoPath = join(repoRoot, "assets", "entry.png");

let photo: Buffer;
try {
  photo = readFileSync(photoPath);
} catch (err) {
  const reason = err instanceof Error ? err.message : String(err);
  console.error(`could not read the catalogue photo (${photoPath}): ${reason}`);
  process.exit(1);
}

// The harness only accepts a real PNG at this path, and a bad file would
// fail the entry outright, so refuse loudly instead of copying garbage.
if (photo.length < PNG_SIGNATURE.length) {
  console.error("the catalogue photo is too short to be a PNG file");
  process.exit(1);
}

if (!photo.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
  const head = [...photo.subarray(0, 8)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
  console.error(`the catalogue photo is not a PNG file (first bytes: ${head})`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "entry.png");
writeFileSync(outputPath, photo);
console.log(`wrote ${photo.length} bytes to ${outputPath}`);
