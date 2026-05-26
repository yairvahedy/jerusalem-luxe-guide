-- JF Realty — Supabase schema (complete, re-runnable)
-- Run this in Supabase SQL editor. Safe to re-run: uses IF NOT EXISTS + ON CONFLICT DO NOTHING.
--
-- SETUP STEPS:
-- 1. Run this file in Supabase → SQL Editor
-- 2. Go to Supabase → Authentication → Users → Add user (set email + password)
-- 3. Log in at your-site.com/admin with those credentials
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Agents ────────────────────────────────────────────────────────────────────
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_he text,
  bio text,
  portrait_url text,
  whatsapp text,
  phone text,
  email text,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.agents add column if not exists name_he text;

-- ── Listings ──────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price numeric not null default 0,
  type text not null default 'rent' check (type in ('sale', 'rent')),
  neighborhood text not null,
  address text,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  sqm integer not null default 0,
  arnona integer,
  balcony boolean not null default false,
  mamad boolean not null default false,
  elevator boolean not null default false,
  parking boolean not null default false,
  storage boolean not null default false,
  sukka_balcony boolean not null default false,
  accessibility boolean not null default false,
  renovated boolean not null default false,
  furnished boolean not null default false,
  air_conditioning boolean not null default false,
  description text,
  images text[] not null default '{}',
  video_url text,
  status text not null default 'available' check (status in ('available', 'rented', 'sold', 'draft')),
  featured boolean not null default false,
  agent_id uuid references public.agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.listings add column if not exists address text;
alter table public.listings add column if not exists arnona integer;
alter table public.listings add column if not exists storage boolean not null default false;
alter table public.listings add column if not exists sukka_balcony boolean not null default false;
alter table public.listings add column if not exists accessibility boolean not null default false;
alter table public.listings add column if not exists renovated boolean not null default false;
alter table public.listings add column if not exists furnished boolean not null default false;
alter table public.listings add column if not exists air_conditioning boolean not null default false;

