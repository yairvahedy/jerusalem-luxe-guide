import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Maximize2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { DbListing } from "@/lib/database.types";
import type { Listing } from "@/lib/listings";

type CardListing = DbListing | Listing;

function isDbListing(l: CardListing): l is DbListing {
  return "status" in l;
}

function getImages(l: CardListing): string[] {
  if (isDbListing(l)) return l.images ?? [];
  return l.images ?? [];
}

function getPrice(l: CardListing): number {
  return l.price ?? 0;
}

function getType(l: CardListing): "sale" | "rent" {
  return l.type ?? "sale";
}

function getSold(l: CardListing): boolean {
  if (isDbListing(l)) return l.status === "sold";
  return l.sold ?? false;
}

function getFeatured(l: CardListing): boolean {
  return l.featured ?? false;
}

export function formatDisplayPrice(price: number, type: "sale" | "rent", lang: "en" | "he" = "en") {
  if (!price) return lang === "he" ? "מחיר לפי בקשה" : "Price on request";
  const n = new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US").format(price);
  if (type === "rent") return `₪${n}${lang === "he" ? " לחודש" : " / mo"}`;
  return `₪${n}`;
}

export function PropertyCard({ l }: { l: CardListing }) {
  const { lang, t } = useI18n();
  const images = getImages(l);
  const sold = getSold(l);
  const featured = getFeatured(l);
  const img = images[0];

  return (
    <Link
      to="/listings/$slug"
      params={{ slug: l.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-sm bg-muted aspect-[4/3]">
        {img ? (
          <img
            src={img}
            alt={l.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">No image</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex gap-1.5">
          {featured && !sold && (
            <span className="text-[9px] uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1 rounded-sm font-medium">
              Featured
            </span>
          )}
          {sold ? (
            <span className="text-[9px] uppercase tracking-widest bg-foreground text-background px-2 py-1 rounded-sm">
              Sold
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-widest bg-background/80 backdrop-blur px-2 py-1 rounded-sm">
              {getType(l) === "sale" ? t.filters.sale : t.filters.rent}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <div className="font-display text-white text-2xl leading-tight drop-shadow-sm">
            {formatDisplayPrice(getPrice(l), getType(l), lang)}
          </div>
        </div>
      </div>

      <div className="pt-4 pb-1">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{l.neighborhood}</div>
        <h3 className="mt-1.5 font-display text-xl leading-snug group-hover:text-accent transition-colors duration-300">
          {l.title}
        </h3>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><BedDouble className="size-3.5" />{l.bedrooms}</span>
          <span className="inline-flex items-center gap-1.5"><Bath className="size-3.5" />{l.bathrooms}</span>
          <span className="inline-flex items-center gap-1.5"><Maximize2 className="size-3.5" />{l.sqm} {t.listing.sqm}</span>
        </div>
      </div>
    </Link>
  );
}
