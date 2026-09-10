import sharp from "sharp";

const SRC = "C:/Users/Shahel Pratap/Downloads/attachments (6)/IMG_3422.jpeg";
const OUT = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public/project-3.jpg";

// Auto-orient, then take a full-width band across the row of four condensers,
// keeping all four in frame and dropping the timber / speed-bump below.
const rotated = await sharp(SRC).rotate().toBuffer({ resolveWithObject: true });
const W = rotated.info.width, H = rotated.info.height;

// Full width, 4:3 band anchored near the top so the units sit centred.
const width = W;
const height = Math.round((W * 3) / 4);
const top = Math.round(0.16 * H); // drop most of the ceiling so units sit centred
const region = { left: 0, top, width, height: Math.min(height, H - top) };

const info = await sharp(rotated.data)
  .extract(region)
  .resize(1200, 900, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

console.log(`oriented ${W}x${H} band top=${region.top} h=${region.height} -> project-3.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
