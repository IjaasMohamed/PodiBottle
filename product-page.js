import { PRODUCTS, SITE_CONFIG } from "/catalog-data.mjs";

const slug = document.body.dataset.productSlug;
const product = PRODUCTS.find((item) => item.slug === slug);
const sizeInputs = Array.from(document.querySelectorAll('input[name="product-size"]'));
const quantityInput = document.querySelector("#product-quantity");
const priceText = document.querySelector("[data-current-price]");
const availabilityText = document.querySelector("[data-availability]");
const enquiryLink = document.querySelector("[data-product-whatsapp]");

if (product && sizeInputs.length && quantityInput && enquiryLink) {
  const money = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 });

  const updateEnquiry = () => {
    const selected = sizeInputs.find((input) => input.checked);
    const size = selected ? selected.value : SITE_CONFIG.sizes[0];
    const rawQuantity = Number.parseInt(quantityInput.value, 10);
    const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
    const price = product.pricesLkr[size];
    const messageLines = [
      "Hi Podi Bottle, I’d like to enquire about " + product.name + ".",
      "Size: " + size,
      "Quantity: " + quantity,
      price === null ? "Could you please confirm the current price and availability?" : "Listed price: " + money.format(price) + ". Please confirm current availability.",
      "Please share the ordering and delivery information.",
      "Product page: " + window.location.origin + window.location.pathname
    ];
    const url = new URL("https://wa.me/" + SITE_CONFIG.whatsappDigits);
    url.searchParams.set("text", messageLines.join("\n"));
    enquiryLink.href = url.toString();
    if (priceText) priceText.textContent = price === null ? "Ask for current price" : money.format(price);
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
