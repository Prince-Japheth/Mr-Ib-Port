"use client"

import { useEffect } from "react"

export function ExperienceSection() {
  
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
  }, [])

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
                <li className="mil-up">
                  <div className="mil-item-head">
                    <h5 className="mil-up mil-mb-15">Senior Full-Stack Developer</h5>
                    <div className="mil-text-sm mil-upper mil-dark">2022 - Present</div>
                  </div>
                  <h6 className="mil-up mil-mb-15">Tech Solutions Inc.</h6>
                  <p className="mil-up">
                    Led development of scalable web applications using React, Node.js, and Laravel. Managed a team
                    of 4 developers and implemented CI/CD pipelines. Built REST APIs and microservices handling
                    100k+ daily requests.
                  </p>
                </li>
                <li className="mil-up">
                  <div className="mil-item-head">
                    <h5 className="mil-up mil-mb-15">Full-Stack Developer</h5>
                    <div className="mil-text-sm mil-upper mil-dark">2020 - 2022</div>
                  </div>
                  <h6 className="mil-up mil-mb-15">Digital Innovation Labs</h6>
                  <p className="mil-up">
                    Developed full-stack web applications using JavaScript, PHP Laravel, and modern frameworks.
                    Built responsive frontends with React and Vue.js, and designed database schemas with MySQL and
                    MongoDB. Worked on projects ranging from e-commerce platforms to healthcare applications.
                  </p>
                </li>
                <li className="mil-up">
                  <div className="mil-item-head">
                    <h5 className="mil-up mil-mb-15">Junior Software Developer</h5>
                    <div className="mil-text-sm mil-upper mil-dark">2019 - 2020</div>
                  </div>
                  <h6 className="mil-up mil-mb-15">StartupHub Technologies</h6>
                  <p className="mil-up">
                    Assisted in developing web applications using JavaScript, PHP, and Laravel framework.
                    Participated in code reviews and learned best practices for software development. Contributed
                    to the development of reusable components and API integrations.
                  </p>
                </li>
                <li className="mil-up">
                  <div className="mil-item-head">
                    <h5 className="mil-up mil-mb-15">Software Development Intern</h5>
                    <div className="mil-text-sm mil-upper mil-dark">2018 - 2019</div>
                  </div>
                  <h6 className="mil-up mil-mb-15">Web Solutions Ltd.</h6>
                  <p className="mil-up">
                    Assisted in developing web applications and maintaining existing codebases. Gained experience
                    in HTML, CSS, JavaScript, and PHP. Developed foundational skills in version control with Git
                    and collaborative development practices.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* experience end */}
    </>
  )
}