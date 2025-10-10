"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Define the light mode accent color based on the stylesheet (rgb(76, 175, 80) -> #4caf50)
  const ACCENT_COLOR_HEX = "#4caf50" 

  // Function to create a lighter hover shade of the accent color for the button
  const getHoverColor = (hex: string, percent: number) => {
    let r = parseInt(hex.substring(1, 3), 16)
    let g = parseInt(hex.substring(3, 5), 16)
    let b = parseInt(hex.substring(5, 7), 16)

    const amount = 255 * (percent / 100)
    
    r = Math.min(255, r + amount)
    g = Math.min(255, g + amount)
    b = Math.min(255, b + amount)

    const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0')

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
  
  // Calculate a slightly lighter shade for hover effect (increase lightness by 20%)
  const HOVER_COLOR_HEX = getHoverColor(ACCENT_COLOR_HEX, 20);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-500">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ "--tw-focus-border-color": ACCENT_COLOR_HEX } as React.CSSProperties}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[var(--tw-focus-border-color)] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ "--tw-focus-border-color": ACCENT_COLOR_HEX } as React.CSSProperties}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[var(--tw-focus-border-color)] transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                backgroundColor: ACCENT_COLOR_HEX, 
                '--tw-hover-bg-color': HOVER_COLOR_HEX 
              } as React.CSSProperties}
              className="w-full px-4 py-3 text-black font-medium rounded-lg hover:bg-[var(--tw-hover-bg-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
