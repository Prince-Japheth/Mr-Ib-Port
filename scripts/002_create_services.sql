-- Create services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.services enable row level security;

-- Allow public read access
create policy "services_select_public"
  on public.services for select
  using (true);

-- Allow authenticated users to manage
create policy "services_all_auth"
  on public.services for all
  using (auth.role() = 'authenticated');

-- Insert default services
insert into public.services (title, description, icon, sort_order)
values 
  ('Web Development', 'Building responsive and modern web applications using the latest technologies.', 'fa-code', 1),
  ('UI/UX Design', 'Creating beautiful and intuitive user interfaces that provide great user experiences.', 'fa-palette', 2),
  ('Mobile Development', 'Developing cross-platform mobile applications for iOS and Android.', 'fa-mobile-alt', 3)
on conflict (id) do nothing;
