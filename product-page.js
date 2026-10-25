import { PRODUCTS, SITE_CONFIG, formatLkr } from "/catalog-data.mjs";

const slug = document.body.dataset.productSlug;
const product = PRODUCTS.find((item) => item.slug === slug);
const sizeInputs = Array.from(document.querySelectorAll('input[name="product-size"]'));
const quantityInput = document.querySelector("#product-quantity");
const priceText = document.querySelector("[data-current-price]");
const totalText = document.querySelector("[data-product-total]");
const availabilityText = document.querySelector("[data-availability]");
const enquiryLink = document.querySelector("[data-product-whatsapp]");

if (product && sizeInputs.length && quantityInput && enquiryLink) {
  const updateEnquiry = () => {
    const selected = sizeInputs.find((input) => input.checked);
    const size = selected ? selected.value : SITE_CONFIG.sizes[0];
    const rawQuantity = Number.parseInt(quantityInput.value, 10);
    const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
    const unitPrice = SITE_CONFIG.pricesLkr[size];
    const lineTotal = unitPrice * quantity;
    const messageLines = [
      "Hi Oro Liquido, I’d like to enquire about " + product.name + ".",
      "Size: " + size,
      "Unit price: " + formatLkr(unitPrice),
      "Quantity: " + quantity,
      "Estimated total: " + formatLkr(lineTotal),
      "Please confirm current availability and islandwide delivery details.",
      "Please also share the eligibility and claim terms for the 8-hour cashback guarantee.",
      "Product page: " + window.location.origin + window.location.pathname
    ];
    const url = new URL("https://wa.me/" + SITE_CONFIG.whatsappDigits);
    url.searchParams.set("text", messageLines.join("\n"));
    enquiryLink.href = url.toString();
    if (priceText) priceText.textContent = formatLkr(unitPrice);
    if (totalText) totalText.textContent = formatLkr(lineTotal);
    if (availabilityText) availabilityText.textContent = "Confirm current availability";
  };

  sizeInputs.forEach((input) => input.addEventListener("change", updateEnquiry));
  quantityInput.addEventListener("input", updateEnquiry);
  quantityInput.addEventListener("change", () => {
    if (!quantityInput.value || Number(quantityInput.value) < 1) quantityInput.value = "1";
    updateEnquiry();
  });
  updateEnquiry();
}
