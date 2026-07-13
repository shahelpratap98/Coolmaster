#!/usr/bin/env python3
"""Generate optimised image assets for the CoolMaster site into the output folder."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np, os

OUT = '/mnt/user-data/outputs/coolmaster-website'
os.makedirs(OUT, exist_ok=True)

word = Image.open('assets/coolmaster_wordmark.png').convert('RGBA')
icon = Image.open('assets/coolmaster_icon.png').convert('RGBA')

def opt_png(img, w, path, colors=200):
    img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    img.quantize(colors=colors, method=Image.Quantize.FASTOCTREE).save(path, optimize=True)
    return os.path.getsize(path)

s1 = opt_png(word, 680, f'{OUT}/coolmaster-wordmark.png', colors=256)
s2 = opt_png(icon, 600, f'{OUT}/coolmaster-icon.png')
fav = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
_fi = icon.copy(); _fi.thumbnail((64, 64), Image.LANCZOS)
fav.alpha_composite(_fi, ((64 - _fi.width) // 2, (64 - _fi.height) // 2))
fav.quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(f'{OUT}/favicon.png', optimize=True)
print(f'wordmark {s1//1024}KB · icon {s2//1024}KB · favicon {os.path.getsize(f"{OUT}/favicon.png")//1024}KB')

# ---- Open Graph share image (1200x630) ----
W, H = 1200, 630
def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
EMBER, FLAME, FROST, DEEP, INK, MIST = hx('#F47A20'), hx('#E5342B'), hx('#169BD7'), hx('#15224F'), hx('#1B2540'), hx('#F5F8FC')
yy, xx = np.mgrid[0:H, 0:W]
bg = np.zeros((H, W, 3), float); bg[:] = MIST
def wash(cx, cy, rad, color, strength):
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / rad
    a = np.clip(1 - d, 0, 1) ** 2 * strength
    for k in range(3): bg[..., k] = bg[..., k] * (1 - a) + color[k] * a
wash(120, 120, 820, EMBER, 0.16); wash(1080, 540, 820, FROST, 0.18)
canvas = Image.fromarray(bg.astype('uint8'), 'RGB').convert('RGBA')

bar = Image.new('RGB', (W, 16)); bp = bar.load()
stops = [(0.0, EMBER), (0.45, FLAME), (1.0, FROST)]
for x in range(W):
    t = x / (W - 1); col = EMBER
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]; t1, c1 = stops[i + 1]
        if t0 <= t <= t1:
            f = (t - t0) / (t1 - t0); col = tuple(round(c0[k] + (c1[k] - c0[k]) * f) for k in range(3)); break
    for y in range(16): bp[x, y] = col
canvas.paste(bar, (0, 0))

_emh = 420; _emw = round(_emh * icon.width / icon.height)
canvas.alpha_composite(icon.resize((_emw, _emh), Image.LANCZOS), (1128 - _emw, (H - _emh) // 2))
wm = word.resize((560, round(word.height * 560 / word.width)), Image.LANCZOS)
canvas.alpha_composite(wm, (80, 205))
draw = ImageDraw.Draw(canvas)
fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
fr = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
draw.text((84, 378), 'Auckland-based · Established 2014', font=fb, fill=DEEP)
draw.text((84, 420), 'Commercial HVAC · Refrigeration · Form 12A', font=fr, fill=INK)
canvas.convert('RGB').save(f'{OUT}/coolmaster-share.jpg', 'JPEG', quality=86, optimize=True)
print('share image', os.path.getsize(f'{OUT}/coolmaster-share.jpg') // 1024, 'KB')
