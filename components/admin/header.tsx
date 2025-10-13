"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Crown, Search, Bell, ChevronDown, User, Settings, LogOut, Menu, X } from "lucide-react"

interface AdminHeaderProps {
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

interface SearchResult {
  type: string
  id: string
  title: string
  description: string
  url: string
}

export default function AdminHeader({ onMenuToggle, isMenuOpen }: AdminHeaderProps) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLogout = async () => {
    // Clear the admin cookie
    document.cookie = "admin-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
    router.refresh()
  }

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results?.slice(0, 5) || []) // Show only top 5 in dropdown
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    performSearch(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchResults(false)
      setSearchQuery("")
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Highlight text function
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              <span className="hidden sm:inline">Portfolio </span>Admin
            </h1>
            <p className="text-gray-500 text-sm hidden sm:block">Content Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Button */}
          <button 
            onClick={() => router.push('/admin/search')}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="bg-transparent text-gray-900 placeholder-gray-500 outline-none w-48"
              />
              {isSearching && (
                <div className="ml-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                </div>
              )}
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto w-96">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className="w-4 h-4 text-[#4c9baf]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {highlightText(result.title, searchQuery)}
                          </h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {result.type}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {highlightText(result.description, searchQuery)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="w-full text-center text-sm text-[#4c9baf] hover:text-[#60aec1] font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          {/* <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div className="hidden sm:block text-left">
                <p className="text-gray-900 text-sm font-medium">Admin User</p>
                <p className="text-gray-500 text-xs">Administrator</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
