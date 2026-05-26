import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { soldListings, formatPrice } from "@/lib/listings";

export const Route = createFileRoute("/sold")({
  component: SoldPage,
});

function SoldPage() {
  const { t, lang } = useI18n();
  const items = soldListings();
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
        <div className="grid gap-10 sm:grid-cols-2">
          {items.map((l) => (
            <div key={l.slug} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img src={l.images[0]} alt={l.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[10px] uppercase tracking-[0.25em] bg-accent text-accent-foreground px-2 py-1">Sold</div>
              </div>
              <div className="pt-5">
                <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{l.neighborhood}</div>
                <div className="mt-1 font-display text-2xl">{l.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{l.bedrooms} BR · {l.sqm} m² · {formatPrice(l.price, l.type, lang)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
