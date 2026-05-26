import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, ArrowRight, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site";
import { featuredListings, soldListings, NEIGHBORHOODS } from "@/lib/listings";
import { PropertyCard } from "@/components/site/PropertyCard";
import hero from "@/assets/hero-jerusalem.jpg";
import portrait from "@/assets/jack-portrait.png";
import lifestyle from "@/assets/lifestyle.jpg";
import nbhdMamilla from "@/assets/nbhd-mamilla.jpg";
import nbhdGerman from "@/assets/nbhd-german.jpg";
import nbhdRehavia from "@/assets/nbhd-rehavia.jpg";
import nbhdTalbiya from "@/assets/nbhd-talbiya.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const nbhdImages: Record<string, string> = {
  "Mamilla": nbhdMamilla,
  "German Colony": nbhdGerman,
  "Rehavia": nbhdRehavia,
  "Talbiya": nbhdTalbiya,
  "Old Katamon": nbhdGerman,
  "City Center": nbhdMamilla,
};

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full overflow-hidden">
      <img src={hero} alt="Jerusalem at golden hour" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/85" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40 min-h-[92vh] lg:min-h-screen flex flex-col justify-end text-white">
        <div className="max-w-3xl fade-up">
          <div className="text-[11px] uppercase tracking-[0.35em] text-accent mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" /> {t.hero.eyebrow}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-[#25D366] text-white font-medium hover:scale-[1.02] transition-transform">
              <MessageCircle className="size-4" /> {t.cta.whatsapp}
            </a>
            <a href={telLink} className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-white text-primary font-medium hover:bg-accent transition-colors">
              <Phone className="size-4" /> {t.cta.call}
            </a>
            <Link to="/listings" className="inline-flex items-center gap-2 h-12 px-6 rounded-sm border border-white/30 text-white hover:bg-white/10 transition-colors">
              {t.cta.viewAll} <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex absolute bottom-12 right-8 rtl:right-auto rtl:left-8 items-end gap-4">
          <div className="text-right rtl:text-left text-white/90 max-w-[180px]">
            <div className="font-display text-lg leading-tight">{SITE.agentName}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-accent mt-1">Luxury Specialist</div>
          </div>
          <div className="relative w-24 h-32 lg:w-32 lg:h-44 overflow-hidden rounded-sm ring-1 ring-white/20">
            <img src={portrait} alt="Jack Freedman" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 sm:mb-14">
      {eyebrow && <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{eyebrow}</div>}
      <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-2xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground max-w-xl">{subtitle}</p>}
    </div>
  );
}

function Featured() {
  const { t } = useI18n();
  const items = featuredListings();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <SectionHeader eyebrow="01 — Collection" title={t.featured.title} subtitle={t.featured.subtitle} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => <PropertyCard key={l.slug} l={l} />)}
      </div>
      <div className="mt-12">
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/80 hover:text-accent">
          {t.cta.viewAll} <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

function Neighborhoods() {
  const { t } = useI18n();
  const list = NEIGHBORHOODS.slice(0, 4);
  return (
    <section className="bg-secondary/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeader eyebrow="02 — Address" title={t.neighborhoods.title} subtitle={t.neighborhoods.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((n) => (
            <Link key={n} to="/neighborhoods" className="group block relative aspect-[3/4] overflow-hidden rounded-sm">
              <img src={nbhdImages[n]} alt={n} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">Neighborhood</div>
                <div className="font-display text-2xl mt-1">{n}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyJack() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted order-2 lg:order-1">
          <img src={portrait} alt="Jack Freedman portrait" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{SITE.brand}</div>
            <div className="font-display text-2xl mt-1">{SITE.agentName}</div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">03 — The Agent</div>
          <h2 className="font-display text-3xl sm:text-5xl leading-tight">{t.why.title}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {t.why.items.map((i, idx) => (
              <div key={idx} className="border-t border-border pt-5">
                <div className="text-accent text-xs">0{idx + 1}</div>
                <div className="font-display text-xl mt-2">{i.t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/80 hover:text-accent">
            More about Jack <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SoldStrip() {
  const { t } = useI18n();
  const items = soldListings();
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">04 — Track record</div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight">{t.sold.title}</h2>
            <p className="mt-3 text-primary-foreground/60 max-w-md">{t.sold.subtitle}</p>
          </div>
          <Link to="/sold" className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent">
            All <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((l) => (
            <div key={l.slug} className="relative aspect-[16/10] overflow-hidden rounded-sm">
              <img src={l.images[0]} alt={l.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[10px] uppercase tracking-[0.25em] bg-accent text-accent-foreground px-2 py-1">Sold</div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{l.neighborhood}</div>
                <div className="font-display text-2xl mt-1">{l.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { t } = useI18n();
  const quotes = [
    { q: "Jack found us a home we didn't know existed. Discreet, professional, and genuinely Jerusalem.", a: "S.K., New York" },
    { q: "From first call to closing, he was three steps ahead. The only agent we'll ever use.", a: "Family R., Tel Aviv" },
    { q: "Knows every stone in this city. We trusted him completely — and he delivered.", a: "D.L., London" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <SectionHeader eyebrow="05 — Voices" title={t.testimonials.title} />
      <div className="grid gap-8 md:grid-cols-3">
        {quotes.map((q, i) => (
          <figure key={i} className="border-t border-border pt-8">
            <div className="flex gap-0.5 text-accent mb-4">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-3.5 fill-current" />)}
            </div>
            <blockquote className="font-display text-xl leading-snug">"{q.q}"</blockquote>
            <figcaption className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">— {q.a}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Lifestyle() {
  return (
    <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
      <img src={lifestyle} alt="Luxury Jerusalem interior" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 h-full mx-auto max-w-7xl px-5 sm:px-8 flex items-center">
        <div className="max-w-xl text-white">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">06 — Lifestyle</div>
          <h2 className="font-display text-3xl sm:text-5xl leading-tight">A Jerusalem address is more than a home.</h2>
          <p className="mt-4 text-white/75">Stone-walled mornings, golden-hour terraces, and a city that has chosen its residents carefully for three thousand years.</p>
        </div>
      </div>
    </section>
  );
}

function ContactBanner() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground p-10 sm:p-16">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-xl">{t.contactBanner.title}</h2>
            <p className="mt-4 text-primary-foreground/70 max-w-md">{t.contactBanner.subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-sm bg-[#25D366] text-white font-medium">
              <MessageCircle className="size-4" /> {t.contactBanner.cta}
            </a>
            <a href={telLink} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-sm border border-white/20 text-white">
              <Phone className="size-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <Featured />
      <Neighborhoods />
      <WhyJack />
      <SoldStrip />
      <Lifestyle />
      <Testimonials />
      <ContactBanner />
    </>
  );
}
