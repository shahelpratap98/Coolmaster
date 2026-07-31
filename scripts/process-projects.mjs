import sharp from "sharp";

const SRC = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public/_proj";
const OUT = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public";

// chosen staged photo -> output name
const PICKS = [
  ["p09.jpeg", "project-1.jpg"], // Mitsubishi rooftop, Auckland view
  ["p13.jpeg", "project-2.jpg"], // Fujitsu Airstage close-up
  ["p05.jpeg", "project-3.jpg"], // Mitsubishi outdoor unit, bracket-mounted
  ["p12.jpeg", "project-4.jpg"], // Fujitsu Airstage in a room
  ["p07.jpeg", "project-5.jpg"], // Güntner coolroom evaporator
  ["p08.jpeg", "project-6.jpg"], // new condenser fans
  ["p04.jpeg", "project-7.jpg"], // coil foam clean
  ["p10.jpeg", "project-8.jpg"], // diagnostics / gauges
];

for (const [src, out] of PICKS) {
  const info = await sharp(`${SRC}/${src}`)
    .rotate() // auto-orient from EXIF
    .resize({ width: 1200, height: 900, fit: "cover", position: "attention", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${OUT}/${out}`);
  console.log(`${out}: ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
console.log("done");
