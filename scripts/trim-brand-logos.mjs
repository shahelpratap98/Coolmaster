import sharp from "sharp";

const DL = "C:/Users/Shahel Pratap/Downloads";
const PUB = "C:/Users/Shahel Pratap/claude code/coolmaster-app/public";

async function trim(input, output) {
  const info = await sharp(input)
    .trim({ threshold: 12 })
    .png()
    .toFile(output);
  console.log(`${output.split("/").pop()}: ${info.width}x${info.height}`);
}

await trim(`${DL}/new-logo.png`, `${PUB}/brand-gree.png`);
await trim(`${DL}/panasonic-rev.webp`, `${PUB}/brand-panasonic.png`);
console.log("done");
