import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { activeListings } from "@/lib/listings";
import nbhdMamilla from "@/assets/nbhd-mamilla.jpg";
import nbhdGerman from "@/assets/nbhd-german.jpg";
import nbhdRehavia from "@/assets/nbhd-rehavia.jpg";
import nbhdTalbiya from "@/assets/nbhd-talbiya.jpg";

export const Route = createFileRoute("/neighborhoods")({
  component: NeighborhoodsPage,
});

const NBHDS = [
  { name: "Mamilla", img: nbhdMamilla, desc: "At the gates of the Old City. Luxury retail, hotels, and addresses with views that no other city can offer." },
  { name: "German Colony", img: nbhdGerman, desc: "Tree-lined streets, restored Templar stone homes, and Jerusalem's most coveted family neighborhood." },
  { name: "Rehavia", img: nbhdRehavia, desc: "Bauhaus elegance and intellectual heritage. Walkable, central, and quietly prestigious." },
  { name: "Talbiya", img: nbhdTalbiya, desc: "Diplomats and dynasties. Stone villas, manicured gardens, and Jerusalem's most refined zip code." },
];

function NeighborhoodsPage() {
  const { t } = useI18n();
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">Address</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.nav.neighborhoods}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        {NBHDS.map((n, idx) => {
          const listings = activeListings().filter((l) => l.neighborhood === n.name).slice(0, 3);
          return (
            <article key={n.name} className={`grid gap-8 lg:gap-14 items-center lg:grid-cols-2 ${idx % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden rounded-sm">
                <img src={n.img} alt={n.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">0{idx + 1}</div>
                <h2 className="font-display text-3xl sm:text-5xl leading-tight">{n.name}</h2>
                <p className="mt-4 text-foreground/75 leading-relaxed max-w-md">{n.desc}</p>
                {listings.length > 0 && (
                  <ul className="mt-8 divide-y divide-border border-t border-border">
                    {listings.map((l) => (
                      <li key={l.slug}>
                        <Link to="/listings/$slug" params={{ slug: l.slug }} className="flex items-center justify-between py-4 group">
                          <span className="font-display text-lg group-hover:text-accent transition-colors">{l.title}</span>
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">{l.bedrooms} BR · {l.sqm} m²</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
