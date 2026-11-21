import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const src = new URL("./assets/entry.png", import.meta.url);
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);
const bytes = readFileSync(dest);
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(sig)) {
  throw new Error(
    `entry.png is not a PNG (first bytes: ${bytes.subarray(0, 8).toString("hex")})`,
  );
}
console.log(`wrote ${dest} (${bytes.length} bytes)`);
