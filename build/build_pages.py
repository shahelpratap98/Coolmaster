#!/usr/bin/env python3
import re, base64, os, urllib.parse

# WhatsApp click-to-chat link (021 024 54541 -> international 64 21 024 54541)
WHATSAPP = "https://wa.me/642102454541?text=" + urllib.parse.quote("Hi CoolMaster, I'd like to request a free quote.")

SRC = open('coolmaster_site.html', encoding='utf-8').read()

# ---------- extract shared CSS ----------
css = re.search(r'<style>(.*?)</style>', SRC, re.S).group(1)

# extra CSS for multi-page (page hero, breadcrumbs, active nav, CTA card)
css += """
/* ---- multi-page additions ---- */
.nav a.active{color:var(--deep)}
.nav a.active::after{width:100%}
.mobile-menu a.active{color:var(--frost)}
.page-hero{position:relative;overflow:hidden;background:var(--mist);padding:58px 0 50px;border-bottom:1px solid var(--line)}
.page-hero::before{content:"";position:absolute;inset:0;z-index:0;
  background:radial-gradient(52% 130% at 92% 0,rgba(22,155,215,.15),transparent 60%),
             radial-gradient(52% 130% at 4% 100%,rgba(244,122,32,.13),transparent 60%)}
.page-hero .wrap{position:relative;z-index:1}
.page-hero h1{font-size:clamp(2.1rem,4.6vw,3.25rem);font-weight:800;margin:14px 0 0}
.page-hero p{color:var(--ink-soft);font-size:1.13rem;max-width:56ch;margin-top:14px}
.crumbs{display:flex;gap:9px;align-items:center;font-family:var(--font-mono);font-size:.78rem;color:var(--ink-soft);margin-bottom:4px}
.crumbs a:hover{color:var(--frost)}
.crumbs .sep{opacity:.5}
.crumbs .here{color:var(--frost)}
.cta-wrap{padding:84px 0}
.cta-card{background:var(--deep);border-radius:28px;padding:54px;display:flex;flex-wrap:wrap;
  align-items:center;justify-content:space-between;gap:26px;position:relative;overflow:hidden;box-shadow:var(--shadow-lg)}
.cta-card::before{content:"";position:absolute;right:-60px;top:-70px;width:280px;height:280px;border-radius:50%;
  background:var(--warm-cool);opacity:.24;filter:blur(12px)}
.cta-card .cta-txt{position:relative;z-index:1}
.cta-card h2{color:#fff;font-size:clamp(1.7rem,3vw,2.35rem)}
.cta-card p{color:#C3CCE6;margin-top:10px;max-width:48ch}
.cta-card .cta-actions{position:relative;z-index:1;display:flex;gap:14px;flex-wrap:wrap}
.cta-card .btn-primary{background:var(--flame);color:#fff}
.cta-card .btn-ghost{color:#fff;border-color:rgba(255,255,255,.35)}
.cta-card .btn-ghost:hover{border-color:#fff;background:rgba(255,255,255,.08)}
@media(max-width:740px){.cta-wrap{padding:60px 0}.cta-card{padding:38px;flex-direction:column;align-items:flex-start}}
/* ---- about page ---- */
.about-story{max-width:70ch}
.about-story p{font-size:1.08rem;color:var(--ink-soft);margin-bottom:18px;line-height:1.75}
.about-story p strong{color:var(--ink)}
.values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.value-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;box-shadow:var(--shadow-sm)}
.value-card h3{font-size:1.14rem;margin-bottom:9px}
.value-card p{color:var(--ink-soft);font-size:.97rem}
.serve-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.serve-card{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--frost);border-radius:16px;padding:26px;box-shadow:var(--shadow-sm)}
.serve-card:nth-child(even){border-left-color:var(--ember)}
.serve-card h3{font-size:1.14rem;margin-bottom:8px}
.serve-card p{color:var(--ink-soft);font-size:.98rem}
@media(max-width:980px){.values-grid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.values-grid{grid-template-columns:1fr}.serve-grid{grid-template-columns:1fr}}
/* ---- services dropdown ---- */
.nav-drop{position:relative;display:inline-flex}
.nav-drop .drop-toggle{display:inline-flex;align-items:center;gap:5px}
.nav-drop .chev{width:14px;height:14px;transition:transform .18s ease}
.nav-drop:hover .chev,.nav-drop:focus-within .chev{transform:rotate(180deg)}
.nav-drop.active>.drop-toggle{color:var(--frost)}
.drop-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);min-width:300px;
  background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 44px rgba(21,34,79,.16);
  padding:10px;display:flex;flex-direction:column;opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .16s ease,transform .16s ease;z-index:80}
.nav-drop:hover .drop-menu,.nav-drop:focus-within .drop-menu{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.drop-menu a{display:block;padding:10px 14px;border-radius:9px;font-size:.95rem;font-weight:500;color:var(--ink);white-space:nowrap}
.drop-menu a:hover{background:var(--mist);color:var(--frost)}
.drop-menu .drop-all{font-weight:700;color:var(--frost);border-bottom:1px solid var(--line);border-radius:9px 9px 0 0;margin-bottom:6px}
.nav-drop::after{content:"";position:absolute;top:100%;left:0;right:0;height:10px}
.mobile-menu a.sub{padding-left:34px;font-size:.98rem;color:var(--ink-soft)}
/* ---- service detail pages ---- */
.svc-detail{max-width:72ch}
.svc-detail p{font-size:1.07rem;color:var(--ink-soft);line-height:1.75;margin-bottom:18px}
.svc-detail p strong{color:var(--ink)}
.svc-includes{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:34px;box-shadow:var(--shadow-sm)}
.svc-includes h3{font-size:1.2rem;margin-bottom:18px}
.svc-two{display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:start}
@media(max-width:860px){.svc-two{grid-template-columns:1fr}}
.svc-card h3 a{color:inherit;text-decoration:none}
.svc-card h3 a::after{content:" →";color:var(--frost);opacity:0;transition:opacity .15s ease}
.svc-card:hover h3 a::after{opacity:1}
.svc-card h3 a:hover{color:var(--frost)}
/* ---- page photo banners (Unsplash CDN) ---- */
.svc-photo{margin:0 0 44px;border-radius:22px;overflow:hidden;box-shadow:var(--shadow-md);background:var(--mist)}
.svc-photo img{width:100%;height:340px;object-fit:cover;display:block}
@media(max-width:640px){.svc-photo img{height:210px}.svc-photo{margin-bottom:30px;border-radius:16px}}
/* ---- floating WhatsApp button ---- */
.wa-fab{position:fixed;right:22px;bottom:22px;z-index:90;display:inline-flex;align-items:center;gap:10px;
  background:#25D366;color:#fff;padding:13px 20px 13px 14px;border-radius:999px;font-family:var(--font-body);
  font-weight:700;font-size:1rem;line-height:1;text-decoration:none;
  box-shadow:0 10px 26px rgba(37,211,102,.45);transition:transform .18s ease,box-shadow .18s ease}
.wa-fab:hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(37,211,102,.55)}
.wa-fab svg{width:28px;height:28px;flex:none}
.wa-fab-label{white-space:nowrap}
@media(max-width:600px){.wa-fab{right:16px;bottom:16px;padding:15px;border-radius:50%}.wa-fab svg{width:30px;height:30px}.wa-fab-label{display:none}}
"""

