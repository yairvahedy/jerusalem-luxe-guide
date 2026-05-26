import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, BedDouble, Bath, Maximize2, Check, X, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getListing, formatPrice, activeListings } from "@/lib/listings";
import { waLink, telLink } from "@/lib/site";
import { PropertyCard } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/listings/$slug")({
  loader: ({ params }) => {
    const l = getListing(params.slug);
    if (!l) throw notFound();
    return { listing: l };
  },
  component: ListingDetail,
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const [active, setActive] = useState(0);
  const related = activeListings().filter((x) => x.slug !== listing.slug).slice(0, 3);

  const facts = [
    { i: BedDouble, k: t.listing.bedrooms, v: listing.bedrooms },
    { i: Bath, k: t.listing.bathrooms, v: listing.bathrooms },
    { i: Maximize2, k: t.listing.sqm, v: listing.sqm },
  ];
  const features: { k: string; v: boolean }[] = [
    { k: t.listing.balcony, v: listing.balcony },
    { k: t.listing.mamad, v: listing.mamad },
    { k: t.listing.elevator, v: listing.elevator },
    { k: t.listing.parking, v: listing.parking },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-8">
        <Link to="/listings" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
          <ArrowLeft className="size-3.5 rtl:rotate-180" /> {t.nav.listings}
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="relative aspect-[16/10] bg-muted rounded-sm overflow-hidden">
              <img src={listing.images[active]} alt={listing.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            {listing.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {listing.images.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden rounded-sm ${i === active ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 self-start space-y-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent">{listing.neighborhood}</div>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl leading-tight">{listing.title}</h1>
              <div className="mt-3 font-display text-2xl text-foreground">{formatPrice(listing.price, listing.type, lang)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {facts.map((f) => (
                <div key={f.k} className="border border-border rounded-sm py-3">
                  <f.i className="size-4 mx-auto text-accent" />
                  <div className="mt-2 text-sm font-medium">{f.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.k}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <a href={waLink(`Hi Jack, I'd like more info about "${listing.title}".`)} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 h-12 rounded-sm bg-[#25D366] text-white font-medium">
                <MessageCircle className="size-4" /> {t.listing.inquire}
              </a>
              <a href={telLink} className="flex items-center justify-center gap-2 h-12 rounded-sm bg-primary text-primary-foreground font-medium">
                <Phone className="size-4" /> {t.cta.call}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid lg:grid-cols-[1fr_320px] gap-12">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{t.listing.overview}</div>
          <p className="text-lg leading-relaxed text-foreground/85 max-w-2xl">{listing.description}</p>
          {listing.videoUrl && (
            <div className="mt-12">
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{t.listing.tour}</div>
              <div className="aspect-video rounded-sm overflow-hidden bg-muted">
                <iframe src={listing.videoUrl} title="Video tour" className="w-full h-full" allowFullScreen />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{t.listing.facts}</div>
          <dl className="divide-y divide-border border-y border-border">
            {features.map((f) => (
              <div key={f.k} className="flex items-center justify-between py-3 text-sm">
                <dt>{f.k}</dt>
                <dd>{f.v ? <Check className="size-4 text-accent" /> : <X className="size-4 text-muted-foreground" />}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <h2 className="font-display text-2xl sm:text-3xl mb-8">{t.listing.related}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((l) => <PropertyCard key={l.slug} l={l} />)}
        </div>
      </section>
    </>
  );
}
