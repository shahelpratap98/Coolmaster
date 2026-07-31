import sharp from "sharp";
import { readFileSync } from "node:fs";

const DIR = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public";

// Re-crop three images that framed poorly. Fractions of the current 1200x900
// image: focus on the equipment, drop distractions (boot, cables, bucket).
const JOBS = [
  // Mitsubishi outdoor unit — tighten, trim right rail/cables
  { file: "project-3.jpg", left: 0.0, top: 0.04, width: 0.84, height: 0.96 },
  // Condenser fans — drop the boot at the bottom, focus on the fans
  { file: "project-6.jpg", left: 0.04, top: 0.0, width: 0.92, height: 0.75 },
  // Coil foam clean — zoom onto the foamed coil, drop the bucket on the right
  { file: "project-7.jpg", left: 0.06, top: 0.14, width: 0.6, height: 0.78 },
];

for (const j of JOBS) {
  const path = `${DIR}/${j.file}`;
  const buf = readFileSync(path);
  const meta = await sharp(buf).metadata();
  const region = {
    left: Math.round(j.left * meta.width),
    top: Math.round(j.top * meta.height),
    width: Math.round(j.width * meta.width),
    height: Math.round(j.height * meta.height),
  };
  const info = await sharp(buf)
    .extract(region)
    .resize(1200, 900, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path);
  console.log(`${j.file}: ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
console.log("done");
