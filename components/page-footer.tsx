"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function PageFooter() {
  const [copyrightText, setCopyrightText] = useState("All rights reserved.")

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
    <footer className="mil-fw">
      <p className="mil-light-soft">
        {copyrightText}
      </p>
    </footer>
  )
}