# ---------- extract body sections by comment markers ----------
def between(a, b):
    m = re.search(re.escape(a) + r'(.*?)' + re.escape(b), SRC, re.S)
    return m.group(1).strip()

H = lambda t: '<!-- ============================ ' + t + ' ============================ -->'
HERO    = between(H('HERO'),    H('TRUST STRIP'))
TRUST   = between(H('TRUST STRIP'), H('SERVICES'))
SERVICES= between(H('SERVICES'), H('DUALITY'))
DUALITY = between(H('DUALITY'),  H('WHY / STATS'))
WHY     = between(H('WHY / STATS'), H('PROCESS'))
PROCESS = between(H('PROCESS'),  H('FAQ'))
FAQ     = between(H('FAQ'),      H('CONTACT'))
CONTACT = between(H('CONTACT'),  H('FOOTER'))
CONTACT = CONTACT.replace('</main>', '').strip()

# bake dimensions into the hero icon so they persist regardless of how the src is filled
HERO = HERO.replace(
    '<img src="__ICON__" alt="CoolMaster sun and snowflake emblem representing heating and cooling">',
    '<img src="__ICON__" alt="CoolMaster sun and snowflake emblem representing heating and cooling" width="600" height="761" fetchpriority="high">')

# ---------- shared head ----------
LOCALBIZ = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "name": "CoolMaster Services Limited",
  "description": "Established in 2014, CoolMaster Services is an Auckland-based commercial HVAC, refrigeration and mechanical ventilation specialist — design, installation, servicing, breakdown repairs, and BWoF servicing with Form 12A support. Residential heat pumps and air conditioning also available.",
  "url": "https://www.coolmaster.co.nz/",
  "logo": "https://www.coolmaster.co.nz/coolmaster-wordmark.png",
  "image": "https://www.coolmaster.co.nz/coolmaster-share.jpg",
  "foundingDate": "2014",
  "telephone": "+64-21-024-54541",
  "email": "shivcoolmaster@gmail.com",
  "priceRange": "$$",
  "areaServed": { "@type": "Country", "name": "New Zealand" },
  "address": { "@type": "PostalAddress", "addressLocality": "Auckland", "addressRegion": "Auckland", "addressCountry": "NZ" },
  "contactPoint": {
    "@type": "ContactPoint",
    "name": "Shiv Sivan",
    "contactType": "customer service",
    "telephone": "+64-21-024-54541",
    "email": "shivcoolmaster@gmail.com",
    "areaServed": "NZ",
    "availableLanguage": "English"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "07:30", "closes": "17:00"
  }],
  "sameAs": ["https://www.facebook.com/", "https://www.instagram.com/"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "HVAC & Refrigeration Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial HVAC Design & Installation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Refrigeration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "BWoF & Form 12A Support" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Servicing & Preventative Maintenance" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mechanical Ventilation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Emergency Refrigeration Repairs" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Heat Pump Supply & Installation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Home Air Conditioning" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ducted Heating & Cooling" } }
    ]
  }
}
</script>"""
FAQSCHEMA = """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do you work with commercial buildings and businesses?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — established in 2014, CoolMaster Services works with commercial building owners, restaurants, property managers and businesses across Auckland. Commercial HVAC, refrigeration and ventilation are our main focus, and we look after residential heat pumps and air conditioning too." } },
    { "@type": "Question", "name": "Can you help with BWoF and Form 12A?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We help with BWoF-related HVAC, air conditioning, refrigeration and mechanical ventilation servicing — including inspection, maintenance, drain and performance checks, records and reporting, and Form 12A support where applicable — so your systems stay maintained, documented and ready for your Building Warrant of Fitness requirements." } },
    { "@type": "Question", "name": "Are you insured and GST registered?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We are a GST-registered New Zealand company with fully insured workmanship, and all work is carried out by qualified, refrigerant-certified technicians." } },
    { "@type": "Question", "name": "Do you offer maintenance contracts and free quotes?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We provide clear, no-obligation quotes for installations and larger jobs, plus planned preventative maintenance agreements to keep commercial systems maintained and reliable." } },
    { "@type": "Question", "name": "Do you provide emergency breakdown repairs?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer responsive breakdown callouts so your coolrooms, chillers, refrigeration and HVAC keep running when you need them most." } },
    { "@type": "Question", "name": "Do you install residential heat pumps too?",
      "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Alongside our commercial work we supply and install quiet, energy-efficient heat pumps and air conditioning for Auckland homes." } }
  ]
}
</script>"""

BASE = "https://www.coolmaster.co.nz/"

def head(title, desc, slug, extra_schema=""):
    canonical = BASE if slug == "" else BASE + slug
    return f"""<!DOCTYPE html>
