const WHATSAPP_NUMBER = "94743739898";

const grid = document.querySelector("#fragrance-grid");
const searchInput = document.querySelector("#scent-search");
const resultCount = document.querySelector("#result-count");
const resultLabel = document.querySelector("#result-label");
const emptyState = document.querySelector("#empty-state");
const scentInput = document.querySelector("#order-scent");
const formatSelect = document.querySelector("#order-format");
const quantityInput = document.querySelector("#order-quantity");
const formStatus = document.querySelector("#form-status");

function filterFragrances(query = "") {
  const normalizedQuery = normalizeSearch(query);
  let visibleCount = 0;

  grid.querySelectorAll("[data-fragrance]").forEach((card) => {
    const matches = normalizeSearch(card.dataset.fragrance).includes(normalizedQuery);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  grid.querySelectorAll("[data-collection-group]").forEach((group) => {
    group.hidden = !group.querySelector('[data-fragrance]:not([hidden])');
  });

  resultCount.textContent = String(visibleCount);
  resultLabel.textContent = visibleCount === 1 ? "fragrance option" : "fragrance options";
  emptyState.hidden = visibleCount !== 0;
}

function normalizeSearch(value) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

searchInput.addEventListener("input", (event) => filterFragrances(event.currentTarget.value));

function goToOrder({ scent, format, focusTarget } = {}) {
  if (scent) scentInput.value = scent;
  if (format) formatSelect.value = format;

  document.querySelector("#order").scrollIntoView({ behavior: "smooth", block: "start" });
  const control = focusTarget === "scent" ? scentInput : formatSelect;
  window.setTimeout(() => control.focus({ preventScroll: true }), 450);
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-scent]");
  if (!button) return;
  goToOrder({ scent: button.dataset.scent, format: button.dataset.productFormat, focusTarget: "format" });
});

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    goToOrder({ format: button.dataset.format, focusTarget: "scent" });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#order-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const scent = scentInput.value.trim() || "a fragrance";
  const format = formatSelect.value;
  const quantity = Number(quantityInput.value);
  const messageLines = [
    `Hi Podi Bottle, I’d like to enquire about ${scent}.`,
    `Size: ${format}`,
    `Quantity: ${quantity}`,
  ];

  if (!['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)) {
    messageLines.push(`Page: ${window.location.origin}${window.location.pathname}`);
  }

  messageLines.push("Could you please confirm current availability and price?");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines.join("\n"))}`;

  formStatus.replaceChildren();
  formStatus.append("WhatsApp is opening with your enquiry ready. ");
  const fallbackLink = document.createElement("a");
  fallbackLink.href = whatsappUrl;
  fallbackLink.target = "_blank";
  fallbackLink.rel = "noopener noreferrer";
  fallbackLink.textContent = "Continue here if it doesn’t open.";
  formStatus.append(fallbackLink);

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.querySelector("#year").textContent = String(new Date().getFullYear());

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;

if ("IntersectionObserver" in window && !motionPreference.matches) {
  document.documentElement.classList.add("motion-ready");
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 80px 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

motionPreference.addEventListener("change", (event) => {
  if (!event.matches) return;
  revealObserver?.disconnect();
  document.documentElement.classList.remove("motion-ready");
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
});
