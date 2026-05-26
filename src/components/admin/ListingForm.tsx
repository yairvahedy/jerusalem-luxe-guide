import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Star, GripVertical, Video, Save, PlayCircle, FileVideo } from "lucide-react";
import { uploadImage, uploadVideo, getAllAgentsAdmin } from "@/lib/db";
import { useToast } from "@/lib/toast";
import type { DbListing, DbListingInsert, Agent } from "@/lib/database.types";

type Props = {
  initialData?: DbListing;
  onSave: (data: DbListingInsert) => Promise<void>;
};

const NEIGHBORHOODS = [
  "German Colony", "Rehavia", "Talbiya", "Old Katamon", "City Center",
  "Baka", "Mamilla", "Arnona", "Abu Tor", "Talbieh", "Yemin Moshe",
  "Kiryat Moshe", "Givat Ram", "Har Nof", "Ramat Eshkol",
];

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

export function ListingForm({ initialData, onSave }: Props) {
  const isEdit = !!initialData;
  const [agents, setAgents] = useState<Agent[]>([]);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    price: initialData?.price?.toString() ?? "",
    type: initialData?.type ?? "rent",
    neighborhood: initialData?.neighborhood ?? "",
    address: initialData?.address ?? "",
    bedrooms: initialData?.bedrooms?.toString() ?? "0",
    bathrooms: initialData?.bathrooms?.toString() ?? "0",
    sqm: initialData?.sqm?.toString() ?? "0",
    arnona: initialData?.arnona?.toString() ?? "",
    balcony: initialData?.balcony ?? false,
    mamad: initialData?.mamad ?? false,
    elevator: initialData?.elevator ?? false,
    parking: initialData?.parking ?? false,
    storage: initialData?.storage ?? false,
    sukka_balcony: initialData?.sukka_balcony ?? false,
    accessibility: initialData?.accessibility ?? false,
    renovated: initialData?.renovated ?? false,
    furnished: initialData?.furnished ?? false,
    air_conditioning: initialData?.air_conditioning ?? false,
    description: initialData?.description ?? "",
    video_url: initialData?.video_url ?? "",
    status: initialData?.status ?? "available",
    featured: initialData?.featured ?? false,
    agent_id: initialData?.agent_id ?? "",
  });

  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllAgentsAdmin().then(setAgents).catch(() => {});
  }, []);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  // ── Image upload ────────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const url = await uploadImage(file, path);
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
      toast(`${urls.length} photo${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
      toast(e.message ?? "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, []);

  // ── Video upload ────────────────────────────────────────────────────────────
  const handleVideoUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file too large — please keep it under 100 MB.");
      toast("Video file too large (max 100 MB)", "error");
      return;
    }
    setVideoUploading(true);
    setVideoProgress(0);
    setError("");

    // Animate progress
    const fakeInterval = setInterval(() => {
      setVideoProgress((p) => {
        if (p >= 85) { clearInterval(fakeInterval); return p; }
        return Math.min(85, p + Math.random() * 12 + 3);
      });
    }, 400);

    try {
      const path = `listings/videos/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const url = await uploadVideo(file, path, (pct) => setVideoProgress(pct));
      clearInterval(fakeInterval);
      setVideoProgress(100);
      setTimeout(() => { setVideoUploading(false); setVideoProgress(0); }, 800);
      set("video_url", url);
      toast("Video uploaded successfully");
    } catch (e: any) {
      clearInterval(fakeInterval);
      setVideoUploading(false);
      setVideoProgress(0);
      setError(e.message ?? "Video upload failed");
      toast(e.message ?? "Video upload failed", "error");
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoUpload(file);
  };

  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setVideoDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) handleVideoUpload(file);
  }, []);

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { setError("Title is required."); return; }
    if (!form.neighborhood) { setError("Neighborhood is required."); return; }
    setSaving(true);
    setError("");
    try {
      const data: DbListingInsert = {
        ...(isEdit ? { slug: initialData!.slug } : { slug: generateSlug(form.title) }),
        title: form.title,
        price: parseFloat(form.price) || 0,
        type: form.type as "sale" | "rent",
        neighborhood: form.neighborhood,
        address: form.address || null,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        sqm: parseInt(form.sqm) || 0,
        arnona: form.arnona ? parseInt(form.arnona) : null,
        balcony: form.balcony,
        mamad: form.mamad,
        elevator: form.elevator,
        parking: form.parking,
        storage: form.storage,
        sukka_balcony: form.sukka_balcony,
        accessibility: form.accessibility,
        renovated: form.renovated,
        furnished: form.furnished,
        air_conditioning: form.air_conditioning,
        description: form.description || null,
        video_url: form.video_url || null,
        images,
        status: form.status as "available" | "rented" | "sold" | "draft",
        featured: form.featured,
        agent_id: form.agent_id || null,
      };
      await onSave(data);
      toast(isEdit ? "Listing updated successfully" : "Listing created successfully");
    } catch (e: any) {
      const msg = e.message ?? "Failed to save listing";
      setError(msg);
      toast(msg, "error");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-white/[0.08]">
        <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
        <div
          onClick={() => set("featured", !form.featured)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${form.featured ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20" : "bg-white/[0.05] text-white/40 border border-white/[0.08] hover:bg-white/[0.08]"}`}
        >
          <Star className="size-3.5" fill={form.featured ? "currentColor" : "none"} />
          Featured
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div
            onClick={() => set("type", form.type === "sale" ? "rent" : "sale")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border cursor-pointer transition-colors ${form.type === "sale" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
          >
            {form.type === "sale" ? "For Sale" : "For Rent"}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="admin-label">Property title *</label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Renovated 3BR — German Colony"
          className="admin-input text-lg"
          required
        />
      </div>

      {/* Price + Neighborhood */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">
            {form.type === "rent" ? "Monthly rent (₪)" : "Sale price (₪)"} — leave 0 for "contact us"
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder={form.type === "rent" ? "7500" : "4500000"}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Neighborhood *</label>
          <select value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} className="admin-input" required>
            <option value="" disabled>Select neighborhood</option>
            {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Address + Arnona */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Street address</label>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="e.g. 12 Lloyd George Street"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Arnona / municipal tax (₪/year, optional)</label>
          <input
            type="number"
            value={form.arnona}
            onChange={(e) => set("arnona", e.target.value)}
            placeholder="8400"
            className="admin-input"
          />
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="admin-label">Bedrooms</label>
          <input type="number" min="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Bathrooms</label>
          <input type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Size (m²)</label>
          <input type="number" min="0" value={form.sqm} onChange={(e) => set("sqm", e.target.value)} className="admin-input" />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="admin-label mb-3 block">Property features</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-5">
          {[
            { key: "balcony", label: "Balcony" },
            { key: "mamad", label: "Mamad (safe room)" },
            { key: "elevator", label: "Elevator" },
            { key: "parking", label: "Parking" },
            { key: "storage", label: "Storage room" },
            { key: "sukka_balcony", label: "Sukka balcony" },
            { key: "accessibility", label: "Accessibility" },
            { key: "renovated", label: "Renovated" },
            { key: "furnished", label: "Furnished" },
            { key: "air_conditioning", label: "Air conditioning" },
          ].map((f) => (
            <label key={f.key} className="flex items-center gap-3 cursor-pointer py-1 select-none">
              <div
                onClick={() => set(f.key, !form[f.key as keyof typeof form])}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${form[f.key as keyof typeof form] ? "bg-white border-white" : "border-white/20 bg-white/[0.04]"}`}
              >
                {form[f.key as keyof typeof form] && <svg className="w-3 h-3 text-black" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
              </div>
              <span className="text-sm text-white/70">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="admin-label">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={5}
          placeholder="Describe the apartment — layout, light, nearby amenities, what makes it special…"
          className="admin-input resize-none leading-relaxed"
        />
      </div>

      {/* Images */}
      <div>
        <label className="admin-label">Photos ({images.length})</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-white/40 bg-white/[0.06]" : "border-white/[0.12] hover:border-white/25 bg-white/[0.02]"}`}
        >
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          <Upload className="size-8 text-white/20 mx-auto mb-3" />
          {uploading ? (
            <p className="text-white/50 text-sm">Uploading…</p>
          ) : (
            <>
              <p className="text-white/50 text-sm">Drag & drop photos here, or tap to browse</p>
              <p className="text-white/25 text-xs mt-1">JPG, PNG, WebP · First photo is the cover</p>
            </>
          )}
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((url, i) => (
              <div key={url + i} className="group relative aspect-square rounded-lg overflow-hidden bg-white/[0.06]">
                <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                {i === 0 && (
                  <div className="absolute top-1 left-1 bg-white/90 text-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm">Cover</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)} className="w-7 h-7 bg-white/90 rounded-md flex items-center justify-center">
                      <GripVertical className="size-3 text-black" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="w-7 h-7 bg-red-500/90 rounded-md flex items-center justify-center">
                    <X className="size-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video upload */}
      <div>
        <label className="admin-label flex items-center gap-2"><Video className="size-3.5" /> Property video tour</label>

        {/* Current video preview */}
        {form.video_url && !videoUploading && (
          <div className="mb-3 rounded-xl overflow-hidden bg-black aspect-video relative group">
            <video
              src={form.video_url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
            <button
              type="button"
              onClick={() => set("video_url", "")}
              className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="size-3.5 text-white" />
            </button>
          </div>
        )}

        {/* Upload progress */}
        {videoUploading && (
          <div className="mb-3 p-5 rounded-xl border border-white/[0.1] bg-white/[0.03]">
            <div className="flex items-center gap-3 mb-3">
              <FileVideo className="size-5 text-white/50" />
              <span className="text-sm text-white/60">Uploading video…</span>
              <span className="ml-auto text-sm text-white/40">{Math.round(videoProgress)}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drop zone */}
        {!form.video_url && !videoUploading && (
          <div
            onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
            onDragLeave={() => setVideoDragOver(false)}
            onDrop={handleVideoDrop}
            onClick={() => videoRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${videoDragOver ? "border-white/40 bg-white/[0.06]" : "border-white/[0.1] hover:border-white/25 bg-white/[0.02]"}`}
          >
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
              onChange={handleVideoFileChange}
              className="hidden"
            />
            <PlayCircle className="size-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/50 text-sm">Drag & drop a video, or tap to browse</p>
            <p className="text-white/25 text-xs mt-1">MP4, MOV, WebM · Max 100 MB · Stored securely in Supabase</p>
          </div>
        )}

        {/* Or paste URL */}
        <div className="mt-2">
          <input
            value={form.video_url}
            onChange={(e) => set("video_url", e.target.value)}
            placeholder="Or paste a video URL (YouTube, direct MP4, etc.)"
            className="admin-input text-sm"
          />
        </div>
      </div>

      {/* Agent */}
      <div>
        <label className="admin-label">Assigned agent</label>
        <select value={form.agent_id} onChange={(e) => set("agent_id", e.target.value)} className="admin-input">
          <option value="">No agent assigned</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}{a.name_he ? ` — ${a.name_he}` : ""}</option>)}
        </select>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/40 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="sticky bottom-0 -mx-5 sm:-mx-8 px-5 sm:px-8 py-4 bg-[#0f0f0f]/95 backdrop-blur border-t border-white/[0.08] flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading || videoUploading}
          className="inline-flex items-center gap-2 h-11 px-7 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          <Save className="size-4" />
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create listing"}
        </button>
        {uploading && <span className="text-white/40 text-sm">Uploading photos…</span>}
        {videoUploading && <span className="text-white/40 text-sm">Uploading video…</span>}
      </div>
    </form>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts = [
    { v: "available", label: "Available", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    { v: "rented", label: "Rented", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    { v: "sold", label: "Sold", cls: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
    { v: "draft", label: "Draft", cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  ];
  const cur = opts.find((o) => o.v === value) ?? opts[0];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 px-3 pr-7 rounded-md text-sm border appearance-none cursor-pointer focus:outline-none ${cur.cls} bg-transparent`}
    >
      {opts.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
  );
}
