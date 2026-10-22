export const SITE_CONFIG = Object.freeze({
  brand: "Podi Bottle",
  origin: "https://YOUR-PRODUCTION-DOMAIN",
  whatsappDigits: "94743739898",
  phoneDisplay: "074 373 9898",
  email: "babageebaba128@gmail.com",
  location: "Dehiwala, Colombo, Sri Lanka",
  sizes: ["6 ml decant", "10 ml decant", "50 ml bottle"],
});

export const PRODUCTS = Object.freeze([
  {
    slug: "blue-de-chanel",
    name: "Blue de Chanel",
    image: "/assets/products/blue-de-chanel-1200.webp",
    imageSmall: "/assets/products/blue-de-chanel-480.webp",
    alt: "Blue de Chanel inspired-version perfume bottle photographed against a deep blue background",
    titleDescription: "An independently presented inspired fragrance listing. Ask Podi Bottle to confirm current size availability and price.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
  {
    slug: "dior-savage",
    name: "Dior Savage",
    image: "/assets/products/dior-savage-1200.webp",
    imageSmall: "/assets/products/dior-savage-480.webp",
    alt: "Dior Savage listing shown on a perfume bottle labelled Savage Noir",
    titleDescription: "The supplied image is labelled Savage Noir and describes an inspired creation of Dior Sauvage. Ask about current size availability and price.",
    imageNote: "The supplied photo is labelled “Savage Noir” and describes it as an inspired creation of Dior Sauvage. This listing is an independent inspired product, not the original designer fragrance.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
  {
    slug: "imperial-oudh",
    name: "Imperial Oudh",
    image: "/assets/products/imperial-oudh-1200.webp",
    imageSmall: "/assets/products/imperial-oudh-480.webp",
    alt: "Imperial Oudh inspired-version perfume bottle photographed in warm amber light",
    titleDescription: "An independently presented inspired fragrance listing. Ask Podi Bottle to confirm current size availability and price.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
  {
    slug: "tom-ford-ombre-leather",
    name: "TOM FORD OMBRÉ LEATHER",
    image: "/assets/products/tom-ford-ombre-leather-1200.webp",
    imageSmall: "/assets/products/tom-ford-ombre-leather-480.webp",
    alt: "Ombré Leather inspired-version perfume bottle photographed against a dark leather-toned background",
    titleDescription: "An independently presented inspired fragrance listing. Ask Podi Bottle to confirm current size availability and price.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
  {
    slug: "louis-vuitton-imagination",
    name: "Louis Vuitton Imagination",
    image: "/assets/products/louis-vuitton-imagination-1200.webp",
    imageSmall: "/assets/products/louis-vuitton-imagination-480.webp",
    alt: "Louis Vuitton Imagination inspired-version perfume bottle photographed in a light neutral setting",
    titleDescription: "An independently presented inspired fragrance listing. Ask Podi Bottle to confirm current size availability and price.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
  {
    slug: "tuxedo-sharp-patchouli",
    name: "TUXEDO SHARP PATCHOULI",
    image: "/assets/products/tuxedo-sharp-patchouli-1200.webp",
    imageSmall: "/assets/products/tuxedo-sharp-patchouli-480.webp",
    alt: "Tuxedo Sharp Patchouli inspired-version perfume bottle photographed in an elegant dark setting",
    titleDescription: "An independently presented inspired fragrance listing. Ask Podi Bottle to confirm current size availability and price.",
    pricesLkr: Object.freeze({ "6 ml decant": null, "10 ml decant": null, "50 ml bottle": null }),
    availability: "unconfirmed",
  },
]);

export function productUrl(product) {
  return "/products/" + product.slug;
}
