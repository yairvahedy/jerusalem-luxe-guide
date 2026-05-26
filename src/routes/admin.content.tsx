import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Check, Loader2, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  getAllSiteContent, upsertSiteContent,
} from "@/lib/db";
import type {
  HeroContent, StatItem, WhyItem, TestimonialItem,
  LifestyleContent, ContactBannerContent, SiteInfo, AboutContent,
} from "@/lib/database.types";

export const Route = createFileRoute("/admin/content")({
  component: ContentEditor,
});

type SaveStatus = "idle" | "saving" | "saved" | "error";

function useSave(key: string) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const save = useCallback(async (value: unknown) => {
    setStatus("saving");
    try {
      await upsertSiteContent(key, value);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [key]);
  return { save, status };
}

function SaveBtn({ status, onClick }: { status: SaveStatus; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      className={`flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium transition-all min-w-[110px] justify-center ${
        status === "saved" ? "bg-green-600 text-white" :
        status === "error" ? "bg-red-600 text-white" :
        status === "saving" ? "bg-white/10 text-white/50 cursor-not-allowed" :
        "bg-white text-black hover:bg-white/90"
      }`}
    >
      {status === "saving" && <Loader2 className="size-4 animate-spin" />}
      {status === "saved" && <Check className="size-4" />}
      {status === "saved" ? "Saved!" : status === "error" ? "Error — retry" : status === "saving" ? "Saving…" : "Save changes"}
    </button>
  );
}

function Field({ label, value, onChange, multiline = false, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm resize-none leading-relaxed"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm"
        />
      )}
    </div>
  );
}

function Section({ title, emoji, children, defaultOpen = false }: {
  title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <span className="font-medium text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="size-4 text-white/40" /> : <ChevronDown className="size-4 text-white/40" />}
      </button>
      {open && <div className="px-5 pb-6 space-y-5 border-t border-white/[0.06] pt-5">{children}</div>}
    </div>
  );
}

function SiteInfoSection({ initial }: { initial: SiteInfo }) {
  const [data, setData] = useState(initial);
  const { save, status } = useSave("site_info");
  useEffect(() => { setData(initial); }, [initial]);
  const set = (k: keyof SiteInfo) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Section title="Contact Details" emoji="📞" defaultOpen>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Brand name" value={data.brand} onChange={set("brand")} />
        <Field label="Agent name" value={data.agent_name} onChange={set("agent_name")} />
        <Field label="Phone (display)" value={data.phone_display} onChange={(v) => { set("phone_display")(v); set("phone")(v); }} placeholder="+972 53-000-0000" />
        <Field label="WhatsApp number" value={data.whatsapp} onChange={set("whatsapp")} placeholder="972530000000 (no + or spaces)" />
        <Field label="Email" value={data.email} onChange={set("email")} />
        <Field label="Office address" value={data.address} onChange={set("address")} />
      </div>
      <Field label="Site tagline (footer)" value={data.tagline} onChange={set("tagline")} />
      <SaveBtn status={status} onClick={() => save(data)} />
    </Section>
  );
}

function StatsSection({ initial }: { initial: StatItem[] }) {
  const [items, setItems] = useState(initial);
  const { save, status } = useSave("stats");
  useEffect(() => { setItems(initial); }, [initial]);
  const update = (i: number, k: keyof StatItem, v: string) =>
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
  return (
    <Section title="Homepage Stats" emoji="📊">
      <div className="space-y-4">
        {items.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-white/[0.03] rounded-lg">
            <Field label="Number / value" value={s.value} onChange={(v) => update(i, "value", v)} placeholder="₪2B+" />
            <Field label="Label" value={s.label} onChange={(v) => update(i, "label", v)} placeholder="In transactions" />
          </div>
        ))}
      </div>
      <SaveBtn status={status} onClick={() => save(items)} />
    </Section>
  );
}

function HeroSection({ initial }: { initial: HeroContent }) {
  const [data, setData] = useState(initial);
  const { save, status } = useSave("hero");
  useEffect(() => { setData(initial); }, [initial]);
  const set = (k: keyof HeroContent) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Section title="Homepage Headline" emoji="✍️">
      <Field label="Eyebrow text (small tag above title)" value={data.eyebrow} onChange={set("eyebrow")} placeholder="Luxury Jerusalem Real Estate" />
      <Field label="Main title" value={data.title} onChange={set("title")} multiline placeholder="Where Jerusalem's most exceptional homes find their owners." />
      <Field label="Subtitle" value={data.subtitle} onChange={set("subtitle")} multiline placeholder="Private, curated, and personally guided by Jack Freedman." />
      <SaveBtn status={status} onClick={() => save(data)} />
    </Section>
  );
}

function WhyJackSection({ initial }: { initial: WhyItem[] }) {
  const [items, setItems] = useState(initial);
  const { save, status } = useSave("why_jack");
  useEffect(() => { setItems(initial); }, [initial]);
  const update = (i: number, k: keyof WhyItem, v: string) =>
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
  return (
    <Section title="Why Work With Jack (4 items)" emoji="💡">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-white/[0.03] rounded-lg space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-white/30">Point {i + 1}</div>
            <Field label="Title" value={item.title} onChange={(v) => update(i, "title", v)} />
            <Field label="Description" value={item.body} onChange={(v) => update(i, "body", v)} multiline />
          </div>
        ))}
      </div>
      <SaveBtn status={status} onClick={() => save(items)} />
    </Section>
  );
}

