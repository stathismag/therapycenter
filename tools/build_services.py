#!/usr/bin/env python3
"""Δημιουργεί τις σελίδες υπηρεσιών (/<slug>/index.html) και το sitemap.xml
από το tools/services_content.py. Τρέξτε από τον φάκελο του repo:
    python3 tools/build_services.py
"""
import html, json, os, sys, datetime
sys.path.insert(0, os.path.dirname(__file__))
from services_content import PAGES

DOMAIN = "https://logotherapeia-pyrgos.gr"
NAME = "Κέντρο Ειδικών Θεραπειών Κανδρή Χρ. Κωνσταντίνα"
TODAY = datetime.date.today().isoformat()
BY_SLUG = {p["slug"]: p for p in PAGES}
e = html.escape

def lis(items, indent):
    pad = " " * indent
    return "\n".join(f"{pad}<li>{e(i)}</li>" for i in items)

def page(p):
    url = f"{DOMAIN}/{p['slug']}/"
    includes = "\n".join(f"""          <article class="service-card">
            <h3>{e(t)}</h3>
            <ul>
{lis(items, 14)}
            </ul>
          </article>""" for t, items in p["includes"])
    photos = ""
    if p.get("photos"):
        photos = """
      <section class="svc-section">
        <h2>Ο χώρος μας</h2>
        <div class="svc-photos">
""" + "\n".join(f'          <img src="/assets/gallery/{n}-thumb.webp" alt="{e(a)}" loading="lazy" width="480" height="360">' for n, a in p["photos"]) + """
        </div>
      </section>
"""
    faq = "\n".join(f"""          <details class="faq-item">
            <summary>{e(q)}</summary>
            <div class="faq-answer"><p>{e(a)}</p></div>
          </details>""" for q, a in p["faq"])
    related = "\n".join(f"""          <a class="svc-related-card" href="/{r}/"><span aria-hidden="true">{BY_SLUG[r]['icon']}</span> {e(BY_SLUG[r]['short'])} →</a>""" for r in p["related"])
    ld = [
        {
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Αρχική", "item": DOMAIN + "/"},
                {"@type": "ListItem", "position": 2, "name": p["short"], "item": url},
            ],
        },
        {
            "@context": "https://schema.org", "@type": "MedicalTherapy",
            "name": p["title"], "description": p["meta"], "url": url,
            "provider": {
                "@type": "MedicalClinic", "name": NAME, "url": DOMAIN + "/",
                "telephone": "+302621029798",
                "address": {"@type": "PostalAddress", "streetAddress": "Παπασταθοπούλου 8", "addressLocality": "Πύργος",
                            "addressRegion": "Ηλεία", "postalCode": "27100", "addressCountry": "GR"},
            },
        },
        {
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]],
        },
    ]
    return f"""<!DOCTYPE html>
<html lang="el">
<head>
  <!-- Παράγεται από το tools/build_services.py. Για αλλαγές επεξεργαστείτε το tools/services_content.py. -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(p['title'])} | Κέντρο Ειδικών Θεραπειών Κανδρή</title>
  <meta name="description" content="{e(p['meta'])}">
  <meta name="theme-color" content="#6e48aa">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="el_GR">
  <meta property="og:site_name" content="{e(NAME)}">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{e(p['title'])}">
  <meta property="og:description" content="{e(p['meta'])}">
  <meta property="og:image" content="{DOMAIN}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/accessibility.css">
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>
<body>
  <a class="skip-link" href="#main">Μετάβαση στο περιεχόμενο</a>
  <header id="header" class="site-header scrolled">
    <div class="container header-content">
      <a href="/" class="logo">
        <img src="/assets/logo-160.png" alt="" width="44" height="44">
        <span class="logo-text">Κέντρο <span class="logo-highlight">Ειδικών Θεραπειών</span></span>
      </a>
      <button class="mobile-menu-btn" id="mobile-btn" aria-controls="nav-list" aria-expanded="false" aria-label="Μενού">
        <span></span><span></span><span></span>
      </button>
      <nav aria-label="Κύριο μενού">
        <ul id="nav-list">
          <li><a href="/">Αρχική</a></li>
          <li><a href="/#about">Σχετικά</a></li>
          <li><a href="/#services" class="active">Υπηρεσίες</a></li>
          <li><a href="/#space">Ο χώρος μας</a></li>
          <li><a href="/#team">Ομάδα</a></li>
          <li><a href="/#faq">Ερωτήσεις</a></li>
          <li><a href="/#contact" class="nav-cta">Επικοινωνία</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="svc-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Διαδρομή"><a href="/">Αρχική</a> › <a href="/#services">Υπηρεσίες</a> › <span aria-current="page">{e(p['short'])}</span></nav>
        <div class="svc-hero-icon" aria-hidden="true">{p['icon']}</div>
        <h1>{e(p['title'])}</h1>
        <p class="svc-lead">{e(p['lead'])}</p>
        <p class="hero-badge">✔ Συνεργασία με ΕΟΠΥΥ</p>
        <div class="hero-actions">
          <a href="/#contact" class="btn">Κλείστε Ραντεβού</a>
          <a href="tel:+302621029798" class="btn btn-ghost">☎️ 26210 29798</a>
        </div>
      </div>
    </section>

    <div class="container svc-body">
      <section class="svc-section svc-intro">
{chr(10).join('        <p>' + e(x) + '</p>' for x in p['intro'])}
      </section>

      <section class="svc-section">
        <h2>Σε ποιους απευθύνεται</h2>
        <ul class="svc-check">
{lis(p['for_whom'], 10)}
        </ul>
      </section>

      <section class="svc-section">
        <h2>Τι περιλαμβάνει</h2>
        <div class="services-grid">
{includes}
        </div>
      </section>

      <section class="svc-section">
        <h2>Πώς ξεκινάμε</h2>
        <ol class="svc-steps">
          <li><strong>Επικοινωνία</strong><span>Μας καλείτε ή μας στέλνετε μήνυμα και κλείνουμε ραντεβού.</span></li>
          <li><strong>Αξιολόγηση</strong><span>Συζητάμε με τους γονείς και γνωρίζουμε το παιδί μέσα από δραστηριότητες και παιχνίδι.</span></li>
          <li><strong>Εξατομικευμένο πρόγραμμα</strong><span>Σας εξηγούμε τα ευρήματα και προτείνουμε πρόγραμμα με σαφείς στόχους.</span></li>
          <li><strong>Συνεργασία & ενημέρωση</strong><span>Παρακολουθούμε την πρόοδο και σας δίνουμε ιδέες για το σπίτι.</span></li>
        </ol>
      </section>
{photos}
      <section class="svc-section">
        <h2>Συχνές ερωτήσεις</h2>
        <div class="faq-list svc-faq">
{faq}
        </div>
      </section>

      <section class="svc-section svc-cta">
        <h2>Θέλετε να συζητήσουμε για το παιδί σας;</h2>
        <p>Παπασταθοπούλου 8, 27100 Πύργος Ηλείας · <a href="tel:+302621029798">26210 29798</a> · <a href="tel:+306971849025">6971 849 025</a></p>
        <a href="/#contact" class="btn">Στείλτε μας μήνυμα</a>
      </section>

      <section class="svc-section">
        <h2>Σχετικές υπηρεσίες</h2>
        <div class="svc-related">
{related}
          <a class="svc-related-card" href="/#services">Όλες οι υπηρεσίες →</a>
        </div>
      </section>
    </div>
  </main>

  <footer>
    <div class="container footer-content">
      <p><strong>{e(NAME)}</strong><br>Παπασταθοπούλου 8, 27100 Πύργος Ηλείας · <a href="tel:+302621029798">26210 29798</a> · <a href="tel:+306971849025">6971 849 025</a></p>
      <p>© <span id="year">{datetime.date.today().year}</span> Όλα τα δικαιώματα διατηρούνται.<br>
        <a href="/privacy.html">Πολιτική Απορρήτου</a>
        <button type="button" id="cookie-settings" class="link-btn">· Ρυθμίσεις cookies</button>
      </p>
    </div>
  </footer>

  <div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookies" hidden>
    <p>Χρησιμοποιούμε cookies του Google Analytics για να μετράμε ανώνυμα την επισκεψιμότητα, μόνο αν το αποδεχτείτε. <a href="/privacy.html">Περισσότερα</a></p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-small btn-outline" data-consent="reject">Απόρριψη</button>
      <button type="button" class="btn btn-small" data-consent="accept">Αποδοχή</button>
    </div>
  </div>

  <a href="tel:+306971849025" class="call-fab" aria-label="Κλήση: 6971 849 025">☎️</a>

  <div id="a11y-toolbar" role="region" aria-label="Εργαλειοθήκη Προσβασιμότητας">
    <button id="a11y-toggle" aria-controls="a11y-panel" aria-expanded="false" title="Ρυθμίσεις προσβασιμότητας" aria-label="Ρυθμίσεις προσβασιμότητας">♿</button>
    <div id="a11y-panel" hidden>
      <ul>
        <li><button type="button" data-a11y="font-up" title="Μεγέθυνση γραμματοσειράς">A+</button></li>
        <li><button type="button" data-a11y="font-down" title="Σμίκρυνση γραμματοσειράς">A-</button></li>
        <li><button type="button" data-a11y="gray-mode" title="Γκρι κλίμακα">⚫ Γκρι</button></li>
        <li><button type="button" data-a11y="high-contrast" title="Υψηλή αντίθεση">🌗 Αντίθεση</button></li>
        <li><button type="button" data-a11y="invert-mode" title="Αντιστροφή χρωμάτων">🔃 Αντιστροφή</button></li>
        <li><button type="button" data-a11y="underline-links" title="Υπογράμμιση συνδέσμων">_Σύνδεσμοι_</button></li>
        <li><button type="button" data-a11y="legible-mode" title="Ευαναγνωσία κειμένου">🔡 Ευαναγνωσία</button></li>
        <li><button type="button" data-a11y="reset" title="Επαναφορά ρυθμίσεων">↺ Επαναφορά</button></li>
      </ul>
    </div>
  </div>

  <script src="/js/config.js"></script>
  <script src="/js/page.js" defer></script>
  <script src="/js/consent.js" defer></script>
  <script src="/js/accessibility.js" defer></script>
</body>
</html>
"""

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for p in PAGES:
        d = os.path.join(root, p["slug"])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(page(p))
        print("wrote", p["slug"] + "/index.html")
    urls = [DOMAIN + "/"] + [f"{DOMAIN}/{p['slug']}/" for p in PAGES]
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += "".join(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{TODAY}</lastmod>\n  </url>\n" for u in urls)
    sm += "</urlset>\n"
    with open(os.path.join(root, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sm)
    print("wrote sitemap.xml with", len(urls), "URLs")

if __name__ == "__main__":
    main()
