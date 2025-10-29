import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Use actual keys from `.env.local` instead of process.env for server context
const SUPABASE_URL = "https://pxllnykfbdodbfqyzkmi.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bGxueWtmYmRvZGJmcXl6a21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjQ3ODMsImV4cCI6MjA3NTUwMDc4M30.VmdPx1fGkxNfmG2KV71mW_aV8f-OLsfThC2apK0qcUQ"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