function TestimonialsSection({ initial }: { initial: TestimonialItem[] }) {
  const [items, setItems] = useState(initial);
  const { save, status } = useSave("testimonials");
  useEffect(() => { setItems(initial); }, [initial]);
  const update = (i: number, k: keyof TestimonialItem, v: string) =>
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
  const add = () => setItems((prev) => [...prev, { quote: "", author: "" }]);
  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  return (
    <Section title="Testimonials" emoji="💬">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-white/[0.03] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-widest text-white/30">Quote {i + 1}</div>
              {items.length > 1 && (
                <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
            <Field label="Quote" value={item.quote} onChange={(v) => update(i, "quote", v)} multiline placeholder="Jack found us a home we didn't know existed..." />
            <Field label="Attribution (name, city)" value={item.author} onChange={(v) => update(i, "author", v)} placeholder="S.K., New York" />
          </div>
        ))}
      </div>
      <button onClick={add} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors py-2">
        <Plus className="size-4" /> Add testimonial
      </button>
      <SaveBtn status={status} onClick={() => save(items)} />
    </Section>
  );
}

function LifestyleSection_({ initial }: { initial: LifestyleContent }) {
  const [data, setData] = useState(initial);
  const { save, status } = useSave("lifestyle");
  useEffect(() => { setData(initial); }, [initial]);
  const set = (k: keyof LifestyleContent) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Section title="Lifestyle Section" emoji="🏙️">
      <p className="text-xs text-white/30">This is the full-width photo section on the homepage with a large text overlay.</p>
      <Field label="Title" value={data.title} onChange={set("title")} multiline />
      <Field label="Subtitle / body text" value={data.subtitle} onChange={set("subtitle")} multiline />
      <SaveBtn status={status} onClick={() => save(data)} />
    </Section>
  );
}

function ContactBannerSection({ initial }: { initial: ContactBannerContent }) {
  const [data, setData] = useState(initial);
  const { save, status } = useSave("contact_banner");
  useEffect(() => { setData(initial); }, [initial]);
  const set = (k: keyof ContactBannerContent) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Section title="Get In Touch Banner" emoji="📩">
      <p className="text-xs text-white/30">The dark banner at the bottom of the homepage with the WhatsApp button.</p>
      <Field label="Title" value={data.title} onChange={set("title")} />
      <Field label="Subtitle" value={data.subtitle} onChange={set("subtitle")} />
      <SaveBtn status={status} onClick={() => save(data)} />
    </Section>
  );
}

function AboutSection({ initial }: { initial: AboutContent }) {
  const [data, setData] = useState(initial);
  const { save, status } = useSave("about");
  useEffect(() => { setData(initial); }, [initial]);
  const set = (k: keyof AboutContent) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Section title="About Page" emoji="👤">
      <Field label="Lead line (italic intro)" value={data.lead} onChange={set("lead")} multiline />
      <Field label="First paragraph" value={data.body1} onChange={set("body1")} multiline />
      <Field label="Second paragraph" value={data.body2} onChange={set("body2")} multiline />
      <SaveBtn status={status} onClick={() => save(data)} />
    </Section>
  );
}

const defaultHero: HeroContent = { eyebrow: "Luxury Jerusalem Real Estate", title: "Where Jerusalem's most exceptional homes find their owners.", subtitle: "Private, curated, and personally guided by Jack Freedman." };
const defaultStats: StatItem[] = [{ value: "₪2B+", label: "In transactions" }, { value: "150+", label: "Homes sold" }, { value: "12+", label: "Years in Jerusalem" }, { value: "100%", label: "Personal service" }];
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
const defaultSiteInfo: SiteInfo = { brand: "JF Realty", agent_name: "Jack Freedman", phone: "+972 53-398-5043", phone_display: "+972 53-398-5043", whatsapp: "972533985043", email: "jackfreedman2210@gmail.com", address: "Jerusalem, Israel", tagline: "Luxury Jerusalem real estate, personally guided." };
const defaultAbout: AboutContent = { lead: "Jerusalem's young luxury specialist — combining old-city instinct with modern service.", body1: "Jack Freedman represents a new generation of Jerusalem real estate.", body2: "His approach is personal, discreet, and uncompromising." };

function ContentEditor() {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [whyJack, setWhyJack] = useState<WhyItem[]>(defaultWhyJack);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(defaultTestimonials);
  const [lifestyle, setLifestyle] = useState<LifestyleContent>(defaultLifestyle);
  const [contactBanner, setContactBanner] = useState<ContactBannerContent>(defaultContactBanner);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(defaultSiteInfo);
  const [about, setAbout] = useState<AboutContent>(defaultAbout);

  useEffect(() => {
    getAllSiteContent().then((all) => {
      if (all.hero) setHero(all.hero as HeroContent);
      if (all.stats) setStats(all.stats as StatItem[]);
      if (all.why_jack) setWhyJack(all.why_jack as WhyItem[]);
      if (all.testimonials) setTestimonials(all.testimonials as TestimonialItem[]);
      if (all.lifestyle) setLifestyle(all.lifestyle as LifestyleContent);
      if (all.contact_banner) setContactBanner(all.contact_banner as ContactBannerContent);
      if (all.site_info) setSiteInfo(all.site_info as SiteInfo);
      if (all.about) setAbout(all.about as AboutContent);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto space-y-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-display text-white">Site Content</h1>
        <p className="text-sm text-white/40 mt-1">Edit each section and tap Save. Changes go live immediately.</p>
      </div>

      <SiteInfoSection initial={siteInfo} />
      <StatsSection initial={stats} />
      <HeroSection initial={hero} />
      <WhyJackSection initial={whyJack} />
      <TestimonialsSection initial={testimonials} />
      <LifestyleSection_ initial={lifestyle} />
      <ContactBannerSection initial={contactBanner} />
      <AboutSection initial={about} />
    </div>
  );
}
