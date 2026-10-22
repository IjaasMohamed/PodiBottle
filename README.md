# Podi Bottle

A static, mobile-first fragrance storefront built with HTML, CSS and browser JavaScript modules. It has no package dependencies, checkout backend or payment integration. Product enquiries open WhatsApp with the selected fragrance, size, quantity and page address; the customer reviews and sends the message in WhatsApp.

## Run locally

Use a local HTTP server from this directory:

    python -m http.server 8000

Open http://localhost:8000. The six product pages are pre-generated static HTML files under the products/ directory.

## Update the product catalogue

Edit catalog-data.mjs, then run:

    node scripts/generate-product-pages.mjs

The script writes six crawlable product pages into products/. Product image variants live in assets/products/; the source photographs remain in assets/. Prices are intentionally null and availability is unconfirmed until the seller supplies accurate details. Do not publish a price or stock claim until it has been verified.

## Deploy to Vercel

1. Import this repository into Vercel or run vercel from this directory.
2. Select the Other framework preset. Leave the build command blank and use . as the output directory.
3. Set the production domain in catalog-data.mjs as SITE_CONFIG.origin (include https://, no trailing slash).
4. Replace YOUR-PRODUCTION-DOMAIN with the production host in index.html, about-fragrances.html, robots.txt and sitemap.xml.
5. Run node scripts/generate-product-pages.mjs to update the product pages' canonical, social and structured-data URLs.
6. Commit and redeploy. Confirm the deployed canonical links and sitemap use the live domain before submitting the sitemap to search engines.

vercel.json enables clean URLs and removes trailing slashes. The site does not require environment variables or a build step.

## Catalogue and business accuracy

- The public catalogue contains only the six supplied fragrance listings.
- Each listing offers a 6 ml decant, 10 ml decant and 50 ml bottle as enquiry options, subject to actual availability.
- No prices, inventory, reviews, delivery promises, cash-on-delivery availability, refunds, longevity guarantees, or brand authorization are claimed.
- The product pages include Product structured data without Offer, price, availability, reviews or ratings.
- The homepage Store structured data uses only the supplied business name, Dehiwala/Colombo location, email and phone. Street address, hours, coordinates and social profiles are omitted.
- The customer-facing contact is shown as 074 373 9898; telephone and WhatsApp links use +94743739898 (the wa.me URL omits the plus sign).
- Product labels describe the listings as inspired versions. These independent products are not presented as the original designer products or as officially affiliated.

## Image assets

The six original photographs are retained in assets/: Blue de Chanel.jpeg, Dior Savage.jpeg, Imperial Oudh.jpeg, INSPIRED TOM FORD OMBRE LEATHER.jpg, Louis Vuitton Imagination.jpeg, and TUXEDO SHARP PATCHOULI.jpeg. Optimized square WebP sizes at 480 px and 1200 px are in assets/products/ and are used in the collection and detail pages. assets/og-podi-bottle.jpg is the 1200 × 630 social-sharing cover. Product name and image paths are maintained together in catalog-data.mjs.

## Owner details to complete

Before publishing, supply the production domain, verified prices by product and size, current stock, delivery coverage/timing/charges, accepted payment methods (including whether cash on delivery is supported), and any real returns/refund terms. A full privacy notice and store terms should be prepared by the business owner. The store-information.html page transparently points out that these policies have not been supplied; it is marked noindex and excluded from the sitemap until complete.

The Dior Savage listing's supplied photograph is labelled “Savage Noir” and describes an inspired creation of Dior Sauvage. Confirm the customer-facing product name with the seller. assets/logo.jpeg bears Ceylon Drops branding, while the existing Podi Bottle drop mark is used in the site header; confirm which mark should represent the website if the supplied brand logo is intended to replace it.

## Checks

This project has no package manifest, build, lint, unit-test or type-check scripts. Useful source checks include:

    node --check script.js
    node --check product-page.js
    node --check scripts/generate-product-pages.mjs
    node scripts/generate-product-pages.mjs

Use a browser at narrow mobile, tablet and desktop widths to review the static pages, product size/quantity selection, navigation, search and WhatsApp draft. The site does not place orders or collect payment.
