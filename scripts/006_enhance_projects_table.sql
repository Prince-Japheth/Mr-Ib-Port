-- Drop existing projects table if it exists and recreate with enhanced fields
drop table if exists public.projects cascade;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text,
  client text,
  date text,
  description text,
  technical_implementation text,
  featured_image_url text,
  github_url text,
  project_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.projects enable row level security;

-- Allow public read access
create policy "projects_select_public"
  on public.projects for select
  using (true);

-- Allow authenticated users to manage
create policy "projects_all_auth"
  on public.projects for all
  using (auth.role() = 'authenticated');

-- Insert sample projects
insert into public.projects (title, slug, category, client, date, description, technical_implementation, featured_image_url, github_url, project_url, sort_order)
values 
  (
    'E-Commerce Platform',
    'ecommerce-platform',
    'Web Development',
    'TechCorp Inc.',
    'January 2024',
    'A modern e-commerce platform built with Next.js and Stripe integration. Features include product catalog, shopping cart, checkout process, and order management.',
    'Built using Next.js 14 with App Router, TypeScript, Tailwind CSS, and Supabase for the database. Integrated Stripe for payment processing and implemented server-side rendering for optimal performance.',
    '/images/projects/ecommerce.jpg',
    'https://github.com/johndoe/ecommerce',
    'https://ecommerce-demo.vercel.app',
    1
  ),
  (
    'Task Management App',
    'task-management-app',
    'Web Development',
    'ProductivityCo',
    'March 2024',
    'A collaborative task management application with real-time updates. Users can create projects, assign tasks, set deadlines, and track progress.',
    'Developed with React, Node.js, Express, and MongoDB. Implemented WebSocket connections for real-time collaboration and used JWT for authentication.',
    '/images/projects/taskapp.jpg',
    'https://github.com/johndoe/taskapp',
    'https://taskapp-demo.vercel.app',
    2
  )
on conflict (slug) do nothing;
