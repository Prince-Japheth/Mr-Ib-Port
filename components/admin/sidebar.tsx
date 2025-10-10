"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "fa-home" },
  { href: "/admin/personal-info", label: "Personal Info", icon: "fa-user" },
  { href: "/admin/services", label: "Services", icon: "fa-briefcase" },
  { href: "/admin/skills", label: "Skills", icon: "fa-code" },
  { href: "/admin/experience", label: "Experience", icon: "fa-building" },
  { href: "/admin/projects", label: "Projects", icon: "fa-folder" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "fa-quote-left" },
  { href: "/admin/social-links", label: "Social Links", icon: "fa-link" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-[#00d4ff] text-black" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
