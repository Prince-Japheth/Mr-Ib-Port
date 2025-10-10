"use client"

import { useEffect } from "react"

interface RightBannerProps {
  backgroundImage?: string
  showPerson?: boolean
}

export function RightBanner({ backgroundImage = "https://miller.bslthemes.com/courtney-demo/light/img/person/bg-1.jpg", showPerson = true }: RightBannerProps) {
  
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
          ;(scene as any).parallaxInstance = new (window as any).Parallax(scene, {
            limitY: 15,
          })
          
          console.log('RightBanner: Parallax initialized')
        }
      }
    }

    // Try multiple times to ensure initialization
    const timer1 = setTimeout(initParallax, 100)
    const timer2 = setTimeout(initParallax, 500)
    const timer3 = setTimeout(initParallax, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])
  return (
    <div className="mil-right-banner" id="scene">
      {/* scrollbar */}
      <div className="mil-progress-track">
        <div className="mil-progress"></div>
      </div>
      {/* scrollbar end */}

      <div className="mil-banner-wrapper" data-depth="1">
        <div className="mil-banner-frame">
          <img src={backgroundImage} alt="background" className={showPerson ? "mil-banner-bg mil-blur" : "mil-banner-bg"} />
        </div>
      </div>

      {showPerson && (
        <div className="mil-banner-wrapper" data-depth="0.2">
          <div className="mil-banner-frame">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/045/592/915/small_2x/black-businessman-with-crossed-arms-on-transparent-background-png.png" alt="person" className="mil-banner-person" />
          </div>
        </div>
      )}

      <div className="mil-flying-skills" data-depth="0.1">
        <div className="mil-skills-frame">
          <div className="mil-item" style={{ top: "30%", left: "10%", width: "80px", height: "80px" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/10826/10826338.png" alt="React" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div className="mil-item" style={{ bottom: "15%", left: "20%", width: "80px", height: "80px" }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhoVwuJmtF1Lu4t9WcsZ7fESV9KdIQ7pVHw&s" alt="Laravel" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div className="mil-item" style={{ bottom: "45%", right: "15%", width: "80px", height: "80px" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/5968/5968292.png" alt="JavaScript" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div className="mil-el mil-addition-el-1">+</div>
          <div className="mil-el mil-addition-el-2">+</div>
          <div className="mil-el mil-addition-el-3"></div>
          <div className="mil-el mil-addition-el-4"></div>
        </div>
      </div>
    </div>
  )
}
