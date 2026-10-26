import { PRODUCTS, SITE_CONFIG, formatLkr } from "/catalog-data.mjs";

const whatsappUrl = (message) => {
  const url = new URL("https://wa.me/" + SITE_CONFIG.whatsappDigits);
  url.searchParams.set("text", message);
  return url.toString();
};

document.querySelectorAll("[data-whatsapp-general]").forEach((link) => {
  link.href = whatsappUrl(
    "Hi Oro Liquido, I’m interested in your inspired fragrances. Could you share current availability, delivery details, and the terms for the 8-hour cashback guarantee?"
  );
});

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function closeMenu(restoreFocus = false) {
  if (!header || !menuToggle) return;
  header.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  if (navigation) navigation.inert = window.matchMedia("(max-width: 760px)").matches;
  if (restoreFocus) menuToggle.focus();
}

if (header && menuToggle && navigation) {
  const isMobileNavigation = () => window.matchMedia("(max-width: 760px)").matches;
  navigation.inert = isMobileNavigation();
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    header.classList.toggle("is-menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navigation.inert = !open;
    if (open) navigation.querySelector("a")?.focus({ preventScroll: true });
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-menu-open")) closeMenu(true);
  });
  window.addEventListener("resize", () => {
    if (!isMobileNavigation()) {
      closeMenu();
      navigation.inert = false;
    } else if (menuToggle.getAttribute("aria-expanded") !== "true") {
      navigation.inert = true;
    }
  });
}

const search = document.querySelector("#scent-search");
const cards = Array.from(document.querySelectorAll("[data-product-card]"));
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");

if (search && cards.length) {
  const filterCards = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const haystack = (card.dataset.search || card.textContent).toLocaleLowerCase();
      const matches = !query || haystack.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (resultCount) resultCount.textContent = String(visible);
    if (emptyState) emptyState.hidden = visible > 0;
  };
  search.addEventListener("input", filterCards);
}

cards.forEach((card) => {
  const image = card.querySelector("[data-card-image]");
  const price = card.querySelector("[data-card-price]");
  const sizeLabel = card.querySelector("[data-card-size-label]");
  const ctaLabel = card.querySelector("[data-card-cta]");
  const links = Array.from(card.querySelectorAll("[data-product-link]"));
  card.querySelectorAll("[data-card-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      const size = button.dataset.size;
      if (!size || !image) return;
      card.querySelectorAll("[data-card-variant]").forEach((option) => {
        const selected = option === button;
        option.setAttribute("aria-pressed", String(selected));
        option.classList.toggle("is-selected", selected);
      });
      const sourceWidth = size === "50 ml" ? 1200 : 960;
      image.classList.add("is-switching");
      image.srcset = `${button.dataset.imageSmall} 480w, ${button.dataset.image} ${sourceWidth}w`;
      image.sizes = "(max-width: 560px) 88vw, (max-width: 900px) 44vw, 30vw";
      image.src = button.dataset.imageSmall;
      image.alt = button.dataset.imageAlt || "Fragrance product image";
      image.width = Number(button.dataset.imageWidth) || 480;
      image.height = Number(button.dataset.imageHeight) || 480;
      image.dataset.imagePortrait = button.dataset.imagePortrait || "false";
      if (price) price.textContent = formatLkr(Number(button.dataset.price) || 0);
      if (sizeLabel) sizeLabel.textContent = button.dataset.sizeLabel || size;
      if (ctaLabel) ctaLabel.textContent = `Explore ${button.dataset.sizeLabel || size}`;
      const url = `${card.dataset.productUrl}?size=${encodeURIComponent(size.toLocaleLowerCase().replace(/\s/g, "-"))}`;
      links.forEach((link) => { link.href = url; });
      if (typeof image.decode === "function") image.decode().then(() => image.classList.remove("is-switching")).catch(() => image.classList.remove("is-switching"));
      else image.onload = () => image.classList.remove("is-switching");
    });
  });
});

