import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts for dashboard stats
  const [{ count: projectsCount }, { count: servicesCount }, { count: experienceCount }, { count: testimonialsCount }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("experience").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
    ])

  const stats = [
    { label: "Projects", count: projectsCount || 0, href: "/admin/projects", icon: "fa-folder" },
    { label: "Services", count: servicesCount || 0, href: "/admin/services", icon: "fa-briefcase" },
    { label: "Experience", count: experienceCount || 0, href: "/admin/experience", icon: "fa-building" },
    { label: "Testimonials", count: testimonialsCount || 0, href: "/admin/testimonials", icon: "fa-quote-left" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#00d4ff] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <i className={`fas ${stat.icon} text-2xl text-[#00d4ff]`}></i>
              <span className="text-3xl font-bold text-white">{stat.count}</span>
            </div>
            <h3 className="text-gray-300 font-medium">{stat.label}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/projects/new"
              className="block px-4 py-3 bg-[#00d4ff] text-black font-medium rounded-lg hover:bg-[#00b8e6] transition-colors text-center"
            >
              Add New Project
            </Link>
            <Link
              href="/admin/experience/new"
              className="block px-4 py-3 bg-[#2a2a2a] text-white font-medium rounded-lg hover:bg-[#3a3a3a] transition-colors text-center"
            >
              Add Experience
            </Link>
            <Link
              href="/admin/testimonials/new"
              className="block px-4 py-3 bg-[#2a2a2a] text-white font-medium rounded-lg hover:bg-[#3a3a3a] transition-colors text-center"
            >
              Add Testimonial
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Content Management</h2>
          <div className="space-y-3">
            <Link
              href="/admin/personal-info"
              className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
            >
              <span className="text-white">Personal Information</span>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Link>
            <Link
              href="/admin/skills"
              className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
            >
              <span className="text-white">Skills & Languages</span>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Link>
            <Link
              href="/admin/social-links"
              className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
            >
              <span className="text-white">Social Media Links</span>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
