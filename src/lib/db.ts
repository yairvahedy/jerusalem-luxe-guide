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
    .in("status", ["available", "sold"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DbListing[];
}

export async function getFeaturedListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .eq("status", "available")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DbListing[];
}

export async function getSoldListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .eq("status", "sold")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DbListing[];
}

export async function getAllListingsAdmin() {
  const { data, error } = await supabase
    .from("listings")
    .select("*, agents(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
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
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...listing, updated_at: new Date().toISOString() } as any)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DbListing;
}

export async function updateListing(id: string, listing: DbListingUpdate) {
  const { data, error } = await supabase
    .from("listings")
    .update({ ...listing, updated_at: new Date().toISOString() } as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DbListing;
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw error;
}

// ── Agents ────────────────────────────────────────────────────────────────────

export async function getAgents() {
  const { data, error } = await supabase
    .from("agents").select("*").eq("active", true).order("created_at");
  if (error) throw error;
  return (data ?? []) as unknown as Agent[];
}

export async function getAllAgentsAdmin() {
  const { data, error } = await supabase.from("agents").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []) as unknown as Agent[];
}

export async function createAgent(agent: AgentInsert) {
  const { data, error } = await supabase.from("agents").insert(agent as any).select().single();
  if (error) throw error;
  return data as unknown as Agent;
}

export async function updateAgent(id: string, agent: AgentUpdate) {
  const { data, error } = await supabase.from("agents").update(agent as any).eq("id", id).select().single();
  if (error) throw error;
  return data as unknown as Agent;
}

export async function deleteAgent(id: string) {
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw error;
}

// ── Neighborhoods ─────────────────────────────────────────────────────────────

export async function getNeighborhoods() {
  const { data, error } = await supabase
    .from("neighborhoods").select("*").eq("active", true).order("display_order");
  if (error) throw error;
  return (data ?? []) as unknown as Neighborhood[];
}

export async function getAllNeighborhoodsAdmin() {
  const { data, error } = await supabase
    .from("neighborhoods").select("*").order("display_order");
  if (error) throw error;
  return (data ?? []) as unknown as Neighborhood[];
}

export async function createNeighborhood(n: NeighborhoodInsert) {
  const { data, error } = await supabase.from("neighborhoods").insert(n as any).select().single();
  if (error) throw error;
  return data as unknown as Neighborhood;
}

export async function updateNeighborhood(id: string, n: NeighborhoodUpdate) {
  const { data, error } = await supabase.from("neighborhoods").update(n as any).eq("id", id).select().single();
  if (error) throw error;
  return data as unknown as Neighborhood;
}

export async function deleteNeighborhood(id: string) {
  const { error } = await supabase.from("neighborhoods").delete().eq("id", id);
  if (error) throw error;
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
  if (error) throw error;
}

// ── Typed content getters (with static defaults) ──────────────────────────────

export async function getHeroContent(): Promise<HeroContent> {
  const d = await getSiteContent<HeroContent>("hero");
  return d ?? { eyebrow: "Luxury Jerusalem Real Estate", title: "Where Jerusalem's most exceptional homes find their owners.", subtitle: "Private, curated, and personally guided by Jack Freedman." };
}

export async function getStats(): Promise<StatItem[]> {
  const d = await getSiteContent<StatItem[]>("stats");
  return d ?? [
    { value: "₪2B+", label: "In transactions" },
    { value: "150+", label: "Homes sold" },
    { value: "12+", label: "Years in Jerusalem" },
    { value: "100%", label: "Personal service" },
  ];
}

export async function getWhyJack(): Promise<WhyItem[]> {
  const d = await getSiteContent<WhyItem[]>("why_jack");
  return d ?? [
    { title: "Jerusalem native expertise", body: "Born here. Raised here. Connected to every neighborhood worth knowing." },
    { title: "Discreet, personal service", body: "Every client is handled directly — no juniors, no handoffs." },
    { title: "International reach", body: "Fluent service for Israeli and overseas buyers, in English and Hebrew." },
    { title: "Off-market access", body: "First call on properties that never reach a public listing." },
  ];
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const d = await getSiteContent<TestimonialItem[]>("testimonials");
  return d ?? [
    { quote: "Jack found us a home we didn't know existed. Discreet, professional, and genuinely Jerusalem.", author: "S.K., New York" },
    { quote: "From first call to closing, he was three steps ahead. The only agent we'll ever use.", author: "Family R., Tel Aviv" },
    { quote: "Knows every stone in this city. We trusted him completely — and he delivered.", author: "D.L., London" },
  ];
}

export async function getLifestyleContent(): Promise<LifestyleContent> {
  const d = await getSiteContent<LifestyleContent>("lifestyle");
  return d ?? { title: "A Jerusalem address is more than a home.", subtitle: "Stone-walled mornings, golden-hour terraces, and a city that has chosen its residents carefully for three thousand years." };
}

export async function getContactBanner(): Promise<ContactBannerContent> {
  const d = await getSiteContent<ContactBannerContent>("contact_banner");
  return d ?? { title: "Looking for something specific?", subtitle: "Tell Jack what you're searching for — he'll find it." };
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const d = await getSiteContent<SiteInfo>("site_info");
  return d ?? { brand: "JF Realty", agent_name: "Jack Freedman", phone: "+972 53-398-5043", phone_display: "+972 53-398-5043", whatsapp: "972533985043", email: "jack@jfrealty.co.il", address: "Jerusalem, Israel", tagline: "Luxury Jerusalem real estate, personally guided." };
}

export async function getAboutContent(): Promise<AboutContent> {
  const d = await getSiteContent<AboutContent>("about");
  return d ?? { lead: "Jerusalem's young luxury specialist — combining old-city instinct with modern service.", body1: "Jack Freedman represents a new generation of Jerusalem real estate.", body2: "His approach is personal, discreet, and uncompromising." };
}

export async function getAppearance(): Promise<AppearanceContent> {
  const d = await getSiteContent<AppearanceContent>("appearance");
  return d ?? { accent_color: "#3dab2c", logo_url: "", hero_image_url: "" };
}

export async function upsertAppearance(value: AppearanceContent): Promise<void> {
  await upsertSiteContent("appearance", value);
}

// ── Storage ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage.from("property-images").remove([path]);
  if (error) throw error;
}
