import type React from "react"
import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  // Allow access to login page without authentication
  if (error || !data?.user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminHeader user={data.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">{children}</main>
      </div>
    </div>
  )
}
