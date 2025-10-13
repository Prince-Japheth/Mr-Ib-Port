import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()
    const searchTerm = `%${query}%`

    // Search across multiple tables
    const [
      { data: projects },
      { data: services },
      { data: experience },
      { data: testimonials },
      { data: skills },
      { data: languageSkills },
      { data: messages },
      { data: userProfile },
      { data: socialLinks },
      { data: siteSettings }
    ] = await Promise.all([
      // Projects
      supabase
        .from('projects')
        .select('id, title, description, created_at, is_active')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10),
      
      // Services
      supabase
        .from('services')
        .select('id, title, description, created_at, is_active')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10),
      
      // Experience
      supabase
        .from('experience')
        .select('id, company, position, description, start_date, end_date, created_at')
        .or(`company.ilike.${searchTerm},position.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10),
      
      // Testimonials (reviews table)
      supabase
        .from('reviews')
        .select('id, client_name, company, review_text, rating, created_at')
        .or(`client_name.ilike.${searchTerm},company.ilike.${searchTerm},review_text.ilike.${searchTerm}`)
        .limit(10),
      
      // Skills
      supabase
        .from('skills')
        .select('id, name, skill_type, created_at, is_active')
        .or(`name.ilike.${searchTerm},skill_type.ilike.${searchTerm}`)
        .limit(10),
      
      // Language Skills
      supabase
        .from('language_skills')
        .select('id, language, proficiency_percentage, created_at, is_active')
        .or(`language.ilike.${searchTerm}`)
        .limit(10),
      
      // Messages
      supabase
        .from('contact_messages')
        .select('id, name, email, message, created_at, is_read')
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},message.ilike.${searchTerm}`)
        .limit(10),
      
      // User Profile
      supabase
        .from('user_profile')
        .select('first_name, last_name, title, bio, location')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},title.ilike.${searchTerm},bio.ilike.${searchTerm},location.ilike.${searchTerm}`)
        .limit(5),
      
      // Social Links
      supabase
        .from('social_links')
        .select('id, platform, url, display_order, is_active')
        .or(`platform.ilike.${searchTerm},url.ilike.${searchTerm}`)
        .limit(10),
      
      // Site Settings
      supabase
        .from('site_settings')
        .select('id, setting_key, setting_value, description')
        .or(`setting_key.ilike.${searchTerm},setting_value.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10)
    ])

    // Combine and format results
    const results = [
      ...(projects || []).map(item => ({
        type: 'project',
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.created_at,
        status: item.is_active ? 'Active' : 'Inactive',
        url: `/admin/projects/${item.id}`
      })),
      
      ...(services || []).map(item => ({
        type: 'service',
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.created_at,
        status: item.is_active ? 'Active' : 'Inactive',
        url: `/admin/services/${item.id}`
      })),
      
      ...(experience || []).map(item => ({
        type: 'experience',
        id: item.id,
        title: `${item.position} at ${item.company}`,
        description: item.description,
        date: item.created_at,
        status: item.end_date ? 'Completed' : 'Current',
        url: `/admin/experience/${item.id}`
      })),
      
      ...(testimonials || []).map(item => ({
        type: 'testimonial',
        id: item.id,
        title: `Review by ${item.client_name}`,
        description: item.review_text,
        date: item.created_at,
        status: `${item.rating}/5 stars`,
        url: `/admin/testimonials/${item.id}`
      })),
      
      ...(skills || []).map(item => ({
        type: 'skill',
        id: item.id,
        title: item.name,
        description: `${item.skill_type}`,
        date: item.created_at,
        status: item.is_active ? 'Active' : 'Inactive',
        url: `/admin/skills/${item.id}`
      })),
      
      ...(languageSkills || []).map(item => ({
        type: 'language',
        id: item.id,
        title: item.language,
        description: `Proficiency: ${item.proficiency_percentage}%`,
        date: item.created_at,
        status: item.is_active ? 'Active' : 'Inactive',
        url: `/admin/languages/${item.id}`
      })),
      
      ...(messages || []).map(item => ({
        type: 'message',
        id: item.id,
        title: `Message from ${item.name}`,
        description: item.message,
        date: item.created_at,
        status: item.is_read ? 'Read' : 'Unread',
        url: `/admin/messages/${item.id}`
      })),
      
      ...(userProfile || []).map(item => ({
        type: 'profile',
        id: 'profile',
        title: `${item.first_name} ${item.last_name}`,
        description: item.title || item.bio,
        date: null,
        status: 'Profile',
        url: `/admin/personal-info`
      })),
      
      ...(socialLinks || []).map(item => ({
        type: 'social',
        id: item.id,
        title: item.platform,
        description: item.url,
        date: null,
        status: item.is_active ? 'Active' : 'Inactive',
        url: `/admin/social-links`
      })),
      
      ...(siteSettings || []).map(item => ({
        type: 'setting',
        id: item.id,
        title: item.setting_key,
        description: item.setting_value || item.description,
        date: null,
        status: 'Setting',
        url: `/admin/settings`
      }))
    ]

    // Add admin page matches if no results found
    if (results.length === 0) {
      const adminPages = [
        { type: 'page', id: 'dashboard', title: 'Dashboard', description: 'Admin dashboard overview', url: '/admin' },
        { type: 'page', id: 'personal-info', title: 'Personal Info', description: 'Manage personal information', url: '/admin/personal-info' },
        { type: 'page', id: 'services', title: 'Services', description: 'Manage services offered', url: '/admin/services' },
        { type: 'page', id: 'skills', title: 'Skills', description: 'Manage technical skills', url: '/admin/skills' },
        { type: 'page', id: 'languages', title: 'Languages', description: 'Manage language skills', url: '/admin/languages' },
        { type: 'page', id: 'experience', title: 'Experience', description: 'Manage work experience', url: '/admin/experience' },
        { type: 'page', id: 'projects', title: 'Projects', description: 'Manage portfolio projects', url: '/admin/projects' },
        { type: 'page', id: 'testimonials', title: 'Testimonials', description: 'Manage client testimonials', url: '/admin/testimonials' },
        { type: 'page', id: 'social-links', title: 'Social Links', description: 'Manage social media links', url: '/admin/social-links' },
        { type: 'page', id: 'messages', title: 'Messages', description: 'View contact messages', url: '/admin/messages' },
        { type: 'page', id: 'settings', title: 'Settings', description: 'Site settings and configuration', url: '/admin/settings' }
      ]
      
      const matchingPages = adminPages.filter(page => 
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
      )
      
      results.push(...matchingPages)
    }

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const queryLower = query.toLowerCase()
      
      if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1
      if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1
      return 0
    })

    // Debug logging
    console.log('Search query:', query)
    console.log('Results count:', results.length)
    console.log('Results by type:', {
      projects: projects?.length || 0,
      services: services?.length || 0,
      experience: experience?.length || 0,
      testimonials: testimonials?.length || 0,
      skills: skills?.length || 0,
      languageSkills: languageSkills?.length || 0,
      messages: messages?.length || 0,
      userProfile: userProfile?.length || 0,
      socialLinks: socialLinks?.length || 0,
      siteSettings: siteSettings?.length || 0
    })

    return NextResponse.json({ results: results.slice(0, 20) })
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
