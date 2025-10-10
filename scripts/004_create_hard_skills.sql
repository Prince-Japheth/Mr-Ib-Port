-- Create hard_skills table
create table if not exists public.hard_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  category text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.hard_skills enable row level security;

-- Allow public read access
create policy "hard_skills_select_public"
  on public.hard_skills for select
  using (true);

-- Allow authenticated users to manage
create policy "hard_skills_all_auth"
  on public.hard_skills for all
  using (auth.role() = 'authenticated');

-- Insert default hard skills
insert into public.hard_skills (name, icon_url, category, sort_order)
values 
  ('React', '/images/skills/react.svg', 'Frontend', 1),
  ('Next.js', '/images/skills/nextjs.svg', 'Frontend', 2),
  ('TypeScript', '/images/skills/typescript.svg', 'Language', 3),
  ('Node.js', '/images/skills/nodejs.svg', 'Backend', 4),
  ('PostgreSQL', '/images/skills/postgresql.svg', 'Database', 5),
  ('Tailwind CSS', '/images/skills/tailwind.svg', 'Frontend', 6)
on conflict (id) do nothing;
