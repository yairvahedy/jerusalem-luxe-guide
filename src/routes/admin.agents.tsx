import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, RefreshCw, AlertTriangle, User, Upload } from "lucide-react";
import { getAllAgentsAdmin, createAgent, updateAgent, deleteAgent, uploadImage } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";
import type { Agent, AgentInsert } from "@/lib/database.types";

export const Route = createFileRoute("/admin/agents")({
  component: AdminAgents,
});

const EMPTY: AgentInsert = {
  name: "", name_he: "", bio: "", whatsapp: "", phone: "", email: "",
  slug: "", portrait_url: "", active: true,
};

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminAgents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<AgentInsert>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      // Confirm session is present before hitting the DB
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("[agents] No active session — RLS will reject admin reads");
      } else {
        console.log("[agents] Session found, user:", sessionData.session.user.email);
      }

      console.log("[agents] Fetching all agents from Supabase…");
      const result = await getAllAgentsAdmin();
      console.log("[agents] Received:", result.length, "agents", result);
      setAgents(result);
    } catch (err: any) {
      const msg = err?.message ?? "Unknown error fetching agents";
      console.error("[agents] Load error:", err);
      setLoadError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(EMPTY);
    setIsNew(true);
    setEditing(null);
    setFormError("");
  };

  const openEdit = (a: Agent) => {
    setForm({
      name: a.name,
      name_he: a.name_he ?? "",
      bio: a.bio ?? "",
      whatsapp: a.whatsapp ?? "",
      phone: a.phone ?? "",
      email: a.email ?? "",
      slug: a.slug,
      portrait_url: a.portrait_url ?? "",
      active: a.active,
    });
    setEditing(a);
    setIsNew(false);
    setFormError("");
  };

  const closeForm = () => { setEditing(null); setIsNew(false); setFormError(""); };

  const handlePortraitUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `agents/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const url = await uploadImage(file, path);
      setForm((f) => ({ ...f, portrait_url: url }));
      toast("Photo uploaded");
    } catch (err: any) {
      const msg = err?.message ?? "Upload failed";
      setFormError(msg);
      toast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    const slug = form.slug.trim() || generateSlug(form.name);
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, slug };
      if (isNew) {
        await createAgent(payload);
        toast("Agent created");
      } else if (editing) {
        await updateAgent(editing.id, payload);
        toast("Agent saved");
      }
      closeForm();
      load();
    } catch (err: any) {
      const msg = err?.message ?? "Failed to save agent";
      console.error("[agents] Save error:", err);
      setFormError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Agent) => {
    if (!confirm(`Delete agent "${a.name}"? This cannot be undone.`)) return;
    try {
      await deleteAgent(a.id);
      toast("Agent deleted");
      load();
    } catch (err: any) {
      const msg = err?.message ?? "Failed to delete agent";
      toast(msg, "error");
    }
  };

  const showForm = isNew || editing !== null;

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Agents</h1>
          <p className="text-white/40 text-sm mt-1">
            {loading ? "Loading…" : loadError ? "Could not load agents" : `${agents.length} agent${agents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <button
              onClick={load}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors py-2 px-3"
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </button>
          )}
          {!showForm && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 h-10 px-5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <Plus className="size-4" /> Add agent
            </button>
          )}
        </div>
      </div>

      {/* Edit / New Form */}
      {showForm && (
        <div className="bg-white/[0.04] border border-white/[0.09] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">
              {isNew ? "New agent" : `Edit — ${editing?.name}`}
            </h2>
            <button onClick={closeForm} className="text-white/40 hover:text-white transition-colors">
              <X className="size-5" />
            </button>
          </div>

          {/* Portrait upload */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                {form.portrait_url ? (
                  <img src={form.portrait_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/30 text-2xl font-medium select-none">
                    {form.name?.[0]?.toUpperCase() ?? <User className="size-6 text-white/20" />}
                  </span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePortraitUpload(f); }}
              />
              <button
                type="button"
                onClick={() => portraitInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-40"
              >
                <Upload className="size-4" />
                {uploading ? "Uploading…" : "Upload portrait photo"}
              </button>
              <p className="text-xs text-white/25 mt-1">JPG or PNG · Stored in Supabase Storage</p>
              {form.portrait_url && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, portrait_url: "" }))}
                  className="text-xs text-white/30 hover:text-red-400 transition-colors mt-1"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Full name (English) *"
              value={form.name ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, name: v, slug: f.slug || generateSlug(v) }))}
              placeholder="Jack Freedman"
            />
            <Field
              label="שם מלא (עברית)"
              value={form.name_he ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, name_he: v }))}
              placeholder="ג'ק פרידמן"
              dir="rtl"
            />
            <Field
              label="Slug (URL identifier)"
              value={form.slug ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
              placeholder="jack-freedman"
            />
            <Field
              label="Phone"
              value={form.phone ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="+972 53-398-5043"
            />
            <Field
              label="WhatsApp (digits only)"
              value={form.whatsapp ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
              placeholder="972533985043"
            />
            <Field
              label="Email"
              value={form.email ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="agent@jfrealty.co.il"
            />
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Bio</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="A short description of the agent's background and expertise…"
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
            <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${form.active ? "bg-white border-white" : "border-white/20 bg-white/[0.04]"}`}
              >
                {form.active && (
                  <svg className="w-3 h-3 text-black" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/60">Active — visible on the public Agents page</span>
            </label>
          </div>

          {formError && (
            <div className="mt-4 bg-red-900/20 border border-red-900/40 text-red-400 text-sm px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="h-10 px-6 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save agent"}
            </button>
            <button
              onClick={closeForm}
              className="h-10 px-5 border border-white/[0.1] text-white/60 rounded-md text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/30 text-sm">Loading agents…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && loadError && (
        <div className="py-8 px-6 bg-red-950/30 border border-red-500/20 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="size-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-300">Failed to load agents</p>
              <p className="text-xs text-red-400/70 mt-1 font-mono">{loadError}</p>
            </div>
          </div>
          <div className="text-xs text-red-400/60 space-y-1 mb-4 pl-8">
            <p>Possible causes:</p>
            <p>• You are not logged in with a valid Supabase session</p>
            <p>• The agents table doesn't exist — run supabase-schema.sql</p>
            <p>• RLS policies are blocking this read</p>
            <p>• Check browser console for the full error</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm text-red-300 hover:text-white transition-colors border border-red-500/30 px-4 py-2 rounded-md hover:bg-red-500/10"
          >
            <RefreshCw className="size-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !loadError && agents.length === 0 && (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
            <User className="size-5 text-white/20" />
          </div>
          <p className="text-white/30 text-sm mb-1">No agents found</p>
          <p className="text-white/20 text-xs mb-5">
            Run supabase-schema.sql to seed the default agents, or add one manually.
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-md transition-colors"
          >
            <Plus className="size-4" /> Add first agent
          </button>
        </div>
      )}

      {/* Agents grid */}
      {!loading && !loadError && agents.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map((a) => (
            <AgentCard
              key={a.id}
              agent={a}
              onEdit={() => openEdit(a)}
              onDelete={() => handleDelete(a)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent: a, onEdit, onDelete }: { agent: Agent; onEdit: () => void; onDelete: () => void }) {
  const initials = a.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 flex gap-4 hover:bg-white/[0.05] transition-colors">
      {/* Portrait */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 shrink-0 flex items-center justify-center border border-white/[0.08]">
        {a.portrait_url ? (
          <img
            src={a.portrait_url}
            alt={a.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, hide it and show initials
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-white/40 text-lg font-semibold select-none">{initials || "?"}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium text-white truncate">{a.name}</div>
            {a.name_he && (
              <div className="text-xs text-white/40 mt-0.5 truncate" dir="rtl">{a.name_he}</div>
            )}
            {a.phone && (
              <div className="text-xs text-white/30 mt-0.5">{a.phone}</div>
            )}
          </div>
          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm shrink-0 ${a.active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.06] text-white/30"}`}>
            {a.active ? "Active" : "Inactive"}
          </span>
        </div>

        {a.bio && (
          <p className="text-xs text-white/35 mt-2 line-clamp-2 leading-relaxed">{a.bio}</p>
        )}

        <div className="flex gap-4 mt-3">
          <button
            onClick={onEdit}
            className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Pencil className="size-3" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-white/25 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="size-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30"
      />
    </div>
  );
}
