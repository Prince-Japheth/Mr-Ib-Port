"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function AnimationInit() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initialize animations when component mounts or route changes
    const initAnimations = () => {
      if (typeof window !== "undefined") {
        // Clean up existing ScrollTrigger instances to prevent duplicates
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.getAll().forEach((trigger: any) => {
            trigger.kill()
          })
        }
        
        // Wait for all scripts to be loaded and preloader to complete
        const checkAndInit = () => {
          if ((window as any).$ && (window as any).gsap && (window as any).ScrollTrigger && (window as any).Parallax) {
        const $ = (window as any).$
          const gsap = (window as any).gsap
          const ScrollTrigger = (window as any).ScrollTrigger
            const Parallax = (window as any).Parallax

            // Wait for preloader to complete before initializing scroll animations
            const waitForPreloader = () => {
              if (!document.documentElement.classList.contains('is-animating')) {
                // Preloader is complete, initialize scroll animations
          ScrollTrigger.refresh()
                console.log('ScrollTrigger initialized after preloader completion')
              } else {
                // Preloader still running, wait a bit more
                setTimeout(waitForPreloader, 100)
              }
            }
            
            waitForPreloader()

            // Re-initialize parallax for the scene (right banner)
            const scene = document.getElementById("scene")
            if (scene) {
              // Destroy existing parallax instance if it exists
              if ((scene as any).parallaxInstance) {
                (scene as any).parallaxInstance.destroy()
              }
              
              // Create new parallax instance
              ;(scene as any).parallaxInstance = new Parallax(scene, {
                limitY: 15,
              })
              
              console.log('Parallax initialized for right banner')
            } else {
              console.log('Scene element not found for right banner')
            }

            // Re-initialize scroll progress
            gsap.to('.mil-progress', {
              height: '100%',
              ease: 'linear',
              scrollTrigger: {
                scrub: 1
              }
            })

            // Re-initialize back to top animation
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
            }

            // Re-initialize scroll animations for .mil-up elements
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

            // Re-initialize rotate animations
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

            // Re-initialize circular progress
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

            // Re-initialize counters
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

            // Re-initialize progress bars
            gsap.utils.toArray(".mil-bar").forEach((element: any) => {
              const value = $(element).data("value")
              gsap.fromTo(
                element,
                { width: 0, duration: 5000, ease: 'sine' },
                {
                  width: value,
                  scrollTrigger: {
                    trigger: element,
                    toggleClass: 'mil-active',
                    toggleActions: 'play none none reverse',
                  }
                }
              )
            })

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
          } else {
            // If scripts aren't loaded yet, try again in 100ms
            setTimeout(checkAndInit, 100)
          }
        }

        checkAndInit()
      }
    }

    // Multiple attempts to ensure right banner is initialized
    const timer1 = setTimeout(() => {
      initAnimations()
    }, 100)

    const timer2 = setTimeout(() => {
      initAnimations()
    }, 500)
    
    const timer3 = setTimeout(() => {
      initAnimations()
    }, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname, mounted])

  if (!mounted) return null

  return null
}
