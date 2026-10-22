import { mkdir, writeFile } from "node:fs/promises";
import { PRODUCTS, SITE_CONFIG } from "../catalog-data.mjs";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const abs = (path) => SITE_CONFIG.origin + path;

function makePage(product, index) {
  const canonical = abs("/products/" + product.slug);
  const title = product.name + " inspired fragrance | Podi Bottle";
  const description = product.titleDescription + " Explore this listing in Dehiwala, Colombo.";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": canonical + "#product",
        "name": product.name,
        "description": product.titleDescription,
        "image": abs(product.image),
        "url": canonical,
        "category": "Inspired fragrance"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": abs("/") },
          { "@type": "ListItem", "position": 2, "name": "Fragrances", "item": abs("/#fragrances") },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": canonical }
        ]
      }
    ]
  };
  const related = PRODUCTS.filter((item) => item.slug !== product.slug).slice(0, 3).map((item) =>
    '<a class="related-card" href="/products/' + escapeHtml(item.slug) + '.html">' +
      '<img src="' + escapeHtml(item.imageSmall) + '" alt="' + escapeHtml(item.alt) + '" width="480" height="480" loading="lazy" decoding="async" />' +
      '<span>' + escapeHtml(item.name) + '</span>' +
    '</a>'
  ).join("\n");
  const options = SITE_CONFIG.sizes.map((size, sizeIndex) =>
    '<div class="size-option"><input id="size-' + sizeIndex + '" type="radio" name="product-size" value="' + escapeHtml(size) + '"' + (sizeIndex === 0 ? " checked" : "") + ' /><label for="size-' + sizeIndex + '">' + escapeHtml(size) + '</label></div>'
  ).join("\n");
  const imageNotice = product.imageNote
    ? '<p class="product-disclaimer">' + escapeHtml(product.imageNote) + '</p>'
    : '<p class="product-disclaimer">This is an independently presented inspired fragrance, not the original designer product. Podi Bottle does not claim official affiliation with the referenced fragrance brands.</p>';

  return '<!doctype html>\n<html lang="en-LK">\n<head>\n' +
    '  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    '  <meta name="theme-color" content="#f7f5ef" />\n' +
    '  <meta name="description" content="' + escapeHtml(description) + '" />\n' +
    '  <meta name="robots" content="index, follow, max-image-preview:large" />\n' +
    '  <link rel="canonical" href="' + escapeHtml(canonical) + '" />\n  <title>' + escapeHtml(title) + '</title>\n' +
    '  <meta property="og:type" content="product" />\n  <meta property="og:site_name" content="Podi Bottle" />\n' +
    '  <meta property="og:title" content="' + escapeHtml(title) + '" />\n  <meta property="og:description" content="' + escapeHtml(description) + '" />\n' +
    '  <meta property="og:url" content="' + escapeHtml(canonical) + '" />\n  <meta property="og:image" content="' + escapeHtml(abs(product.image)) + '" />\n' +
    '  <meta property="og:image:alt" content="' + escapeHtml(product.alt) + '" />\n  <meta property="og:locale" content="en_LK" />\n' +
    '  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content="' + escapeHtml(title) + '" />\n' +
    '  <meta name="twitter:description" content="' + escapeHtml(description) + '" />\n  <meta name="twitter:image" content="' + escapeHtml(abs(product.image)) + '" />\n' +
    '  <link rel="icon" type="image/png" href="/assets/podi-bottle-mark.png" />\n' +
    '  <link rel="preload" as="image" href="' + escapeHtml(product.image) + '" fetchpriority="high" />\n' +
    '  <link rel="stylesheet" href="/styles.css" />\n' +
    '  <script type="application/ld+json">' + JSON.stringify(structuredData) + '</script>\n' +
    '  <script type="module" src="/script.js"></script>\n  <script type="module" src="/product-page.js"></script>\n' +
    '</head>\n<body data-product-slug="' + escapeHtml(product.slug) + '">\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    '  <div class="announcement"><span>Independent inspired fragrances</span><span aria-hidden="true">·</span><span>Dehiwala, Colombo</span></div>\n' +
    '  <header class="site-header"><div class="nav-shell">\n' +
    '    <a class="brand" href="/" aria-label="Podi Bottle home"><img class="brand__mark" src="/assets/podi-bottle-mark.png" alt="" width="40" height="40" /><span class="brand__name">podi bottle</span></a>\n' +
    '    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation menu"><span></span><span></span></button>\n' +
    '    <nav class="navigation" id="primary-navigation" aria-label="Main navigation" inert><a href="/#fragrances">Shop fragrances</a><a href="/about-fragrances.html">About fragrances</a><a href="/#contact">Contact</a><a class="navigation__cta" href="/#fragrances">Explore the collection <span aria-hidden="true">↗</span></a></nav>\n' +
    '  </div></header>\n' +
    '  <main id="main" class="product-page-main">\n' +
    '    <nav class="breadcrumbs section-wrap product-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="breadcrumbs__separator" aria-hidden="true">/</span><a href="/#fragrances">Fragrances</a><span class="breadcrumbs__separator" aria-hidden="true">/</span><span aria-current="page">' + escapeHtml(product.name) + '</span></nav>\n' +
    '    <div class="section-wrap product-layout">\n' +
    '      <figure class="product-gallery"><img src="' + escapeHtml(product.image) + '" srcset="' + escapeHtml(product.imageSmall) + ' 480w, ' + escapeHtml(product.image) + ' 1200w" sizes="(max-width: 760px) 92vw, 54vw" alt="' + escapeHtml(product.alt) + '" width="1200" height="1200" fetchpriority="high" /><figcaption class="product-gallery__caption">Product photo supplied for this inspired-version listing.</figcaption></figure>\n' +
    '      <section class="product-details" aria-labelledby="product-title">\n' +
    '        <p class="eyebrow"><span class="eyebrow__line"></span> Independent inspired fragrance</p>\n' +
    '        <span class="product-flag">Inspired version</span>\n' +
    '        <h1 id="product-title">' + escapeHtml(product.name) + '</h1>\n' +
    '        <p class="product-details__intro">' + escapeHtml(product.titleDescription) + '</p>\n' +
    '        ' + imageNotice + '\n' +
    '        <fieldset class="product-config"><legend>Choose a size</legend><div class="size-options">' + options + '</div></fieldset>\n' +
    '        <p class="price-status"><span data-current-price>Ask for current price</span><strong data-availability>Confirm current availability</strong></p>\n' +
    '        <div class="quantity-row"><label for="product-quantity">Quantity</label><input class="quantity-control" id="product-quantity" type="number" min="1" step="1" value="1" inputmode="numeric" /></div>\n' +
    '        <a class="button button--dark product-buy" href="https://wa.me/' + SITE_CONFIG.whatsappDigits + '" target="_blank" rel="noopener noreferrer" data-product-whatsapp>Ask about this fragrance <span aria-hidden="true">↗</span></a>\n' +
    '        <p class="product-detail-note">Your enquiry opens in WhatsApp. Review and send it there; no order is placed on this website.</p>\n' +
    '        <div class="product-description"><h2>About this listing</h2><p>This page identifies an independently presented inspired fragrance. The referenced designer name is used for identification only; this product is not the original branded fragrance and Podi Bottle does not claim brand affiliation. Available formats, price and stock must be confirmed before ordering.</p></div>\n' +
    '      </section>\n' +
    '    </div>\n' +
    '    <section class="section-wrap related-section" aria-labelledby="related-title"><h2 id="related-title">Explore another scent</h2><div class="related-grid">' + related + '</div></section>\n' +
    '  </main>\n' +
    '  <footer class="site-footer"><div class="footer-main section-wrap">\n' +
    '    <div class="footer-brand-block"><a class="brand brand--footer" href="/" aria-label="Podi Bottle home"><img class="brand__mark" src="/assets/podi-bottle-mark.png" alt="" width="38" height="38" /><span class="brand__name">podi bottle</span></a><p>Independent inspired fragrances in Dehiwala, Colombo.</p></div>\n' +
    '    <div class="footer-column"><span class="footer-column__title">Discover</span><a href="/#fragrances">Shop fragrances</a><a href="/about-fragrances.html">About fragrances</a></div>\n' +
    '    <div class="footer-column"><span class="footer-column__title">Store information</span><a href="/store-information.html#delivery">Delivery</a><a href="/store-information.html#returns">Returns and refunds</a><a href="/store-information.html#privacy">Privacy</a><a href="/store-information.html#terms">Terms</a></div>\n' +
    '    <div class="footer-column"><span class="footer-column__title">Contact</span><a href="https://wa.me/' + SITE_CONFIG.whatsappDigits + '" target="_blank" rel="noopener noreferrer" data-whatsapp-general>WhatsApp · ' + escapeHtml(SITE_CONFIG.phoneDisplay) + ' ↗</a><a href="mailto:' + escapeHtml(SITE_CONFIG.email) + '">Email Podi Bottle</a><span>' + escapeHtml(SITE_CONFIG.location) + '</span></div>\n' +
    '  </div><div class="footer-bottom section-wrap"><span>© <span data-current-year>2026</span> Podi Bottle</span><span>Independent inspired fragrances · Product options subject to availability</span></div></footer>\n' +
    '  <a class="whatsapp-float" href="https://wa.me/' + SITE_CONFIG.whatsappDigits + '" target="_blank" rel="noopener noreferrer" aria-label="Ask Podi Bottle a question on WhatsApp" data-whatsapp-general><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.9A8.4 8.4 0 1 1 20.5 11.8Z"></path><path d="M8.2 7.8c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .6.3.6 1.1 1.8 2.5 2.4.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5s-.1 1-.6 1.4c-.5.5-1.2.7-2 .5-1-.2-2.2-.7-3.5-1.8-1.4-1.2-2.3-2.7-2.6-3.7-.3-.9 0-1.8.3-2.3Z"></path></svg></a>\n' +
    '</body>\n</html>\n';
}

await mkdir(new URL("../products/", import.meta.url), { recursive: true });
for (const [index, product] of PRODUCTS.entries()) {
  const html = makePage(product, index);
  await writeFile(new URL("../products/" + product.slug + ".html", import.meta.url), html, "utf8");
}
console.log("Generated " + PRODUCTS.length + " static product pages.");