<html lang="en-NZ">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; object-src 'none'; base-uri 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="CoolMaster Services Limited">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#15224F">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CoolMaster Services Limited">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="en_NZ">
<meta property="og:image" content="{BASE}coolmaster-share.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{BASE}coolmaster-share.jpg">
<link rel="icon" type="image/png" href="__FAVICON__">
<link rel="apple-touch-icon" href="__FAVICON__">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
{LOCALBIZ}
{extra_schema}
<style>{css}</style>
</head>
<body>
"""

# ---------- shared header ----------
PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'

# slug -> menu label (order = menu order, commercial first)
SERVICE_MENU = [
    ("commercial-hvac.html",          "Commercial HVAC Design &amp; Install"),
    ("commercial-refrigeration.html", "Commercial Refrigeration"),
    ("bwof-form-12a.html",            "BWoF &amp; Form 12A Support"),
    ("servicing-maintenance.html",    "Servicing &amp; Maintenance"),
    ("mechanical-ventilation.html",   "Mechanical Ventilation"),
    ("emergency-repairs.html",        "Emergency Refrigeration Repairs"),
    ("heat-pumps.html",               "Heat Pump Supply &amp; Installation"),
    ("air-conditioning.html",         "Home Air Conditioning"),
    ("ducted-systems.html",           "Ducted Heating &amp; Cooling"),
]
SERVICE_SLUGS = {slug for slug, _ in SERVICE_MENU}

# link each services-grid card title to its dedicated page (count=1 so the BWoF panel h3 keeps its own link separate)
CARD_LINKS = [
    ('Commercial HVAC Design &amp; Install',      'commercial-hvac.html'),
    ('Commercial Refrigeration',                  'commercial-refrigeration.html'),
    ('BWoF &amp; Form 12A Support',               'bwof-form-12a.html'),
    ('Servicing &amp; Preventative Maintenance',  'servicing-maintenance.html'),
    ('Mechanical Ventilation',                    'mechanical-ventilation.html'),
    ('Emergency Refrigeration Repairs',           'emergency-repairs.html'),
    ('Heat Pump Supply &amp; Installation',       'heat-pumps.html'),
    ('Home Air Conditioning',                     'air-conditioning.html'),
    ('Ducted Heating &amp; Cooling',              'ducted-systems.html'),
]
for _t, _s in CARD_LINKS:
    SERVICES = SERVICES.replace(f'<h3>{_t}</h3>', f'<h3><a href="{_s}">{_t}</a></h3>', 1)

def header(active):
    def cls(key):
        return ' class="active" aria-current="page"' if key == active else ''
    drop_active = ' active' if active == 'services' else ''
    drop_items = '\n'.join(f'        <a href="{slug}">{label}</a>' for slug, label in SERVICE_MENU)
    mobile_items = '\n'.join(f'  <a href="{slug}" class="sub">{label}</a>' for slug, label in SERVICE_MENU)
    return f"""<header class="site-header" id="top">
  <div class="wrap header-inner">
    <a href="index.html" class="brand" aria-label="CoolMaster Services home">
      <img src="__WORDMARK__" alt="CoolMaster Services Limited — Refrigeration, Air Conditioning &amp; HVAC" width="680" height="173" fetchpriority="high">
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="index.html"{cls('home')}>Home</a>
      <a href="about.html"{cls('about')}>About</a>
      <div class="nav-drop{drop_active}">
        <a href="services.html" class="drop-toggle"{' aria-current="page"' if active=='services' else ''}>Services <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg></a>
        <div class="drop-menu" role="menu" aria-label="Services">
        <a href="services.html" class="drop-all">All services</a>
{drop_items}
        </div>
      </div>
      <a href="faq.html"{cls('faq')}>FAQ</a>
      <a href="contact.html"{cls('contact')}>Contact</a>
    </nav>
    <div class="header-cta">
      <a href="tel:+64800000000" class="header-phone">{PHONE_SVG} 0800 000 000</a>
      <a href="__WA__" class="btn btn-primary" target="_blank" rel="noopener">Request a Free Quote</a>
    </div>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu">
  <a href="index.html"{cls('home')}>Home</a>
  <a href="about.html"{cls('about')}>About</a>
  <a href="services.html"{cls('services')}>Services</a>
{mobile_items}
  <a href="faq.html"{cls('faq')}>FAQ</a>
  <a href="contact.html"{cls('contact')}>Contact</a>
  <a href="tel:+64800000000">Call 0800 000 000</a>
  <a href="__WA__" class="btn btn-primary" target="_blank" rel="noopener">Request a Free Quote</a>
</div>
<main>
"""

# ---------- shared footer + script ----------
FOOTER = """</main>
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="__WORDMARK__" alt="CoolMaster Services Limited" width="680" height="173" loading="lazy">
        <p>Refrigeration, air conditioning &amp; HVAC specialists keeping New Zealand homes and businesses at the perfect temperature.</p>
      </div>
      <div>
        <h5>Services</h5>
        <ul>
          <li><a href="commercial-hvac.html">Commercial HVAC</a></li>
          <li><a href="commercial-refrigeration.html">Commercial refrigeration</a></li>
          <li><a href="bwof-form-12a.html">BWoF &amp; Form 12A support</a></li>
          <li><a href="heat-pumps.html">Heat pumps</a></li>
          <li><a href="servicing-maintenance.html">Servicing &amp; maintenance</a></li>
          <li><a href="services.html">All services</a></li>
        </ul>
      </div>
      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About us</a></li>
          <li><a href="services.html#audiences">Residential &amp; commercial</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h5>Contact</h5>
        <ul>
          <li>Shiv Sivan</li>
          <li><a href="tel:+64800000000">0800 000 000</a></li>
          <li><a href="mailto:info@coolmaster.co.nz">info@coolmaster.co.nz</a></li>
          <li>[Your service area], NZ</li>
          <li>Mon–Fri 7:30am–5pm</li>
        </ul>
      </div>
    </div>
      <div class="footer-brands">
        <h5>Heat pump &amp; air conditioning brands we install</h5>
        <ul class="brand-list">
          <li>Mitsubishi Electric</li>
          <li>Daikin</li>
          <li>Fujitsu</li>
          <li>Panasonic</li>
          <li>Toshiba</li>
          <li>Mitsubishi Heavy Industries</li>
          <li>LG</li>
          <li>Samsung</li>
        </ul>
      </div>
    <div class="footer-bottom">
      <div>© <span id="year"></span> CoolMaster Services Limited · GST registered</div>
      <div class="socials">
        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg></a>
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
      </div>
    </div>
  </div>
</footer>
<a class="wa-fab" href="__WA__" target="_blank" rel="noopener" aria-label="Chat with CoolMaster on WhatsApp">
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.71 6.402L3.2 28.8l6.56-1.72a12.74 12.74 0 006.24 1.62h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.052A12.72 12.72 0 0016.001 3.2zm0 23.36h-.004a10.56 10.56 0 01-5.384-1.474l-.386-.23-3.893 1.021 1.04-3.797-.252-.39a10.53 10.53 0 01-1.614-5.62c0-5.87 4.777-10.646 10.65-10.646 2.844 0 5.517 1.108 7.527 3.12a10.58 10.58 0 013.117 7.533c0 5.87-4.777 10.647-10.647 10.647zm5.84-7.976c-.32-.16-1.894-.934-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.575-1.588-.952-.849-1.594-1.897-1.78-2.217-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.735-.986-2.375-.26-.624-.524-.539-.72-.549l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.669 0 1.574 1.146 3.095 1.306 3.308.16.213 2.256 3.445 5.466 4.83.764.33 1.36.527 1.825.674.767.244 1.464.21 2.016.127.615-.092 1.894-.774 2.16-1.522.267-.747.267-1.388.187-1.521-.08-.134-.293-.214-.613-.374z"/></svg>
  <span class="wa-fab-label">Chat with us</span>
