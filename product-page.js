import { PRODUCTS, SITE_CONFIG, formatLkr } from "/catalog-data.mjs";

const slug = document.body.dataset.productSlug;
const product = PRODUCTS.find((item) => item.slug === slug);
const sizeInputs = Array.from(document.querySelectorAll('input[name="product-size"]'));
const quantityInput = document.querySelector("#product-quantity");
const priceText = document.querySelector("[data-current-price]");
const totalText = document.querySelector("[data-product-total]");
const availabilityText = document.querySelector("[data-availability]");
const enquiryLink = document.querySelector("[data-product-whatsapp]");
const gallery = document.querySelector("[data-product-gallery]");
const galleryImage = document.querySelector("[data-product-image]");
const galleryCaption = document.querySelector("[data-gallery-caption]");

if (product && sizeInputs.length && quantityInput && enquiryLink) {
  const requestedSize = new URLSearchParams(window.location.search).get("size")?.replace(/-/g, " ");
  const requestedInput = sizeInputs.find((input) => input.value === requestedSize);
  if (requestedInput) requestedInput.checked = true;

  let imageVersion = 0;
  const updateGallery = (size) => {
    const image = product.imagesBySize?.[size];
    if (!image || !galleryImage) return;
    if (gallery?.dataset.productSize === size && galleryImage.alt === image.alt) return;
    const version = ++imageVersion;
    gallery?.setAttribute("data-product-size", size);
    galleryImage.classList.add("is-switching");
    galleryImage.srcset = `${image.imageSmall} 480w, ${image.image} ${image.width === 1200 ? 1200 : 960}w`;
    galleryImage.sizes = "(max-width: 760px) 92vw, 54vw";
    galleryImage.src = image.imageSmall;
    galleryImage.alt = image.alt;
    galleryImage.width = image.width;
    galleryImage.height = image.height;
    galleryImage.dataset.imagePortrait = String(size !== "50 ml");
    if (galleryCaption) galleryCaption.textContent = `${size}${size === "50 ml" ? " bottle" : " decant"} · Product photograph for the selected size.`;
    const finish = () => {
      if (version === imageVersion) window.setTimeout(() => galleryImage.classList.remove("is-switching"), 80);
    };
    if (typeof galleryImage.decode === "function") galleryImage.decode().then(finish).catch(finish);
    else galleryImage.onload = finish;
  };

  const updateEnquiry = () => {
    const selected = sizeInputs.find((input) => input.checked);
    const size = selected ? selected.value : SITE_CONFIG.sizes[0];
    const sizeDescription = size === "50 ml" ? "50 ml bottle" : `${size} decant`;
    const rawQuantity = Number.parseInt(quantityInput.value, 10);
    const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
    const unitPrice = SITE_CONFIG.pricesLkr[size];
    const lineTotal = unitPrice * quantity;
    const messageLines = [
      "Hi Oro Liquido, I’d like to enquire about " + product.name + ".",
      "Size: " + sizeDescription,
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
    updateGallery(size);
  };

  sizeInputs.forEach((input) => input.addEventListener("change", updateEnquiry));
  quantityInput.addEventListener("input", updateEnquiry);
  quantityInput.addEventListener("change", () => {
    if (!quantityInput.value || Number(quantityInput.value) < 1) quantityInput.value = "1";
    updateEnquiry();
  });
  updateEnquiry();
}
