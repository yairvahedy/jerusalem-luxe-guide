import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Upload } from "lucide-react";
import { getAppearance, upsertAppearance, uploadImage } from "@/lib/db";
import type { AppearanceContent } from "@/lib/database.types";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const DEFAULT: AppearanceContent = { accent_color: "#3dab2c", logo_url: "", hero_image_url: "" };

function AdminSettings() {
  const [form, setForm] = useState<AppearanceContent>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "hero" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAppearance().then(setForm).catch(() => {});
  }, []);

  const set = (key: keyof AppearanceContent, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "hero_image_url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field === "logo_url" ? "logo" : "hero");
    setError("");
    try {
      const path = `site/${field === "logo_url" ? "logo" : "hero"}-${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      setForm((f) => ({ ...f, [field]: url }));
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await upsertAppearance(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Site Settings</h1>
        <p className="text-white/40 text-sm mt-1">Customize the appearance of your website.</p>
      </div>

      <div className="space-y-8">
        {/* Accent color */}
        <Section title="Brand color" subtitle="The primary accent color used for buttons and highlights.">
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={form.accent_color}
              onChange={(e) => set("accent_color", e.target.value)}
              className="w-14 h-14 rounded-md cursor-pointer bg-transparent border-0 p-0.5"
            />
            <div>
              <input
                type="text"
                value={form.accent_color}
                onChange={(e) => set("accent_color", e.target.value)}
                placeholder="#3dab2c"
                className="admin-input w-36 font-mono text-sm uppercase"
              />
              <p className="text-white/30 text-xs mt-1.5">Currently applied: WhatsApp buttons & accents</p>
            </div>
          </div>
        </Section>

        {/* Logo */}
        <Section title="Logo image" subtitle="Upload a custom logo to replace the default. Recommended: square PNG, at least 200×200px.">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-md bg-white/[0.06] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 text-xs">Logo</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={form.logo_url}
                onChange={(e) => set("logo_url", e.target.value)}
                placeholder="https://... or upload below"
                className="admin-input text-sm"
              />
              <label className="mt-2 inline-flex items-center gap-2 cursor-pointer text-sm text-white/50 hover:text-white transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "logo_url")} />
                <Upload className="size-4" />
                {uploading === "logo" ? "Uploading…" : "Upload logo"}
              </label>
            </div>
          </div>
        </Section>

        {/* Hero image */}
        <Section title="Hero background image" subtitle="The full-width background photo on the homepage hero section.">
          <div className="space-y-3">
            {form.hero_image_url && (
              <div className="aspect-[16/5] rounded-md overflow-hidden bg-white/[0.04]">
                <img src={form.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="text"
              value={form.hero_image_url}
              onChange={(e) => set("hero_image_url", e.target.value)}
              placeholder="https://... or upload below"
              className="admin-input text-sm"
            />
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-white/50 hover:text-white transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "hero_image_url")} />
              <Upload className="size-4" />
              {uploading === "hero" ? "Uploading…" : "Upload hero image"}
            </label>
          </div>
        </Section>

        {error && (
          <div className="bg-red-900/20 border border-red-900/40 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 h-11 px-7 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${saved ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-white text-black hover:bg-white/90"}`}
          >
            {saved ? <><Check className="size-4" /> Saved</> : saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
      <div className="mb-5">
        <h2 className="text-base font-medium text-white">{title}</h2>
        <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
