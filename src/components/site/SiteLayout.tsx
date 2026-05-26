import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, MessageCircle, Languages, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site";
import { useListingAgent } from "@/lib/listing-agent-context";
import logo from "@/assets/jf-logo.jpeg";

function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const isAdmin = router.location.pathname.startsWith("/admin");
  const { listingAgent } = useListingAgent();

  const agentFirstName = listingAgent ? listingAgent.name.split(" ")[0] : null;
  const activeWaLink = listingAgent?.whatsapp
    ? `https://wa.me/${listingAgent.whatsapp}?text=${encodeURIComponent(`Hi ${agentFirstName}, I'd like more info about a property.`)}`
    : waLink();
  const activeTelLink = listingAgent?.phone ? `tel:${listingAgent.phone}` : telLink;
  const activePhoneDisplay = listingAgent?.phone ?? SITE.phoneDisplay;

  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/listings", label: t.nav.listings },
    { to: "/neighborhoods", label: t.nav.neighborhoods },
    { to: "/agents", label: lang === "he" ? "סוכנים" : "Agents" },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/90 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="JF Realty" className="h-9 w-9 rounded-sm object-cover" />
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide">JF Realty</div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Jerusalem</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[13px] tracking-wide text-foreground/70 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLang(lang === "en" ? "he" : "en")}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors px-2 py-1.5"
            aria-label="Switch language"
          >
            <Languages className="size-3.5" /> {lang === "en" ? "עב" : "EN"}
          </button>
          <a
            href={activeWaLink}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white hover:bg-[#22c45e] px-4 py-2 rounded-sm transition-colors bg-[#3dab2c]"
          >
            <MessageCircle className="size-3.5" /> {agentFirstName ? `WhatsApp ${agentFirstName}` : "WhatsApp"}
          </a>
          <a
            href={activeTelLink}
            className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-widest border border-border hover:border-foreground/40 px-4 py-2 rounded-sm transition-colors"
          >
            <Phone className="size-3.5" /> {activePhoneDisplay}
          </a>
          <button className="lg:hidden p-2 -mr-1" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md">
          <nav className="flex flex-col px-5 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-[15px] border-b border-border/40 last:border-0 text-foreground/80"
                activeProps={{ className: "text-foreground font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
            <div className="pt-5 pb-2 flex gap-3">
              <a href={activeWaLink} target="_blank" rel="noopener"
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#3dab2c] text-white rounded-sm text-sm font-medium hover:bg-[#22c45e] transition-colors">
                <MessageCircle className="size-4" /> {agentFirstName ? `WhatsApp ${agentFirstName}` : "WhatsApp"}
              </a>
              <a href={activeTelLink}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground rounded-sm text-sm font-medium">
                <Phone className="size-4" /> Call
              </a>
            </div>
            <button
              onClick={() => { setLang(lang === "en" ? "he" : "en"); setOpen(false); }}
              className="mt-2 mb-3 text-sm uppercase tracking-widest text-accent self-start"
            >
              {lang === "en" ? "עברית" : "English"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { t, lang } = useI18n();
  const router = useRouterState();
  const isAdmin = router.location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className="mt-32 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="" className="h-10 w-10 rounded-sm opacity-90" />
            <div>
              <div className="font-display text-xl">JF Realty</div>
              <div className="text-[9px] uppercase tracking-[0.3em] opacity-50">Jerusalem</div>
            </div>
          </div>
          <p className="text-sm opacity-60 max-w-sm leading-relaxed">{t.footer.tagline}</p>
          <div className="mt-8 flex gap-3">
            <a href={waLink()} target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <span className="opacity-20">·</span>
            <a href={telLink} className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-40 mb-5">Contact</div>
          <ul className="space-y-3 text-sm">
            <li><a className="opacity-70 hover:opacity-100 transition-opacity" href={telLink}>{SITE.phoneDisplay}</a></li>
            <li><a className="opacity-70 hover:opacity-100 transition-opacity" href={waLink()}>WhatsApp</a></li>
            <li><a className="opacity-70 hover:opacity-100 transition-opacity" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="opacity-50">{SITE.address}</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-40 mb-5">Navigate</div>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/listings", label: t.nav.listings },
              { to: "/neighborhoods", label: t.nav.neighborhoods },
              { to: "/agents", label: lang === "he" ? "סוכנים" : "Agents" },
              { to: "/about", label: t.nav.about },
              { to: "/contact", label: t.nav.contact },
            ].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="opacity-70 hover:opacity-100 transition-opacity">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 text-[11px] opacity-40 flex flex-col sm:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} JF Realty. {t.footer.rights}</div>
          <div>Jack Freedman · Jerusalem</div>
        </div>
      </div>
    </footer>
  );
}

function StickyMobileCTA() {
  const { t } = useI18n();
  const router = useRouterState();
  const path = router.location.pathname;
  const isAdmin = path.startsWith("/admin");
  const isListings = path.startsWith("/listings");
  if (isAdmin || isListings) return null;
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="grid grid-cols-2 gap-2 pointer-events-auto">
          <a href={waLink()} target="_blank" rel="noopener"
            className="flex items-center justify-center gap-2 h-13 rounded-sm bg-[#3dab2c] text-white font-medium text-sm shadow-lg shadow-black/15 active:scale-[0.98] transition-transform hover:bg-[#22c45e]">
            <MessageCircle className="size-4" /> {t.cta.whatsapp}
          </a>
          <a href={telLink}
            className="flex items-center justify-center gap-2 h-13 rounded-sm bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-black/15 active:scale-[0.98] transition-transform">
            <Phone className="size-4" /> {t.cta.call}
          </a>
        </div>
      </div>
    </div>
  );
}

function FloatingDesktopCTA() {
  const router = useRouterState();
  const path = router.location.pathname;
  const isAdmin = path.startsWith("/admin");
  const isListings = path.startsWith("/listings");
  if (isAdmin || isListings) return null;
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      className="hidden lg:flex fixed bottom-7 right-7 z-40 items-center gap-2.5 h-14 px-6 rounded-full text-white font-medium shadow-2xl shadow-black/25 hover:scale-[1.04] transition-transform bg-[#3dab2c] hover:bg-[#22c45e]"
    >
      <MessageCircle className="size-5" /> WhatsApp Jack
    </a>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <Footer />
      <StickyMobileCTA />
      <FloatingDesktopCTA />
    </div>
  );
}
