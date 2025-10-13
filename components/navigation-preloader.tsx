"use client"

import { useEffect } from 'react'

interface NavigationPreloaderProps {
  isVisible: boolean
}

export function NavigationPreloader({ isVisible }: NavigationPreloaderProps) {
  useEffect(() => {
    if (isVisible) {
      // Show preloader
      const preloader = document.getElementById('navigation-preloader')
      if (preloader) {
        preloader.style.display = 'flex'
        preloader.style.opacity = '1'
      }
    } else {
      // Hide preloader
      const preloader = document.getElementById('navigation-preloader')
      if (preloader) {
        preloader.style.opacity = '0'
        setTimeout(() => {
          preloader.style.display = 'none'
        }, 300)
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      id="navigation-preloader"
      className="mil-preloader-frame"
      style={{
        position: 'fixed',
        zIndex: 999999999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'rgb(32, 33, 36)',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div 
        className="mil-preloader-content"
        style={{
          position: 'relative',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <div className="mil-preloader">
          <div className="mil-circ-1"></div>
          <div className="mil-circ-2"></div>
          <div className="mil-circ-3"></div>
          <div className="mil-circ-4"></div>
        </div>
        <div className="mil-upper">Loading</div>
      </div>
    </div>
  )
}
