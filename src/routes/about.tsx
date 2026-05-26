import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { waLink, telLink, SITE } from "@/lib/site";
import portrait from "@/assets/jack-portrait.png";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-12 sm:pt-24 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">{SITE.brand}</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05]">{t.about.title}</h1>
          <p className="mt-6 text-lg text-foreground/80 max-w-xl">{t.about.lead}</p>
          <p className="mt-4 text-foreground/70 leading-relaxed max-w-xl">{t.about.body1}</p>
          <p className="mt-4 text-foreground/70 leading-relaxed max-w-xl">{t.about.body2}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-[#25D366] text-white font-medium"><MessageCircle className="size-4" /> {t.cta.whatsapp}</a>
            <a href={telLink} className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-primary text-primary-foreground font-medium"><Phone className="size-4" /> {t.cta.call}</a>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[3/4] rounded-sm overflow-hidden bg-muted">
          <img src={portrait} alt="Jack Freedman" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.about.timeline.map((row, i) => (
              <div key={i} className="border-t border-accent pt-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{row.y}</div>
                <div className="mt-2 font-display text-xl">{row.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
