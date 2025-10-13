import type React from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import "./globals.css" // Keep global styles here

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  
  // Fetch site settings data
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['site_title', 'site_description'])

  if (settingsError) {
    console.error('Error fetching site settings for metadata:', settingsError)
  }

  const siteTitle = settings?.find(s => s.setting_key === 'site_title')?.setting_value
  const siteDescription = settings?.find(s => s.setting_key === 'site_description')?.setting_value

  return {
    title: siteTitle,
    description: siteDescription,
    generator: 'https://jethroportfolio.vercel.app'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zxx">
      <head>
        <link rel="stylesheet" href="/css/font-awesome.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}