import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Maximize2 } from "lucide-react";
import { formatPrice, type Listing } from "@/lib/listings";
import { useI18n } from "@/lib/i18n";

export function PropertyCard({ l }: { l: Listing }) {
  const { t, lang } = useI18n();
  return (
    <Link
      to="/listings/$slug"
      params={{ slug: l.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-sm bg-muted aspect-[4/3]">
        <img
          src={l.images[0]}
          alt={l.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-widest bg-background/90 backdrop-blur px-2 py-1 rounded-sm">
            {l.type === "sale" ? t.filters.sale : t.filters.rent}
          </span>
          {l.sold && (
            <span className="text-[10px] uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1 rounded-sm">
              Sold
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 rtl:left-3 rtl:right-3 text-white">
          <div className="font-display text-2xl leading-tight">{formatPrice(l.price, l.type, lang)}</div>
        </div>
      </div>
      <div className="pt-4 pb-1">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{l.neighborhood}</div>
        <h3 className="mt-1 font-display text-xl leading-snug group-hover:text-accent transition-colors">
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