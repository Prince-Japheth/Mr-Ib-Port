-- Update testimonials table policies
alter table public.testimonials enable row level security;

-- Drop existing policies if they exist
drop policy if exists "testimonials_select_public" on public.testimonials;
drop policy if exists "testimonials_all_auth" on public.testimonials;

-- Allow public read access
create policy "testimonials_select_public"
  on public.testimonials for select
  using (true);

-- Allow authenticated users to manage
create policy "testimonials_all_auth"
  on public.testimonials for all
  using (auth.role() = 'authenticated');

-- Add avatar_url column if it doesn't exist
alter table public.testimonials add column if not exists avatar_url text;
