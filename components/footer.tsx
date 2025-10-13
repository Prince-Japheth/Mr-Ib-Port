"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Footer() {
  const [copyrightText, setCopyrightText] = useState("© 2025. John Doe. All rights reserved.")

  useEffect(() => {
    // Fetch copyright text from site settings
    const fetchCopyrightText = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'copyright_text')
          .single()

        if (error) {
          console.error('Error fetching copyright text:', error)
        } else if (data?.setting_value) {
          // Replace the year placeholder with current year
          const currentYear = new Date().getFullYear()
          const dynamicCopyright = data.setting_value.replace('2023', currentYear.toString())
          setCopyrightText(`© ${currentYear}. ${dynamicCopyright}`)
        }
      } catch (error) {
        console.error('Error fetching copyright text:', error)
      }
    }

    fetchCopyrightText()
  }, [])

  return (
    <footer className="border-t border-slate-800 py-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>{copyrightText}</p>
          <p>
            Built with <span className="text-cyan-400">Next.js</span> and{" "}
            <span className="text-cyan-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}