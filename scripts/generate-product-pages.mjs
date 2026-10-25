import { mkdir, readFile, writeFile } from "node:fs/promises";
import { PRODUCTS, SITE_CONFIG, formatLkr, productUrl } from "../catalog-data.mjs";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const abs = (path) => SITE_CONFIG.origin + path;

function makeProductCard(product, index) {
  const url = productUrl(product) + ".html";
  const query = [product.name, product.inspiration || "", "inspired fragrance"].join(" ").toLocaleLowerCase();
  return `
            <article class="product-card" data-product-card data-search="${escapeHtml(query)}">
              <a class="product-card__media" href="${url}" aria-label="View ${escapeHtml(product.name)} inspired fragrance">
                <img src="${product.imageSmall}" srcset="${product.imageSmall} 480w, ${product.image} 1200w" sizes="(max-width: 560px) 88vw, (max-width: 900px) 44vw, 30vw" alt="${escapeHtml(product.alt)}" width="480" height="480" loading="lazy" decoding="async" />
                <span class="product-card__index">${String(index + 1).padStart(2, "0")}</span>
                <span class="product-card__view">Discover fragrance <span aria-hidden="true">↗</span></span>
              </a>
              <div class="product-card__body">
                <p class="product-card__label">Independent inspired version</p>
                <h3><a href="${url}">${escapeHtml(product.name)}</a></h3>
                <p class="product-card__inspiration">${product.inspiration ? "Inspired by " + escapeHtml(product.inspiration) : "A fragrance from the current edit"}</p>
                <p class="product-card__sizes">5 ml · 10 ml · 50 ml <span>Choose a size on the product page</span></p>
                <p class="product-card__price">From <strong>${formatLkr(SITE_CONFIG.pricesLkr["5 ml"])}</strong></p>
                <a class="product-card__cta" href="${url}">Explore sizes <span aria-hidden="true">↗</span></a>
              </div>
            </article>`;
}

function makePage(product, index) {
  const canonical = abs(productUrl(product));
  const title = `${product.name} inspired fragrance | Oro Liquido`;
  const description = `${product.titleDescription} Explore 5 ml, 10 ml and 50 ml sizes from Oro Liquido in Dehiwala, Colombo.`;
  const offers = SITE_CONFIG.sizes.map((size) => ({
    "@type": "Offer",
    "name": size,
    "price": String(SITE_CONFIG.pricesLkr[size]),
    "priceCurrency": "LKR",
    "url": canonical + "#size-" + size.replace(/\s/g, "-")
  }));
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
        "category": "Inspired fragrance",
        "offers": offers
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
    `<a class="related-card" href="${productUrl(item)}.html"><img src="${item.imageSmall}" alt="${escapeHtml(item.alt)}" width="480" height="480" loading="lazy" decoding="async" /><span>${escapeHtml(item.name)}</span><small>From ${formatLkr(SITE_CONFIG.pricesLkr["5 ml"])}</small></a>`
  ).join("\n");
  const options = SITE_CONFIG.sizes.map((size, sizeIndex) => {
    const sizeId = "size-" + size.toLocaleLowerCase().replace(/\s+/g, "-");
    return `<div class="size-option"><input id="${sizeId}" type="radio" name="product-size" value="${escapeHtml(size)}"${sizeIndex === 0 ? " checked" : ""} /><label for="${sizeId}"><span>${escapeHtml(size)}</span><small>${formatLkr(SITE_CONFIG.pricesLkr[size])}</small></label></div>`;
  }).join("\n");
  const imageNotice = product.imageNote
    ? `<p class="product-disclaimer">${escapeHtml(product.imageNote)}</p>`
    : `<p class="product-disclaimer">This is an independently presented inspired fragrance, separate from the original designer product. Oro Liquido does not claim official affiliation with the referenced fragrance brands.</p>`;
  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en-LK">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#11110f" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <title>${escapeHtml(title)}</title>
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Oro Liquido" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(abs(product.image))}" />
  <meta property="og:image:alt" content="${escapeHtml(product.alt)}" />
  <meta property="og:locale" content="en_LK" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(abs(product.image))}" />
  <link rel="icon" type="image/png" href="${SITE_CONFIG.favicon}" />
  <link rel="preload" as="image" href="${product.image}" fetchpriority="high" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">${jsonLd}</script>
  <script type="module" src="/script.js"></script>
  <script type="module" src="/product-page.js"></script>