</a>
<script>
document.getElementById('year').textContent = new Date().getFullYear();
var header = document.querySelector('.site-header');
window.addEventListener('scroll', function(){ header.classList.toggle('scrolled', window.scrollY > 8); }, {passive:true});
var burger = document.getElementById('burger');
var menu = document.getElementById('mobileMenu');
function closeMenu(){ menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Open menu'); document.body.style.overflow=''; }
burger.addEventListener('click', function(){
  var open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true':'false');
  burger.setAttribute('aria-label', open ? 'Close menu':'Open menu');
  document.body.style.overflow = open ? 'hidden':'';
});
menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
var reveals = document.querySelectorAll('.reveal');
function revealAll(){ reveals.forEach(function(el){ el.classList.add('in'); }); }
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  reveals.forEach(function(el){ io.observe(el); });
  setTimeout(revealAll, 2500);
} else { revealAll(); }
var qs = document.getElementById('quoteSubmit');
if(qs){
  qs.addEventListener('click', function(){
    var v = function(id){ return (document.getElementById(id).value || '').trim(); };
    var name = v('f-name'), phone = v('f-phone'), email = v('f-email'), type = v('f-type'), msg = v('f-msg');
    if(!name || (!phone && !email)){ alert('Please add your name and a phone or email so we can reply.'); return; }
    var subject = 'Quote request: ' + type + ' — ' + name;
    var body = 'Name: '+name+'\\nPhone: '+phone+'\\nEmail: '+email+'\\nService: '+type+'\\n\\nDetails:\\n'+msg+'\\n';
    window.location.href = 'mailto:info@coolmaster.co.nz?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
}
</script>
</body>
</html>"""

# ---------- reusable blocks ----------
def page_hero(crumb, eyebrow, title, sub):
    return f"""<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs reveal" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><span class="here">{crumb}</span></nav>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    <p>{sub}</p>
  </div>
</section>
"""

CTA = """<section class="cta-wrap"><div class="wrap"><div class="cta-card reveal">
  <div class="cta-txt">
    <h2>Ready for the perfect temperature?</h2>
    <p>Get honest advice and a free, no-obligation quote for your home or business.</p>
  </div>
  <div class="cta-actions">
    <a href="__WA__" class="btn btn-primary" target="_blank" rel="noopener">Request a Free Quote</a>
    <a href="tel:+64800000000" class="btn btn-ghost">Call 0800 000 000</a>
  </div>
</div></div></section>
"""

def crumb_schema(crumb, slug):
    return f"""<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{{"@type":"ListItem","position":1,"name":"Home","item":"{BASE}"}},
{{"@type":"ListItem","position":2,"name":"{crumb}","item":"{BASE}{slug}"}}]}}
</script>"""

# services page wants its process section on white (sits after tinted duality)
PROCESS_WHITE = PROCESS.replace('class="section tint" id="process"', 'class="section" id="process"')

# inner pages already have a page-hero, so strip the duplicate section headings
SERVICES_INNER = re.sub(r'<div class="section-head reveal">.*?</div>\s*', '', SERVICES, count=1, flags=re.S)
FAQ_INNER = re.sub(r'<div class="section-head reveal"[^>]*>.*?</div>\s*', '', FAQ, count=1, flags=re.S)
CONTACT_INNER = CONTACT
CONTACT_INNER = CONTACT_INNER.replace('<span class="eyebrow on-dark">Get in touch</span>\n      ', '')
CONTACT_INNER = CONTACT_INNER.replace('<h2>Ready for the perfect temperature?</h2>', '<h2>Reach us directly</h2>')
CONTACT_INNER = re.sub(r'<p>Tell us about your home or business[^<]*</p>\s*', '', CONTACT_INNER, count=1)
# add the contact person row after the email row
_email_row_end = '<a class="v" href="mailto:info@coolmaster.co.nz">info@coolmaster.co.nz</a></div>\n        </div>'
_person_row = _email_row_end + """
        <div class="contact-row">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          <div><div class="t">Contact</div><div class="v">Shiv Sivan</div></div>
        </div>"""
assert _email_row_end in CONTACT_INNER, 'email row anchor not found'
CONTACT_INNER = CONTACT_INNER.replace(_email_row_end, _person_row, 1)

# ---------- assemble pages ----------
pages = {}

# HOME
pages['index.html'] = (
    head("Commercial HVAC, Refrigeration &amp; Heat Pump Specialists Auckland | CoolMaster",
         "Commercial HVAC, refrigeration and heat pump specialists in Auckland — expert installation, repairs, maintenance, BWoF servicing and Form 12A support. Next-day installation available, zero surprise pricing, Auckland since 2014. Request a free quote.",
         "")
    + header('home') + HERO + TRUST + SERVICES + DUALITY + WHY + PROCESS + CTA + FOOTER
)

# SERVICES
pages['services.html'] = (
    head("Commercial HVAC, Refrigeration &amp; BWoF Form 12A Support | CoolMaster",
         "CoolMaster's Auckland commercial HVAC, refrigeration, ventilation, maintenance, breakdown repairs and BWoF servicing with Form 12A support — plus residential heat pumps and air conditioning. Established 2014.",
         "services.html", crumb_schema("Services", "services.html"))
    + header('services')
    + page_hero("Services", "What we do",
                "Commercial HVAC, refrigeration &amp; BWoF support",
                "Design, installation, maintenance, breakdown repairs and BWoF servicing with Form 12A support for Auckland businesses — plus quality heat pumps and air conditioning for the home.")
    + SERVICES_INNER + DUALITY + PROCESS_WHITE + CTA + FOOTER
)

# FAQ
pages['faq.html'] = (
    head("FAQ — Commercial HVAC, Refrigeration &amp; BWoF Form 12A | CoolMaster",
         "Answers about CoolMaster's Auckland commercial HVAC, refrigeration, ventilation, BWoF servicing and Form 12A support, maintenance contracts and breakdown repairs — plus residential heat pumps. Established 2014.",
         "faq.html", FAQSCHEMA + "\n" + crumb_schema("FAQ", "faq.html"))
    + header('faq')
    + page_hero("FAQ", "Good to know",
                "Frequently asked questions",
                "Everything you might want to know about working with CoolMaster — and if your question isn't here, just ask.")
    + FAQ_INNER + CTA + FOOTER
)

# CONTACT
pages['contact.html'] = (
    head("Contact CoolMaster Services | Auckland HVAC, Refrigeration &amp; BWoF",
         "Get in touch with CoolMaster Services for a free, no-obligation quote on commercial HVAC, refrigeration, ventilation and BWoF Form 12A support — or residential heat pumps. Auckland-based, established 2014.",
         "contact.html", crumb_schema("Contact", "contact.html"))
    + header('contact')
    + page_hero("Contact", "Get in touch",
                "Let's talk about your space",
                "Tell us what you need heated, cooled or chilled and we'll come back with honest advice and a free quote.")
    + CONTACT_INNER + FOOTER
)

# About page — company story, values, who we serve
ABOUT_STORY = """<section class="section">
  <div class="wrap">
    <figure class="svc-photo reveal"><img src="banner-about.jpg" alt="Heat pump unit installed outside an Auckland building" loading="lazy" width="1200" height="340" onerror="this.closest('figure').style.display='none'"></figure>
    <div class="section-head reveal">
      <span class="eyebrow">Our story</span>
      <h2>Keeping Auckland at the perfect temperature since 2014</h2>
    </div>
    <div class="about-story reveal">
      <p>CoolMaster Services Limited was established in 2014 by <strong>Shiv Sivan</strong> with a simple idea: give Auckland homes and businesses one reliable team for heating, cooling and refrigeration — and treat every job like it matters, because it does.</p>
      <p>More than a decade on, that's still how we work. Our core focus is <strong>commercial HVAC, refrigeration and mechanical ventilation</strong> — designing, installing and maintaining the systems that restaurants, offices, retail stores and industrial sites depend on every day. We help commercial building owners and property managers keep their systems serviced, documented and ready for their Building Warrant of Fitness requirements, including Form 12A support where applicable.</p>
      <p>And because comfort matters at home too, the same certified crew installs and services heat pumps and air conditioning for households across Auckland — quiet, energy-efficient systems sized for the way you live.</p>
      <p>We're a GST-registered, NZ-owned company with fully insured workmanship. No jargon, no surprises — just clear quotes, honest advice and systems that work.</p>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">How we work</span>
      <h2>What you can expect from us</h2>
    </div>
    <div class="values-grid">
      <div class="value-card reveal">
        <h3>Honest advice first</h3>
        <p>We recommend what your space actually needs — not the most expensive option. If a repair beats a replacement, we'll tell you.</p>
      </div>
      <div class="value-card reveal">
        <h3>Clear, written quotes</h3>
        <p>You'll always know the price before we start. Free, no-obligation quotes on installations and larger jobs.</p>
      </div>
      <div class="value-card reveal">
        <h3>Work we stand behind</h3>
        <p>Qualified, refrigerant-certified technicians and fully insured workmanship on every job, big or small.</p>
      </div>
      <div class="value-card reveal">
        <h3>There when it counts</h3>
        <p>Responsive servicing and breakdown callouts — because a failed coolroom or a freezing office can't wait until next week.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Who we serve</span>
      <h2>From commercial kitchens to family living rooms</h2>
    </div>
    <div class="serve-grid">
      <div class="serve-card reveal">
        <h3>Commercial building owners &amp; property managers</h3>
        <p>BWoF-related servicing, maintenance records, reporting and Form 12A support for air conditioning and mechanical ventilation systems.</p>
      </div>
      <div class="serve-card reveal">
        <h3>Restaurants &amp; hospitality</h3>
        <p>Commercial refrigeration, coolrooms, extract fans and kitchen ventilation that keep stock safe and kitchens legal.</p>
      </div>
      <div class="serve-card reveal">
        <h3>Offices, retail &amp; industrial</h3>
        <p>HVAC design, installation and preventative maintenance for comfortable staff, happy customers and predictable running costs.</p>
      </div>
      <div class="serve-card reveal">
        <h3>Auckland homeowners</h3>
        <p>Heat pumps, air conditioning and ducted systems for warm, dry, healthy homes — installed right and serviced fast.</p>
      </div>
    </div>
  </div>
