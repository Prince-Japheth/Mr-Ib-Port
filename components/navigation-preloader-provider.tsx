"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { NavigationPreloader } from './navigation-preloader'

interface NavigationContextType {
  isNavigating: boolean
  setNavigating: (navigating: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationPreloaderProvider')
  }
  return context
}

export function NavigationPreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Reset navigation state when pathname changes (page loaded)
    setIsNavigating(false)
  }, [pathname])

  const setNavigating = (navigating: boolean) => {
    setIsNavigating(navigating)
  }

  return (
    <NavigationContext.Provider value={{ isNavigating, setNavigating }}>
      {children}
      <NavigationPreloader isVisible={isNavigating} />
    </NavigationContext.Provider>
  )
}
