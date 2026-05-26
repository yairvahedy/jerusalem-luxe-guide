import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { activeListings, type Listing } from "@/lib/listings";
import { getListings, getNeighborhoods } from "@/lib/db";
import { PropertyCard } from "@/components/site/PropertyCard";
import type { DbListing } from "@/lib/database.types";

export const Route = createFileRoute("/listings/")({
  validateSearch: (search) => ({
    neighborhood: typeof search.neighborhood === "string" ? search.neighborhood : "",
  }),
  component: ListingsPage,
});

function staticToDb(l: Listing): DbListing {
  return {
    id: l.slug, slug: l.slug, title: l.title, price: l.price,
    type: l.type, neighborhood: l.neighborhood, bedrooms: l.bedrooms,
    bathrooms: l.bathrooms, sqm: l.sqm, balcony: l.balcony,
    mamad: l.mamad, elevator: l.elevator, parking: l.parking,
    description: l.description ?? null, images: l.images,
    video_url: l.videoUrl ?? null,
    status: l.sold ? "sold" : "available",
    featured: l.featured ?? false, agent_id: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
}

function ListingsPage() {
  const { t } = useI18n();
  const { neighborhood: searchNeighborhood } = Route.useSearch();

  const [allListings, setAllListings] = useState<DbListing[]>(activeListings().map(staticToDb));
  const [dbNeighborhoods, setDbNeighborhoods] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [nbhd, setNbhd] = useState<string>(searchNeighborhood ?? "");
  const [beds, setBeds] = useState<string>("");
  const [baths, setBaths] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(!!searchNeighborhood);

  // Sync nbhd state when URL search param changes (e.g. back/forward navigation)
  useEffect(() => {
    setNbhd(searchNeighborhood ?? "");
    if (searchNeighborhood) setFiltersOpen(true);
  }, [searchNeighborhood]);

  useEffect(() => {
    getListings().then((data) => {
      const available = data.filter((l) => l.status === "available");
      if (available.length > 0) setAllListings(available);
    }).catch(() => {});

    // Load all DB neighborhoods so the dropdown always has the full list
    getNeighborhoods().then((nbhds) => {
      setDbNeighborhoods(nbhds.map((n) => n.name));
    }).catch(() => {});
  }, []);

  // Merge: neighborhoods from DB + neighborhoods from listings + current selection
  // (current selection included so the dropdown always shows the right value even before DB loads)
  const neighborhoods = useMemo(() => {
    const fromListings = allListings.map((l) => l.neighborhood);
    const current = nbhd ? [nbhd] : [];
    return [...new Set([...dbNeighborhoods, ...fromListings, ...current])].sort();
  }, [allListings, dbNeighborhoods, nbhd]);

  const items = useMemo(() => {
    return allListings.filter((l) => {
      if (q && !(`${l.title} ${l.neighborhood}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (nbhd && l.neighborhood !== nbhd) return false;
      if (beds && l.bedrooms < Number(beds)) return false;
      if (baths && l.bathrooms < Number(baths)) return false;
      if (type && l.type !== type) return false;
      return true;
    });
  }, [allListings, q, nbhd, beds, baths, type]);

  const clearAll = () => { setQ(""); setNbhd(""); setBeds(""); setBaths(""); setType(""); };
  const hasFilters = q || nbhd || beds || baths || type;

  const nbhdOptions = [{ v: "", l: t.filters.all }, ...neighborhoods.map((n) => ({ v: n, l: n }))];

  return (
    <>
      <section className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-accent" />
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent">Collection</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.nav.listings}</h1>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{items.length}</span> {t.filters.results}
            </div>
          </div>
        </div>
      </section>

      {/* Desktop filters */}
      <section className="hidden lg:block sticky top-[80px] z-30 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <label className="relative flex-1 max-w-xs">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.filters.search} className="w-full h-10 pl-10 pr-3 bg-secondary/50 border border-border/60 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
            </label>
            <FilterSelect value={nbhd} onChange={setNbhd} label={t.filters.neighborhood} options={nbhdOptions} />
            <FilterSelect value={beds} onChange={setBeds} label={t.filters.beds} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4,5].map((n) => ({ v: String(n), l: `${n}+` }))]} />
            <FilterSelect value={baths} onChange={setBaths} label={t.filters.baths} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4].map((n) => ({ v: String(n), l: `${n}+` }))]} />
            <FilterSelect value={type} onChange={setType} label={t.filters.type} options={[{ v: "", l: t.filters.all }, { v: "sale", l: t.filters.sale }, { v: "rent", l: t.filters.rent }]} />
            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <X className="size-3.5" /> {t.filters.clear}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter */}
      <section className="lg:hidden px-5 py-4 border-b border-border/40 bg-background/95">
        <div className="flex gap-3">
          <label className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full h-11 pl-10 pr-3 bg-secondary/50 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </label>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 h-11 px-4 rounded-sm border text-sm transition-colors ${hasFilters ? "border-accent text-accent bg-accent/5" : "border-border"}`}>
            <SlidersHorizontal className="size-4" />
            {hasFilters ? "Filtered" : "Filter"}
          </button>
        </div>
        {filtersOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <FilterSelect value={nbhd} onChange={setNbhd} label={t.filters.neighborhood} options={nbhdOptions} />
            <FilterSelect value={type} onChange={setType} label={t.filters.type} options={[{ v: "", l: t.filters.all }, { v: "sale", l: t.filters.sale }, { v: "rent", l: t.filters.rent }]} />
            <FilterSelect value={beds} onChange={setBeds} label={t.filters.beds} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4,5].map((n) => ({ v: String(n), l: `${n}+` }))]} />
            <FilterSelect value={baths} onChange={setBaths} label={t.filters.baths} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4].map((n) => ({ v: String(n), l: `${n}+` }))]} />
            {hasFilters && (
              <button onClick={clearAll} className="col-span-2 flex items-center justify-center gap-2 h-11 text-sm border border-border rounded-sm text-muted-foreground">
                <X className="size-4" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-display text-2xl text-muted-foreground mb-3">No listings found</div>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters</p>
            <button onClick={clearAll} className="text-sm uppercase tracking-widest text-accent hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((l) => <PropertyCard key={l.slug} l={l} />)}
          </div>
        )}
      </section>
    </>
  );
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: { v: string; l: string }[] }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 bg-secondary/50 border border-border/60 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer">
        <option value="" disabled hidden>{label}</option>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
