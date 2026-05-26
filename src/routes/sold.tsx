import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { soldListings, formatPrice, type Listing } from "@/lib/listings";
import { getSoldListings } from "@/lib/db";
import type { DbListing } from "@/lib/database.types";

export const Route = createFileRoute("/sold")({
  component: SoldPage,
});

function staticToDb(l: Listing): DbListing {
  return {
    id: l.slug, slug: l.slug, title: l.title, price: l.price,
    type: l.type, neighborhood: l.neighborhood, bedrooms: l.bedrooms,
    bathrooms: l.bathrooms, sqm: l.sqm, balcony: l.balcony,
    mamad: l.mamad, elevator: l.elevator, parking: l.parking,
    description: l.description ?? null, images: l.images,
    video_url: l.videoUrl ?? null,
    status: "sold" as const,
    featured: l.featured ?? false, agent_id: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
}

function formatDbPrice(price: number, type: "sale" | "rent", lang: "en" | "he" = "en") {
  if (!price) return lang === "he" ? "מחיר לפי בקשה" : "Price on request";
  const n = new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US").format(price);
  if (type === "rent") return `₪${n}${lang === "he" ? " לחודש" : " / mo"}`;
  return `₪${n}`;
}

function SoldPage() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<DbListing[]>(soldListings().map(staticToDb));

  useEffect(() => {
    getSoldListings().then((data) => {
      if (data.length > 0) setItems(data);
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">Track record</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.sold.title}</h1>
          <p className="mt-3 text-primary-foreground/70 max-w-lg">{t.sold.subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No sold properties yet.</div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2">
            {items.map((l) => (
              <div key={l.slug} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
                  {l.images[0] ? (
                    <img src={l.images[0]} alt={l.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">No image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[10px] uppercase tracking-[0.25em] bg-accent text-accent-foreground px-2 py-1">Sold</div>
                </div>
                <div className="pt-5">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{l.neighborhood}</div>
                  <div className="mt-1 font-display text-2xl">{l.title}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {l.bedrooms} BR · {l.sqm} m² · {formatDbPrice(l.price, l.type, lang)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
