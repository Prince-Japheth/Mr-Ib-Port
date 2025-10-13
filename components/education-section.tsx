"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Education {
  id: number
  institution: string
  degree: string
  field_of_study: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  gpa: string | null
  location: string | null
  display_order: number
  is_active: boolean
}

export function EducationSection() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to format date range
  const formatDateRange = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate).getFullYear()
    const end = isCurrent ? 'Present' : endDate ? new Date(endDate).getFullYear() : 'Present'
    return `${start} - ${end}`
  }
  
  useEffect(() => {
    // Fetch education data from Supabase
    const fetchEducation = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching education:', error)
        } else {
          setEducation(data || [])
        }
      } catch (error) {
        console.error('Error fetching education:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  useEffect(() => {
    // Ensure scroll animations are initialized for this specific component
    const initScrollAnimations = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize scroll animations for .mil-up elements in this section
        const educationSection = document.querySelector('.mil-education-section')
        if (educationSection) {
          const milUpElements = educationSection.querySelectorAll(".mil-up")
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
        
        console.log('EducationSection: Scroll animations initialized')
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
  }, [education])

  if (loading) {
    return (
      <>
        <div className="mil-section-title mil-up">
          <div className="mil-divider"></div>
          <h3>Education</h3>
        </div>
        <section className="mil-p-90-60 mil-education-section">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="mil-center">
                <p>Loading education...</p>
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
        <h3>Education</h3>
      </div>

      {/* education */}
      <section className="mil-p-90-60 mil-education-section">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="mil-timeline">
              <ul>
                {education.length > 0 ? (
                  education.map((edu) => (
                    <li key={edu.id} className="mil-up">
                      <div className="mil-item-head">
                        <h5 className="mil-up mil-mb-15">
                          {edu.degree}
                          {edu.field_of_study && (
                            // <span className="mil-text-sm mil-upper mil-dark"> in {edu.field_of_study}</span>
                            <span className=""> in {edu.field_of_study}</span>
                          )}
                        </h5>
                        <div className="mil-text-sm mil-upper mil-dark">
                          {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                        </div>
                      </div>
                      <h6 className="mil-up mil-mb-15">
                        {edu.institution}
                        {edu.location && (
                          <span className="mil-text-sm mil-upper mil-dark"> • {edu.location}</span>
                        )}
                      </h6>
                      {edu.gpa && (
                        <p className="mil-up mil-mb-15 mil-accent">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.description && (
                        <p className="mil-up">
                          {edu.description}
                        </p>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="mil-up">
                    <div className="mil-center">
                      <p className="mil-text-lg">No education available at the moment.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* education end */}
    </>
  )
}
