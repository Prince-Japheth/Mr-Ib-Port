"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface RightBannerProps {
  backgroundImage?: string
  showPerson?: boolean
}

interface FloatingSkill {
  id: number
  name: string
  icon_url: string
  alt_text: string | null
  position_top: string | null
  position_left: string | null
  position_bottom: string | null
  position_right: string | null
  width: string
  height: string
  display_order: number
  is_active: boolean
}

interface BannerImage {
  id: number
  image_type: string
  image_url: string
  alt_text: string | null
  is_default: boolean
  is_active: boolean
}

export function RightBanner({ backgroundImage, showPerson = true }: RightBannerProps) {
  const [floatingSkills, setFloatingSkills] = useState<FloatingSkill[]>([])
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([])

  useEffect(() => {
    fetchFloatingSkills()
    fetchBannerImages()
  }, [])

  const fetchFloatingSkills = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('floating_skills')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setFloatingSkills(data || [])
    } catch (error) {
      console.error('Error fetching floating skills:', error)
    }
  }

  const fetchBannerImages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('banner_images')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })

      if (error) throw error
      setBannerImages(data || [])
    } catch (error) {
      console.error('Error fetching banner images:', error)
    }
  }



  useEffect(() => {
    // Ensure parallax is initialized for this specific component
    const initParallax = () => {
      if (typeof window !== "undefined" && (window as any).Parallax) {
        const scene = document.getElementById("scene")
        if (scene) {
          // Destroy existing parallax instance if it exists
          if ((scene as any).parallaxInstance) {
            (scene as any).parallaxInstance.destroy()
          }

          // Create new parallax instance
          ; (scene as any).parallaxInstance = new (window as any).Parallax(scene, {
            limitY: 15,
          })

          console.log('RightBanner: Parallax initialized...')
        }
      }
    }

    // Try multiple times to ensure initialization
    const timer1 = setTimeout(initParallax, 100)
    const timer2 = setTimeout(initParallax, 505)
    const timer3 = setTimeout(initParallax, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [bannerImages])
  return (
    <div className="mil-right-banner" id="scene">
      {/* scrollbar */}
      <div className="mil-progress-track">
        <div className="mil-progress"></div>
      </div>
      {/* scrollbar end */}

      <div className="mil-banner-wrapper" data-depth="1">
        <div className="mil-banner-frame">
          {(bannerImages.find(img => img.image_type === 'background')?.image_url || backgroundImage) && (
            <img
              src={bannerImages.find(img => img.image_type === 'background')?.image_url || backgroundImage}
              alt={bannerImages.find(img => img.image_type === 'background')?.alt_text || "background"}
              className={showPerson ? "mil-banner-bg mil-blur" : "mil-banner-bg"}
            />
          )}
        </div>
      </div>

      {showPerson && bannerImages.find(img => img.image_type === 'person')?.image_url && (
        <div className="mil-banner-wrapper" data-depth="0.2">
          <div className="mil-banner-frame">
            <img
              src={bannerImages.find(img => img.image_type === 'person')?.image_url}
              alt={bannerImages.find(img => img.image_type === 'person')?.alt_text || "person"}
              className="mil-banner-person"
            />
          </div>
        </div>
      )}

      <div className="mil-flying-skills" data-depth="0.1">
        <div className="mil-skills-frame">
          {floatingSkills.map((skill) => {
            const positionStyle: React.CSSProperties = {
              width: skill.width,
              height: skill.height,
              objectFit: "contain"
            }

            // Apply positioning based on database values
            if (skill.position_top) positionStyle.top = skill.position_top
            if (skill.position_left) positionStyle.left = skill.position_left
            if (skill.position_bottom) positionStyle.bottom = skill.position_bottom
            if (skill.position_right) positionStyle.right = skill.position_right

            return (
              <div
                key={skill.id}
                className="mil-item"
                style={positionStyle}
              >
                <img
                  src={skill.icon_url}
                  alt={skill.alt_text || skill.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </div>
            )
          })}
          <div className="mil-el mil-addition-el-1">+</div>
          <div className="mil-el mil-addition-el-2">+</div>
          <div className="mil-el mil-addition-el-3"></div>
          <div className="mil-el mil-addition-el-4"></div>
        </div>
      </div>
    </div>
  )
}
