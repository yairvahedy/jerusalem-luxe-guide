import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { activeListings, NEIGHBORHOODS } from "@/lib/listings";
import { PropertyCard } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/listings/")({
  component: ListingsPage,
});

function ListingsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [nbhd, setNbhd] = useState<string>("");
  const [beds, setBeds] = useState<string>("");
  const [baths, setBaths] = useState<string>("");
  const [type, setType] = useState<string>("");

  const items = useMemo(() => {
    return activeListings().filter((l) => {
      if (q && !(`${l.title} ${l.neighborhood}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (nbhd && l.neighborhood !== nbhd) return false;
      if (beds && l.bedrooms < Number(beds)) return false;
      if (baths && l.bathrooms < Number(baths)) return false;
      if (type && l.type !== type) return false;
      return true;
    });
  }, [q, nbhd, beds, baths, type]);

  const clearAll = () => { setQ(""); setNbhd(""); setBeds(""); setBaths(""); setType(""); };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">Collection</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.nav.listings}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <label className="lg:col-span-2 relative">
            <Search className="size-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.filters.search} className="w-full h-11 pl-10 rtl:pl-3 rtl:pr-10 pr-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </label>
          <Select value={nbhd} onChange={setNbhd} label={t.filters.neighborhood} options={[{ v: "", l: t.filters.all }, ...NEIGHBORHOODS.map((n) => ({ v: n, l: n }))]} />
          <Select value={beds} onChange={setBeds} label={t.filters.beds} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4,5].map((n) => ({ v: String(n), l: `${n}+` }))]} />
          <Select value={baths} onChange={setBaths} label={t.filters.baths} options={[{ v: "", l: t.filters.all }, ...[1,2,3,4].map((n) => ({ v: String(n), l: `${n}+` }))]} />
          <Select value={type} onChange={setType} label={t.filters.type} options={[{ v: "", l: t.filters.all }, { v: "sale", l: t.filters.sale }, { v: "rent", l: t.filters.rent }]} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div>{items.length} {t.filters.results}</div>
          <button onClick={clearAll} className="uppercase tracking-widest hover:text-accent">{t.filters.clear}</button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => <PropertyCard key={l.slug} l={l} />)}
        </div>
      </section>
    </>
  );
}

function Select({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: { v: string; l: string }[] }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-11 px-3 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent">
        <option value="" disabled hidden>{label}</option>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
