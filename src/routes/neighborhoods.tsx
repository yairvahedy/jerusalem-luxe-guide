import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { getNeighborhoods, getListings } from "@/lib/db";
import type { Neighborhood, DbListing } from "@/lib/database.types";
import nbhdMamilla from "@/assets/nbhd-mamilla.jpg";
import nbhdGerman from "@/assets/nbhd-german.jpg";
import nbhdRehavia from "@/assets/nbhd-rehavia.jpg";
import nbhdTalbiya from "@/assets/nbhd-talbiya.jpg";

export const Route = createFileRoute("/neighborhoods")({
  component: NeighborhoodsPage,
});

const localImages: Record<string, string> = {
  Mamilla: nbhdMamilla,
  "German Colony": nbhdGerman,
  Rehavia: nbhdRehavia,
  Talbiya: nbhdTalbiya,
  "Old Katamon": nbhdGerman,
  "City Center": nbhdMamilla,
};

const staticNbhds: Neighborhood[] = [
  { id: "1", name: "Mamilla", slug: "mamilla", description: "At the gates of the Old City. Luxury retail, hotels, and addresses with views that no other city can offer.", image_url: null, display_order: 1, active: true, created_at: "" },
  { id: "2", name: "German Colony", slug: "german-colony", description: "Tree-lined streets, restored Templar stone homes, and Jerusalem's most coveted family neighborhood.", image_url: null, display_order: 2, active: true, created_at: "" },
  { id: "3", name: "Rehavia", slug: "rehavia", description: "Bauhaus elegance and intellectual heritage. Walkable, central, and quietly prestigious.", image_url: null, display_order: 3, active: true, created_at: "" },
  { id: "4", name: "Talbiya", slug: "talbiya", description: "Diplomats and dynasties. Stone villas, manicured gardens, and Jerusalem's most refined zip code.", image_url: null, display_order: 4, active: true, created_at: "" },
];

function NeighborhoodsPage() {
  const { t } = useI18n();
  const [nbhds, setNbhds] = useState<Neighborhood[]>(staticNbhds);
  const [listings, setListings] = useState<DbListing[]>([]);

  useEffect(() => {
    getNeighborhoods().then(setNbhds).catch(() => {});
    getListings().then(setListings).catch(() => {});
  }, []);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">Address</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.nav.neighborhoods}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        {nbhds.map((n, idx) => {
          const nbhdListings = listings
            .filter((l) => l.neighborhood === n.name && l.status === "available")
            .slice(0, 3);
          const imgSrc = n.image_url || localImages[n.name] || nbhdMamilla;
          return (
            <article key={n.id} className={`grid gap-8 lg:gap-14 items-center lg:grid-cols-2 ${idx % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden rounded-sm">
                <img src={imgSrc} alt={n.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">0{idx + 1}</div>
                <h2 className="font-display text-3xl sm:text-5xl leading-tight">{n.name}</h2>
                <p className="mt-4 text-foreground/75 leading-relaxed max-w-md">{n.description}</p>
                {nbhdListings.length > 0 && (
                  <ul className="mt-8 divide-y divide-border border-t border-border">
                    {nbhdListings.map((l) => (
                      <li key={l.slug}>
                        <Link to="/listings/$slug" params={{ slug: l.slug }} className="flex items-center justify-between py-4 group">
                          <span className="font-display text-lg group-hover:text-accent transition-colors">{l.title}</span>
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">{l.bedrooms} BR · {l.sqm} m²</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8">
                  <Link to="/listings" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors">
                    View listings in {n.name}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
