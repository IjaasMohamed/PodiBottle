# Oro Liquido

A static fragrance catalogue built with HTML, CSS and browser JavaScript modules. Product pages and the homepage catalogue are generated as crawlable HTML from catalog-data.mjs. Enquiries open WhatsApp with a selected fragrance, size, price, quantity and page URL. There is no cart, checkout backend or payment integration.

## Run locally

Serve this directory over HTTP so browser modules load correctly:

    python -m http.server 8000

Open http://localhost:8000.

## Catalogue updates

Edit catalog-data.mjs, then run:

    node scripts/generate-product-pages.mjs

This refreshes the homepage product cards and the six static pages in products/. Product names, image paths and sizes/prices are defined centrally. Each product's `imagesBySize` maps the 5 ml and 10 ml decant photos and the 50 ml bottle photo; the catalogue selectors and product pages use that mapping to keep the displayed image, price and enquiry size in sync. The supplied original photos remain in `assets/`; optimized WebP variants are in `assets/products/`.

## Deploy to Vercel

1. Import this source directory/repository into Vercel, or run vercel from it.
2. Select the Other framework preset. No build command is needed; use . as the output directory.
3. Set SITE_CONFIG.origin in catalog-data.mjs to the canonical production origin (for example https://shop.example.com, with no trailing slash).
4. Replace YOUR-PRODUCTION-DOMAIN with the live host in index.html, about-us.html, about-fragrances.html, robots.txt and sitemap.xml.
5. Run node scripts/generate-product-pages.mjs so generated product URLs use the production origin, then deploy.
6. Check the live canonical links and sitemap before submitting the sitemap in Google Search Console.

vercel.json enables clean URLs and removes trailing slashes. There are no environment variables or build step.

## Business and catalogue accuracy

- The catalogue contains the six products previously supplied, presented as independent inspired versions; the listings are not the original designer products and Oro Liquido does not claim official brand affiliation.
- Confirmed size pricing is 5 ml — LKR 950, 10 ml — LKR 1,700, and 50 ml — LKR 7,900.
- Availability is unconfirmed and should be checked with the seller before ordering.
- Business-supplied information says fragrances are sourced from Dubai, islandwide delivery is available in Sri Lanka, and the business offers cashback if a perfume does not last more than eight hours. The detailed eligibility, wear assessment and claim process for that guarantee are still needed.
- The business reports more than 1,000 customers and positive reviews. No review assets or individual testimonials were supplied.
- Contact: 074 373 9898 via WhatsApp/phone, babageebaba128@gmail.com, Dehiwala, Colombo, Sri Lanka. WhatsApp links use the verified existing international digits 94743739898.
- Delivery timing/charges, payment options, returns/refunds, guarantee terms, privacy notice and full terms are not documented. The store-information page transparently points this out and is marked noindex.
- The Dior Savage product photo is labelled “Savage Noir” and identifies an inspired creation of Dior Sauvage. Confirm the customer-facing name if needed.

## Assets and checks

The transparent Oro Liquido wordmark and favicon are derived from the owner-supplied assets/Oro Logo.png; the source image is kept intact. Product photographs and optimized WebP variants remain in assets/ and assets/products/. assets/og-oro-liquido.jpg is the brand social-sharing image.

Useful project checks:

    node --check catalog-data.mjs
    node --check script.js
    node --check product-page.js
    node --check scripts/generate-product-pages.mjs
    node scripts/generate-product-pages.mjs

The repository is static and has no package manifest, build, lint, unit-test or type-check scripts. Review the homepage and product pages at narrow mobile, tablet and desktop widths. Test search, size/price selection, quantity totals, menu keyboard controls and the generated WhatsApp drafts in a browser.
