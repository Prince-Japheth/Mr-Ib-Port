"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Home, 
  User, 
  Briefcase, 
  Code, 
  Building, 
  FolderOpen, 
  Quote, 
  Link as LinkIcon, 
  Mail, 
  Settings, 
  ExternalLink,
  Languages,
  Search,
  Tag,
  Sparkles,
  Upload,
  GraduationCap,
  Eye
} from "lucide-react"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/search", label: "Search", icon: Search },
  { href: "/admin/personal-info", label: "Personal Info", icon: User },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/languages", label: "Languages", icon: Languages },
  { href: "/admin/experience", label: "Experience", icon: Building },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/floating-skills", label: "Floating Skills", icon: Sparkles },
  { href: "/admin/banner-images", label: "Banner Images", icon: Upload },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/social-links", label: "Social Links", icon: LinkIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  // { href: "/admin/section-visibility", label: "Section Visibility", icon: Eye },
]

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  useEffect(() => {
    fetchUnreadMessageCount()
    
    // Listen for message status changes
    const handleMessageStatusChange = () => {
      fetchUnreadMessageCount()
    }
    
    window.addEventListener('messageStatusChanged', handleMessageStatusChange)
    
    return () => {
      window.removeEventListener('messageStatusChanged', handleMessageStatusChange)
    }
  }, [])

  const fetchUnreadMessageCount = async () => {
    try {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (error) throw error
      setUnreadMessageCount(count || 0)
    } catch (error) {
      console.error('Error fetching unread message count:', error)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-50
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Navigation</h2>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            // Check if current path matches or is a sub-page of this item
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
            const hasNotification = item.href === '/admin/messages' && unreadMessageCount > 0
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive 
                    ? "bg-green-50 text-green-700 border-r-2 border-green-600" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center relative ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}>
                  <item.icon className="w-4 h-4" />
                  {hasNotification && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
                {hasNotification && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <Link
              href="/admin/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Profile</span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Settings</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                <ExternalLink className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">View Site</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
