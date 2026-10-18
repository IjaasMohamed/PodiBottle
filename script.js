const fragrances = [
  "Azzaro Most Wanted",
  "Creed Aventus",
  "Sabhaya",
  "Dior Sauvage",
  "Oudh",
  "9PM",
  "1 Billion",
  "Lattafa",
  "Calvin Klein",
  "Armani",
  "Armani Di Aqua",
  "Hawas Ice",
  "J'adore",
  "Lacoste",
  "CR7",
];

const grid = document.querySelector("#fragrance-grid");
const searchInput = document.querySelector("#scent-search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const scentInput = document.querySelector("#order-scent");
const formatSelect = document.querySelector("#order-format");
const datalist = document.querySelector("#scent-options");
const formStatus = document.querySelector("#form-status");

function renderFragrances(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = fragrances.filter((name) => name.toLocaleLowerCase().includes(normalizedQuery));

  grid.innerHTML = matches
    .map(
      (name) => `
        <article class="fragrance-card">
          <div class="fragrance-card__top">
            <span>THE SCENT LIST</span>
            <span class="fragrance-card__drop" aria-hidden="true"></span>
          </div>
          <div>
            <h3>${name}</h3>
            <button type="button" data-scent="${name}">Ask about this scent <span aria-hidden="true">↗</span></button>
          </div>
        </article>
      `,
    )
    .join("");

  resultCount.textContent = String(matches.length);
  emptyState.hidden = matches.length !== 0;
}

renderFragrances();

datalist.innerHTML = fragrances.map((name) => `<option value="${name}"></option>`).join("");
searchInput.addEventListener("input", (event) => renderFragrances(event.currentTarget.value));

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-scent]");
  if (!button) return;

  scentInput.value = button.dataset.scent;
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => formatSelect.focus({ preventScroll: true }), 450);
});

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    formatSelect.value = button.dataset.format;
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => scentInput.focus({ preventScroll: true }), 450);
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const scent = scentInput.value.trim() || "your fragrances";
  const format = formatSelect.value;
  const message = `Hi Podi Bottle, I'm interested in ${scent} (${format}). Could you please confirm availability and current price?`;
  const whatsappUrl = `https://wa.me/9776131010?text=${encodeURIComponent(message)}`;

  formStatus.replaceChildren();
  formStatus.append("Opening WhatsApp with your selection. ");
  const fallbackLink = document.createElement("a");
  fallbackLink.href = whatsappUrl;
  fallbackLink.target = "_blank";
  fallbackLink.rel = "noreferrer";
  fallbackLink.textContent = "Continue here if it doesn’t open.";
  formStatus.append(fallbackLink);

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