</section>
"""

pages['about.html'] = (
    head("About Us | CoolMaster Services — Auckland HVAC &amp; Refrigeration Since 2014",
         "Established in 2014 by Shiv Sivan, CoolMaster Services is an Auckland-based, GST-registered HVAC and refrigeration company — commercial specialists with BWoF Form 12A support, trusted by homes and businesses for over a decade.",
         "about.html", crumb_schema("About us", "about.html"))
    + header('about')
    + page_hero("About us", "Established 2014",
                "The team behind the temperature",
                "Auckland-based HVAC &amp; refrigeration specialists — founded by Shiv Sivan, trusted by homes and businesses for over a decade.")
    + ABOUT_STORY
    + WHY
    + CTA + FOOTER
)

# ---------- individual service pages ----------
# Page banner photos are self-hosted in the site folder (originally sourced from
# Unsplash under the Unsplash License — free for commercial use, no attribution
# required). Self-hosting avoids hotlink breakage and third-party requests.
SERVICE_PHOTOS = {
    'commercial-hvac.html':          ('banner-commercial-hvac.jpg',
                                      'Ceiling cassette air conditioning unit and ductwork in a commercial office fit-out'),
    'commercial-refrigeration.html': ('banner-commercial-refrigeration.jpg',
                                      'Glass-door commercial display fridges stocked with chilled food and drinks'),
    'bwof-form-12a.html':            ('banner-bwof-form-12a.jpg',
                                      'Building inspector in hi-vis vest reviewing floor plans on a clipboard'),
    'servicing-maintenance.html':    ('banner-servicing-maintenance.jpg',
                                      'HVAC service tools laid out for a maintenance visit'),
    'mechanical-ventilation.html':   ('banner-mechanical-ventilation.jpg',
                                      'Spiral mechanical ventilation ducting in a commercial ceiling'),
    'emergency-repairs.html':        ('banner-emergency-repairs.jpg',
                                      'Large commercial HVAC fan unit'),
    'heat-pumps.html':               ('banner-heat-pumps.jpg',
                                      'Energy-efficient heat pump outdoor unit installed in a landscaped garden'),
    'air-conditioning.html':         ('banner-air-conditioning.jpg',
                                      'Wall-mounted air conditioning unit in a sunlit modern living room'),
    'ducted-systems.html':           ('banner-ducted-systems.jpg',
                                      'Ceiling vent diffuser of a ducted heating and cooling system'),
}

def service_schema(name, desc, slug):
    return f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{name}",
  "serviceType": "{name}",
  "description": "{desc}",
  "url": "https://www.coolmaster.co.nz/{slug}",
  "areaServed": {{ "@type": "City", "name": "Auckland" }},
  "provider": {{ "@type": "HVACBusiness", "name": "CoolMaster Services Limited", "telephone": "+64-21-024-54541", "url": "https://www.coolmaster.co.nz/" }}
}}
</script>"""

