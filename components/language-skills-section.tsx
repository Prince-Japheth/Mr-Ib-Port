"use client"

import { useEffect } from "react"

export function LanguageSkillsSection() {
  
  useEffect(() => {
    // Ensure circular progress animations are initialized for this specific component
    const initCircularProgress = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize circular progress
        gsap.utils.toArray(".mil-circular-progress").forEach((element: any) => {
          const value = element.getAttribute("data-value")
          gsap.fromTo(
            element,
            { "--p": '0', ease: 'sine' },
            {
              "--p": value,
              duration: 1,
              scrollTrigger: {
                trigger: element,
                toggleActions: 'play none none reverse',
              }
            }
          )
        })

        // Re-initialize counters
        const counters = document.querySelectorAll(".mil-counter")
        counters.forEach((element: any) => {
          const count = element
          const zero = { val: 0 }
          const num = parseInt(count.getAttribute("data-number"))
          const split = (num + "").split(".")
          const decimals = split.length > 1 ? split[1].length : 0

          gsap.to(zero, {
            val: num,
            duration: 2,
            scrollTrigger: {
              trigger: element,
              toggleActions: 'play none none reverse',
            },
            onUpdate: function () {
              count.textContent = zero.val.toFixed(decimals)
            }
          })
        })
        
        console.log('LanguageSkillsSection: Circular progress initialized')
      }
    }

    // Try multiple times to ensure initialization
    const timer1 = setTimeout(initCircularProgress, 100)
    const timer2 = setTimeout(initCircularProgress, 500)
    const timer3 = setTimeout(initCircularProgress, 1000)

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
        <h3>Language Skills</h3>
      </div>

      {/* language */}
      <section className="mil-lang-skills mil-p-90-60">
        <div className="row justify-content-between align-items-center">
          <div className="col-6 col-lg-3">
            <div className="mil-lang-skills-item mil-center mil-up mil-mb-30">
              <div className="mil-circular-progress" data-value="95%">
                <div className="mil-counter-frame mil-upper mil-dark">
                  <span className="mil-counter" data-number="95">
                    95
                  </span>
                  <span>%</span>
                </div>
              </div>
              <h6 className="mil-up">English</h6>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="mil-lang-skills-item mil-center mil-up mil-mb-30">
              <div className="mil-circular-progress" data-value="85%">
                <div className="mil-counter-frame mil-upper mil-dark">
                  <span className="mil-counter" data-number="85">
                    85
                  </span>
                  <span>%</span>
                </div>
              </div>
              <h6 className="mil-up">French</h6>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="mil-lang-skills-item mil-center mil-up mil-mb-30">
              <div className="mil-circular-progress" data-value="60%">
                <div className="mil-counter-frame mil-upper mil-dark">
                  <span className="mil-counter" data-number="60">
                    60
                  </span>
                  <span>%</span>
                </div>
              </div>
              <h6 className="mil-up">Spanish</h6>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="mil-lang-skills-item mil-center mil-up mil-mb-30">
              <div className="mil-circular-progress" data-value="40%">
                <div className="mil-counter-frame mil-upper mil-dark">
                  <span className="mil-counter" data-number="40">
                    40
                  </span>
                  <span>%</span>
                </div>
              </div>
              <h6 className="mil-up">German</h6>
            </div>
          </div>
        </div>
      </section>
      {/* language end */}
    </>
  )
}
