"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Experience {
  id: number
  position: string
  company: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  display_order: number
  is_active: boolean
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to format date range
  const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate).getFullYear()
    const end = isCurrent ? 'Present' : endDate ? new Date(endDate).getFullYear() : 'Present'
    return `${start} - ${end}`
  }
  
  useEffect(() => {
    // Fetch experience data from Supabase
    const fetchExperiences = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching experiences:', error)
        } else {
          setExperiences(data || [])
        }
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  useEffect(() => {
    // Ensure scroll animations are initialized for this specific component
    const initScrollAnimations = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize scroll animations for .mil-up elements in this section
        const experienceSection = document.querySelector('.mil-experience-section')
        if (experienceSection) {
          const milUpElements = experienceSection.querySelectorAll(".mil-up")
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
        
        console.log('ExperienceSection: Scroll animations initialized')
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
  }, [experiences])

  if (loading) {
    return (
      <>
        <div className="mil-section-title mil-up">
          <div className="mil-divider"></div>
          <h3>Experience</h3>
        </div>
        <section className="mil-p-90-60 mil-experience-section">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="mil-center">
                <p>Loading experience...</p>
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
        <h3>Experience</h3>
      </div>

      {/* experience */}
      <section className="mil-p-90-60 mil-experience-section">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="mil-timeline">
              <ul>
                {experiences.length > 0 ? (
                  experiences.map((experience) => (
                    <li key={experience.id} className="mil-up">
                      <div className="mil-item-head">
                        <h5 className="mil-up mil-mb-15">{experience.position}</h5>
                        <div className="mil-text-sm mil-upper mil-dark">
                          {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                        </div>
                      </div>
                      <h6 className="mil-up mil-mb-15">{experience.company}</h6>
                      <p className="mil-up">
                        {experience.description}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="mil-up">
                    <div className="mil-center">
                      <p className="mil-text-lg">No experience available at the moment.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* experience end */}
    </>
  )
}