def service_page(slug, name_html, name_plain, meta_title, meta_desc, hero_sub, paras, includes, includes_title="What's included"):
    para_html = '\n      '.join(f'<p>{p}</p>' for p in paras)
    inc_html = '\n          '.join(
        f'<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg> {i}</li>'
        for i in includes)
    photo = SERVICE_PHOTOS.get(slug)
    photo_html = (f'<figure class="svc-photo reveal"><img src="{photo[0]}" alt="{photo[1]}" loading="lazy" width="1200" height="340" onerror="this.closest(\'figure\').style.display=\'none\'"></figure>\n    '
                  if photo else '')
    body = f"""<section class="section">
  <div class="wrap">
    {photo_html}<div class="svc-two">
      <div class="svc-detail reveal">
      {para_html}
      </div>
      <div class="svc-includes reveal">
        <h3>{includes_title}</h3>
        <ul class="trust-list" style="grid-template-columns:1fr">
          {inc_html}
        </ul>
      </div>
    </div>
  </div>
</section>
"""
    return (
        head(meta_title, meta_desc, slug,
             service_schema(name_plain, meta_desc, slug) + "\n" + crumb_schema(name_plain, slug))
        + header('services')
        + page_hero(name_plain, "Our services", name_html, hero_sub)
        + body + CTA + FOOTER
    )

pages['commercial-hvac.html'] = service_page(
    'commercial-hvac.html',
    'Commercial HVAC design &amp; installation', 'Commercial HVAC Design & Install',
    "Commercial HVAC Design &amp; Installation Auckland | CoolMaster Services",
    "Commercial HVAC design, supply, installation and commissioning for Auckland offices, hospitality, retail and industrial sites. Established 2014, GST registered, fully insured. Free quotes.",
    "Full project delivery for offices, hospitality, retail and industrial sites — designed right, installed once, running for years.",
    ["Every building moves heat differently. We design commercial HVAC systems around your space, occupancy and running-cost targets — then supply, install and commission them with minimal disruption to your business.",
     "From fit-outs and upgrades to new installations, CoolMaster has delivered commercial heating, cooling and ventilation across Auckland since 2014. We work with owners, project managers and trades to hit deadlines and hand over systems that are documented and ready for ongoing maintenance.",
     "Because we also service and maintain what we install, we design for reliability and easy upkeep — not just day-one performance."],
    ["System design &amp; heat-load assessment", "Supply of trusted commercial brands", "Installation &amp; commissioning", "Fit-outs, upgrades &amp; replacements", "Ongoing preventative maintenance plans", "Documentation &amp; maintenance records"])

pages['commercial-refrigeration.html'] = service_page(
    'commercial-refrigeration.html',
    'Commercial refrigeration', 'Commercial Refrigeration',
    "Commercial Refrigeration Auckland — Coolrooms, Chillers &amp; Freezers | CoolMaster",
    "Commercial refrigeration for Auckland restaurants, cafes, dairies and food businesses — coolrooms, freezers, chillers and display cabinets designed, installed and maintained. Breakdown response available.",
    "Coolrooms, freezers, chillers and display cabinets that keep your stock safe, your kitchen legal and your margins intact.",
    ["When refrigeration fails, you lose stock, trading hours and customer trust. CoolMaster designs, installs and maintains commercial refrigeration that's built to run around the clock — and we're there fast when something goes wrong.",
     "We work with restaurants, cafes, takeaways, dairies, supermarkets and food producers across Auckland: sizing coolrooms and freezers for your volume, fitting display cabinets that sell, and keeping everything at safe, compliant temperatures.",
     "Planned maintenance — condenser cleans, gas checks, door seals, temperature verification — catches small problems before they become spoiled-stock emergencies."],
    ["Coolroom &amp; freezer room design and install", "Chillers, under-bench &amp; display cabinets", "Temperature &amp; food-safety compliance checks", "Planned preventative maintenance", "Repairs &amp; breakdown response", "Maintenance records for your documentation"])

pages['bwof-form-12a.html'] = service_page(
    'bwof-form-12a.html',
    'BWoF &amp; Form 12A support', 'BWoF & Form 12A Support',
    "BWoF &amp; Form 12A Support Auckland — HVAC &amp; Ventilation Servicing | CoolMaster",
    "BWoF-related HVAC, air conditioning, refrigeration and mechanical ventilation servicing in Auckland — inspection, maintenance, reporting and Form 12A support for commercial building owners and property managers.",
    "Keeping your specified systems maintained, documented and ready for your Building Warrant of Fitness requirements.",
    ["If you own or manage a commercial building, your Building Warrant of Fitness depends on specified systems being maintained and documented all year — not just remembered the week the anniversary comes around.",
     "CoolMaster Services helps with BWoF-related HVAC, air conditioning, refrigeration and mechanical ventilation servicing. We assist commercial building owners, restaurants, property managers and businesses with inspection, maintenance, reporting and Form 12A support for relevant systems.",
     "We keep the servicing on schedule and the paperwork in order, so your systems stay maintained, documented and ready when your BWoF requirements come due."],
    ["Air conditioning system maintenance", "Mechanical ventilation checks", "Extract fan servicing &amp; repairs", "Commercial refrigeration maintenance", "Drain checks &amp; system performance checks", "Maintenance records &amp; reporting support", "Form 12A support where applicable"],
    "Our BWoF support includes")

pages['servicing-maintenance.html'] = service_page(
    'servicing-maintenance.html',
    'Servicing &amp; preventative maintenance', 'Servicing & Preventative Maintenance',
    "HVAC Servicing &amp; Preventative Maintenance Auckland | CoolMaster Services",
    "Planned HVAC, air conditioning and refrigeration maintenance in Auckland — filter cleans, gas checks, performance checks and reporting that keep systems efficient, reliable and documented. Maintenance contracts available.",
    "Planned maintenance that extends system life, keeps running costs down and stops small faults becoming big failures.",
    ["Heating, cooling and refrigeration plant is like any hard-working machine: look after it and it lasts; ignore it and it fails on the hottest week of the year.",
     "Our maintenance visits cover filter cleans, gas and pressure checks, drain checks, electrical inspection and performance verification — with a written record of what was done and what's coming up. For commercial clients we build a schedule around your systems and compliance needs, so nothing gets missed.",
     "Regular servicing typically pays for itself in energy savings alone: clean, well-tuned systems draw noticeably less power and hold their capacity for years longer."],
    ["Scheduled maintenance contracts", "Filter cleans &amp; coil cleaning", "Refrigerant gas &amp; pressure checks", "Drain &amp; condensate checks", "Performance &amp; efficiency verification", "Written service records &amp; reporting"])

