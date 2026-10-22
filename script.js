import { SITE_CONFIG } from "/catalog-data.mjs";

const whatsappUrl = (message) => {
  const url = new URL("https://wa.me/" + SITE_CONFIG.whatsappDigits);
  url.searchParams.set("text", message);
  return url.toString();
};

document.querySelectorAll("[data-whatsapp-general]").forEach((link) => {
  link.href = whatsappUrl(
    "Hi Podi Bottle, I’m interested in your inspired fragrances. Could you share the current options, sizes, prices, availability and ordering information?"
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

const enquiryForm = document.querySelector("[data-home-enquiry]");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const formData = new FormData(enquiryForm);
    const scent = String(formData.get("scent") || "").trim();
    const size = String(formData.get("format") || "").trim();
    const quantity = Math.max(1, Number.parseInt(String(formData.get("quantity") || "1"), 10) || 1);
    const message = [
      "Hi Podi Bottle, I’d like to enquire about " + scent + ".",
      "Size: " + size,
      "Quantity: " + quantity,
      "Could you please confirm the current availability and price?",
      "Please also share the ordering and delivery information.",
      "Page: " + window.location.origin + "/"
    ].join("\n");
    const link = whatsappUrl(message);
    const status = document.querySelector("#form-status");
    if (status) status.textContent = "WhatsApp is opening with your enquiry. Review it there before sending.";
    window.open(link, "_blank", "noopener,noreferrer");
  });
}

const floatingWhatsApp = document.querySelector(".whatsapp-float");
const whatsappCoveredAreas = document.querySelectorAll(".hero__actions, .product-details, .article-aside");
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
if (!reducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".format-card, .product-card, .story-image, .story-copy, .enquiry-intro, .order-form");
  revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));
  document.documentElement.classList.add("reveal-enabled");
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  revealTargets.forEach((element) => observer.observe(element));
}
