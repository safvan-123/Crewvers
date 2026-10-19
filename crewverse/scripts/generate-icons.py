"""Deterministic logo/icon conversion from the latest user-supplied JPEG.
Requires Pillow. No AI redraw, replacement font, recoloring or letter extraction.
Run: python3 scripts/generate-icons.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
source = Image.open(PUBLIC / 'images/logo-supplied.jpeg').convert('RGB')
# Ignore compression noise when locating the complete wordmark and tagline.
x0, y0, x1, y1 = source.convert('L').point(lambda x: 255 if x > 55 else 0).getbbox()
wordmark = source.crop((max(0,x0-10), max(0,y0-10), min(source.width,x1+10), min(source.height,y1+10)))
# Keep the existing header/footer asset dimensions and preserve logo proportions.
website = Image.new('RGB', (1754, 419), 'black')
fitted = ImageOps.contain(wordmark, website.size, Image.Resampling.LANCZOS)
website.paste(fitted, ((website.width-fitted.width)//2, (website.height-fitted.height)//2))
website.save(PUBLIC / 'images/logo.webp', 'WEBP', lossless=True, method=6)

# Use the complete supplied logo in every square favicon, without a substitute C.
master = Image.new('RGB', (512, 512), 'black')
fitted = ImageOps.contain(wordmark, (480, 480), Image.Resampling.LANCZOS)
master.paste(fitted, ((512-fitted.width)//2, (512-fitted.height)//2))
for size in (16, 32, 48, 96, 192, 512):
    master.resize((size,size), Image.Resampling.LANCZOS).save(PUBLIC / f'favicon-{size}x{size}.png', optimize=True)
master.resize((180,180), Image.Resampling.LANCZOS).save(PUBLIC / 'apple-touch-icon.png', optimize=True)
master.save(PUBLIC / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(96,96),(128,128),(256,256)])
# Retain the old SVG URL too, using the actual supplied logo instead of a glyph.
from base64 import b64encode
svg_data = b64encode((PUBLIC / 'favicon-512x512.png').read_bytes()).decode()
(PUBLIC / 'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,'+svg_data+'"/></svg>\n')
print('Generated full-logo favicon set and same-size lossless website wordmark from latest supplied JPEG.')
