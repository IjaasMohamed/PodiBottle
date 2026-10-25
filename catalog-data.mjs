export const SITE_CONFIG = Object.freeze({
  brand: "Oro Liquido",
  origin: "https://YOUR-PRODUCTION-DOMAIN",
  whatsappDigits: "94743739898",
  phoneDisplay: "+94 74 373 9898",
  email: "babageebaba128@gmail.com",
  location: "Dehiwala, Colombo, Sri Lanka",
  sizes: ["5 ml", "10 ml", "50 ml"],
  pricesLkr: Object.freeze({ "5 ml": 950, "10 ml": 1700, "50 ml": 7900 }),
  logo: "/assets/oro-liquido-logo.png",
  favicon: "/assets/oro-liquido-mark.png",
  socialImage: "/assets/og-oro-liquido.jpg",
});

export const PRODUCTS = Object.freeze([
  {
    slug: "blue-de-chanel",
    name: "Blue de Chanel",
    image: "/assets/products/blue-de-chanel-1200.webp",
    imageSmall: "/assets/products/blue-de-chanel-480.webp",
    alt: "Blue de Chanel inspired-version fragrance bottle against a deep blue backdrop",
    titleDescription: "An independently presented inspired fragrance listing. Product sizes are priced consistently; confirm current availability before ordering.",
    inspiration: "Chanel Bleu de Chanel",
    availability: "unconfirmed",
  },
  {
    slug: "dior-savage",
    name: "Dior Savage",
    image: "/assets/products/dior-savage-1200.webp",
    imageSmall: "/assets/products/dior-savage-480.webp",
    alt: "Perfume bottle labelled Savage Noir in the Dior Savage inspired-fragrance listing",
    titleDescription: "The supplied photo is labelled Savage Noir and describes an inspired creation of Dior Sauvage. Confirm the listing name and availability before ordering.",
    inspiration: "Dior Sauvage",
    imageNote: "The supplied photo is labelled “Savage Noir” and describes it as an inspired creation of Dior Sauvage. This is an independently presented inspired product, not the original designer fragrance.",
    availability: "unconfirmed",
  },
  {
    slug: "imperial-oudh",
    name: "Imperial Oudh",
    image: "/assets/products/imperial-oudh-1200.webp",
    imageSmall: "/assets/products/imperial-oudh-480.webp",
    alt: "Imperial Oudh inspired-version fragrance bottle photographed in warm amber light",
    titleDescription: "An independently presented fragrance listing. Product sizes are priced consistently; confirm current availability before ordering.",
    availability: "unconfirmed",
  },
  {
    slug: "tom-ford-ombre-leather",
    name: "TOM FORD OMBRÉ LEATHER",
    image: "/assets/products/tom-ford-ombre-leather-1200.webp",
    imageSmall: "/assets/products/tom-ford-ombre-leather-480.webp",
    alt: "Ombré Leather inspired-version fragrance bottle photographed against a dark background",
    titleDescription: "An independently presented inspired fragrance listing. Product sizes are priced consistently; confirm current availability before ordering.",
    inspiration: "TOM FORD Ombré Leather",
    availability: "unconfirmed",
  },
  {
    slug: "louis-vuitton-imagination",
    name: "Louis Vuitton Imagination",
    image: "/assets/products/louis-vuitton-imagination-1200.webp",
    imageSmall: "/assets/products/louis-vuitton-imagination-480.webp",
    alt: "Louis Vuitton Imagination inspired-version fragrance bottle in a light neutral setting",
    titleDescription: "An independently presented inspired fragrance listing. Product sizes are priced consistently; confirm current availability before ordering.",
    inspiration: "Louis Vuitton Imagination",
    availability: "unconfirmed",
  },
  {
    slug: "tuxedo-sharp-patchouli",
    name: "TUXEDO SHARP PATCHOULI",
    image: "/assets/products/tuxedo-sharp-patchouli-1200.webp",
    imageSmall: "/assets/products/tuxedo-sharp-patchouli-480.webp",
    alt: "Tuxedo Sharp Patchouli inspired-version fragrance bottle in a dark setting",
    titleDescription: "An independently presented inspired fragrance listing. Product sizes are priced consistently; confirm current availability before ordering.",
    availability: "unconfirmed",
  },
]);

export function productUrl(product) {
  return "/products/" + product.slug;
}

export function formatLkr(value) {
  return "LKR " + new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(value);
}
