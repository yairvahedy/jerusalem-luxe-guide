-- JF Realty — Supabase schema (complete)
-- Run this entire file in Supabase SQL editor (safe to re-run: uses IF NOT EXISTS + ON CONFLICT DO NOTHING)

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

-- Add name_he if upgrading from older schema
alter table public.agents add column if not exists name_he text;

-- ── Listings ──────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price numeric not null default 0,
  type text not null default 'sale' check (type in ('sale', 'rent')),
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
  status text not null default 'available' check (status in ('available', 'sold', 'draft')),
  featured boolean not null default false,
  agent_id uuid references public.agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add new columns if upgrading from older schema
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

-- ── Site Content (flexible JSON key-value store) ───────────────────────────────
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Storage bucket ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict do nothing;

-- Storage policies
do $$ begin
  create policy "Anyone can view property images"
    on storage.objects for select
    using (bucket_id = 'property-images');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated users can upload property images"
    on storage.objects for insert
    with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated users can delete property images"
    on storage.objects for delete
    using (bucket_id = 'property-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.agents enable row level security;
alter table public.listings enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.site_content enable row level security;

-- Agents
do $$ begin
  create policy "Anyone can read active agents" on public.agents
    for select using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can manage agents" on public.agents
    for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Listings
do $$ begin
  create policy "Anyone can read available/sold listings" on public.listings
    for select using (status in ('available', 'sold'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can manage listings" on public.listings
    for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Neighborhoods
do $$ begin
  create policy "Anyone can read active neighborhoods" on public.neighborhoods
    for select using (active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can manage neighborhoods" on public.neighborhoods
    for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Site content
do $$ begin
  create policy "Anyone can read site content" on public.site_content
    for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated can manage site content" on public.site_content
    for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── Seed: Agents ──────────────────────────────────────────────────────────────
insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active)
values (
  'Jack Freedman', 'ג''ק פרידמן',
  'Jerusalem''s luxury real estate specialist. Born and raised in Jerusalem, Jack brings unmatched local expertise and a deeply personal approach to every transaction.',
  '972533985043', '+972 53-398-5043', 'jack@jfrealty.co.il', 'jack-freedman', true
) on conflict (slug) do update set name_he = excluded.name_he;

insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active)
values (
  'Yehuda Klein', 'יהודה קליין',
  'Specializes in residential sales across Jerusalem''s finest neighborhoods with over a decade of experience.',
  '972585420333', '+972 58-542-0333', 'yehuda@jfrealty.co.il', 'yehuda-klein', true
) on conflict (slug) do nothing;

insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active)
values (
  'Perla Goldenberg', 'פרלה גולדנברג',
  'Bringing warmth and expertise to every client search. Fluent in Hebrew, English, and French.',
  '972525782001', '+972 52-578-2001', 'perla@jfrealty.co.il', 'perla-goldenberg', true
) on conflict (slug) do nothing;

insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active)
values (
  'Pinchas Liker', 'פנחס לייקר',
  'Focused on high-value properties and international clients seeking Jerusalem''s most exclusive addresses.',
  '972542018974', '+972 54-201-8974', 'pinchas@jfrealty.co.il', 'pinchas-liker', true
) on conflict (slug) do nothing;

insert into public.agents (name, name_he, bio, whatsapp, phone, email, slug, active)
values (
  'Yair Aronstam', 'יאיר ארונסתם',
  'Expert in Jerusalem''s rental market and investment properties. Known for fast closings and sharp negotiation.',
  '972505532889', '+972 50-553-2889', 'yair@jfrealty.co.il', 'yair-aronstam', true
) on conflict (slug) do nothing;

-- ── Seed: Listings ───────────────────────────────────────────────────────────
insert into public.listings (slug, title, price, type, neighborhood, bedrooms, bathrooms, sqm, balcony, mamad, elevator, parking, description, images, status, featured)
values
  ('mamilla-penthouse-old-city-view', 'Mamilla Penthouse with Old City View', 18500000, 'sale', 'Mamilla', 4, 3, 240, true, true, true, true,
   'A rare penthouse moments from the Old City walls. Floor-to-ceiling windows frame the golden Jerusalem skyline. Imported Italian marble, custom millwork, private rooftop terrace.',
   '{}', 'available', true),
  ('german-colony-garden-residence', 'German Colony Garden Residence', 9750000, 'sale', 'German Colony', 5, 3, 210, true, true, false, true,
   'Restored Templar-era stone home with a private walled garden. Arched windows, vaulted ceilings, and a tranquil position on one of the colony''s most coveted streets.',
   '{}', 'available', true),
  ('talbiya-stone-villa', 'Talbiya Classic Stone Villa', 24000000, 'sale', 'Talbiya', 6, 5, 380, true, true, true, true,
   'Landmark villa in the heart of Talbiya. Soaring ceilings, original mosaics, and a private pool — minutes from the Presidential Residence.',
   '{}', 'available', true),
  ('rehavia-boutique-apartment', 'Rehavia Boutique Apartment', 6200000, 'sale', 'Rehavia', 3, 2, 140, true, true, true, true,
   'Elegant Bauhaus apartment in a boutique building. Fully renovated with hand-laid herringbone oak, brass fixtures, and a sunlit south-facing balcony.',
   '{}', 'available', false),
  ('old-katamon-family-home', 'Old Katamon Family Home', 32000, 'rent', 'Old Katamon', 4, 3, 180, true, true, true, true,
   'Light-filled four bedroom in a quiet leafy street. Move-in ready, beautifully appointed, ideal for relocating families.',
   '{}', 'available', false),
  ('sold-mamilla-residence', 'Mamilla Signature Residence', 16200000, 'sale', 'Mamilla', 4, 3, 220, true, true, true, true,
   'Sold off-market within three weeks.', '{}', 'sold', false),
  ('sold-german-colony-townhouse', 'German Colony Townhouse', 11800000, 'sale', 'German Colony', 5, 4, 260, true, true, false, true,
   'Closed with an international buyer.', '{}', 'sold', false)
