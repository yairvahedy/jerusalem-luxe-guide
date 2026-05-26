import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import lifestyle from "@/assets/lifestyle.jpg";

/**
 * EDIT THIS FILE TO ADD / EDIT / REMOVE LISTINGS.
 *
 * Each listing must have a unique `slug`. Copy any object below to duplicate.
 * Images: drop new image files in src/assets/ and import them at the top.
 * Set `sold: true` to move a listing into the Sold Properties page.
 */

export type Listing = {
  slug: string;
  title: string;
  price: number; // in ILS (₪). Set 0 to display "Price upon request".
  type: "sale" | "rent";
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  balcony: boolean;
  mamad: boolean;
  elevator: boolean;
  parking: boolean;
  description: string;
  images: string[];
  videoUrl?: string; // YouTube/Vimeo embed URL
  sold?: boolean;
  featured?: boolean;
};

export const NEIGHBORHOODS = [
  "Mamilla",
  "German Colony",
  "Rehavia",
  "Talbiya",
  "Old Katamon",
  "City Center",
] as const;

export const LISTINGS: Listing[] = [
  {
    slug: "mamilla-penthouse-old-city-view",
    title: "Mamilla Penthouse with Old City View",
    price: 18500000,
    type: "sale",
    neighborhood: "Mamilla",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 240,
    balcony: true,
    mamad: true,
    elevator: true,
    parking: true,
    description:
      "A rare penthouse moments from the Old City walls. Floor-to-ceiling windows frame the golden Jerusalem skyline. Imported Italian marble, custom millwork, private rooftop terrace.",
    images: [listing1, lifestyle, listing2],
    featured: true,
  },
  {
    slug: "german-colony-garden-residence",
    title: "German Colony Garden Residence",
    price: 9750000,
    type: "sale",
    neighborhood: "German Colony",
    bedrooms: 5,
    bathrooms: 3,
    sqm: 210,
    balcony: true,
    mamad: true,
    elevator: false,
    parking: true,
    description:
      "Restored Templar-era stone home with a private walled garden. Arched windows, vaulted ceilings, and a tranquil position on one of the colony's most coveted streets.",
    images: [listing2, listing3, lifestyle],
    featured: true,
  },
  {
    slug: "talbiya-stone-villa",
    title: "Talbiya Classic Stone Villa",
    price: 24000000,
    type: "sale",
    neighborhood: "Talbiya",
    bedrooms: 6,
    bathrooms: 5,
    sqm: 380,
    balcony: true,
    mamad: true,
    elevator: true,
    parking: true,
    description:
      "Landmark villa in the heart of Talbiya. Soaring ceilings, original mosaics, and a private pool — minutes from the Presidential Residence.",
    images: [listing3, listing1, lifestyle],
    featured: true,
  },
  {
    slug: "rehavia-boutique-apartment",
    title: "Rehavia Boutique Apartment",
    price: 6200000,
    type: "sale",
    neighborhood: "Rehavia",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 140,
    balcony: true,
    mamad: true,
    elevator: true,
    parking: true,
    description:
      "Elegant Bauhaus apartment in a boutique building. Fully renovated with hand-laid herringbone oak, brass fixtures, and a sunlit south-facing balcony.",
    images: [lifestyle, listing1],
  },
  {
    slug: "old-katamon-family-home",
    title: "Old Katamon Family Home",
    price: 32000,
    type: "rent",
    neighborhood: "Old Katamon",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 180,
    balcony: true,
    mamad: true,
    elevator: true,
    parking: true,
    description:
      "Light-filled four bedroom in a quiet leafy street. Move-in ready, beautifully appointed, ideal for relocating families.",
    images: [listing2, lifestyle],
  },
  // --- SOLD ---
  {
    slug: "sold-mamilla-residence",
    title: "Mamilla Signature Residence",
    price: 16200000,
    type: "sale",
    neighborhood: "Mamilla",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 220,
    balcony: true,
    mamad: true,
    elevator: true,
    parking: true,
    description: "Sold off-market within three weeks.",
    images: [listing1],
    sold: true,
  },
  {
    slug: "sold-german-colony-townhouse",
    title: "German Colony Townhouse",
    price: 11800000,
    type: "sale",
    neighborhood: "German Colony",
    bedrooms: 5,
    bathrooms: 4,
    sqm: 260,
    balcony: true,
    mamad: true,
    elevator: false,
    parking: true,
    description: "Closed with an international buyer.",
    images: [listing2],
    sold: true,
  },
];

export const formatPrice = (p: number, type: "sale" | "rent", lang: "en" | "he" = "en") => {
  if (!p) return lang === "he" ? "מחיר לפי בקשה" : "Price on request";
  const n = new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US").format(p);
  if (type === "rent") return `₪${n}${lang === "he" ? " לחודש" : " / mo"}`;
  return `₪${n}`;
};

export const getListing = (slug: string) => LISTINGS.find((l) => l.slug === slug);
export const activeListings = () => LISTINGS.filter((l) => !l.sold);
export const soldListings = () => LISTINGS.filter((l) => l.sold);
export const featuredListings = () => LISTINGS.filter((l) => l.featured && !l.sold);