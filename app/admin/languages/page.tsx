"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Languages, 
  Percent,
  Globe
} from "lucide-react"
import { LanguagesLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface LanguageSkill {
  id: number
  language: string
  proficiency_percentage: number
  display_order: number
  is_active: boolean
}

export default function LanguagesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([])

  const [formData, setFormData] = useState({
    language: "",
    proficiency_percentage: 50,
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchLanguageSkills()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/languages/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/languages/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const languageId = parseInt(id)
        const language = languageSkills.find(l => l.id === languageId)
        if (language) {
          handleEdit(language)
        }
      }
    } else if (pathname === '/admin/languages') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        language: "", 
        proficiency_percentage: 50, 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, languageSkills])

  const fetchLanguageSkills = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('language_skills')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching language skills:', error)
        return
      }

      setLanguageSkills(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  const handleAddLanguageSkill = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing language skill
        const { error } = await supabase
          .from('language_skills')
          .update({
            language: formData.language,
            proficiency_percentage: parseInt(formData.proficiency_percentage.toString()),
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating language skill:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new language skill
        const { error } = await supabase
          .from('language_skills')
          .insert([{
            language: formData.language,
            proficiency_percentage: parseInt(formData.proficiency_percentage.toString()),
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding language skill:', error)
          return
        }
      }
      
      await fetchLanguageSkills() // Refresh data
      setFormData({ 
        language: "", 
        proficiency_percentage: 50, 
        display_order: 0, 
        is_active: true 
      })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/languages')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (languageSkill: LanguageSkill) => {
    setFormData({
      language: languageSkill.language,
      proficiency_percentage: languageSkill.proficiency_percentage,
      display_order: languageSkill.display_order,
      is_active: languageSkill.is_active
    })
    setEditingId(languageSkill.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/languages/edit/${languageSkill.id}`)
  }

  const handleAddNew = () => {
    setFormData({ 
      language: "", 
      proficiency_percentage: 50, 
      display_order: 0, 
      is_active: true 
    })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/languages/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      language: "", 
      proficiency_percentage: 50, 
      display_order: 0, 
      is_active: true 
    })
    // Navigate back to list view
    router.push('/admin/languages')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this language skill?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('language_skills')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting language skill:', error)
        return
      }

      await fetchLanguageSkills() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getProficiencyLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Native', color: 'bg-green-500' }
    if (percentage >= 80) return { level: 'Fluent', color: 'bg-blue-500' }
    if (percentage >= 60) return { level: 'Advanced', color: 'bg-yellow-500' }
    if (percentage >= 40) return { level: 'Intermediate', color: 'bg-orange-500' }
    if (percentage >= 20) return { level: 'Basic', color: 'bg-red-500' }
    return { level: 'Beginner', color: 'bg-gray-500' }
  }

  if (isLoading) {
    return <LanguagesLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Language Skills</h1>
          <p className="text-gray-600 mt-1">Manage your language proficiency levels</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Language Skill" : "Add New Language Skill"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., English, Spanish, French"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level: {formData.proficiency_percentage}%
              </label>
              <input
                type="range"
                name="proficiency_percentage"
                min="0"
                max="100"
                value={formData.proficiency_percentage}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${
                  getProficiencyLevel(formData.proficiency_percentage).color
                }`}>
                  {getProficiencyLevel(formData.proficiency_percentage).level}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#4c9baf] border-gray-300 rounded focus:ring-green-500"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleAddLanguageSkill}
              disabled={isSaving}
              className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Language" : "Add Language"}
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Language Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {languageSkills.map((languageSkill) => {
          const proficiency = getProficiencyLevel(languageSkill.proficiency_percentage)
          return (
            <div key={languageSkill.id} className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${languageSkill.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Languages className="w-5 h-5 text-[#4c9baf]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{languageSkill.language}</h3>
                    <p className="text-xs text-gray-500">Language Skill</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(languageSkill)}
                    className="text-gray-400 hover:text-[#4c9baf] transition-colors duration-200 p-1"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(languageSkill.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Proficiency</span>
                  <span className="text-xs font-medium text-gray-900">{languageSkill.proficiency_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${proficiency.color}`}
                    style={{ width: `${languageSkill.proficiency_percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${proficiency.color}`}>
                    {proficiency.level}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  languageSkill.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {languageSkill.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {languageSkill.display_order}</span>
              </div>
            </div>
          )
        })}
      </div>

      {languageSkills.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No language skills yet</h3>
          <p className="text-gray-600 mb-4">Add your language proficiency levels to get started.</p>
          <button
            onClick={handleAddNew}
            className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        </div>
      )}
    </div>
  )
}