-- ── Neighborhoods ─────────────────────────────────────────────────────────────
create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Site Content (key-value JSON store) ───────────────────────────────────────
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Storage: property-media bucket (images + videos) ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media', 'property-media', true,
  104857600,   -- 100 MB limit
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','video/webm','video/x-msvideo']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies
do $$ begin
  create policy "Anyone can view property media"
    on storage.objects for select using (bucket_id = 'property-media');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can upload property media"
    on storage.objects for insert
    with check (bucket_id = 'property-media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete property media"
    on storage.objects for delete
    using (bucket_id = 'property-media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can update property media"
    on storage.objects for update
    using (bucket_id = 'property-media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Keep old bucket working (backwards compat)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict do nothing;

do $$ begin
  create policy "Anyone can view property images"
    on storage.objects for select using (bucket_id = 'property-images');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can upload property images"
    on storage.objects for insert
    with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete property images"
    on storage.objects for delete
    using (bucket_id = 'property-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── Enable RLS ────────────────────────────────────────────────────────────────
alter table public.agents enable row level security;
alter table public.listings enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.site_content enable row level security;

-- ── RLS: Agents ───────────────────────────────────────────────────────────────
do $$ begin
  create policy "Public can read active agents"
    on public.agents for select using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can select all agents"
    on public.agents for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can insert agents"
    on public.agents for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can update agents"
    on public.agents for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete agents"
    on public.agents for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── RLS: Listings ─────────────────────────────────────────────────────────────
do $$ begin
  create policy "Public can read available and rented/sold listings"
    on public.listings for select using (status in ('available', 'rented', 'sold'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can select all listings"
    on public.listings for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can insert listings"
    on public.listings for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can update listings"
    on public.listings for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete listings"
    on public.listings for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── RLS: Neighborhoods ────────────────────────────────────────────────────────
do $$ begin
  create policy "Public can read active neighborhoods"
    on public.neighborhoods for select using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can select all neighborhoods"
    on public.neighborhoods for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can insert neighborhoods"
    on public.neighborhoods for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can update neighborhoods"
    on public.neighborhoods for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete neighborhoods"
    on public.neighborhoods for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── RLS: Site Content ─────────────────────────────────────────────────────────
do $$ begin
  create policy "Public can read site content"
    on public.site_content for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can insert site content"
    on public.site_content for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can update site content"
    on public.site_content for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can delete site content"
    on public.site_content for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── Seed: Agents ──────────────────────────────────────────────────────────────
insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active) values
  ('Jack Freedman', 'ג''ק פרידמן', 'Jerusalem rental and property specialist. Born and raised in Jerusalem, Jack brings genuine local knowledge and a personal approach to every search.', '972533985043', '+972 53-398-5043', 'jack@jfrealty.co.il', 'jack-freedman', true),
  ('Yehuda Klein', 'יהודה קליין', 'Specializes in residential rentals and sales across Jerusalem''s top neighborhoods with over a decade of hands-on experience.', '972585420333', '+972 58-542-0333', 'yehuda@jfrealty.co.il', 'yehuda-klein', true),
  ('Perla Goldenberg', 'פרלה גולדנברג', 'Helping families and individuals find the right Jerusalem apartment. Fluent in Hebrew, English, and French.', '972525782001', '+972 52-578-2001', 'perla@jfrealty.co.il', 'perla-goldenberg', true),
  ('Pinchas Liker', 'פנחס לייקר', 'Focused on long-term rentals and property investment in Jerusalem''s most sought-after addresses.', '972542018974', '+972 54-201-8974', 'pinchas@jfrealty.co.il', 'pinchas-liker', true),
  ('Yair Aronstam', 'יאיר ארונסתם', 'Expert in Jerusalem''s rental market and investment properties. Known for fast matches and sharp negotiation.', '972505532889', '+972 50-553-2889', 'yair@jfrealty.co.il', 'yair-aronstam', true)
on conflict (slug) do update set
  name_he = excluded.name_he,
  bio = excluded.bio,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email;

-- ── Seed: Neighborhoods ───────────────────────────────────────────────────────
insert into public.neighborhoods (name, slug, description, display_order, active) values
  ('German Colony', 'german-colony', 'Tree-lined streets and restored stone homes. One of Jerusalem''s most popular family neighborhoods, walkable and full of cafés.', 1, true),
  ('Rehavia', 'rehavia', 'Central, quiet, and prestigious. Known for its Bauhaus architecture and proximity to everything.', 2, true),
  ('Talbiya', 'talbiya', 'Large stone apartments, embassies, and manicured gardens. A classic Jerusalem address.', 3, true),
  ('Old Katamon', 'old-katamon', 'Leafy streets, beautiful stone buildings, and a tight-knit community feel. Ideal for families.', 4, true),
  ('City Center', 'city-center', 'Walking distance to everything. Vibrant, connected, and always in demand.', 5, true),
  ('Baka', 'baka', 'Trendy and relaxed, with cafés, young families, and a mix of renovated and classic apartments.', 6, true),
  ('Mamilla', 'mamilla', 'Steps from the Old City walls. Premium location with excellent shops and dining nearby.', 7, true),
  ('Arnona', 'arnona', 'Residential and spacious. Popular with families seeking larger apartments and peaceful streets.', 8, true)
on conflict (slug) do nothing;

-- ── Seed: Sample Listings ─────────────────────────────────────────────────────
insert into public.listings (slug, title, price, type, neighborhood, bedrooms, bathrooms, sqm, balcony, elevator, parking, renovated, description, images, status, featured) values
  ('german-colony-3br-rent', '3-Bedroom Apartment — German Colony', 9500, 'rent', 'German Colony', 3, 2, 110, true, false, false, true,
   'Bright and renovated 3-bedroom apartment in a quiet German Colony street. Large balcony, parquet floors, and great natural light throughout.', '{}', 'available', true),
  ('rehavia-2br-rent', 'Renovated 2BR in Central Rehavia', 7200, 'rent', 'Rehavia', 2, 1, 75, true, true, true, true,
   'Modern 2-bedroom apartment steps from Emek Refaim. Elevator building, parking, fully renovated kitchen and bathrooms.', '{}', 'available', true),
  ('old-katamon-4br-sale', '4-Bedroom Stone Apartment — Old Katamon', 5800000, 'sale', 'Old Katamon', 4, 2, 155, true, false, false, false,
   'Classic Jerusalem stone building in the heart of Old Katamon. High ceilings, arched windows, and a private garden area. A rare find on one of the neighborhood''s best streets.', '{}', 'available', false),
  ('baka-2br-rent', 'Charming 2BR in Baka', 6000, 'rent', 'Baka', 2, 1, 68, false, false, false, false,
   'Cozy 2-bedroom apartment in Baka. Close to cafés, the shuk, and public transport. Good natural light, quiet street.', '{}', 'available', false),
  ('city-center-studio-rent', 'Modern Studio — City Center', 4200, 'rent', 'City Center', 1, 1, 42, false, true, false, true,
   'Smart and modern studio apartment in a new building in the city center. Ideal for students or young professionals. Fully equipped.', '{}', 'available', false)
on conflict (slug) do nothing;

-- ── Seed: Site Content ────────────────────────────────────────────────────────
insert into public.site_content (key, value) values
  ('hero', '{"eyebrow":"Jerusalem Apartments","title":"Find your next Jerusalem apartment.","subtitle":"Rentals and sales across Jerusalem''s best neighborhoods — guided by local experts."}'::jsonb),
  ('stats', '[{"value":"500+","label":"Apartments placed"},{"value":"12+","label":"Years in Jerusalem"},{"value":"5","label":"Local agents"},{"value":"100%","label":"Personal service"}]'::jsonb),
  ('why_jack', '[{"title":"Deep local knowledge","body":"We know every street, building, and landlord. No guesswork — just genuine Jerusalem expertise."},{"title":"Fast WhatsApp service","body":"Send us a message and get a real response within the hour. We work on your timeline."},{"title":"Verified listings","body":"Every property we list has been visited in person. What you see is what you get."},{"title":"Hebrew and English","body":"Full service in both languages for Israeli and international clients alike."}]'::jsonb),
  ('testimonials', '[{"quote":"JF Realty found us our Rehavia apartment in three days. Personal, fast, and genuinely helpful.","author":"T.G., Jerusalem"},{"quote":"Finally an agent who actually knows the city. Found us the perfect rental for our whole family.","author":"M.K., Tel Aviv"},{"quote":"Moved from New York and was stressed about finding a place. Jack had options ready before I landed.","author":"S.L., New York"}]'::jsonb),
  ('lifestyle', '{"title":"A Jerusalem apartment that actually fits your life.","subtitle":"Stone buildings, sunny balconies, and neighborhoods where neighbors still say good morning."}'::jsonb),
  ('contact_banner', '{"title":"Have a specific apartment in mind?","subtitle":"Tell us your budget, neighborhood, and needs — we''ll do the searching."}'::jsonb),
  ('site_info', '{"brand":"JF Realty","agent_name":"Jack Freedman","phone":"+972533985043","phone_display":"+972 53-398-5043","whatsapp":"972533985043","email":"jack@jfrealty.co.il","address":"Jerusalem, Israel","tagline":"Jerusalem apartment rentals & sales — local expertise, personal service."}'::jsonb),
  ('about', '{"lead":"Jerusalem rental and property experts — practical, personal, and genuinely local.","body1":"JF Realty helps people find the right Jerusalem apartment — whether you''re relocating, investing, or simply looking for a better place to live. We cover rentals and sales across the city''s most sought-after neighborhoods.","body2":"Our approach is straightforward: we listen, we search, we show you properties that actually match. No pressure, no wasted time. Just good apartments and honest advice."}'::jsonb),
  ('appearance', '{"accent_color":"#3dab2c","logo_url":"","hero_image_url":""}'::jsonb)
on conflict (key) do nothing;
