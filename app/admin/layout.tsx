"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import NextTopLoader from "nextjs-toploader"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const cookies = document.cookie.split(';')
      const adminCookie = cookies.find(cookie =>
        cookie.trim().startsWith('admin-authenticated=')
      )
      const isAuth = adminCookie?.split('=')[1] === 'true'
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      if (!isAuth && !window.location.pathname.includes('/admin/login')) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router, pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c9baf]"></div>
      </div>
    )
  }

  // Allow access to login page without authentication
  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <>
      <NextTopLoader color="#10b981" height={3} showSpinner={false} />
      <div className="min-h-screen bg-gray-50">
        <AdminHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
        <div className="flex">
          <AdminSidebar isOpen={isMenuOpen} onClose={closeMenu} />
          <main className="flex-1 p-4 md:p-6 md:ml-64 min-h-[calc(100vh-73px)]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
