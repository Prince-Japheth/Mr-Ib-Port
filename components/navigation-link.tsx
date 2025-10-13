"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNavigation } from './navigation-preloader-provider'

interface NavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}

export function NavigationLink({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: NavigationLinkProps) {
  const { setNavigating } = useNavigation()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }

    // Only show preloader for internal navigation
    if (href.startsWith('/') && !href.startsWith('http')) {
      e.preventDefault()
      setNavigating(true)
      router.push(href)
    }
    // For external links, let the default behavior handle it
  }

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}
