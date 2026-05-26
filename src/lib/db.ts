import { supabase } from "./supabase";
import type { DbListing, DbListingInsert, DbListingUpdate, Agent, AgentInsert, AgentUpdate } from "./database.types";

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
  const payload = { ...listing, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("listings")
    .insert(payload as any)
    .select()
    .single();
  if (error) throw error;
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
    .from("agents")
    .select("*")
    .eq("active", true)
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as unknown as Agent[];
}

export async function getAllAgentsAdmin() {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as unknown as Agent[];
}

export async function getAgentBySlug(slug: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data as unknown as Agent | null;
}

export async function createAgent(agent: AgentInsert) {
  const { data, error } = await supabase
    .from("agents")
    .insert(agent as any)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Agent;
}

export async function updateAgent(id: string, agent: AgentUpdate) {
  const { data, error } = await supabase
    .from("agents")
    .update(agent as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Agent;
}

export async function deleteAgent(id: string) {
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw error;
}

// ── Storage ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage.from("property-images").remove([path]);
  if (error) throw error;
}
