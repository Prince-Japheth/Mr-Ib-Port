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
  Building, 
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react"
import { ExperienceLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface Experience {
  id: number
  position: string
  company: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  display_order: number
  is_active: boolean
}

export default function ExperiencePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])

  const [formData, setFormData] = useState({
    position: "",
    company: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/experience/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/experience/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const experienceId = parseInt(id)
        const experience = experiences.find(e => e.id === experienceId)
        if (experience) {
          handleEdit(experience)
        }
      }
    } else if (pathname === '/admin/experience') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        position: "", 
        company: "", 
        start_date: "", 
        end_date: "", 
        is_current: false, 
        description: "", 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, experiences])

  const fetchExperiences = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching experiences:', error)
        return
      }

      setExperiences(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  const handleAddExperience = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing experience
        const { error } = await supabase
          .from('experience')
          .update({
            position: formData.position,
            company: formData.company,
            start_date: formData.start_date,
            end_date: formData.is_current ? null : formData.end_date,
            is_current: formData.is_current,
            description: formData.description,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating experience:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new experience
        const { error } = await supabase
          .from('experience')
          .insert([{
            position: formData.position,
            company: formData.company,
            start_date: formData.start_date,
            end_date: formData.is_current ? null : formData.end_date,
            is_current: formData.is_current,
            description: formData.description,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding experience:', error)
          return
        }
      }
      
      await fetchExperiences() // Refresh data
      setFormData({ 
        position: "", 
        company: "", 
        start_date: "", 
        end_date: "", 
        is_current: false, 
        description: "", 
        display_order: 0, 
        is_active: true 
      })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/experience')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (experience: Experience) => {
    setFormData({
      position: experience.position,
      company: experience.company,
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      is_current: experience.is_current,
      description: experience.description,
      display_order: experience.display_order,
      is_active: experience.is_active
    })
    setEditingId(experience.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/experience/edit/${experience.id}`)
  }

  const handleAddNew = () => {
    setFormData({ 
      position: "", 
      company: "", 
      start_date: "", 
      end_date: "", 
      is_current: false, 
      description: "", 
      display_order: 0, 
      is_active: true 
    })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/experience/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      position: "", 
      company: "", 
      start_date: "", 
      end_date: "", 
      is_current: false, 
      description: "", 
      display_order: 0, 
      is_active: true 
    })
    // Navigate back to list view
    router.push('/admin/experience')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting experience:', error)
        return
      }

      await fetchExperiences() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const calculateDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`
    } else {
      return `${months} month${months > 1 ? 's' : ''}`
    }
  }

  if (isLoading) {
    return <ExperienceLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-gray-600 mt-1">Manage your professional work experience</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-[#60aec1] transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position Title</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Senior Full-Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Tech Solutions Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                disabled={formData.is_current}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formData.is_current ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#4c9baf] border-gray-300 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">Currently working here</label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your role, responsibilities, and achievements..."
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
              onClick={handleAddExperience}
              disabled={isSaving}
              className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-[#60aec1] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Experience" : "Add Experience"}
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

      {/* Experience Timeline */}
      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <div key={experience.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${experience.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      experience.is_current ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Building className={`w-6 h-6 ${
                        experience.is_current ? 'text-[#4c9baf]' : 'text-gray-600'
                      }`} />
                    </div>
                    {index < experiences.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{experience.position}</h3>
                        <p className="text-[#4c9baf] font-medium">{experience.company}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(experience)}
                          className="text-gray-400 hover:text-[#4c9baf] transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(experience.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date!)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{calculateDuration(experience.start_date, experience.end_date, experience.is_current)}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">{experience.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          experience.is_current 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {experience.is_current ? 'Current' : 'Previous'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          experience.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {experience.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Order: {experience.display_order}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experience entries yet</h3>
            <p className="text-gray-600 mb-4">Add your first work experience to get started.</p>
            <button
              onClick={handleAddNew}
              className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-[#60aec1] transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
