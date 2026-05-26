import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, User } from "lucide-react";
import { getAgents } from "@/lib/db";
import type { Agent } from "@/lib/database.types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/agents")({
  component: AgentsPage,
});

const STATIC_AGENTS: Agent[] = [
  { id: "1", name: "Jack Freedman", name_he: "ג'ק פרידמן", bio: "Jerusalem's luxury real estate specialist. Born and raised in Jerusalem, Jack brings unmatched local expertise and a deeply personal approach to every transaction.", phone: "+972 53-398-5043", whatsapp: "972533985043", email: "jackfreedman2210@gmail.com", portrait_url: null, slug: "jack-freedman", active: true, created_at: "" },
  { id: "2", name: "Yehuda Klein", name_he: "יהודה קליין", bio: "Specializes in residential sales across Jerusalem's finest neighborhoods with over a decade of experience.", phone: "+972 58-542-0333", whatsapp: "972585420333", email: "yehuda@jfrealty.co.il", portrait_url: null, slug: "yehuda-klein", active: true, created_at: "" },
  { id: "3", name: "Perla Goldenberg", name_he: "פרלה גולדנברג", bio: "Bringing warmth and expertise to every client search. Fluent in Hebrew, English, and French.", phone: "+972 52-578-2001", whatsapp: "972525782001", email: "perla@jfrealty.co.il", portrait_url: null, slug: "perla-goldenberg", active: true, created_at: "" },
  { id: "4", name: "Pinchas Liker", name_he: "פנחס לייקר", bio: "Focused on high-value properties and international clients seeking Jerusalem's most exclusive addresses.", phone: "+972 54-201-8974", whatsapp: "972542018974", email: "pinchas@jfrealty.co.il", portrait_url: null, slug: "pinchas-liker", active: true, created_at: "" },
  { id: "5", name: "Yair Aronstam", name_he: "יאיר ארונסתם", bio: "Expert in Jerusalem's rental market and investment properties. Known for fast closings and sharp negotiation.", phone: "+972 50-553-2889", whatsapp: "972505532889", email: "yair@jfrealty.co.il", portrait_url: null, slug: "yair-aronstam", active: true, created_at: "" },
];

function AgentsPage() {
  const { lang } = useI18n();
  const [agents, setAgents] = useState<Agent[]>(STATIC_AGENTS);

  useEffect(() => {
    getAgents().then((data) => {
      if (data.length > 0) setAgents(data);
    }).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/40 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-accent" />
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent">JF Realty</div>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight max-w-2xl">
            {lang === "he" ? "הצוות שלנו" : "Meet Our Team"}
          </h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-xl">
            {lang === "he"
              ? "מומחים אישיים לנדל\"ן יוקרה בירושלים — כל לקוח, כל נכס, שירות אמיתי."
              : "Personal luxury real estate specialists, each with deep Jerusalem roots and a commitment to exceptional service."}
          </p>
        </div>
      </section>

      {/* Agents grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} lang={lang} />
          ))}
        </div>
      </section>
    </>
  );
}

function AgentCard({ agent, lang }: { agent: Agent; lang: "en" | "he" }) {
  const waHref = agent.whatsapp
    ? `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${agent.name}, I'd like to discuss a property.`)}`
    : "#";
  const telHref = agent.phone ? `tel:${agent.phone.replace(/\s/g, "")}` : "#";

  return (
    <div className="group flex flex-col">
      {/* Portrait */}
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-secondary mb-6">
        {agent.portrait_url ? (
          <img
            src={agent.portrait_url}
            alt={agent.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-secondary/60">
            <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center">
              <User className="size-10 text-muted-foreground/40" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {lang === "he" ? "תמונה בקרוב" : "Photo coming soon"}
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="mb-1">
          <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">JF Realty Jerusalem</div>
          <h2 className="font-display text-2xl leading-tight">{agent.name}</h2>
          {agent.name_he && (
            <div className="text-base text-foreground/60 mt-0.5" dir="rtl">{agent.name_he}</div>
          )}
        </div>

        {agent.bio && (
          <p className="mt-3 text-sm text-foreground/65 leading-relaxed flex-1">{agent.bio}</p>
        )}

        {agent.phone && (
          <div className="mt-3 text-sm text-foreground/50">{agent.phone}</div>
        )}

        {/* CTAs */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-2 h-11 rounded-sm bg-[#3dab2c] text-white text-sm font-medium hover:bg-[#22c45e] transition-colors"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a
            href={telHref}
            className="flex items-center justify-center gap-2 h-11 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Phone className="size-4" />
            {lang === "he" ? "התקשרו" : "Call"}
          </a>
        </div>
      </div>
    </div>
  );
}
