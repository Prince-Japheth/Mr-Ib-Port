-- Create social_links table
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.social_links enable row level security;

-- Allow public read access
create policy "social_links_select_public"
  on public.social_links for select
  using (true);

-- Allow authenticated users to manage
create policy "social_links_all_auth"
  on public.social_links for all
  using (auth.role() = 'authenticated');

-- Insert default social links
insert into public.social_links (platform, url, icon, sort_order)
values 
  ('GitHub', 'https://github.com/johndoe', 'fab fa-github', 1),
  ('LinkedIn', 'https://linkedin.com/in/johndoe', 'fab fa-linkedin', 2),
  ('Twitter', 'https://twitter.com/johndoe', 'fab fa-twitter', 3),
  ('Dribbble', 'https://dribbble.com/johndoe', 'fab fa-dribbble', 4)
on conflict (id) do nothing;