pages['mechanical-ventilation.html'] = service_page(
    'mechanical-ventilation.html',
    'Mechanical ventilation', 'Mechanical Ventilation',
    "Mechanical Ventilation Auckland — Fresh Air &amp; Extract Systems | CoolMaster",
    "Mechanical ventilation for Auckland commercial buildings — fresh-air systems, extraction, kitchen extract fans and ductwork, installed and serviced for healthy, code-compliant indoor environments.",
    "Fresh-air and extraction systems for healthy, code-compliant indoor environments in commercial buildings.",
    ["Good ventilation is invisible when it works — and impossible to ignore when it doesn't. Stale air, condensation, lingering kitchen smells and stuffy meeting rooms all point to ventilation that isn't keeping up.",
     "CoolMaster installs and services mechanical ventilation for Auckland commercial buildings: fresh-air supply systems, extract fans, kitchen extraction and the ductwork that ties it together. We design for the airflow your space actually needs, then maintain it so it keeps performing.",
     "For buildings with ventilation in their compliance schedule, we fold servicing into your BWoF maintenance plan with records and reporting included."],
    ["Fresh-air supply systems", "Extract fans &amp; kitchen extraction", "Ductwork installation &amp; repairs", "Airflow checks &amp; balancing", "Servicing &amp; filter maintenance", "BWoF-related ventilation checks"])

pages['emergency-repairs.html'] = service_page(
    'emergency-repairs.html',
    'Emergency refrigeration repairs', 'Emergency Refrigeration Repairs',
    "Emergency Refrigeration &amp; HVAC Repairs Auckland | CoolMaster Services",
    "Rapid breakdown response for coolrooms, chillers, freezers and commercial HVAC across Auckland. Fast diagnosis and repair to protect your stock and keep your business trading.",
    "Rapid breakdown response for coolrooms, chillers and HVAC — because downtime puts your stock, compliance and customers at risk.",
    ["A failed coolroom at 6pm on a Friday isn't an inconvenience — it's thousands of dollars of stock on a countdown. When refrigeration or critical HVAC goes down, speed is everything.",
     "Call us and we'll get a technician moving: fast diagnosis, honest advice on repair versus replacement, and everything we can do on the spot to protect your stock and get you trading again.",
     "If a full fix needs parts, we'll stabilise what we can, keep you informed, and return with the repair scheduled around your hours — then help you set up preventative maintenance so it's far less likely to happen again."],
    ["Coolroom, chiller &amp; freezer breakdowns", "Commercial HVAC failures", "Fast on-site diagnosis", "Honest repair-vs-replace advice", "Stock-protection priority response", "Follow-up preventative maintenance"])

pages['heat-pumps.html'] = service_page(
    'heat-pumps.html',
    'Heat pump supply &amp; installation', 'Heat Pump Supply & Installation',
    "Heat Pump Installation Auckland — Supply &amp; Install | CoolMaster Services",
    "Heat pump supply and installation for Auckland homes — quiet, energy-efficient high-wall and floor-console units, properly sized and professionally installed. Free quotes since 2014.",
    "Quiet, energy-efficient heat pumps sized and installed to keep your home warm in winter and cool in summer.",
    ["A heat pump is only as good as its sizing and installation. Undersized, it runs flat-out and struggles; oversized, it cycles and wastes power; installed badly, it's noisy and short-lived.",
     "We start with your actual rooms — size, sun, insulation, how you live in them — then recommend the right unit from trusted, energy-efficient brands and install it cleanly: tidy pipework, correct refrigerant charge, and a proper walkthrough of how to get the best from it.",
     "One system or a whole home, you'll get a clear written quote first, workmanship that's fully insured, and a team that's been installing across Auckland since 2014."],
    ["Free in-home assessment &amp; written quote", "High-wall &amp; floor-console units", "Trusted, energy-efficient brands", "Professional installation &amp; commissioning", "Tidy pipework &amp; correct refrigerant charge", "Servicing &amp; filter-clean plans"])

pages['air-conditioning.html'] = service_page(
    'air-conditioning.html',
    'Home air conditioning', 'Home Air Conditioning',
    "Home Air Conditioning Auckland — Install &amp; Service | CoolMaster Services",
    "Home air conditioning for Auckland — from single rooms to multi-zone systems, installed and serviced for reliable cooling and heating all year round. Free quotes.",
    "Reliable cooling and heating for the home — from single rooms to multi-zone systems that hold every space at the right temperature.",
    ["Auckland summers are getting warmer and stickier — and a well-chosen air conditioning system turns the worst of it into a non-event.",
     "We install and service home air conditioning from single-room units through to multi-zone systems that keep the whole house comfortable: bedrooms cool for sleeping, living areas fresh for the family, all controlled simply.",
     "Every install starts with a free assessment and a clear written quote. And because the same team handles servicing, your system keeps performing summer after summer."],
    ["Single-room &amp; multi-zone systems", "Free assessment &amp; written quote", "Energy-efficient heating + cooling units", "Professional installation", "Servicing, repairs &amp; re-gassing", "Filter cleans for healthy air"])

pages['ducted-systems.html'] = service_page(
    'ducted-systems.html',
    'Ducted heating &amp; cooling', 'Ducted Heating & Cooling',
    "Ducted Heating &amp; Cooling Auckland — Whole-Home Systems | CoolMaster",
    "Ducted heating and cooling for Auckland homes and businesses — discreet whole-home systems that deliver clean, even air through ceiling vents, with zone control room by room.",
    "Discreet whole-home systems that distribute clean, even air through the house — without the wall units.",
    ["Ducted systems are the quiet achievers of home comfort: one hidden unit, ceiling vents in every room, and even temperatures through the whole house — no wall units in sight.",
     "We design ducted heating and cooling around your floor plan, with zone control so bedrooms and living areas can run at different temperatures (or switch off entirely) to keep running costs sensible.",
     "Ideal for new builds, renovations and larger homes — and for businesses wanting whole-floor comfort with a clean look. We handle design, installation, commissioning and ongoing servicing."],
    ["Whole-home &amp; whole-floor design", "Discreet ceiling-vent delivery", "Room-by-room zone control", "New builds &amp; renovations", "Installation &amp; commissioning", "Ongoing servicing &amp; filter care"])

