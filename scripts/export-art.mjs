// Deterministic resizing/encoding only; illustrations come from image_gen.
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  process.env.SHARP_MODULE || "../frontend/node_modules/sharp",
);
const manifest = JSON.parse(await fs.readFile(process.argv[2], "utf8"));
const dest = path.resolve("backend/public/icones");
await fs.mkdir(dest, { recursive: true });
for (const [name, source] of Object.entries(manifest)) {
  const wide = name === "kingdom-background";
  const buffer = await sharp(source)
    .resize(wide ? 1600 : 512, wide ? 900 : 512, { fit: "cover" })
    .webp({ quality: 88 })
    .toBuffer();
  const legacy = [
    "archer",
    "chevalier",
    "monture",
    "siege",
    "forteresse",
    "war-world",
    "all",
    "upgrade",
    "angel",
    "manager",
  ].includes(name);
  if (legacy) {
    await fs.writeFile(
      path.join(dest, `${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/webp;base64,${buffer.toString("base64")}"/></svg>\n`,
    );
  } else {
    await fs.writeFile(path.join(dest, `${name}.webp`), buffer);
  }
  console.log(`${name}: ${buffer.length} bytes`);
}
