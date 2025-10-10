-- Create language_skills table
create table if not exists public.language_skills (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  percentage integer not null check (percentage >= 0 and percentage <= 100),
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.language_skills enable row level security;

-- Allow public read access
create policy "language_skills_select_public"
  on public.language_skills for select
  using (true);

-- Allow authenticated users to manage
create policy "language_skills_all_auth"
  on public.language_skills for all
  using (auth.role() = 'authenticated');

-- Insert default language skills
insert into public.language_skills (language, percentage, sort_order)
values 
  ('English', 95, 1),
  ('French', 80, 2),
  ('Spanish', 70, 3),
  ('German', 60, 4)
on conflict (id) do nothing;
