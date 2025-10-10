import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import NextTopLoader from "nextjs-toploader"
import { SimpleAnimationInit } from "@/components/simple-animation-init"
import "./globals.css" // Keep global styles here

export const metadata: Metadata = {
  title: "John Doe - Software Engineer",
  description: "Portfolio of John Doe, a passionate software engineer",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zxx" className="is-animating">
      <head>
        {/* Public-specific styles loaded in head to prevent FOUC */}
        <link rel="stylesheet" href="/css/bootstrap-grid.css" />
        <link rel="stylesheet" href="/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/css/swiper.min.css" />
        <link rel="stylesheet" href="/css/light-mode.css" />
        <link rel="stylesheet" href="/css/preloader.css" />
        
        {/* Immediate preloader visibility script */}
        <Script id="immediate-preloader" strategy="beforeInteractive">
          {`
            // Ensure preloader is visible immediately and prevent multiple additions
            if (!document.documentElement.classList.contains('is-animating')) {
              document.documentElement.classList.add('is-animating');
            }
          `}
        </Script>
      </head>
      <body>
        <NextTopLoader color="#4caf50" height={3} showSpinner={false} />
        
        {/* Preloader */}
        <div className="mil-preloader-frame" id="preloader">
          <div className="mil-preloader-content" style={{transform: 'scale(.6) translateY(200px)', opacity: 0}}>
            <div className="mil-preloader">
              <div className="mil-circ-1"></div>
              <div className="mil-circ-2"></div>
              <div className="mil-circ-3"></div>
              <div className="mil-circ-4"></div>
            </div>
            <div className="mil-upper">Loading</div>
          </div>
        </div>
        
        {children}
        
        <SimpleAnimationInit />

        {/* Keep common scripts here if needed for ALL pages, otherwise move them */}
        <Script src="/js/jquery.min.js" strategy="beforeInteractive" />
        {/* Removed Swup scripts - using Next.js navigation instead */}
        <Script src="/js/swiper.min.js" strategy="afterInteractive" />
        <Script src="/js/gsap.min.js" strategy="afterInteractive" />
        <Script src="/js/smooth-scroll.js" strategy="afterInteractive" />
        <Script src="/js/ScrollTrigger.min.js" strategy="afterInteractive" />
        <Script src="/js/parallax.js" strategy="afterInteractive" />
        {/* Custom main.js temporarily disabled for debugging */}
        {/* <Script id="custom-main" strategy="afterInteractive">
          {`
            // Custom main.js content temporarily disabled
          `}
        </Script> */}
        
        {/* Complete Preloader System */}
        <Script id="preloader-system" strategy="afterInteractive">
          {`
            // Complete preloader system with proper flow
            function initPreloader() {
              // Wait for GSAP to be available
              const waitForGSAP = () => {
                if (typeof gsap !== 'undefined' && !window.preloaderInitialized) {
                  const gsap = window.gsap;
                  
                  // Create the preloader timeline
                  const timeline = gsap.timeline();
                  
                  // Step 1: Fade in preloader content (exact match to original)
                  timeline.to(".mil-preloader-content", {
                    ease: "sine",
                    y: 0,
                    duration: 0.4,
                    scale: 1,
                    opacity: 1,
                    delay: '.2',
                  });

                  // Step 2: Fade out preloader content (exact match to original)
                  timeline.to(".mil-preloader-content", {
                    ease: "sine",
                    y: '-200',
                    duration: 0.4,
                    scale: .6,
                    opacity: 0,
                    delay: '1.2',
                  });

                  // Step 3: Collapse preloader frame and remove is-animating class (exact match to original)
                  timeline.to(".mil-preloader-frame", {
                    ease: "sine",
                    duration: 0.4,
                    height: 0,
                    onComplete: function () {
                      // Remove is-animating class to show main content (only once)
                      if (document.documentElement.classList.contains('is-animating')) {
                        document.documentElement.classList.remove('is-animating');
                        console.log('Preloader complete - main content now visible');
                      }
                    }
                  });
                  
                  window.preloaderInitialized = true;
                  console.log('Preloader timeline started');
                } else if (typeof gsap === 'undefined') {
                  // If GSAP isn't loaded yet, try again in 100ms
                  setTimeout(waitForGSAP, 100);
                }
              };
              
              // Start the preloader system
              waitForGSAP();
            }

            // Initialize preloader when DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initPreloader);
            } else {
              // DOM is already ready
              initPreloader();
            }
          `}
        </Script>
        
        {/* Fallback preloader hide script */}
        <Script id="preloader-fallback" strategy="afterInteractive">
          {`
            // Fallback to hide preloader if GSAP timeline doesn't work
            setTimeout(function() {
              const preloader = document.getElementById('preloader');
              if (preloader && preloader.style.display !== 'none') {
                preloader.style.display = 'none';
                if (document.documentElement.classList.contains('is-animating')) {
                  document.documentElement.classList.remove('is-animating');
                  console.log('Preloader fallback triggered');
                }
              }
            }, 3000);
          `}
        </Script>
      </body>
    </html>
  )
}