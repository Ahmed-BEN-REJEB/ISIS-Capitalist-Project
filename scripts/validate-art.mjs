import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(
  process.env.SHARP_MODULE || "../frontend/node_modules/sharp",
);
const root = "backend/public/icones";
const names = (await fs.readdir(root)).sort();
const squares = [];
for (const name of names) {
  let data = await fs.readFile(path.join(root, name));
  if (name.endsWith(".svg")) {
    const encoded = data.toString().match(/data:image\/webp;base64,([^"]+)/);
    if (!encoded) throw new Error("Missing WebP payload: " + name);
    data = Buffer.from(encoded[1], "base64");
  }
  const meta = await sharp(data).metadata();
  const background = name.startsWith("kingdom-background");
  if (
    meta.format !== "webp" ||
    meta.width !== (background ? 1600 : 512) ||
    meta.height !== (background ? 900 : 512)
  )
    throw new Error("Invalid dimensions: " + name);
  if (!background) squares.push({ name, data });
}
const tiles = await Promise.all(
  squares.map(async ({ name, data }, index) => {
    const label = Buffer.from(
      '<svg width="170" height="28"><text x="85" y="19" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#eadcc7">' +
        name +
        "</text></svg>",
    );
    return {
      input: await sharp({
        create: { width: 170, height: 180, channels: 4, background: "#111b28" },
      })
        .composite([
          {
            input: await sharp(data).resize(128, 128).toBuffer(),
            left: 21,
            top: 8,
          },
          { input: label, left: 0, top: 145 },
        ])
        .png()
        .toBuffer(),
      left: (index % 6) * 170,
      top: Math.floor(index / 6) * 180,
    };
  }),
);
await fs.mkdir("artifacts", { recursive: true });
await sharp({
  create: {
    width: 1020,
    height: Math.ceil(tiles.length / 6) * 180,
    channels: 4,
    background: "#111b28",
  },
})
  .composite(tiles)
  .png()
  .toFile("artifacts/art-contact-sheet.png");
console.log(names.length + " assets validated; contact sheet written.");
