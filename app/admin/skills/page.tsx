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
  Upload, 
  CloudUpload, 
  Loader2, 
  Code 
} from "lucide-react"
import { SkillsLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface Skill {
  id: number
  name: string
  icon_url: string | null
  skill_type: string
  display_order: number
  is_active: boolean
}

export default function SkillsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])

  const [formData, setFormData] = useState({
    name: "",
    icon_url: "",
    skill_type: "technical",
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/skills/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/skills/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const skillId = parseInt(id)
        const skill = skills.find(s => s.id === skillId)
        if (skill) {
          handleEdit(skill)
        }
      }
    } else if (pathname === '/admin/skills') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        name: "", 
        icon_url: "", 
        skill_type: "technical", 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, skills])

  const fetchSkills = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching skills:', error)
        return
      }

      setSkills(data || [])
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

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    
    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (error) {
        console.error('Error uploading image:', error)
        
        // Handle specific error cases
        if (error.message.includes('Bucket not found')) {
          alert('Images bucket not found. Please create an "images" bucket in your Supabase Storage first.')
        } else if (error.message.includes('JWT')) {
          alert('Authentication error. Please check your Supabase configuration.')
        } else if (error.message.includes('permission')) {
          alert('Permission denied. Please check your Supabase Storage policies.')
        } else {
          alert(`Error uploading image: ${error.message}`)
        }
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Update form data with the new URL
      setFormData(prev => ({ ...prev, icon_url: publicUrl }))
      
    } catch (error) {
      console.error('Error:', error)
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      uploadImage(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleAddSkill = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update({
            name: formData.name,
            icon_url: formData.icon_url || null,
            skill_type: formData.skill_type,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating skill:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new skill
        const { error } = await supabase
          .from('skills')
          .insert([{
            name: formData.name,
            icon_url: formData.icon_url || null,
            skill_type: formData.skill_type,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding skill:', error)
          return
        }
      }
      
      await fetchSkills() // Refresh data
      setFormData({ name: "", icon_url: "", skill_type: "technical", display_order: 0, is_active: true })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/skills')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      icon_url: skill.icon_url || "",
      skill_type: skill.skill_type,
      display_order: skill.display_order,
      is_active: skill.is_active
    })
    setEditingId(skill.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/skills/edit/${skill.id}`)
  }

  const handleAddNew = () => {
    setFormData({ name: "", icon_url: "", skill_type: "technical", display_order: 0, is_active: true })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/skills/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", icon_url: "", skill_type: "technical", display_order: 0, is_active: true })
    // Navigate back to list view
    router.push('/admin/skills')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting skill:', error)
        return
      }

      await fetchSkills() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return <SkillsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
          <p className="text-gray-600 mt-1">Manage your technical skills and tools</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., React.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Type</label>
              <select
                name="skill_type"
                value={formData.skill_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="technical">Technical</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="language">Language</option>
                <option value="framework">Framework</option>
                <option value="database">Database</option>
                <option value="tool">Tool</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Icon</label>
              
              {/* URL Input */}
              <input
                type="url"
                name="icon_url"
                value={formData.icon_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                placeholder="https://example.com/icon.png"
              />
              
              {/* Upload Section */}
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Or upload an icon:</div>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isUploading 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                      <span className="text-green-600">Uploading...</span>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Drag & drop an icon here</p>
                      <p className="text-xs text-gray-500">or</p>
                      <label className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 cursor-pointer">
                        <Upload className="w-3 h-3 mr-1 inline" />
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
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
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddSkill}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Skill" : "Add Skill"}
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${skill.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                {skill.icon_url ? (
                  <img src={skill.icon_url} alt={skill.name} className="w-6 h-6" />
                ) : (
                  <Code className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(skill)}
                  className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-1"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1">{skill.name}</h3>
            <p className="text-xs text-gray-500 mb-2 capitalize">{skill.skill_type}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">#{skill.display_order}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${skill.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {skill.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
