# Podi Bottle

A mobile-first fragrance storefront built with plain HTML, CSS, and JavaScript. It has no package dependencies or build step. The enquiry form opens WhatsApp with the selected fragrance, size, quantity, and production page URL prefilled; the customer reviews and sends the message from WhatsApp.

## Run locally

From this directory, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to Vercel

1. Import the existing repository into Vercel, or run `vercel` from this directory.
2. Use the **Other** framework preset.
3. Leave the build command blank and set the output directory to `.`.
4. Deploy. No environment variables are required.
5. Set the production domain. Replace every `YOUR-PRODUCTION-DOMAIN` token in `index.html`, `robots.txt`, and `sitemap.xml` with the production host (for example, `shop.example.com`; do not include `https://`). Keep the existing `https://` in the files.
6. Commit and redeploy so the canonical URL, social sharing URLs, structured data, and sitemap all use the production domain.

The domain is intentionally a clear placeholder because no production domain was supplied. Do not submit the sitemap to search engines until it has been replaced.

## Content and structured data

- The public fragrance names are rendered in HTML, so they remain available to search engines without JavaScript.
- Fragrance availability and prices are confirmed through the enquiry flow; no item-level offers or stock claims are marked up.
- The local business schema uses only the supplied name, location, email, and phone number. It omits street address, opening hours, coordinates, reviews, and social profiles.
- The local contact number is displayed as `074 373 9898`; `tel:` and WhatsApp links use the Sri Lankan international number `+94743739898` (`wa.me` omits the plus sign).

## Supplied assets

- `assets/roll-on-hero.webp` — optimized feature image from the supplied `02.png`.
- `assets/og-podi-bottle.jpg` — branded 1200 × 630 social-sharing image composed from the supplied bottle photograph.
- `assets/Jadoor.jpeg` — supplied roll-on product photo used in the editorial section and video poster.
- `assets/Attar.mp4` — supplied product video, loaded only when requested by the visitor.
- `assets/attar new (1).mp4` and `assets/attar new (2).mp4` — original supplied videos retained in the assets folder.
- `assets/01.png` — supplied 6ml promotional artwork retained, but its displayed price and delivery promotion are not repeated as current offers.
- `assets/podi-bottle-mark.png` — the supplied drop emblem cropped for use with the requested Podi Bottle wordmark.

## Checks

Run `node --check script.js` to check JavaScript syntax. The project has no build, lint, or unit-test scripts because it has no package manifest or dependencies.
