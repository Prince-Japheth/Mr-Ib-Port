"use client"

import { useEffect } from "react"

export function ServicesSection() {
  
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
  }, [])

  return (
    <>
      <div className="mil-section-title mil-up">
        <div className="mil-divider"></div>
        <h3>Services</h3>
        </div>

      {/* services */}
      <section className="mil-p-90-30 mil-services-section">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-4">
            <div className="mil-icon-box mil-center mil-mb-60">
              <div className="mil-service-icon mil-up">
                <img src="/images/1.svg" alt="icon" className="mil-mb-30" />
              </div>
              <h5 className="mil-up mil-mb-30">Full-Stack Development</h5>
              <p className="mil-up mil-mb-30">
                Build robust web applications with modern JavaScript frameworks and PHP Laravel backend solutions
              </p>
              <div className="mil-up">
                <a href="/service" className="mil-link mil-icon-link">
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
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mil-icon-box mil-center mil-mb-60">
              <div className="mil-service-icon mil-up">
                <img src="/images/2.svg" alt="icon" className="mil-mb-30" />
              </div>
              <h5 className="mil-up mil-mb-30">API Development</h5>
              <p className="mil-up mil-mb-30">
                Create scalable REST APIs and microservices using Laravel and modern backend technologies.
              </p>
              <div className="mil-up">
                <a href="/service" className="mil-link mil-icon-link">
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
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mil-icon-box mil-center mil-mb-60">
              <div className="mil-service-icon mil-up">
                <img src="/images/3.svg" alt="icon" className="mil-mb-30" />
              </div>
              <h5 className="mil-up mil-mb-30">Database Design</h5>
              <p className="mil-up mil-mb-30">
                Design and optimize database schemas with MySQL, MongoDB, and other modern database solutions.
              </p>
              <div className="mil-up">
                <a href="/service" className="mil-link mil-icon-link">
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
            </div>
          </div>
      </div>
    </section>
      {/* services end */}
    </>
  )
}