import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, ArrowRight, Star, MapPin } from "lucide-react";
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
  Mamilla: nbhdMamilla,
  "German Colony": nbhdGerman,
  Rehavia: nbhdRehavia,
  Talbiya: nbhdTalbiya,
  "Old Katamon": nbhdGerman,
  "City Center": nbhdMamilla,
};

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[95vh] w-full overflow-hidden">
      <img
        src={hero}
        alt="Jerusalem at golden hour"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/90" />

      {/* Subtle top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 flex flex-col justify-end min-h-[95vh] pb-20 lg:pb-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-accent" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent">{t.hero.eyebrow}</span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-white">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-light">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm text-white font-medium hover:bg-[#22c45e] transition-colors shadow-xl shadow-black/20 bg-[#3dab2c]"
            >
              <MessageCircle className="size-4" /> {t.cta.whatsapp}
            </a>
            <a
              href={telLink}
              className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="size-4" /> {t.cta.call}
            </a>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
            >
              {t.cta.viewAll} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Agent card — desktop */}
        <div className="hidden md:flex absolute bottom-16 right-8 items-end gap-4">
          <div className="text-right text-white/90">
            <div className="font-display text-xl leading-tight">{SITE.agentName}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent mt-1">Luxury Specialist</div>
          </div>
          <div className="relative w-20 h-28 lg:w-28 lg:h-40 overflow-hidden rounded-sm ring-1 ring-white/20">
            <img src={portrait} alt="Jack Freedman" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <div className="text-[9px] uppercase tracking-[0.3em]">Scroll</div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 sm:mb-16 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
          <div className="h-px w-8 bg-accent" />
          <div className="text-[10px] uppercase tracking-[0.35em] text-accent">{eyebrow}</div>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-2xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function Featured() {
  const { t } = useI18n();
  const items = featuredListings();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="flex items-end justify-between gap-6 mb-14">
        <SectionHeader eyebrow="01 — Collection" title={t.featured.title} subtitle={t.featured.subtitle} />
        <Link
          to="/listings"
          className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors shrink-0 mb-1"
        >
          {t.cta.viewAll} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => (
          <PropertyCard key={l.slug} l={l} />
        ))}
      </div>
      <div className="mt-10 sm:hidden">
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent"
        >
          {t.cta.viewAll} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Neighborhoods() {
  const { t } = useI18n();
  const list = NEIGHBORHOODS.slice(0, 4);
  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <SectionHeader eyebrow="02 — Address" title={t.neighborhoods.title} subtitle={t.neighborhoods.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((n, i) => (
            <Link
              key={n}
              to="/neighborhoods"
              className="group block relative overflow-hidden rounded-sm"
              style={{ aspectRatio: i === 0 || i === 3 ? "3/4" : "3/4" }}
            >
              <div className="aspect-[3/4]">
                <img
                  src={nbhdImages[n]}
                  alt={n}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="size-3 text-accent" />
                    <div className="text-[9px] uppercase tracking-[0.3em] text-accent">Jerusalem</div>
                  </div>
                  <div className="font-display text-2xl">{n}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: "₪2B+", l: "In transactions" },
    { n: "150+", l: "Homes sold" },
    { n: "12+", l: "Years in Jerusalem" },
    { n: "100%", l: "Personal service" },
  ];
  return (
    <section className="border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border/60">
          {stats.map((s) => (
            <div key={s.l} className="text-center lg:px-8">
              <div className="font-display text-4xl sm:text-5xl text-foreground">{s.n}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyJack() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
            <img
              src={portrait}
              alt="Jack Freedman"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-[9px] uppercase tracking-[0.3em] text-accent">{SITE.brand}</div>
              <div className="font-display text-2xl mt-1">{SITE.agentName}</div>
              <div className="text-sm text-white/60 mt-0.5">Luxury Specialist · Jerusalem</div>
            </div>
          </div>
          {/* Floating accent */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-sm hidden lg:block" />
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeader eyebrow="03 — The Agent" title={t.why.title} />
          <div className="grid gap-6 sm:grid-cols-2">
            {t.why.items.map((item, idx) => (
              <div key={idx} className="border-t border-border pt-5">
                <div className="text-accent text-[10px] font-medium mb-2">0{idx + 1}</div>
                <div className="font-display text-lg mb-2">{item.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors"
          >
            More about Jack <ArrowRight className="size-4" />
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
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <div className="flex items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <div className="text-[10px] uppercase tracking-[0.35em] text-accent">04 — Track record</div>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight">{t.sold.title}</h2>
            <p className="mt-4 text-primary-foreground/50 max-w-md">{t.sold.subtitle}</p>
          </div>
          <Link
            to="/sold"
            className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            All <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((l) => (
            <div key={l.slug} className="group relative aspect-[16/9] overflow-hidden rounded-sm bg-white/5">
              {l.images[0] ? (
                <img
                  src={l.images[0]}
                  alt={l.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.3em] bg-accent text-accent-foreground px-2.5 py-1 rounded-sm">
                Sold
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-[9px] uppercase tracking-[0.25em] text-accent">{l.neighborhood}</div>
                <div className="font-display text-2xl mt-1">{l.title}</div>
                <div className="mt-1 text-sm text-white/50">₪{new Intl.NumberFormat("en-US").format(l.price)}</div>
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
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <SectionHeader eyebrow="05 — Voices" title={t.testimonials.title} />
      <div className="grid gap-8 md:grid-cols-3">
        {quotes.map((q, i) => (
          <figure key={i} className="group">
            <div className="flex gap-0.5 text-accent mb-5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="size-3.5 fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-xl leading-snug text-foreground/90">
              "{q.q}"
            </blockquote>
            <div className="mt-1 h-px w-full bg-border mt-6" />
            <figcaption className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">
              — {q.a}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function LifestyleSection() {
  return (
    <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
      <img
        src={lifestyle}
        alt="Luxury Jerusalem interior"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="relative z-10 h-full mx-auto max-w-7xl px-5 sm:px-8 flex items-center">
        <div className="max-w-lg text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-accent" />
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent">06 — Lifestyle</div>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl leading-tight">
            A Jerusalem address is more than a home.
          </h2>
          <p className="mt-5 text-white/65 leading-relaxed">
            Stone-walled mornings, golden-hour terraces, and a city that has chosen its residents carefully for three thousand years.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactBanner() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground px-8 py-14 sm:px-16 sm:py-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4">Let's talk</div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-xl">{t.contactBanner.title}</h2>
            <p className="mt-5 text-primary-foreground/60 max-w-md leading-relaxed">{t.contactBanner.subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-sm text-white font-medium shadow-lg shadow-black/20 hover:bg-[#22c45e] transition-colors bg-[#3dab2c]"
            >
              <MessageCircle className="size-4" /> {t.contactBanner.cta}
            </a>
            <a
              href={telLink}
              className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-sm border border-white/15 text-white hover:bg-white/5 transition-colors"
            >
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
      <Stats />
      <Featured />
      <Neighborhoods />
      <WhyJack />
      <SoldStrip />
      <LifestyleSection />
      <Testimonials />
      <ContactBanner />
    </>
  );
}
