"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export default function AdminHeader({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Portfolio Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