const enquiryForm = document.querySelector("[data-home-enquiry]");
if (enquiryForm) {
  const sizeSelect = enquiryForm.querySelector('[name="format"]');
  const quantityInput = enquiryForm.querySelector('[name="quantity"]');
  const total = enquiryForm.querySelector("[data-order-total]");
  const currentPrice = () => SITE_CONFIG.pricesLkr[sizeSelect?.value] ?? SITE_CONFIG.pricesLkr["5 ml"];
  const currentQuantity = () => Math.max(1, Number.parseInt(quantityInput?.value || "1", 10) || 1);
  const updateTotal = () => {
    if (total) total.textContent = formatLkr(currentPrice() * currentQuantity());
  };
  sizeSelect?.addEventListener("change", updateTotal);
  quantityInput?.addEventListener("input", updateTotal);
  updateTotal();

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const formData = new FormData(enquiryForm);
    const scent = String(formData.get("scent") || "").trim();
    const size = String(formData.get("format") || "").trim();
    const sizeDescription = size === "50 ml" ? "50 ml bottle" : `${size} decant`;
    const quantity = currentQuantity();
    const unitPrice = currentPrice();
    const productRecord = PRODUCTS.find((item) => item.name === scent);
    const message = [
      "Hi Oro Liquido, I’d like to enquire about " + scent + ".",
      "Size: " + sizeDescription,
      "Unit price: " + formatLkr(unitPrice),
      "Quantity: " + quantity,
      "Estimated total: " + formatLkr(unitPrice * quantity),
      "Could you please confirm current availability and delivery details?",
      "Please also share the terms for the 8-hour cashback guarantee.",
      "Product page: " + window.location.origin + (productRecord ? "/products/" + productRecord.slug : "/#fragrances")
    ].join("\n");
    const status = document.querySelector("#form-status");
    if (status) status.textContent = "WhatsApp is opening with your enquiry. Review the details there before sending.";
    const destination = whatsappUrl(message);
    const popup = window.open("about:blank", "_blank");
    if (popup) {
      popup.opener = null;
      popup.location.replace(destination);
    } else {
      window.location.assign(destination);
    }
  });
}

const floatingWhatsApp = document.querySelector(".whatsapp-float");
const whatsappCoveredAreas = document.querySelectorAll(".hero__actions, #fragrances, .product-gallery, .product-details, .article-aside, .about-hero__copy, .enquiry-section");
if (floatingWhatsApp && whatsappCoveredAreas.length && "IntersectionObserver" in window) {
  const visibleAreas = new Set();
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleAreas.add(entry.target);
      else visibleAreas.delete(entry.target);
    });
    const hidden = visibleAreas.size > 0;
    floatingWhatsApp.classList.toggle("is-hidden", hidden);
    floatingWhatsApp.setAttribute("aria-hidden", String(hidden));
    floatingWhatsApp.tabIndex = hidden ? -1 : 0;
  }, { threshold: 0.12 });
  whatsappCoveredAreas.forEach((area) => visibilityObserver.observe(area));
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroArt = document.querySelector("[data-hero-art]");
if (heroArt && !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frame = 0;
  heroArt.addEventListener("pointermove", (event) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
      heroArt.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
      heroArt.style.setProperty("--light-x", `${(50 + x * 35).toFixed(1)}%`);
      heroArt.style.setProperty("--light-y", `${(35 + y * 30).toFixed(1)}%`);
    });
  });
  heroArt.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--tilt-x", "0deg");
    heroArt.style.setProperty("--tilt-y", "0deg");
    heroArt.style.setProperty("--light-x", "50%");
    heroArt.style.setProperty("--light-y", "35%");
  });
}

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".format-card, .product-card, .story-image, .story-copy, .enquiry-intro, .order-form, .proof-item, .about-intro__inner, .benefit-card, .about-disclaimer__inner, .about-cta__inner");
  revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));
  document.documentElement.classList.add("reveal-enabled");
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -18px 0px" });
  revealTargets.forEach((element) => observer.observe(element));
}
