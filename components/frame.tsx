"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface SocialLink {
  id: number
  platform: string
  url: string
  icon_class: string
  display_order: number
  is_active: boolean
}

export function Frame() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [logoText, setLogoText] = useState("J")
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [contactEmail, setContactEmail] = useState("")

  useEffect(() => {
    setMounted(true)
    
    // Fetch site settings and social links
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        // Fetch logo text and contact email from site settings
        const { data: settings, error: settingsError } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['logo_text', 'contact_email'])

        if (settingsError) {
          console.error('Error fetching site settings:', settingsError)
        } else if (settings) {
          settings.forEach(setting => {
            if (setting.setting_key === 'logo_text') {
              setLogoText(setting.setting_value || 'J')
            } else if (setting.setting_key === 'contact_email') {
              setContactEmail(setting.setting_value || '')
            }
          })
        }

        // Fetch social links
        const { data: links, error: linksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (linksError) {
          console.error('Error fetching social links:', linksError)
        } else {
          setSocialLinks(links || [])
        }
      } catch (error) {
        console.error('Error fetching frame data:', error)
      }
    }

    fetchData()
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const getPageName = () => {
    if (pathname === "/") return "Homepage"
    if (pathname.startsWith("/projects")) return "Projects"
    if (pathname === "/contact") return "Contact"
    return "Homepage"
  }


  return (
    <div className="mil-frame">
      {/* top bar */}
      <div className="mil-top-panel">
        <Link href="/" className="mil-logo">
          <span className="mil-dot">{logoText}</span>
        </Link>

        <div className="mil-navigation">
          <nav className="mil-menu-transition">
            <ul>
              <li className={`mil-has-children ${isActive("/") ? "mil-active" : ""}`}>
                <Link href="/">Home</Link>
              </li>
              <li className={`mil-has-children ${isActive("/projects") ? "mil-active" : ""}`}>
                <Link href="/projects">Projects</Link>
              </li>
              <li className={isActive("/contact") ? "mil-active" : ""}>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mil-top-panel-btns">
          <Link 
            href={contactEmail ? `mailto:${contactEmail}` : "/contact"} 
            className="mil-contact-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-mail"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </Link>

          <div className="mil-menu-btn">
            <span></span>
          </div>
        </div>
      </div>
      {/* top bar end */}

      {/* left bar */}
      <div className="mil-left-panel">
        <div className="mil-page-name mil-upper mil-dark">{getPageName()}</div>

        <ul className="mil-social-icons">
          {socialLinks.length > 0 ? (
            socialLinks.map((link) => (
              <li key={link.id}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  className="social-icon" 
                  rel="noreferrer"
                >
                  <i className={link.icon_class}></i>
                </a>
              </li>
            ))
          ) : null}
        </ul>
      </div>
      {/* left bar end */}

      {/* back to top */}
      <div className="mil-back-to-top">
        <a href="#top" className="mil-link mil-btt-icon">
          <span>Back to top</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-right"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
      {/* back to top end */}
    </div>
  )
}
