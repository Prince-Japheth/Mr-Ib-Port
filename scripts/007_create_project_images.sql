-- Create project_images table for multiple images per project
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.project_images enable row level security;

-- Allow public read access
create policy "project_images_select_public"
  on public.project_images for select
  using (true);

-- Allow authenticated users to manage
create policy "project_images_all_auth"
  on public.project_images for all
  using (auth.role() = 'authenticated');
