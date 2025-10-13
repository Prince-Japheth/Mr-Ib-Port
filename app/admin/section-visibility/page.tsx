"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Save, 
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"

interface SectionVisibility {
  id: number
  section_name: string
  is_visible: boolean
  display_order: number
  description: string | null
}

export default function SectionVisibilityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [sections, setSections] = useState<SectionVisibility[]>([])

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setSections(data || [])
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = async (sectionId: number, currentVisibility: boolean) => {
    try {
      setIsSaving(true)
      const supabase = createClient()
      const { error } = await supabase
        .from('section_visibility')
        .update({ is_visible: !currentVisibility })
        .eq('id', sectionId)

      if (error) throw error

      // Update local state
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, is_visible: !currentVisibility }
          : section
      ))
    } catch (error) {
      console.error('Error updating section visibility:', error)
      alert('Error updating section visibility. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getSectionDisplayName = (sectionName: string) => {
    const nameMap: { [key: string]: string } = {
      'about_section': 'About Section',
      'services_section': 'Services Section',
      'language_skills_section': 'Language Skills Section',
      'hard_skills_section': 'Hard Skills Section',
      'experience_section': 'Experience Section',
      'education_section': 'Education Section',
      'reviews_section': 'Reviews Section',
      'projects_section': 'Projects Section',
      'contact_section': 'Contact Section'
    }
    return nameMap[sectionName] || sectionName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Section Visibility</h1>
        <p className="text-gray-600 mt-1">Enable or disable sections on your portfolio website</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getSectionDisplayName(section.section_name)}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    section.is_visible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {section.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  
                  <button
                    onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      section.is_visible
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-[#60aec1] hover:bg-green-200'
                    } disabled:opacity-50`}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : section.is_visible ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                    {section.is_visible ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">How it works</h4>
            <p className="text-sm text-blue-700 mt-1">
              Toggle sections on or off to control what appears on your portfolio website. 
              Hidden sections will not be displayed to visitors, but the data remains in your database.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
