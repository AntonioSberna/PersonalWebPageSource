#!/usr/bin/env python3
"""Generate static/images/social-card.png (1200x630), the link-preview image used
for pages without their own featured image (home, lists, news...).

Name, role and organization are read from hugo.toml, so re-run it after changing them:
    python3 tools/make_social_card.py
"""
import math, random, tomllib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
cfg = tomllib.loads((ROOT / "hugo.toml").read_text())
p = cfg["params"]
NAME, ROLE, ORG = cfg["title"], p["role"], p["organization"]
URL = cfg["baseURL"].split("//")[1].strip("/").lower()

W, H = 1200, 630
BG, TEXT, MUTED, ACCENT, BORDER = "#0d1117", "#e2e8f0", "#8892a4", "#7c9bdf", "#2a3654"
SERIF = "/usr/share/fonts/opentype/urw-base35/P052-Bold.otf"
SANS = "/usr/share/fonts/truetype/lato/Lato-Regular.ttf"
SANS_MED = "/usr/share/fonts/truetype/lato/Lato-Medium.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

S = 2  # draw at 2x, downsample for smooth lines
img = Image.new("RGB", (W * S, H * S), BG)
d = ImageDraw.Draw(img)

# seismograph trace along the bottom: quiet, a burst, decaying (fades at the left)
random.seed(7)
base_y, x0, x1 = 520 * S, 0, int(0.86 * W * S)   # x1 = pen position
pts = []
for x in range(x0, x1, 2):
    t = x / (W * S)
    env = math.exp(-((t - 0.62) / 0.07) ** 2) + 0.45 * math.exp(-((t - 0.72) / 0.10) ** 2)
    y = base_y - S * (env * 46 * math.sin(x / (9 * S)) * (0.75 + 0.5 * random.random()) + random.uniform(-1.2, 1.2))
    pts.append((x, y))
trace = Image.new("L", img.size, 0)
ImageDraw.Draw(trace).line(pts, fill=255, width=2 * S)
fade = Image.linear_gradient("L").rotate(90, expand=True).resize(img.size)   # 0 left -> 255 right
fade = Image.eval(fade, lambda v: int(min(255, v * 1.6)))
mask = Image.composite(trace, Image.new("L", img.size, 0), fade)
img.paste(Image.new("RGB", img.size, ACCENT), (0, 0), mask)
d.line([(0, base_y), (W * S, base_y)], fill=BORDER, width=S)
pen = (x1, int(pts[-1][1]))
d.ellipse([pen[0] - 5 * S, pen[1] - 5 * S, pen[0] + 5 * S, pen[1] + 5 * S], fill=ACCENT)

# avatar (circle with thin ring)
av_size, ax, ay = 250 * S, 90 * S, 120 * S
av = Image.open(ROOT / "assets/images/avatar.jpeg").convert("RGB")
side = min(av.size); av = av.crop(((av.width - side) // 2, (av.height - side) // 2,
                                    (av.width + side) // 2, (av.height + side) // 2))
av = av.resize((av_size, av_size), Image.LANCZOS)
m = Image.new("L", (av_size, av_size), 0); ImageDraw.Draw(m).ellipse([0, 0, av_size, av_size], fill=255)
img.paste(av, (ax, ay), m)
d.ellipse([ax - 6 * S, ay - 6 * S, ax + av_size + 6 * S, ay + av_size + 6 * S], outline=BORDER, width=2 * S)

# text
tx = ax + av_size + 70 * S
f_name = ImageFont.truetype(SERIF, 66 * S)
f_role = ImageFont.truetype(SANS, 30 * S)
f_org = ImageFont.truetype(SANS_MED, 28 * S)
f_url = ImageFont.truetype(MONO, 20 * S)
d.text((tx, 150 * S), NAME, font=f_name, fill=TEXT)
d.line([(tx, 248 * S), (tx + 64 * S, 248 * S)], fill=ACCENT, width=3 * S)
d.text((tx, 275 * S), ROLE, font=f_role, fill=MUTED)
d.text((tx, 322 * S), ORG, font=f_org, fill=ACCENT)
d.text((tx, 420 * S), URL, font=f_url, fill=MUTED)

out = ROOT / "static/images/social-card.png"
img.resize((W, H), Image.LANCZOS).save(out, optimize=True)
print("written", out)
