import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`;
    window.open(waLink(msg), "_blank");
    setSent(true);
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{t.nav.contact}</div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">{t.contact.title}</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="space-y-4">
            <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-4 p-5 rounded-sm border border-border hover:border-accent group">
              <MessageCircle className="size-5 text-[#25D366]" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
                <div className="font-display text-xl group-hover:text-accent">{SITE.phoneDisplay}</div>
              </div>
            </a>
            <a href={telLink} className="flex items-center gap-4 p-5 rounded-sm border border-border hover:border-accent group">
              <Phone className="size-5 text-accent" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.cta.call}</div>
                <div className="font-display text-xl group-hover:text-accent">{SITE.phoneDisplay}</div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 p-5 rounded-sm border border-border hover:border-accent group">
              <Mail className="size-5 text-accent" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                <div className="font-display text-xl group-hover:text-accent">{SITE.email}</div>
              </div>
            </a>
            <div className="flex items-center gap-4 p-5 rounded-sm border border-border">
              <MapPin className="size-5 text-accent" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Office</div>
                <div className="font-display text-xl">{SITE.address}</div>
              </div>
            </div>
          </div>
          <div className="mt-8 aspect-[16/10] rounded-sm overflow-hidden border border-border">
            <iframe
              title="Map"
              className="w-full h-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${SITE.mapsQuery}&output=embed`}
            />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label={t.contact.form.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label={t.contact.form.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label={t.contact.form.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.contact.form.message}</span>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} className="mt-2 w-full p-3 bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-8 rounded-sm bg-primary text-primary-foreground font-medium">
            {t.contact.form.submit}
          </button>
          {sent && <div className="text-sm text-accent">{t.contact.form.sent}</div>}
        </form>
      </section>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full h-11 px-3 bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
    </label>
  );
}