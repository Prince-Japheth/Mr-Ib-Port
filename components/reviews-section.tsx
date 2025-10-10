"use client"

import { useEffect } from "react"

export function ReviewsSection() {
  
  useEffect(() => {
    // Ensure scroll animations and slider are initialized for this specific component
    const initAnimations = () => {
      if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger) {
        const gsap = (window as any).gsap
        const ScrollTrigger = (window as any).ScrollTrigger
        
        // Re-initialize scroll animations for .mil-up elements in this section
        const reviewsSection = document.querySelector('.mil-reviews-section')
        if (reviewsSection) {
          const milUpElements = reviewsSection.querySelectorAll(".mil-up")
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

        // Re-initialize reviews slider
        if ((window as any).Swiper) {
          const Swiper = (window as any).Swiper
          const existingSlider = document.querySelector('.mil-reviews-slider')
          if (existingSlider && !(existingSlider as any).swiper) {
            new Swiper('.mil-reviews-slider', {
              spaceBetween: 30,
              speed: 800,
              parallax: true,
              navigation: {
                nextEl: '.mil-reviews-next',
                prevEl: '.mil-reviews-prev',
              },
              pagination: {
                el: '.swiper-reviews-pagination',
                clickable: true,
              },
            })
          }
        }
        
        console.log('ReviewsSection: Scroll animations and slider initialized')
      }
    }

    // Try multiple times to ensure initialization
    const timer1 = setTimeout(initAnimations, 100)
    const timer2 = setTimeout(initAnimations, 500)
    const timer3 = setTimeout(initAnimations, 1000)

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
        <h3>Reviews</h3>
      </div>

      {/* reviews */}
      <section className="mil-p-90-90 mil-reviews-section">
        <div className="row justify-content-center mil-reviews-slider-frame">
          <div className="col-lg-8">
            <div className="swiper-container mil-reviews-slider mil-mb-30">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="mil-review mil-center">
                    <div className="mil-review-top">
                      <img src="/images/1.jpg" alt="customer" className="mil-avatar mil-up" />
                      <div className="mil-name">
                        <h4 className="mil-up mil-mb-5">Paul Trueman</h4>
                        <p className="mil-upper mil-up">TechCorp Solutions</p>
                      </div>
                    </div>
                    <p className="mil-up">
                      Working with John Doe as our full-stack developer was an absolute pleasure. His technical
                      expertise and problem-solving approach brought our complex application to life. The scalable
                      architecture he built exceeded our expectations, and our users love the performance. Highly
                      recommended!
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="mil-review mil-center">
                    <div className="mil-review-top">
                      <img src="/images/2.jpg" alt="customer" className="mil-avatar mil-up" />
                      <div className="mil-name">
                        <h4 className="mil-up mil-mb-5">Olivia Oldman</h4>
                        <p className="mil-upper mil-up">DataFlow Systems</p>
                      </div>
                    </div>
                    <p className="mil-up">
                      I had the opportunity to collaborate with John, and I must say he is incredibly talented.
                      His ability to understand our technical requirements and translate them into robust code was
                      impressive. John's Laravel APIs were efficient, and enhanced our application performance
                      significantly. I look forward to working with him again!
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="mil-review mil-center">
                    <div className="mil-review-top">
                      <img src="/images/3.jpg" alt="customer" className="mil-avatar mil-up" />
                      <div className="mil-name">
                        <h4 className="mil-up mil-mb-5">Oscar Newman</h4>
                        <p className="mil-upper mil-up">CloudTech Ventures</p>
                      </div>
                    </div>
                    <p className="mil-up">
                      John Doe is an exceptional software engineer. He has a deep understanding of modern
                      technologies and knows how to build scalable applications. John's React and Laravel
                      expertise greatly improved our platform's performance, and we couldn't be happier with the
                      results. Highly skilled and reliable!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mil-slider-nav mil-up">
            <div className="mil-reviews-prev">
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
            </div>
            <div className="mil-reviews-next">
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
            </div>
          </div>

          <div className="swiper-reviews-pagination mil-up"></div>
        </div>
      </section>
      {/* reviews end */}
    </>
  )
}
