-- Create personal_info table for storing portfolio owner information
create table if not exists public.personal_info (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  bio text,
  avatar_url text,
  signature_url text,
  resume_url text,
  years_experience integer,
  email text,
  phone text,
  location text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.personal_info enable row level security;

-- Allow public read access
create policy "personal_info_select_public"
  on public.personal_info for select
  using (true);

-- Allow authenticated users to update
create policy "personal_info_update_auth"
  on public.personal_info for update
  using (auth.role() = 'authenticated');

-- Insert default data
insert into public.personal_info (full_name, title, bio, years_experience, email, phone, location)
values (
  'John Doe',
  'Software Engineer',
  'I am a passionate software engineer with expertise in full-stack development. I love creating beautiful and functional web applications that solve real-world problems.',
  5,
  'john.doe@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA'
) on conflict (id) do nothing;
