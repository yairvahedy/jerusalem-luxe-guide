-- JF Realty — Supabase schema
-- Run this entire file in Supabase SQL editor

-- Agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  portrait_url text,
  whatsapp text,
  phone text,
  email text,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price numeric not null default 0,
  type text not null default 'sale' check (type in ('sale', 'rent')),
  neighborhood text not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  sqm integer not null default 0,
  balcony boolean not null default false,
  mamad boolean not null default false,
  elevator boolean not null default false,
  parking boolean not null default false,
  description text,
  images text[] not null default '{}',
  video_url text,
  status text not null default 'available' check (status in ('available', 'sold', 'draft')),
  featured boolean not null default false,
  agent_id uuid references public.agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Storage bucket for property images
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can view property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Authenticated users can upload property images"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete property images"
  on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');

-- RLS
alter table public.agents enable row level security;
alter table public.listings enable row level security;

-- Agents policies
create policy "Anyone can read active agents" on public.agents
  for select using (active = true);

create policy "Authenticated can manage agents" on public.agents
  for all using (auth.role() = 'authenticated');

-- Listings policies
create policy "Anyone can read available/sold listings" on public.listings
  for select using (status in ('available', 'sold'));

create policy "Authenticated can manage listings" on public.listings
  for all using (auth.role() = 'authenticated');

-- Seed Jack Freedman as default agent
insert into public.agents (name, bio, whatsapp, phone, email, slug, active)
values (
  'Jack Freedman',
  'Jerusalem''s luxury real estate specialist. Born and raised in Jerusalem, Jack brings unmatched local expertise and a deeply personal approach to every transaction.',
  '972533985043',
  '+972 53-398-5043',
  'jack@jfrealty.co.il',
  'jack-freedman',
  true
) on conflict (slug) do nothing;

-- Seed initial listings from static data
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
