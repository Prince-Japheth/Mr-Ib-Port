-- Update experience table policies if needed
alter table public.experience enable row level security;

-- Drop existing policies if they exist
drop policy if exists "experience_select_public" on public.experience;
drop policy if exists "experience_all_auth" on public.experience;

-- Allow public read access
create policy "experience_select_public"
  on public.experience for select
  using (true);

-- Allow authenticated users to manage
create policy "experience_all_auth"
  on public.experience for all
  using (auth.role() = 'authenticated');
