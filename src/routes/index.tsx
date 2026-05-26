import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, ArrowRight, Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site";
import { featuredListings, NEIGHBORHOODS, type Listing } from "@/lib/listings";
import { PropertyCard } from "@/components/site/PropertyCard";
import {
  getFeaturedListings, getStats, getWhyJack,
  getTestimonials, getLifestyleContent, getContactBanner,
} from "@/lib/db";
import type {
  DbListing, StatItem, WhyItem, TestimonialItem,
  LifestyleContent, ContactBannerContent,
} from "@/lib/database.types";
import hero from "@/assets/hero-jerusalem.jpg";
import portrait from "@/assets/jack-photo.png";
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

const defaultStats: StatItem[] = [
  { value: "₪2B+", label: "In transactions" },
  { value: "150+", label: "Homes sold" },
  { value: "12+", label: "Years in Jerusalem" },
  { value: "100%", label: "Personal service" },
];
const defaultWhyJack: WhyItem[] = [
  { title: "Jerusalem native expertise", body: "Born here. Raised here. Connected to every neighborhood worth knowing." },
  { title: "Discreet, personal service", body: "Every client is handled directly — no juniors, no handoffs." },
  { title: "International reach", body: "Fluent service for Israeli and overseas buyers, in English and Hebrew." },
  { title: "Off-market access", body: "First call on properties that never reach a public listing." },
];
const defaultTestimonials: TestimonialItem[] = [
  { quote: "Jack found us a home we didn't know existed. Discreet, professional, and genuinely Jerusalem.", author: "S.K., New York" },
  { quote: "From first call to closing, he was three steps ahead. The only agent we'll ever use.", author: "Family R., Tel Aviv" },
  { quote: "Knows every stone in this city. We trusted him completely — and he delivered.", author: "D.L., London" },
];
const defaultLifestyle: LifestyleContent = { title: "A Jerusalem address is more than a home.", subtitle: "Stone-walled mornings, golden-hour terraces, and a city that has chosen its residents carefully for three thousand years." };
const defaultContactBanner: ContactBannerContent = { title: "Looking for something specific?", subtitle: "Tell Jack what you're searching for — he'll find it." };

type SiteData = {
  featured: DbListing[];
  stats: StatItem[];
  whyJack: WhyItem[];
  testimonials: TestimonialItem[];
  lifestyle: LifestyleContent;
  contactBanner: ContactBannerContent;
};

function useSiteData() {
  const [data, setData] = useState<SiteData>({
    featured: featuredListings().map(staticToDb),
    stats: defaultStats,
    whyJack: defaultWhyJack,
    testimonials: defaultTestimonials,
    lifestyle: defaultLifestyle,
    contactBanner: defaultContactBanner,
  });

  useEffect(() => {
    Promise.allSettled([
      getFeaturedListings(),
      getStats(),
      getWhyJack(),
      getTestimonials(),
      getLifestyleContent(),
      getContactBanner(),
    ]).then(([featured, stats, whyJack, testimonials, lifestyle, contactBanner]) => {
      setData({
        featured: featured.status === "fulfilled" && featured.value.length > 0 ? featured.value : featuredListings().map(staticToDb),
        stats: stats.status === "fulfilled" ? stats.value : defaultStats,
        whyJack: whyJack.status === "fulfilled" ? whyJack.value : defaultWhyJack,
        testimonials: testimonials.status === "fulfilled" ? testimonials.value : defaultTestimonials,
        lifestyle: lifestyle.status === "fulfilled" ? lifestyle.value : defaultLifestyle,
        contactBanner: contactBanner.status === "fulfilled" ? contactBanner.value : defaultContactBanner,
      });
    });
  }, []);

  return data;
}

function SectionHeader({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-12 sm:mb-16 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
          <div className="h-px w-8 bg-accent" />
          <div className="text-[10px] uppercase tracking-[0.35em] text-accent">{eyebrow}</div>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-2xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[95vh] w-full overflow-hidden">
      <img src={hero} alt="Jerusalem at golden hour" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/90" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 flex flex-col justify-end min-h-[95vh] pb-20 lg:pb-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-accent" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent">{t.hero.eyebrow}</span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-white">{t.hero.title}</h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-light">{t.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm text-white font-medium hover:bg-[#22c45e] transition-colors shadow-xl shadow-black/20 bg-[#3dab2c]">
              <MessageCircle className="size-4" /> {t.cta.whatsapp}
            </a>
            <a href={telLink} className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors">
              <Phone className="size-4" /> {t.cta.call}
            </a>
            <Link to="/listings" className="inline-flex items-center gap-2.5 h-13 px-7 rounded-sm border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors">
              {t.cta.viewAll} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex absolute bottom-16 right-8 items-end gap-4">
          <div className="text-right text-white/90">
            <div className="font-display text-xl leading-tight">{SITE.agentName}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent mt-1">Luxury Specialist</div>
          </div>
          <div className="relative w-20 h-28 lg:w-28 lg:h-40 overflow-hidden rounded-sm ring-1 ring-white/20">
            <img src={portrait} alt="Jack Freedman" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <div className="text-[9px] uppercase tracking-[0.3em]">Scroll</div>
        </div>
      </div>
    </section>
  );
}

