import { supabase } from "./supabase";
import type {
  DbListing, DbListingInsert, DbListingUpdate,
  Agent, AgentInsert, AgentUpdate,
  Neighborhood, NeighborhoodInsert, NeighborhoodUpdate,
  HeroContent, StatItem, WhyItem, TestimonialItem,
  LifestyleContent, ContactBannerContent, SiteInfo, AboutContent, AppearanceContent,
} from "./database.types";

// ── Listings ──────────────────────────────────────────────────────────────────

export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .in("status", ["available", "rented", "sold"])
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load listings: ${error.message}`);
  return (data ?? []) as unknown as DbListing[];
}

export async function getFeaturedListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .eq("status", "available")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load featured listings: ${error.message}`);
  return (data ?? []) as unknown as DbListing[];
}

export async function getSoldListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .in("status", ["rented", "sold"])
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load sold/rented listings: ${error.message}`);
  return (data ?? []) as unknown as DbListing[];
}

export async function getAllListingsAdmin() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load listings: ${error.message}`);
  return (data ?? []) as unknown as DbListing[];
}

export async function getListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data as unknown as DbListing | null;
}

export async function createListing(listing: DbListingInsert) {
  const payload = { ...listing, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("listings")
    .insert(payload as any)
    .select()
    .single();
  if (error) {
    if (error.code === "42501") throw new Error("Permission denied — please log in as admin first.");
    if (error.code === "42P01") throw new Error("Database not set up — please run supabase-schema.sql in your Supabase project.");
    throw new Error(error.message);
  }
  return data as unknown as DbListing;
}

export async function updateListing(id: string, listing: DbListingUpdate) {
  const payload = { ...listing, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("listings")
    .update(payload as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    if (error.code === "42501") throw new Error("Permission denied — please log in as admin first.");
    if (error.code === "42P01") throw new Error("Database not set up — please run supabase-schema.sql in your Supabase project.");
    throw new Error(error.message);
  }
  return data as unknown as DbListing;
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Agents ────────────────────────────────────────────────────────────────────

export async function getAgents() {
  const { data, error } = await supabase
    .from("agents").select("*").eq("active", true).order("created_at");
  if (error) throw new Error(`Failed to load agents: ${error.message}`);
  return (data ?? []) as unknown as Agent[];
}

export async function getAllAgentsAdmin() {
  const { data, error } = await supabase.from("agents").select("*").order("created_at");
  if (error) throw new Error(`Failed to load agents: ${error.message}`);
  return (data ?? []) as unknown as Agent[];
}

export async function createAgent(agent: AgentInsert) {
  const { data, error } = await supabase.from("agents").insert(agent as any).select().single();
  if (error) {
    if (error.code === "42501") throw new Error("Permission denied — please log in as admin first.");
    if (error.code === "42P01") throw new Error("Database not set up — please run supabase-schema.sql in your Supabase project.");
    throw new Error(error.message);
  }
  return data as unknown as Agent;
}

export async function updateAgent(id: string, agent: AgentUpdate) {
  const { data, error } = await supabase.from("agents").update(agent as any).eq("id", id).select().single();
  if (error) {
    if (error.code === "42501") throw new Error("Permission denied — please log in as admin first.");
    throw new Error(error.message);
  }
  return data as unknown as Agent;
}

export async function deleteAgent(id: string) {
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Neighborhoods ─────────────────────────────────────────────────────────────

export async function getNeighborhoods() {
  const { data, error } = await supabase
    .from("neighborhoods").select("*").eq("active", true).order("display_order");
  if (error) throw new Error(`Failed to load neighborhoods: ${error.message}`);
  return (data ?? []) as unknown as Neighborhood[];
}

export async function getAllNeighborhoodsAdmin() {
  const { data, error } = await supabase.from("neighborhoods").select("*").order("display_order");
  if (error) throw new Error(`Failed to load neighborhoods: ${error.message}`);
  return (data ?? []) as unknown as Neighborhood[];
}

export async function createNeighborhood(n: NeighborhoodInsert) {
  const { data, error } = await supabase.from("neighborhoods").insert(n as any).select().single();
  if (error) throw new Error(error.message);
  return data as unknown as Neighborhood;
}

export async function updateNeighborhood(id: string, n: NeighborhoodUpdate) {
  const { data, error } = await supabase.from("neighborhoods").update(n as any).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as unknown as Neighborhood;
}

export async function deleteNeighborhood(id: string) {
  const { error } = await supabase.from("neighborhoods").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Site Content ──────────────────────────────────────────────────────────────

export async function getSiteContent<T = unknown>(key: string): Promise<T | null> {
  const { data } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? null;
}

export async function getAllSiteContent(): Promise<Record<string, unknown>> {
  const { data } = await supabase.from("site_content").select("key, value");
  if (!data) return {};
  return Object.fromEntries(data.map((r) => [r.key, r.value]));
}

export async function upsertSiteContent(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value: value as any, updated_at: new Date().toISOString() });
  if (error) {
    if (error.code === "42501") throw new Error("Permission denied — please log in as admin first.");
    if (error.code === "42P01") throw new Error("Database not set up — please run supabase-schema.sql in your Supabase project.");
    throw new Error(error.message);
  }
}

// ── Typed content getters ─────────────────────────────────────────────────────

export async function getHeroContent(): Promise<HeroContent> {
  const d = await getSiteContent<HeroContent>("hero");
  return d ?? {
    eyebrow: "Jerusalem Apartments",
    title: "Find your next Jerusalem apartment.",
    subtitle: "Rentals and sales across Jerusalem's best neighborhoods — guided by local experts.",
  };
}

export async function getStats(): Promise<StatItem[]> {
  const d = await getSiteContent<StatItem[]>("stats");
  return d ?? [
    { value: "500+", label: "Apartments placed" },
    { value: "12+", label: "Years in Jerusalem" },
    { value: "5", label: "Local agents" },
    { value: "100%", label: "Personal service" },
  ];
}

export async function getWhyJack(): Promise<WhyItem[]> {
  const d = await getSiteContent<WhyItem[]>("why_jack");
  return d ?? [
    { title: "Deep local knowledge", body: "We know every street, building, and landlord. No guesswork — genuine Jerusalem expertise." },
    { title: "Fast WhatsApp service", body: "Send a message and get a real answer within the hour. We work on your timeline." },
    { title: "Verified listings", body: "Every apartment we list has been visited in person. What you see is what you get." },
    { title: "Hebrew and English", body: "Full service in both languages for Israeli and international clients alike." },
  ];
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const d = await getSiteContent<TestimonialItem[]>("testimonials");
  return d ?? [
    { quote: "JF Realty found us our Rehavia apartment in three days. Personal, fast, and genuinely helpful.", author: "T.G., Jerusalem" },
    { quote: "Finally an agent who actually knows the city. Found us the perfect rental for our whole family.", author: "M.K., Tel Aviv" },
    { quote: "Moved from New York and was stressed about finding a place. Jack had options ready before I landed.", author: "S.L., New York" },
  ];
}

export async function getLifestyleContent(): Promise<LifestyleContent> {
  const d = await getSiteContent<LifestyleContent>("lifestyle");
  return d ?? {
    title: "A Jerusalem apartment that actually fits your life.",
    subtitle: "Stone buildings, sunny balconies, and neighborhoods where neighbors still say good morning.",
  };
}

export async function getContactBanner(): Promise<ContactBannerContent> {
  const d = await getSiteContent<ContactBannerContent>("contact_banner");
  return d ?? {
    title: "Have a specific apartment in mind?",
    subtitle: "Tell us your budget, neighborhood, and needs — we'll do the searching.",
  };
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const d = await getSiteContent<SiteInfo>("site_info");
  return d ?? {
    brand: "JF Realty",
    agent_name: "Jack Freedman",
    phone: "+972533985043",
    phone_display: "+972 53-398-5043",
    whatsapp: "972533985043",
    email: "jack@jfrealty.co.il",
    address: "Jerusalem, Israel",
    tagline: "Jerusalem apartment rentals & sales — local expertise, personal service.",
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const d = await getSiteContent<AboutContent>("about");
  return d ?? {
    lead: "Jerusalem rental and property experts — practical, personal, and genuinely local.",
    body1: "JF Realty helps people find the right Jerusalem apartment — whether you're relocating, investing, or simply looking for a better place to live.",
    body2: "Our approach is straightforward: we listen, we search, we show you properties that actually match.",
  };
}

export async function getAppearance(): Promise<AppearanceContent> {
  const d = await getSiteContent<AppearanceContent>("appearance");
  return d ?? { accent_color: "#3dab2c", logo_url: "", hero_image_url: "" };
}

export async function upsertAppearance(value: AppearanceContent): Promise<void> {
  await upsertSiteContent("appearance", value);
}

// ── Storage: file upload ──────────────────────────────────────────────────────
// Uses the new 'property-media' bucket; falls back to 'property-images' for images

export async function uploadImage(file: File, path: string): Promise<string> {
  const bucket = "property-media";
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) {
    // Fallback to old bucket for backwards compat
    const { error: err2 } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
    if (err2) throw new Error(`Upload failed: ${error.message}`);
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVideo(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const bucket = "property-media";
  onProgress?.(10);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || "video/mp4",
  });

  if (error) throw new Error(`Video upload failed: ${error.message}`);
  onProgress?.(100);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(path: string) {
  await supabase.storage.from("property-media").remove([path]);
  await supabase.storage.from("property-images").remove([path]);
}

// ── DB health check ───────────────────────────────────────────────────────────
export type DbHealthStatus = "ok" | "no_table" | "no_data" | "error";

export async function checkDbHealth(): Promise<{ status: DbHealthStatus; message: string }> {
  try {
    const { data, error } = await supabase.from("listings").select("id").limit(1);
    if (error) {
      if (error.code === "42P01") return { status: "no_table", message: "Tables not found — run supabase-schema.sql first." };
      return { status: "error", message: error.message };
    }
    if (!data || data.length === 0) return { status: "no_data", message: "Tables exist but no data seeded yet." };
    return { status: "ok", message: "Connected" };
  } catch (e: any) {
    return { status: "error", message: e.message ?? "Unknown error" };
  }
}
