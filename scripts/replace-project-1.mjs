import sharp from "sharp";

const SRC = "C:/Users/Shahel Pratap/Downloads/IMG_4085 (1).jpeg";
const OUT = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public/project-1.jpg";

// Auto-orient from EXIF, then crop the upright portrait to frame the Gree unit.
const rotated = await sharp(SRC).rotate().toBuffer({ resolveWithObject: true });
const W = rotated.info.width, H = rotated.info.height;

const frac = { left: 0.07, top: 0.27, width: 0.75, height: 0.46 };
const region = {
  left: Math.round(frac.left * W),
  top: Math.round(frac.top * H),
  width: Math.round(frac.width * W),
  height: Math.round(frac.height * H),
};

const info = await sharp(rotated.data)
  .extract(region)
  .resize(1200, 900, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

console.log(`oriented ${W}x${H} -> project-1.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