function Stats({ items }: { items: StatItem[] }) {
  return (
    <section className="border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border/60">
          {items.map((s) => (
            <div key={s.label} className="text-center lg:px-8">
              <div className="font-display text-4xl sm:text-5xl text-foreground">{s.value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured({ items }: { items: DbListing[] }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="flex items-end justify-between gap-6 mb-14">
        <SectionHeader eyebrow="01 — Collection" title={t.featured.title} subtitle={t.featured.subtitle} />
        <Link to="/listings" className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors shrink-0 mb-1">
          {t.cta.viewAll} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => <PropertyCard key={l.slug} l={l} />)}
      </div>
      <div className="mt-10 sm:hidden">
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent">
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
            <Link key={n} to="/neighborhoods" className="group block relative overflow-hidden rounded-sm" style={{ aspectRatio: "3/4" }}>
              <div className="aspect-[3/4]">
                <img src={nbhdImages[n]} alt={n} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
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

function WhyJack({ items }: { items: WhyItem[] }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
            <img src={portrait} alt="Jack Freedman" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-[9px] uppercase tracking-[0.3em] text-accent">{SITE.brand}</div>
              <div className="font-display text-2xl mt-1">{SITE.agentName}</div>
              <div className="text-sm text-white/60 mt-0.5">Luxury Specialist · Jerusalem</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-sm hidden lg:block" />
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeader eyebrow="03 — The Agent" title={t.why.title} />
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item, idx) => (
              <div key={idx} className="border-t border-border pt-5">
                <div className="text-accent text-[10px] font-medium mb-2">0{idx + 1}</div>
                <div className="font-display text-lg mb-2">{item.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors">
            More about Jack <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }: { items: TestimonialItem[] }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <SectionHeader eyebrow="05 — Voices" title={t.testimonials.title} />
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((q, i) => (
          <figure key={i} className="group">
            <div className="flex gap-0.5 text-accent mb-5">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-3.5 fill-current" />)}
            </div>
            <blockquote className="font-display text-xl leading-snug text-foreground/90">"{q.quote}"</blockquote>
            <div className="mt-1 h-px w-full bg-border mt-6" />
            <figcaption className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">— {q.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function LifestyleSection({ content }: { content: LifestyleContent }) {
  return (
    <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
      <img src={lifestyle} alt="Luxury Jerusalem interior" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="relative z-10 h-full mx-auto max-w-7xl px-5 sm:px-8 flex items-center">
        <div className="max-w-lg text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-accent" />
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent">06 — Lifestyle</div>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl leading-tight">{content.title}</h2>
          <p className="mt-5 text-white/65 leading-relaxed">{content.subtitle}</p>
        </div>
      </div>
    </section>
  );
}

function ContactBanner({ content }: { content: ContactBannerContent }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground px-8 py-14 sm:px-16 sm:py-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4">Let's talk</div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-xl">{content.title}</h2>
            <p className="mt-5 text-primary-foreground/60 max-w-md leading-relaxed">{content.subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-sm text-white font-medium shadow-lg shadow-black/20 hover:bg-[#22c45e] transition-colors bg-[#3dab2c]">
              <MessageCircle className="size-4" /> {t.contactBanner.cta}
            </a>
            <a href={telLink} className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-sm border border-white/15 text-white hover:bg-white/5 transition-colors">
              <Phone className="size-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const data = useSiteData();
  return (
    <>
      <Hero />
      <Stats items={data.stats} />
      <Featured items={data.featured} />
      <Neighborhoods />
      <WhyJack items={data.whyJack} />
      <LifestyleSection content={data.lifestyle} />
      <Testimonials items={data.testimonials} />
      <ContactBanner content={data.contactBanner} />
    </>
  );
}
