import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Phone, MessageCircle, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site";
import logo from "@/assets/jf-logo.jpeg";

function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/listings", label: t.nav.listings },
    { to: "/neighborhoods", label: t.nav.neighborhoods },
    { to: "/sold", label: t.nav.sold },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="JF Realty" className="h-9 w-9 rounded-sm object-cover ring-1 ring-border" />
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide">JF Realty</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Jerusalem</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm tracking-wide text-foreground/80 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "he" : "en")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/70 hover:text-accent transition-colors px-2 py-1"
            aria-label="Switch language"
          >
            <Languages className="size-3.5" /> {lang === "en" ? "עב" : "EN"}
          </button>
          <a
            href={telLink}
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/80 hover:text-accent px-3 py-2 border border-border rounded-sm"
          >
            <Phone className="size-3.5" /> {SITE.phoneDisplay}
          </a>
          <button className="lg:hidden p-2 -mr-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-base border-b border-border/40 last:border-0">
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => { setLang(lang === "en" ? "he" : "en"); setOpen(false); }}
              className="mt-3 text-sm uppercase tracking-widest text-accent self-start"
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
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="" className="h-10 w-10 rounded-sm" />
            <div>
              <div className="font-display text-xl">JF Realty</div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-60">Jerusalem</div>
            </div>
          </div>
          <p className="text-sm opacity-70 max-w-sm leading-relaxed">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest opacity-50 mb-4">{t.nav.contact}</div>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-accent" href={telLink}>{SITE.phoneDisplay}</a></li>
            <li><a className="hover:text-accent" href={waLink()}>WhatsApp</a></li>
            <li><a className="hover:text-accent" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="opacity-70">{SITE.address}</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest opacity-50 mb-4">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/listings" className="hover:text-accent">{t.nav.listings}</Link></li>
            <li><Link to="/neighborhoods" className="hover:text-accent">{t.nav.neighborhoods}</Link></li>
            <li><Link to="/sold" className="hover:text-accent">{t.nav.sold}</Link></li>
            <li><Link to="/about" className="hover:text-accent">{t.nav.about}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 text-xs opacity-50 flex flex-col sm:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} JF Realty. {t.footer.rights}</div>
          <div>Jack Freedman · Jerusalem</div>
        </div>
      </div>
    </footer>
  );
}

function StickyMobileCTA() {
  const { t } = useI18n();
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/95 to-background/0 pointer-events-none">
      <div className="grid grid-cols-2 gap-2 pointer-events-auto">
        <a href={waLink()} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 h-12 rounded-sm bg-[#25D366] text-white font-medium shadow-lg shadow-black/10 active:scale-[0.98] transition-transform">
          <MessageCircle className="size-5" /> {t.cta.whatsapp}
        </a>
        <a href={telLink} className="flex items-center justify-center gap-2 h-12 rounded-sm bg-primary text-primary-foreground font-medium shadow-lg shadow-black/10 active:scale-[0.98] transition-transform">
          <Phone className="size-5" /> {t.cta.call}
        </a>
      </div>
    </div>
  );
}

function FloatingDesktopCTA() {
  const { t } = useI18n();
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-2 h-14 px-5 rounded-full bg-[#25D366] text-white font-medium shadow-2xl shadow-black/20 hover:scale-[1.03] transition-transform"
    >
      <MessageCircle className="size-5" /> {t.cta.whatsapp}
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