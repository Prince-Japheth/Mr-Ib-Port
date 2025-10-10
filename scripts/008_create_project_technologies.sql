-- Create project_technologies table for technologies used in each project
create table if not exists public.project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  technology text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.project_technologies enable row level security;

-- Allow public read access
create policy "project_technologies_select_public"
  on public.project_technologies for select
  using (true);

-- Allow authenticated users to manage
create policy "project_technologies_all_auth"
  on public.project_technologies for all
  using (auth.role() = 'authenticated');