</head>
<body data-product-slug="${product.slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement"><span>Sourced from Dubai</span><span aria-hidden="true">·</span><span>Islandwide delivery across Sri Lanka</span></div>
  <header class="site-header"><div class="nav-shell">
    <a class="brand" href="/" aria-label="Oro Liquido home"><img class="brand__logo" src="${SITE_CONFIG.logo}" alt="Oro Liquido perfume shop" width="176" height="88" /></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation menu"><span></span><span></span></button>
    <nav class="navigation" id="primary-navigation" aria-label="Main navigation" inert><a href="/#fragrances">Fragrances</a><a href="/about-us.html">About us</a><a href="/#contact">Contact</a><a class="navigation__cta" href="/#fragrances">Explore the collection <span aria-hidden="true">↗</span></a></nav>
  </div></header>
  <main id="main" class="product-page-main">
    <nav class="breadcrumbs section-wrap product-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="breadcrumbs__separator" aria-hidden="true">/</span><a href="/#fragrances">Fragrances</a><span class="breadcrumbs__separator" aria-hidden="true">/</span><span aria-current="page">${escapeHtml(product.name)}</span></nav>
    <div class="section-wrap product-layout">
      <figure class="product-gallery"><img src="${product.image}" srcset="${product.imageSmall} 480w, ${product.image} 1200w" sizes="(max-width: 760px) 92vw, 54vw" alt="${escapeHtml(product.alt)}" width="1200" height="1200" fetchpriority="high" /><figcaption class="product-gallery__caption">Product photograph supplied for this inspired-version listing.</figcaption></figure>
      <section class="product-details" aria-labelledby="product-title">
        <p class="eyebrow"><span class="eyebrow__line"></span> Independent inspired fragrance</p>
        <span class="product-flag">Inspired version</span>
        <h1 id="product-title">${escapeHtml(product.name)}</h1>
        <p class="product-details__intro">${escapeHtml(product.titleDescription)}</p>
        ${imageNotice}
        <fieldset class="product-config"><legend>Choose a size</legend><div class="size-options">${options}</div></fieldset>
        <p class="price-status"><span data-current-price aria-live="polite">${formatLkr(SITE_CONFIG.pricesLkr[SITE_CONFIG.sizes[0]])}</span><strong data-availability>Confirm current availability</strong></p>
        <div class="quantity-row"><label for="product-quantity">Quantity</label><input class="quantity-control" id="product-quantity" type="number" min="1" step="1" value="1" inputmode="numeric" /></div>
        <p class="order-total order-total--detail" aria-live="polite">Estimated total <strong data-product-total>${formatLkr(SITE_CONFIG.pricesLkr[SITE_CONFIG.sizes[0]])}</strong></p>
        <a class="button button--dark product-buy" href="https://wa.me/${SITE_CONFIG.whatsappDigits}" target="_blank" rel="noopener noreferrer" data-product-whatsapp>Enquire on WhatsApp <span aria-hidden="true">↗</span></a>
        <p class="product-detail-note">Your enquiry opens in WhatsApp with the selected size, price and quantity. Review and send it there; no order is placed on this website.</p>
        <div class="product-description"><h2>About this listing</h2><p>This product is an independently presented inspired fragrance, not the original designer product. Brand names identify the listed inspiration only; Oro Liquido does not claim authorization or affiliation. The business states islandwide delivery and an 8-hour cashback guarantee; confirm delivery charges, timing, and guarantee eligibility and claim conditions before ordering.</p></div>
      </section>
    </div>
    <section class="section-wrap related-section" aria-labelledby="related-title"><h2 id="related-title">Continue your discovery</h2><div class="related-grid">${related}</div></section>
  </main>
  <footer class="site-footer"><div class="footer-main section-wrap">
    <div class="footer-brand-block"><a class="brand brand--footer" href="/" aria-label="Oro Liquido home"><img class="brand__logo" src="${SITE_CONFIG.logo}" alt="Oro Liquido perfume shop" width="154" height="77" /></a><p>Inspired fragrances in Dehiwala, Colombo.</p></div>
    <div class="footer-column"><span class="footer-column__title">Discover</span><a href="/#fragrances">Shop fragrances</a><a href="/about-us.html">About us</a></div>
    <div class="footer-column"><span class="footer-column__title">Information</span><a href="/store-information.html#delivery">Delivery</a><a href="/store-information.html#returns">Returns and refunds</a><a href="/store-information.html#privacy">Privacy</a><a href="/store-information.html#terms">Terms</a></div>
    <div class="footer-column"><span class="footer-column__title">Contact</span><a href="https://wa.me/${SITE_CONFIG.whatsappDigits}" target="_blank" rel="noopener noreferrer" data-whatsapp-general>WhatsApp · ${SITE_CONFIG.phoneDisplay} ↗</a><a href="mailto:${SITE_CONFIG.email}">Email Oro Liquido</a><span>${SITE_CONFIG.location}</span></div>
  </div><div class="footer-bottom section-wrap"><span>© <span data-current-year>2026</span> Oro Liquido</span><span>Independent inspired fragrances · Confirm availability before ordering</span></div></footer>
  <a class="whatsapp-float" href="https://wa.me/${SITE_CONFIG.whatsappDigits}" target="_blank" rel="noopener noreferrer" aria-label="Ask Oro Liquido a question on WhatsApp" data-whatsapp-general><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.9A8.4 8.4 0 1 1 20.5 11.8Z"></path><path d="M8.2 7.8c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .6.3.6 1.1 1.8 2.5 2.4.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5s-.1 1-.6 1.4c-.5.5-1.2.7-2 .5-1-.2-2.2-.7-3.5-1.8-1.4-1.2-2.3-2.7-2.6-3.7-.3-.9 0-1.8.3-2.3Z"></path></svg></a>
</body>
</html>`;
}

const indexPath = new URL("../index.html", import.meta.url);
let indexHtml = await readFile(indexPath, "utf8");
const cards = PRODUCTS.map(makeProductCard).join("\n");
indexHtml = indexHtml.replace(/<!-- PRODUCT CARDS START -->[\s\S]*?<!-- PRODUCT CARDS END -->/, `<!-- PRODUCT CARDS START -->\n${cards}\n            <!-- PRODUCT CARDS END -->`);
const productOptions = PRODUCTS.map((product) => `<option value="${escapeHtml(product.name)}">${escapeHtml(product.name)}</option>`).join("");
indexHtml = indexHtml.replace(/<!-- PRODUCT OPTIONS START -->[\s\S]*?<!-- PRODUCT OPTIONS END -->/, `<!-- PRODUCT OPTIONS START -->${productOptions}<!-- PRODUCT OPTIONS END -->`);
await writeFile(indexPath, indexHtml, "utf8");
await mkdir(new URL("../products/", import.meta.url), { recursive: true });
for (const [index, product] of PRODUCTS.entries()) {
  await writeFile(new URL(`../products/${product.slug}.html`, import.meta.url), makePage(product, index), "utf8");
}
console.log(`Generated homepage catalogue and ${PRODUCTS.length} static product pages.`);
