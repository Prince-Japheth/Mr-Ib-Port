import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  FolderOpen, 
  Briefcase, 
  Building, 
  Quote, 
  Code, 
  Languages, 
  Mail, 
  Plus, 
  ChartLine 
} from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch comprehensive data for dashboard
  const [
    { count: projectsCount },
    { count: servicesCount },
    { count: experienceCount },
    { count: reviewsCount },
    { count: skillsCount },
    { count: languageSkillsCount },
    { count: contactMessagesCount },
    { data: recentProjects },
    { data: recentMessages },
    { data: userProfile }
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("experience").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("language_skills").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("id, title, created_at, is_active").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_messages").select("id, name, email, created_at, is_read").order("created_at", { ascending: false }).limit(5),
    supabase.from("user_profile").select("first_name, last_name, title").single()
  ])

  const stats = [
    { 
      label: "Projects", 
      count: projectsCount || 0, 
      href: "/admin/projects", 
      icon: FolderOpen
    },
    { 
      label: "Services", 
      count: servicesCount || 0, 
      href: "/admin/services", 
      icon: Briefcase
    },
    { 
      label: "Experience", 
      count: experienceCount || 0, 
      href: "/admin/experience", 
      icon: Building
    },
    { 
      label: "Testimonials", 
      count: reviewsCount || 0, 
      href: "/admin/testimonials", 
      icon: Quote
    },
    { 
      label: "Skills", 
      count: skillsCount || 0, 
      href: "/admin/skills", 
      icon: Code
    },
    { 
      label: "Languages", 
      count: languageSkillsCount || 0, 
      href: "/admin/skills", 
      icon: Languages
    },
    { 
      label: "Messages", 
      count: contactMessagesCount || 0, 
      href: "/admin/messages", 
      icon: Mail
    }
  ]

  const quickActions = [
    { label: "Add Project", href: "/admin/projects/new", icon: Plus },
    { label: "Add Experience", href: "/admin/experience/new", icon: Plus },
    { label: "Add Testimonial", href: "/admin/testimonials/new", icon: Plus },
    { label: "Add Service", href: "/admin/services/new", icon: Plus }
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {userProfile?.first_name || "Admin"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-500 text-sm">Last updated</p>
              <p className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <ChartLine className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-gray-900">{stat.count}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
            <h3 className="text-gray-700 font-medium">{stat.label}</h3>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 text-sm md:text-base"
                >
                  <action.icon className="w-4 h-4" />
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link href="/admin/projects" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects?.map((project, index) => (
                <div key={project.id} className="flex items-center space-x-3 md:space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 font-medium truncate">{project.title}</h4>
                    <p className="text-gray-500 text-sm">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    project.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {project.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          <Link href="/admin/messages" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {recentMessages?.map((message) => (
            <div key={message.id} className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  message.is_read 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {message.is_read ? 'Read' : 'New'}
                </div>
              </div>
              <h4 className="text-gray-900 font-medium mb-1 truncate">{message.name}</h4>
              <p className="text-gray-600 text-sm mb-2 truncate">{message.email}</p>
              <p className="text-gray-500 text-xs">
                {new Date(message.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
