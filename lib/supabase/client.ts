import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://pxllnykfbdodbfqyzkmi.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bGxueWtmYmRvZGJmcXl6a21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjQ3ODMsImV4cCI6MjA3NTUwMDc4M30.VmdPx1fGkxNfmG2KV71mW_aV8f-OLsfThC2apK0qcUQ"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
