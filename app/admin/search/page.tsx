"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Search, 
  FolderOpen, 
  Briefcase, 
  Building, 
  Quote, 
  Code, 
  Languages, 
  Mail, 
  User,
  ArrowLeft,
  Calendar,
  Tag,
  Link as LinkIcon,
  Settings
} from "lucide-react"

interface SearchResult {
  type: string
  id: string
  title: string
  description: string
  date: string | null
  status: string
  url: string
}

const typeIcons = {
  project: FolderOpen,
  service: Briefcase,
  experience: Building,
  testimonial: Quote,
  skill: Code,
  language: Languages,
  message: Mail,
  profile: User,
  social: LinkIcon,
  setting: Settings,
  page: Search
}

const typeColors = {
  project: "bg-blue-100 text-blue-800",
  service: "bg-green-100 text-green-800",
  experience: "bg-purple-100 text-purple-800",
  testimonial: "bg-yellow-100 text-yellow-800",
  skill: "bg-red-100 text-red-800",
  language: "bg-indigo-100 text-indigo-800",
  message: "bg-gray-100 text-gray-800",
  profile: "bg-pink-100 text-pink-800",
  social: "bg-cyan-100 text-cyan-800",
  setting: "bg-orange-100 text-orange-800",
  page: "bg-emerald-100 text-emerald-800"
}

function highlightText(text: string, query: string) {
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Search Results
            </h1>
            <p className="text-gray-600">
              {query ? `Searching for "${query}"` : 'Search across all content'}
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search projects, services, experience, skills..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </h2>
          </div>
          
          <div className="grid gap-4">
            {results.map((result) => {
              const IconComponent = typeIcons[result.type as keyof typeof typeIcons]
              const colorClass = typeColors[result.type as keyof typeof typeColors]
              
              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900 font-medium">
                          {highlightText(result.title, query)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                          {result.type}
                        </span>
                      </div>
                      
                      {result.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {highlightText(result.description, query)}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {result.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {result.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : query ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            No content found for "{query}". Try different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Search across all content</h3>
          <p className="text-gray-600">
            Search for projects, services, experience, skills, testimonials, and messages.
          </p>
        </div>
      )}
    </div>
  )
}
