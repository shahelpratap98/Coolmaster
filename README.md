# CoolMaster Services — Website

A fast, static, mobile-friendly marketing site for **CoolMaster Services Limited** (Auckland-based commercial HVAC, refrigeration, ventilation & residential heat pumps, established 2014).

## Files in this folder

| File | Purpose |
|------|---------|
| `index.html` | Home page |
| `services.html` | Services + BWoF / Form 12A support |
| `faq.html` | Frequently asked questions |
| `contact.html` | Contact details + enquiry form |
| `404.html` | "Page not found" page (served automatically) |
| `hero-banner.jpg` | Home page hero photo (heat pump at sunset) |
| `coolmaster-wordmark.png` | Logo (also embedded in pages; used by search/social) |
| `coolmaster-icon.png` | Sun/snowflake emblem |
| `coolmaster-share.jpg` | Social-share preview image (Open Graph) |
| `favicon.png` | Browser tab icon |
| `sitemap.xml`, `robots.txt` | Search-engine files |

Everything is self-contained — the logos are embedded directly in the pages, so they always display. No build step, no dependencies. Just upload all files together to the site root.

## Deploy on GitHub Pages

1. Create a repository and upload **all** files above, keeping them flat at the top level (so `index.html` is at the root).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
4. Wait ~1 minute. The site publishes at `https://<username>.github.io/` (or `/<repo>/` for a project site).

Any static host works too (Netlify, Cloudflare Pages, cPanel) — just upload the files to the web root.

## Before you go live — checklist

- [ ] **Replace the domain.** The placeholder `https://www.coolmaster.co.nz/` appears in the page `<head>` tags (canonical/Open Graph), `sitemap.xml` and `robots.txt`. Find-and-replace it with the real domain everywhere.
- [ ] **Confirm the WhatsApp number.** All "Get a free quote" buttons and the floating chat button open `https://wa.me/642102454541` (021 024 54541 in international format). Make sure that number has an active WhatsApp account, or swap it.
- [ ] **Add social links.** The Facebook / Instagram icons in the footer currently point to `#`. Replace with the real profile URLs (or remove them).
- [ ] **Submit the sitemap** to Google Search Console once live (`.../sitemap.xml`).
- [ ] **Set up Google Business Profile** and gather reviews — on-page SEO is done, but local ranking depends on this off-page work.

## Good to know

- **Page photos:** the service and About pages load photos directly from Unsplash's CDN (`images.unsplash.com`) under the Unsplash License — free for commercial use, no attribution required. They require no hosting on your side. For maximum robustness (or to replace them with real job photos, which is recommended), download replacements and swap the `src` URLs.
- **Contact form:** the enquiry form opens the visitor's email app pre-filled to `shivcoolmaster@gmail.com` (no server/backend needed). For a form that sends without opening an email app, a service like Formspree can be wired in later.
- **Form 12A wording:** the site describes BWoF servicing and **Form 12A support** (maintenance, checks, records, reporting) — not certificate issuance. Keep this framing unless CoolMaster is a registered IQP for the relevant specified systems.
- **Business details in use:** CoolMaster Services Limited · Shiv Shivan · 021 024 54541 · shivcoolmaster@gmail.com · Auckland-based · established 2014.

---
Built by Smart IT Solutions.