on conflict (slug) do nothing;

-- ── Seed: Neighborhoods ───────────────────────────────────────────────────────
insert into public.neighborhoods (name, slug, description, display_order, active) values
  ('Mamilla', 'mamilla', 'At the gates of the Old City. Luxury retail, hotels, and addresses with views that no other city can offer.', 1, true),
  ('German Colony', 'german-colony', 'Tree-lined streets, restored Templar stone homes, and Jerusalem''s most coveted family neighborhood.', 2, true),
  ('Rehavia', 'rehavia', 'Bauhaus elegance and intellectual heritage. Walkable, central, and quietly prestigious.', 3, true),
  ('Talbiya', 'talbiya', 'Diplomats and dynasties. Stone villas, manicured gardens, and Jerusalem''s most refined zip code.', 4, true),
  ('Old Katamon', 'old-katamon', 'Quiet, leafy streets and beautifully restored stone homes, beloved by families and diplomats alike.', 5, true),
  ('City Center', 'city-center', 'The pulse of modern Jerusalem — walkable, vibrant, and always in demand.', 6, true)
on conflict (slug) do nothing;

-- ── Seed: Site Content ────────────────────────────────────────────────────────
insert into public.site_content (key, value) values
  ('hero', '{"eyebrow":"Luxury Jerusalem Real Estate","title":"Where Jerusalem''s most exceptional homes find their owners.","subtitle":"Private, curated, and personally guided by Jack Freedman."}'::jsonb),
  ('stats', '[{"value":"₪2B+","label":"In transactions"},{"value":"150+","label":"Homes sold"},{"value":"12+","label":"Years in Jerusalem"},{"value":"100%","label":"Personal service"}]'::jsonb),
  ('why_jack', '[{"title":"Jerusalem native expertise","body":"Born here. Raised here. Connected to every neighborhood worth knowing."},{"title":"Discreet, personal service","body":"Every client is handled directly — no juniors, no handoffs."},{"title":"International reach","body":"Fluent service for Israeli and overseas buyers, in English and Hebrew."},{"title":"Off-market access","body":"First call on properties that never reach a public listing."}]'::jsonb),
  ('testimonials', '[{"quote":"Jack found us a home we didn''t know existed. Discreet, professional, and genuinely Jerusalem.","author":"S.K., New York"},{"quote":"From first call to closing, he was three steps ahead. The only agent we''ll ever use.","author":"Family R., Tel Aviv"},{"quote":"Knows every stone in this city. We trusted him completely — and he delivered.","author":"D.L., London"}]'::jsonb),
  ('lifestyle', '{"title":"A Jerusalem address is more than a home.","subtitle":"Stone-walled mornings, golden-hour terraces, and a city that has chosen its residents carefully for three thousand years."}'::jsonb),
  ('contact_banner', '{"title":"Looking for something specific?","subtitle":"Tell Jack what you''re searching for — he''ll find it."}'::jsonb),
  ('site_info', '{"brand":"JF Realty","agent_name":"Jack Freedman","phone":"+972 53-398-5043","phone_display":"+972 53-398-5043","whatsapp":"972533985043","email":"jack@jfrealty.co.il","address":"Jerusalem, Israel","tagline":"Luxury Jerusalem real estate, personally guided."}'::jsonb),
  ('about', '{"lead":"Jerusalem''s young luxury specialist — combining old-city instinct with modern service.","body1":"Jack Freedman represents a new generation of Jerusalem real estate. With deep roots in the city and a sharp eye for architecture, light, and value, he guides buyers from Israel and abroad through the city''s most desirable neighborhoods.","body2":"His approach is personal, discreet, and uncompromising. Every relationship begins with a conversation — and ends with the keys to a home worth waiting for."}'::jsonb),
  ('appearance', '{"accent_color":"#3dab2c","logo_url":"","hero_image_url":""}'::jsonb)
on conflict (key) do nothing;
