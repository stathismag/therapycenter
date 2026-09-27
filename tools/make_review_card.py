#!/usr/bin/env python3
"""Φτιάχνει την κάρτα κριτικής με QR code για εκτύπωση.
    python3 tools/make_review_card.py [έξοδος]
Παράγει: κάρτα A6 (PNG + PDF), σελίδα A4 με 4 κάρτες για κόψιμο, αφίσα A4 (PNG + PDF).
Απαιτεί: pip install qrcode pillow
"""
import os, sys
import qrcode
from PIL import Image, ImageDraw, ImageFont

URL = "https://logotherapeia-pyrgos.gr/kritiki"
SHOW = "logotherapeia-pyrgos.gr/kritiki"
PURPLE = (110, 72, 170); PURPLE2 = (157, 80, 187); ORANGE = (255, 142, 60); TEXT = (45, 52, 54); GREY = (95, 105, 110)
DPI = 300
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def mm(v): return int(round(v / 25.4 * DPI))
def font(path, px): return ImageFont.truetype(path, px)

def gradient(w, h):
    g = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(g)
    for x in range(w):
        t = x / max(1, w - 1)
        d.line([(x, 0), (x, h)], fill=tuple(int(a + (b - a) * t) for a, b in zip(PURPLE, PURPLE2)))
    return g

def qr_image(size):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2, box_size=10)
    q.add_data(URL); q.make(fit=True)
    img = q.make_image(fill_color=(40, 25, 70), back_color="white").convert("RGB")
    return img.resize((size, size), Image.NEAREST)

def center(d, W, y, text, f, fill):
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, y), text, font=f, fill=fill)

def wrap_center(d, W, y, text, f, fill, maxw, gap):
    words, line, lines = text.split(), "", []
    for wd in words:
        t = (line + " " + wd).strip()
        if d.textlength(t, font=f) <= maxw: line = t
        else: lines.append(line); line = wd
    lines.append(line)
    for l in lines:
        center(d, W, y, l, f, fill); y += gap
    return y

def card(w_mm, h_mm, scale=1.0):
    W, H = mm(w_mm), mm(h_mm)
    s = W / mm(105) * scale
    img = Image.new("RGB", (W, H), "white")
    head = int(H * 0.30)
    img.paste(gradient(W, head), (0, 0))
    d = ImageDraw.Draw(img)
    # logo in white circle
    logo = Image.open(os.path.join(ROOT, "assets", "logo-160.png")).convert("RGBA")
    L = int(150 * s); pad = int(14 * s)
    circ = Image.new("RGBA", (L, L), (0, 0, 0, 0)); ImageDraw.Draw(circ).ellipse((0, 0, L - 1, L - 1), fill="white")
    circ.alpha_composite(logo.resize((L - 2 * pad, L - 2 * pad), Image.LANCZOS), (pad, pad))
    img.paste(circ, ((W - L) // 2, int(40 * s)), circ)
    center(d, W, int(40 * s) + L + int(18 * s), "Κέντρο Ειδικών Θεραπειών", font(FB, int(46 * s)), "white")
    center(d, W, int(40 * s) + L + int(76 * s), "Κανδρή Χρ. Κωνσταντίνα", font(FR, int(34 * s)), "white")
    y = head + int(60 * s)
    center(d, W, y, "Η γνώμη σας μετράει!", font(FB, int(78 * s)), PURPLE); y += int(110 * s)
    d.rounded_rectangle(((W - int(120 * s)) // 2, y, (W + int(120 * s)) // 2, y + int(8 * s)), radius=int(4 * s), fill=ORANGE); y += int(60 * s)
    y = wrap_center(d, W, y, "Αφήστε μας μια κριτική στο Google. Βοηθάτε κι άλλες οικογένειες να μας βρουν.",
                    font(FR, int(38 * s)), TEXT, W - int(140 * s), int(52 * s)) + int(30 * s)
    Q = int(min(W * 0.52, H - y - int(250 * s)))
    img.paste(qr_image(Q), ((W - Q) // 2, y)); y += Q + int(30 * s)
    center(d, W, y, "Σκανάρετε με την κάμερα του κινητού σας", font(FB, int(34 * s)), TEXT); y += int(52 * s)
    center(d, W, y, SHOW, font(FR, int(32 * s)), PURPLE); y += int(64 * s)
    center(d, W, y, "Ευχαριστούμε πολύ!", font(FB, int(36 * s)), ORANGE)
    # footer strip
    d.rectangle((0, H - int(22 * s), W, H), fill=PURPLE)
    return img

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "print")
    os.makedirs(out, exist_ok=True)
    a6 = card(105, 148)
    a6.save(os.path.join(out, "karta-kritikis-A6.png"), dpi=(DPI, DPI))
    a6.save(os.path.join(out, "karta-kritikis-A6.pdf"), resolution=DPI)
    # A4 sheet with 4 A6 cards and light cut marks
    A4W, A4H = mm(210), mm(297)
    sheet = Image.new("RGB", (A4W, A4H), "white")
    for i in range(4):
        sheet.paste(a6, ((i % 2) * a6.width, (i // 2) * a6.height))
    d = ImageDraw.Draw(sheet)
    d.line((a6.width, 0, a6.width, A4H), fill=(200, 200, 200), width=2)
    d.line((0, a6.height, A4W, a6.height), fill=(200, 200, 200), width=2)
    sheet.save(os.path.join(out, "kartes-kritikis-4-ana-A4.pdf"), resolution=DPI)
    sheet.save(os.path.join(out, "kartes-kritikis-4-ana-A4.png"), dpi=(DPI, DPI))
    poster = card(210, 297)
    poster.save(os.path.join(out, "afisa-kritikis-A4.png"), dpi=(DPI, DPI))
    poster.save(os.path.join(out, "afisa-kritikis-A4.pdf"), resolution=DPI)
    print("Αρχεία στο", out)

if __name__ == "__main__":
    main()