# 404 (GitHub Pages serves this automatically for unknown URLs)
NOTFOUND = """<section class="page-hero" style="text-align:center">
  <div class="wrap">
    <span class="eyebrow" style="justify-content:center">Error 404</span>
    <h1>This page took a cool-down break</h1>
    <p style="margin:0 auto">The page you're looking for doesn't exist or may have moved. Let's get you back to somewhere comfortable.</p>
    <div class="hero-actions" style="justify-content:center">
      <a href="index.html" class="btn btn-primary">Back to home</a>
      <a href="services.html" class="btn btn-ghost">View services</a>
    </div>
  </div>
</section>
"""
pages['404.html'] = (
    head("Page not found | CoolMaster Services",
         "Sorry, we couldn't find that page. Head back to CoolMaster Services for Auckland commercial HVAC, refrigeration and BWoF Form 12A support.",
         "404.html").replace('index, follow, max-image-preview:large', 'noindex, follow')
    + header('') + NOTFOUND + CTA + FOOTER
)

# ---------- rewrite in-page anchors to page links ----------
def rewrite_links(html, fname):
    repl = [
        ('href="#audiences"', 'href="services.html#audiences"'),
        ('href="#why"',       'href="index.html#why"'),
        ('href="#process"',   'href="services.html#process"'),
        ('href="#services"',  'href="services.html"'),
        ('href="#faq"',       'href="faq.html"'),
        ('href="#contact"',   'href="contact.html"'),
        ('href="#top"',       'href="index.html"'),
    ]
    for a, b in repl:
        html = html.replace(a, b)
    # convert links that point to the current page back into in-page anchors
    html = html.replace(f'href="{fname}#', 'href="#')
    html = html.replace(f'href="{fname}"', 'href="#top"')
    return html

# ---------- embed logos ----------
# ---------- assets: keep external files for SEO/social refs, embed logos for reliable display ----------
os.makedirs('/mnt/user-data/outputs/coolmaster-website', exist_ok=True)
OUT = '/mnt/user-data/outputs/coolmaster-website'

# the optimised image files live in OUT (generated by build_assets.py); embed them as data URIs
def datauri(path, mime='image/png'):
    with open(path, 'rb') as f:
        return f'data:{mime};base64,' + base64.b64encode(f.read()).decode()
for _need in ['coolmaster-wordmark.png', 'coolmaster-icon.png', 'favicon.png']:
    assert os.path.exists(os.path.join(OUT, _need)), f'missing optimised asset {_need} — run build_assets.py first'
WORD = datauri(os.path.join(OUT, 'coolmaster-wordmark.png'))
ICON = datauri(os.path.join(OUT, 'coolmaster-icon.png'))
FAV  = datauri(os.path.join(OUT, 'favicon.png'))

for fname, html in pages.items():
    html = rewrite_links(html, fname)
    # apply real business details (single source of truth)
    html = html.replace('tel:+64800000000', 'tel:+642102454541')
    html = html.replace('0800 000 000', '021 024 54541')
    html = html.replace('info@coolmaster.co.nz', 'shivcoolmaster@gmail.com')
    html = html.replace('[Your service area], New Zealand', 'Auckland-based · Serving New Zealand')
    html = html.replace('[Your service area], NZ', 'Auckland, New Zealand')
    html = html.replace('__WA__', WHATSAPP)
    # embed the hero photo into the home page only (guaranteed rendering, like the logos);
    # other pages keep the tiny file reference in shared CSS but never use .hero
    if fname == 'index.html':
        with open(os.path.join(OUT, 'hero-banner.jpg'), 'rb') as _hb:
            _hb64 = 'data:image/jpeg;base64,' + base64.b64encode(_hb.read()).decode()
        html = html.replace("url('hero-banner.jpg')", f"url('{_hb64}')")
    # embed logos as data URIs (always visible — preview, standalone, and hosted)
    html = html.replace('__WORDMARK__', WORD)
    html = html.replace('__ICON__', ICON)
    html = html.replace('__FAVICON__', FAV)
    # validation
    for tok in ['__WORDMARK__','__ICON__','__FAVICON__','__WA__']:
        assert tok not in html, f'{fname}: token {tok} left'
    assert '145-151-872' not in html, f'{fname}: IRD present'
    assert '[Your service area]' not in html, f'{fname}: service-area placeholder left'
    assert '0800 000 000' not in html, f'{fname}: old phone left'
    assert 'info@coolmaster.co.nz' not in html, f'{fname}: old email left'
    assert 'shivcoolmaster@gmail.com' in html, f'{fname}: new email missing'
    assert '021 024 54541' in html, f'{fname}: new phone missing'
    assert 'href="#audiences"' not in html or fname=='services.html', None
    # tag balance
    for t in ['section','header','footer','main','details','html','body']:
        o=len(re.findall('<'+t+r'[ >]',html)); c=len(re.findall('</'+t+'>',html))
        assert o==c, f'{fname}: <{t}> {o}/{c}'
    assert html.count('<h1')==1 and html.count('</h1>')==1, f'{fname}: h1 count {html.count("<h1")}'
    open(os.path.join(OUT, fname),'w',encoding='utf-8').write(html)
    print(f'{fname:16s} {len(html.encode())//1024:4d} KB  h1=1  tags OK')

print('\\nAll pages written to', OUT)

# ---------- sitemap.xml ----------
import datetime
today = datetime.date.today().isoformat()
sitemap_urls = [
    ("",              "1.0", "monthly"),
    ("services.html", "0.9", "monthly"),
    ("commercial-hvac.html",          "0.8", "monthly"),
    ("commercial-refrigeration.html", "0.8", "monthly"),
    ("bwof-form-12a.html",            "0.8", "monthly"),
    ("servicing-maintenance.html",    "0.7", "monthly"),
    ("mechanical-ventilation.html",   "0.7", "monthly"),
    ("emergency-repairs.html",        "0.7", "monthly"),
    ("heat-pumps.html",               "0.7", "monthly"),
    ("air-conditioning.html",         "0.7", "monthly"),
    ("ducted-systems.html",           "0.7", "monthly"),
    ("about.html",    "0.8", "yearly"),
    ("contact.html",  "0.8", "yearly"),
    ("faq.html",      "0.7", "yearly"),
]
rows = "\n".join(
    f"""  <url>
    <loc>{BASE}{slug}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>""" for slug, prio, freq in sitemap_urls
)
sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{rows}
</urlset>
"""
open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(sitemap)

# ---------- robots.txt ----------
robots = f"""# robots.txt for CoolMaster Services Limited
User-agent: *
Allow: /

Sitemap: {BASE}sitemap.xml
"""
open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8').write(robots)

# validate sitemap is well-formed XML
import xml.dom.minidom as _x
_x.parseString(sitemap.encode())
print('sitemap.xml written ('+str(len(sitemap_urls))+' urls, valid XML) and robots.txt written')
