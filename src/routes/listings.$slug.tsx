import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, BedDouble, Bath, Maximize2, Check, ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getListing, activeListings, type Listing } from "@/lib/listings";
import { getListingBySlug, getListings, getAgents } from "@/lib/db";
import { waLink, telLink, SITE } from "@/lib/site";
import { PropertyCard, formatDisplayPrice } from "@/components/site/PropertyCard";
import type { DbListing, Agent } from "@/lib/database.types";
import { useListingAgent } from "@/lib/listing-agent-context";

function staticToDb(l: Listing): DbListing {
  return {
    id: l.slug, slug: l.slug, title: l.title, price: l.price,
    type: l.type, neighborhood: l.neighborhood, bedrooms: l.bedrooms,
    bathrooms: l.bathrooms, sqm: l.sqm, balcony: l.balcony,
    mamad: l.mamad, elevator: l.elevator, parking: l.parking,
    storage: false, sukka_balcony: false, accessibility: false,
    renovated: false, furnished: false, air_conditioning: false,
    address: null, arnona: null,
    description: l.description ?? null, images: l.images,
    video_url: l.videoUrl ?? null,
    status: l.sold ? "sold" : "available",
    featured: l.featured ?? false, agent_id: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
}

export const Route = createFileRoute("/listings/$slug")({
  loader: async ({ params }) => {
    try {
      const listing = await getListingBySlug(params.slug);
      if (listing) return { listing };
    } catch {}
    const l = getListing(params.slug);
    if (!l) throw notFound();
    return { listing: staticToDb(l) };
  },
  component: ListingDetail,
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const [active, setActive] = useState(0);
  const [agent, setAgent] = useState<Agent | null>(null);
  const { setListingAgent } = useListingAgent();
  const [related, setRelated] = useState<DbListing[]>(
    activeListings().filter((x) => x.slug !== listing.slug).slice(0, 3).map(staticToDb)
  );

  useEffect(() => {
    getListings().then((data) => {
      const rel = data.filter((x) => x.slug !== listing.slug && x.status === "available").slice(0, 3);
      if (rel.length > 0) setRelated(rel);
    }).catch(() => {});

    if (listing.agent_id) {
      getAgents().then((agents) => {
        const found = agents.find((a) => a.id === listing.agent_id) ?? null;
        setAgent(found);
        setListingAgent(found);
      }).catch(() => {});
    }

    // Clear agent from layout when leaving this listing page
    return () => setListingAgent(null);
  }, [listing.slug, listing.agent_id]);

  const facts = [
    { i: BedDouble, k: t.listing.bedrooms, v: listing.bedrooms },
    { i: Bath, k: t.listing.bathrooms, v: listing.bathrooms },
    { i: Maximize2, k: t.listing.sqm, v: `${listing.sqm}m²` },
  ];

  // All amenity fields — only show the ones that are true (checked)
  const allFeatures = [
    { k: t.listing.balcony,     v: listing.balcony },
    { k: t.listing.mamad,       v: listing.mamad },
    { k: t.listing.elevator,    v: listing.elevator },
    { k: t.listing.parking,     v: listing.parking },
    { k: t.listing.storage,     v: (listing as any).storage },
    { k: t.listing.sukkaBalcony,v: (listing as any).sukka_balcony },
    { k: t.listing.accessibility,v: (listing as any).accessibility },
    { k: t.listing.renovated,   v: (listing as any).renovated },
    { k: t.listing.furnished,   v: (listing as any).furnished },
    { k: t.listing.airCon,      v: (listing as any).air_conditioning },
  ];
  const checkedFeatures = allFeatures.filter((f) => f.v);

  // Contact info — use assigned agent if available, fall back to Jack
  const agentFirstName = agent ? agent.name.split(" ")[0] : "Jack";
  const contactWaLink = agent?.whatsapp
    ? `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${agentFirstName}, I'd like more info about "${listing.title}".`)}`
    : waLink(`Hi Jack, I'd like more info about "${listing.title}".`);
  const contactTelLink = agent?.phone ? `tel:${agent.phone}` : telLink;

  const prev = () => setActive((a) => (a === 0 ? listing.images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === listing.images.length - 1 ? 0 : a + 1));

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-7 pb-2">
        <Link to="/listings" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="size-3.5" /> {t.nav.listings}
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-4 pb-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 xl:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[16/10] bg-muted rounded-sm overflow-hidden group">
              {listing.images[active] ? (
                <img src={listing.images[active]} alt={listing.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">No image</div>
              )}
              {listing.images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="size-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="size-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-sm">{active + 1} / {listing.images.length}</div>
                </>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {listing.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden rounded-sm transition-all ${i === active ? "ring-2 ring-accent ring-offset-1" : "opacity-60 hover:opacity-90"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-card border border-border/60 rounded-sm p-6 sm:p-7 space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{listing.neighborhood}</div>
                <h1 className="font-display text-3xl leading-tight">{listing.title}</h1>
                <div className="mt-3 font-display text-3xl text-foreground">
                  {formatDisplayPrice(listing.price, listing.type, lang)}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {listing.type === "sale" ? t.filters.sale : t.filters.rent}
                  {listing.status === "sold" && <span className="ml-2 text-accent">· Sold</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {facts.map((f) => (
                  <div key={f.k} className="border border-border/60 rounded-sm py-3.5 px-2 text-center bg-secondary/20">
                    <f.i className="size-4 mx-auto text-accent mb-1.5" />
                    <div className="text-base font-medium">{f.v}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{f.k}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <a href={contactWaLink} target="_blank" rel="noopener" className="flex items-center justify-center gap-2.5 h-13 rounded-sm bg-[#3dab2c] text-white font-medium hover:bg-[#22c45e] transition-colors shadow-md shadow-black/10">
                  <MessageCircle className="size-4" /> Contact {agentFirstName}
                </a>
                <a href={contactTelLink} className="flex items-center justify-center gap-2.5 h-13 rounded-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  <Phone className="size-4" /> {t.cta.call}
                </a>
              </div>

              {checkedFeatures.length > 0 && (
                <div className="border-t border-border/40 pt-5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{t.listing.facts}</div>
                  <dl className="space-y-2.5">
                    {checkedFeatures.map((f) => (
                      <div key={f.k} className="flex items-center justify-between text-sm">
                        <dt className="text-foreground/70">{f.k}</dt>
                        <dd><Check className="size-4 text-accent" /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Description + video */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 xl:gap-16">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">{t.listing.overview}</div>
            <p className="text-lg leading-relaxed text-foreground/80 max-w-2xl">{listing.description}</p>

            {listing.video_url && (
              <div className="mt-14">
                <div className="flex items-center gap-3 mb-5">
                  <Play className="size-4 text-accent" />
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{t.listing.tour}</div>
                </div>
                <div className="aspect-video rounded-sm overflow-hidden bg-muted shadow-xl">
                  <iframe src={listing.video_url} title="Video tour" className="w-full h-full" allowFullScreen />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Property details</div>
            <div className="space-y-0 border-t border-border/40">
              {[
                { label: "Type", value: listing.type === "sale" ? "For Sale" : "For Rent" },
                { label: "Neighborhood", value: listing.neighborhood },
                { label: "Bedrooms", value: listing.bedrooms },
                { label: "Bathrooms", value: listing.bathrooms },
                { label: "Area", value: `${listing.sqm} m²` },
                ...(agent ? [{ label: "Agent", value: agent.name }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3.5 border-b border-border/40 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
          <div className="border-t border-border/40 pt-12 mb-10">
            <h2 className="font-display text-3xl">{t.listing.related}</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => <PropertyCard key={l.slug} l={l} />)}
          </div>
        </section>
      )}
    </>
  );
}
