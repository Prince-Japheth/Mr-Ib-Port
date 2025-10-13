"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Service {
  id: number
  title: string
  description: string
  icon_url: string
  link_url: string
  display_order: number
  is_active: boolean
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch services data from Supabase
    const fetchServices = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching services:', error)
        } else {
          setServices(data || [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    // Ensure scroll animations are initialized for this specific component
    const initScrollAnimations = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize scroll animations for .mil-up elements in this section
        const servicesSection = document.querySelector('.mil-services-section')
        if (servicesSection) {
          const milUpElements = servicesSection.querySelectorAll(".mil-up")
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
        
        console.log('ServicesSection: Scroll animations initialized')
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
  }, [services])

  if (loading) {
    return (
      <>
        <div className="mil-section-title mil-up">
          <div className="mil-divider"></div>
          <h3>Services</h3>
        </div>
        <section className="mil-p-90-30 mil-services-section">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="mil-center">
                <p>Loading services...</p>
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
        <h3>Services</h3>
      </div>

      {/* services */}
      <section className="mil-p-90-30 mil-services-section">
        <div className="row justify-content-between align-items-center">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="col-lg-4">
                <div className="mil-icon-box mil-center mil-mb-60">
                  <div className="mil-service-icon mil-up">
                    <img 
                      src={service.icon_url} 
                      alt={service.title} 
                      className="mil-mb-30" 
                    />
                  </div>
                  <h5 className="mil-up mil-mb-30">{service.title}</h5>
                  <p className="mil-up mil-mb-30">
                    {service.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="mil-center">
                <p className="mil-text-lg">No services available at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* services end */}
    </>
  )
}