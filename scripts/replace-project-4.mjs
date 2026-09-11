import sharp from "sharp";

const SRC = "C:/Users/Shahel Pratap/Downloads/attachments (6)/IMG_3420.jpeg";
const OUT = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public/project-4.jpg";

const rotated = await sharp(SRC).rotate().toBuffer({ resolveWithObject: true });
const W = rotated.info.width, H = rotated.info.height;

// Frame the bracket-mounted unit + spiral duct; keep the ladder out on the right.
const frac = { left: 0.0, top: 0.09, width: 0.74, height: 0.6 };
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

console.log(`oriented ${W}x${H} -> project-4.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
