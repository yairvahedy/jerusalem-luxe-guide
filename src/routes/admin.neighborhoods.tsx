import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, GripVertical, Eye, EyeOff, Upload } from "lucide-react";
import {
  getAllNeighborhoodsAdmin, createNeighborhood,
  updateNeighborhood, deleteNeighborhood, uploadImage,
} from "@/lib/db";
import type { Neighborhood, NeighborhoodInsert } from "@/lib/database.types";

export const Route = createFileRoute("/admin/neighborhoods")({
  component: NeighborhoodsAdmin,
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  active: boolean;
};

const emptyForm = (): FormState => ({ name: "", slug: "", description: "", image_url: "", display_order: 0, active: true });

function NeighborhoodForm({
  initial, onSave, onCancel, loading,
}: {
  initial: FormState;
  onSave: (f: FormState, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial.image_url);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof FormState) => (v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleNameChange = (v: string) => {
    set("name")(v);
    if (!initial.slug) set("slug")(slugify(v));
  };

  const handleImageFile = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  return (
    <div className="bg-[#1e1e1e] border border-white/[0.1] rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="German Colony"
            className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">URL Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
            placeholder="german-colony"
            className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          rows={3}
          placeholder="Describe this neighborhood for visitors…"
          className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-md text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Photo</label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border-2 border-dashed border-white/[0.1] rounded-lg overflow-hidden cursor-pointer hover:border-white/20 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <div className="relative aspect-[16/6]">
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 rounded-md px-3 py-2 text-xs text-white flex items-center gap-2">
                  <Upload className="size-3.5" /> Change photo
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-2 text-white/30">
              <Upload className="size-6" />
              <div className="text-sm">Tap to upload a photo</div>
              <div className="text-xs">JPG, PNG, WebP</div>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
        {!imageFile && (
          <div className="mt-2">
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => { set("image_url")(e.target.value); setPreview(e.target.value); }}
              placeholder="Or paste an image URL…"
              className="w-full h-10 px-3 bg-white/[0.04] border border-white/[0.08] rounded-md text-white/60 placeholder-white/20 focus:outline-none focus:border-white/20 text-xs"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Display Order</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => set("display_order")(Number(e.target.value))}
            min={0}
            className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.1] rounded-md text-white focus:outline-none focus:border-white/30 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => set("active")(!form.active)}
            className={`flex items-center gap-2 h-11 px-4 rounded-md text-sm w-full justify-center transition-colors ${form.active ? "bg-green-700/40 text-green-400 border border-green-700/40" : "bg-white/[0.06] text-white/40 border border-white/[0.1]"}`}
          >
            {form.active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {form.active ? "Visible" : "Hidden"}
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form, imageFile ?? undefined)}
          disabled={loading || !form.name}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          {loading ? "Saving…" : "Save neighborhood"}
        </button>
        <button onClick={onCancel} className="px-5 py-3 rounded-md text-sm text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function NeighborhoodsAdmin() {
  const [items, setItems] = useState<Neighborhood[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    getAllNeighborhoodsAdmin().then(setItems).catch(() => {}).finally(() => setPageLoading(false));
  };

  useEffect(() => { load(); }, []);

  const nbhdToForm = (n: Neighborhood): FormState => ({
    name: n.name, slug: n.slug, description: n.description ?? "",
    image_url: n.image_url ?? "", display_order: n.display_order, active: n.active,
  });

  const handleCreate = async (form: FormState, imageFile?: File) => {
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const path = `neighborhoods/${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        imageUrl = await uploadImage(imageFile, path);
      }
      const data: NeighborhoodInsert = {
        name: form.name, slug: form.slug || slugify(form.name),
        description: form.description || null, image_url: imageUrl || null,
        display_order: form.display_order, active: form.active,
      };
      await createNeighborhood(data);
      setAdding(false);
      load();
    } catch (e) {
      alert("Failed to save: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, form: FormState, imageFile?: File) => {
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const path = `neighborhoods/${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        imageUrl = await uploadImage(imageFile, path);
      }
      await updateNeighborhood(id, {
        name: form.name, slug: form.slug, description: form.description || null,
        image_url: imageUrl || null, display_order: form.display_order, active: form.active,
      });
      setEditingId(null);
      load();
    } catch (e) {
      alert("Failed to save: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await deleteNeighborhood(id).catch(() => {});
    setDeleting(null);
    load();
  };

  const toggleActive = async (n: Neighborhood) => {
    await updateNeighborhood(n.id, { active: !n.active }).catch(() => {});
    load();
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto space-y-5 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white">Neighborhoods</h1>
          <p className="text-sm text-white/40 mt-1">{items.length} neighborhood{items.length !== 1 ? "s" : ""}</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <Plus className="size-4" /> Add
          </button>
        )}
      </div>

      {adding && (
        <NeighborhoodForm
          initial={emptyForm()}
          onSave={handleCreate}
          onCancel={() => setAdding(false)}
          loading={saving}
        />
      )}

      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id}>
            {editingId === n.id ? (
              <NeighborhoodForm
                initial={nbhdToForm(n)}
                onSave={(form, file) => handleUpdate(n.id, form, file)}
                onCancel={() => setEditingId(null)}
                loading={saving}
              />
            ) : (
              <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
                <div className="text-white/20 cursor-grab shrink-0">
                  <GripVertical className="size-4" />
                </div>

                {n.image_url ? (
                  <div className="w-14 h-14 rounded-md overflow-hidden shrink-0">
                    <img src={n.image_url} alt={n.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-md bg-white/[0.04] shrink-0 flex items-center justify-center">
                    <span className="text-white/20 text-xs">No img</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{n.name}</div>
                  {n.description && (
                    <div className="text-xs text-white/40 mt-0.5 line-clamp-1">{n.description}</div>
                  )}
                  <div className="text-[10px] text-white/25 mt-1">/{n.slug} · order {n.display_order}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(n)}
                    className={`p-2 rounded-md transition-colors ${n.active ? "text-green-400 hover:bg-green-900/20" : "text-white/30 hover:bg-white/[0.06]"}`}
                    title={n.active ? "Visible — click to hide" : "Hidden — click to show"}
                  >
                    {n.active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  <button
                    onClick={() => { setEditingId(n.id); setAdding(false); }}
                    className="p-2 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id, n.name)}
                    disabled={deleting === n.id}
                    className="p-2 rounded-md text-white/30 hover:text-red-400 hover:bg-red-900/10 transition-colors disabled:opacity-50"
                  >
                    {deleting === n.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !adding && (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">🏘️</div>
          <div className="text-sm">No neighborhoods yet. Add one above.</div>
          <div className="text-xs mt-1">Run the schema SQL to seed the default Jerusalem neighborhoods.</div>
        </div>
      )}
    </div>
  );
}
