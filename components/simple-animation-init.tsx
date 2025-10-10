"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function SimpleAnimationInit() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Reset animation flags for new page
    ;(window as any).milUpAnimationsInitialized = false
    ;(window as any).rotateAnimationsInitialized = false
    ;(window as any).circularProgressInitialized = false
    ;(window as any).counterAnimationsInitialized = false

    // Simple animation initialization that doesn't cause stammer
    const initSimpleAnimations = () => {
      if (typeof window !== "undefined") {
        // Wait for all scripts to be loaded
        const checkAndInit = () => {
          if ((window as any).$ && (window as any).gsap && (window as any).ScrollTrigger && (window as any).Parallax) {
            const $ = (window as any).$
            const gsap = (window as any).gsap
            const ScrollTrigger = (window as any).ScrollTrigger
            const Parallax = (window as any).Parallax

            // Wait for preloader to complete
            const waitForPreloader = () => {
              if (!document.documentElement.classList.contains('is-animating')) {
                // Preloader is complete, initialize animations
                ScrollTrigger.refresh()
                console.log('Simple animations initialized after preloader completion')
              } else {
                setTimeout(waitForPreloader, 100)
              }
            }
            
            waitForPreloader()

            // Initialize parallax for right banner (only once)
            const scene = document.getElementById("scene")
            if (scene && !(scene as any).parallaxInitialized) {
              if ((scene as any).parallaxInstance) {
                (scene as any).parallaxInstance.destroy()
              }
              ;(scene as any).parallaxInstance = new Parallax(scene, {
                limitY: 15,
              })
              ;(scene as any).parallaxInitialized = true
              console.log('Parallax initialized for right banner')
            }

            // Initialize scroll progress (only once)
            if (!(window as any).scrollProgressInitialized) {
              gsap.to('.mil-progress', {
                height: '100%',
                ease: 'linear',
                scrollTrigger: {
                  scrub: 1
                }
              })
              ;(window as any).scrollProgressInitialized = true
              console.log('Scroll progress initialized')
            }

            // Initialize back to top animation (only once)
            if (!(window as any).backToTopInitialized) {
              const btt = document.querySelector(".mil-back-to-top .mil-link")
              if (btt) {
                gsap.set(btt, { opacity: 0.5 })
                gsap.to(btt, {
                  opacity: 1,
                  ease: 'sine',
                  scrollTrigger: {
                    trigger: "body",
                    start: "top -20%",
                    end: "top -20%",
                    toggleActions: "play none reverse none"
                  }
                })
                ;(window as any).backToTopInitialized = true
                console.log('Back to top animation initialized')
              }
            }

            // Initialize scroll animations for .mil-up elements (only once per route)
            if (!(window as any).milUpAnimationsInitialized) {
              gsap.utils.toArray(".mil-up").forEach((element: any) => {
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
              ;(window as any).milUpAnimationsInitialized = true
              console.log('Mil-up scroll animations initialized')
            }

            // Initialize rotate animations (only once per route)
            if (!(window as any).rotateAnimationsInitialized) {
              gsap.utils.toArray(".mil-rotate").forEach((element: any) => {
                const value = $(element).data("value")
                gsap.fromTo(
                  element,
                  {
                    ease: 'sine',
                    rotate: 0,
                  },
                  {
                    rotate: value,
                    scrollTrigger: {
                      trigger: element,
                      scrub: true,
                      toggleActions: 'play none none reverse',
                    }
                  }
                )
              })
              ;(window as any).rotateAnimationsInitialized = true
              console.log('Rotate animations initialized')
            }

            // Initialize circular progress animations (only once per route)
            if (!(window as any).circularProgressInitialized) {
              gsap.utils.toArray(".mil-circular-progress").forEach((element: any) => {
                const value = $(element).data("value")
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
              ;(window as any).circularProgressInitialized = true
              console.log('Circular progress animations initialized')
            }

            // Initialize counter animations (only once per route)
            if (!(window as any).counterAnimationsInitialized) {
              $(".mil-counter").each(function (index: number, element: any) {
                const count = $(element)
                const zero = { val: 0 }
                const num = count.data("number")
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
                    count.text(zero.val.toFixed(decimals))
                  }
                })
              })
              ;(window as any).counterAnimationsInitialized = true
              console.log('Counter animations initialized')
            }
          } else {
            setTimeout(checkAndInit, 100)
          }
        }

        checkAndInit()
      }
    }

    // Single attempt to initialize
    const timer = setTimeout(initSimpleAnimations, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, mounted])

  if (!mounted) return null

  return null
}
