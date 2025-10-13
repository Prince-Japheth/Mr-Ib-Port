"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Skill {
  id: number
  name: string
  icon_url: string
  skill_type: string
  display_order: number
  is_active: boolean
}

export function HardSkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch skills data from Supabase
    const fetchSkills = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching skills:', error)
        } else {
          setSkills(data || [])
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  useEffect(() => {
    // Ensure scroll animations are initialized for this specific component
    const initScrollAnimations = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize scroll animations for .mil-up elements in this section
        const hardSkillsSection = document.querySelector('.mil-hard-skills-section')
        if (hardSkillsSection) {
          const milUpElements = hardSkillsSection.querySelectorAll(".mil-up")
          milUpElements.forEach((element: any) => {
            gsap.fromTo(
              element,
              {
                opacity: 0,
                y: 50,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              }
            )
          })
        }
        
        console.log('HardSkillsSection: Scroll animations initialized')
      }
    }

    // Try multiple times to ensure initialization
    const timer1 = setTimeout(initScrollAnimations, 100)
    const timer2 = setTimeout(initScrollAnimations, 500)
    const timer3 = setTimeout(initScrollAnimations, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [skills])

  if (loading) {
    return (
      <>
        <div className="mil-section-title mil-up">
          <div className="mil-divider"></div>
          <h3>Hard Skills</h3>
        </div>
        <section className="mil-p-90-60 mil-hard-skills-section">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="mil-center">
                <p>Loading skills...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="mil-section-title mil-up">
        <div className="mil-divider"></div>
        <h3>Hard Skills</h3>
      </div>

      {/* hard skills */}
      <section className="mil-p-90-60 mil-hard-skills-section">
        <div className="row justify-content-center align-items-center">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="col-lg-2 col-md-3 col-4 mil-mb-30">
                <div className="mil-icon-box mil-center">
                  <div className="mil-service-icon mil-up">
                    <img 
                      src={skill.icon_url} 
                      alt={skill.name} 
                      className="mil-mb-30" 
                    />
                  </div>
                  <h6 className="mil-up">{skill.name}</h6>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="mil-center">
                <p className="mil-text-lg">No skills available at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* hard skills end */}
    </>
  )
}
