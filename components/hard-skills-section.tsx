"use client"

import { useEffect } from "react"

export function HardSkillsSection() {
  
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
  }, [])

  return (
    <>
      <div className="mil-section-title mil-up">
        <div className="mil-divider"></div>
        <h3>Hard Skills</h3>
      </div>

      {/* hard skills */}
      <section className="mil-p-90-60 mil-hard-skills-section">
        <div className="row justify-content-center align-items-center">
          {[
            { name: "HTML5", icon: "https://cdn-icons-png.flaticon.com/128/3291/3291670.png" },
            {
              name: "CSS3",
              icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Official_CSS_Logo.svg/2048px-Official_CSS_Logo.svg.png",
            },
            { name: "SASS", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968358.png" },
            {
              name: "Bootstrap",
              icon: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png",
            },
            { name: "Tailwind", icon: "https://www.cdnlogo.com/logos/t/58/tailwindcss.svg" },
            { name: "JavaScript", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968292.png" },
            { name: "TypeScript", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968381.png" },
            { name: "Node.js", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968322.png" },
            {
              name: "jQuery",
              icon: "https://cdn.iconscout.com/icon/free/png-256/free-jquery-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-3028907.png",
            },
            { name: "React", icon: "https://cdn-icons-png.flaticon.com/128/10826/10826338.png" },
            { name: "Next.js", icon: "https://www.datocms-assets.com/98835/1684410508-image-7.png" },
            {
              name: "Astro",
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5KhCojo9MAD9u7-vbHjYYFzD69By9d-PWcw&s",
            },
            { name: "PHP", icon: "https://cdn-icons-png.flaticon.com/128/919/919830.png" },
            {
              name: "Laravel",
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhoVwuJmtF1Lu4t9WcsZ7fESV9KdIQ7pVHw&s",
            },
            { name: "React Native", icon: "https://cdn-icons-png.flaticon.com/128/3459/3459528.png" },
            { name: "Java", icon: "https://cdn-icons-png.flaticon.com/128/3291/3291669.png" },
            { name: "C++", icon: "https://cdn-icons-png.flaticon.com/128/6132/6132222.png" },
            { name: "C#", icon: "https://cdn-icons-png.flaticon.com/128/6132/6132221.png" },
            {
              name: "MongoDB",
              icon: "https://cdn.prod.website-files.com/6640cd28f51f13175e577c05/664e00a400e23f104ed2b6cd_3b3dd6e8-8a73-5879-84a9-a42d5b910c74.svg",
            },
            { name: "MySQL", icon: "https://cdn-icons-png.flaticon.com/128/9543/9543826.png" },
            { name: "MS Office", icon: "https://cdn-icons-png.flaticon.com/128/888/888867.png" },
            {
              name: "Webflow",
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0bNFRNPDWOMqO7zuWEUNlktjE0eU-5q-UlQ&s",
            },
            {
              name: "VS Code",
              icon: "https://cdn3d.iconscout.com/3d/free/thumb/free-visual-studio-code-3d-icon-download-in-png-blend-fbx-gltf-file-formats--microsoft-logo-python-java-c-coding-lang-pack-logos-icons-7578027.png",
            },
            { name: "CLI", icon: "https://cdn-icons-png.flaticon.com/128/11895/11895137.png" },
            { name: "Git", icon: "https://cdn-icons-png.flaticon.com/128/15466/15466163.png" },
            { name: "NPM", icon: "https://cdn-icons-png.flaticon.com/128/15484/15484297.png" },
            { name: "CorelDRAW", icon: "https://cdn-icons-png.flaticon.com/128/16064/16064387.png" },
            { name: "Adobe CC", icon: "https://cdn-icons-png.flaticon.com/128/5436/5436970.png" },
            { name: "Figma", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968705.png" },
            { name: "Canva", icon: "https://freepnglogo.com/images/all_img/1691829322canva-app-logo-png.png" },
          ].map((skill) => (
            <div key={skill.name} className="col-lg-2 col-md-3 col-4 mil-mb-30">
              <div className="mil-icon-box mil-center">
                <div className="mil-service-icon mil-up">
                  <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="mil-mb-30" />
                </div>
                <h6 className="mil-up">{skill.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* hard skills end */}
    </>
  )
}
