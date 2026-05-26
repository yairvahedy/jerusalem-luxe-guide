import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { getAllAgentsAdmin, createAgent, updateAgent, deleteAgent } from "@/lib/db";
import type { Agent, AgentInsert } from "@/lib/database.types";
import { uploadImage } from "@/lib/db";

export const Route = createFileRoute("/admin/agents")({
  component: AdminAgents,
});

const EMPTY: AgentInsert = {
  name: "", bio: "", whatsapp: "", phone: "", email: "",
  slug: "", portrait_url: "", active: true,
};

function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<AgentInsert>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    getAllAgentsAdmin().then(setAgents).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(EMPTY);
    setIsNew(true);
    setEditing(null);
    setError("");
  };

  const openEdit = (a: Agent) => {
    setForm({ name: a.name, bio: a.bio ?? "", whatsapp: a.whatsapp ?? "", phone: a.phone ?? "", email: a.email ?? "", slug: a.slug, portrait_url: a.portrait_url ?? "", active: a.active });
    setEditing(a);
    setIsNew(false);
    setError("");
  };

  const closeForm = () => { setEditing(null); setIsNew(false); setError(""); };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `agents/${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      setForm((f) => ({ ...f, portrait_url: url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) { setError("Name is required."); return; }
    if (!form.slug) { setError("Slug is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await createAgent(form);
      } else if (editing) {
        await updateAgent(editing.id, form);
      }
      closeForm();
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Agent) => {
    if (!confirm(`Delete agent "${a.name}"?`)) return;
    await deleteAgent(a.id);
    load();
  };

  const showForm = isNew || editing !== null;

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Agents</h1>
          <p className="text-white/40 text-sm mt-1">{agents.length} agent{agents.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 h-10 px-5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <Plus className="size-4" /> Add agent
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/[0.04] border border-white/[0.09] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">{isNew ? "New agent" : `Edit — ${editing?.name}`}</h2>
            <button onClick={closeForm} className="text-white/40 hover:text-white"><X className="size-5" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v, slug: f.slug || generateSlug(v) }))} placeholder="Jack Freedman" />
            <Field label="Slug *" value={form.slug ?? ""} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} placeholder="jack-freedman" />
            <Field label="Phone" value={form.phone ?? ""} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+972 53-398-5043" />
            <Field label="WhatsApp number" value={form.whatsapp ?? ""} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} placeholder="972533985043" />
            <Field label="Email" value={form.email ?? ""} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="agent@jfrealty.co.il" />
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Portrait photo</label>
              <input type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" id="portrait-upload" />
              <label htmlFor="portrait-upload" className="flex items-center gap-3 cursor-pointer">
                <div className="w-14 h-14 rounded-md bg-white/[0.06] overflow-hidden border border-white/[0.1] flex items-center justify-center shrink-0">
                  {form.portrait_url ? (
                    <img src={form.portrait_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/20 text-xs">+</span>
                  )}
                </div>
                <span className="text-sm text-white/50 hover:text-white transition-colors">
                  {uploading ? "Uploading…" : "Upload photo"}
                </span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Bio</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Agent biography..."
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="active" checked={form.active ?? true} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded" />
              <label htmlFor="active" className="text-sm text-white/60">Active (visible on public site)</label>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save agent"}
            </button>
            <button onClick={closeForm} className="h-10 px-5 border border-white/[0.1] text-white/60 rounded-md text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Agents list */}
      {loading ? (
        <div className="py-16 text-center text-white/30">Loading…</div>
      ) : agents.length === 0 ? (
        <div className="py-16 text-center text-white/30">No agents yet</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map((a) => (
            <div key={a.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/[0.06] shrink-0">
                {a.portrait_url ? (
                  <img src={a.portrait_url} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">{a.name[0]}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-white">{a.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{a.email}</div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm shrink-0 ${a.active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/30"}`}>
                    {a.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {a.bio && <p className="text-xs text-white/40 mt-2 line-clamp-2">{a.bio}</p>}
                <div className="flex gap-3 mt-3">
                  <button onClick={() => openEdit(a)} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
                    <Pencil className="size-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(a)} className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1">
                    <Trash2 className="size-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30"
      />
    </div>
  );
}
