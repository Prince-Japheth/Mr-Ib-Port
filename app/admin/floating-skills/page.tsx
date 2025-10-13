"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Loader2,
  Upload
} from "lucide-react"
import { ConfirmationModal } from "@/components/admin/confirmation-modal"

interface FloatingSkill {
  id: number
  name: string
  icon_url: string
  alt_text: string | null
  position_top: string | null
  position_left: string | null
  position_bottom: string | null
  position_right: string | null
  width: string
  height: string
  display_order: number
  is_active: boolean
}

export default function FloatingSkillsPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [floatingSkills, setFloatingSkills] = useState<FloatingSkill[]>([])

  const [formData, setFormData] = useState({
    name: "",
    icon_url: "",
    alt_text: "",
    position_top: "",
    position_left: "",
    position_bottom: "",
    position_right: "",
    width: "80px",
    height: "80px",
    display_order: 0,
    is_active: true
  })

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  })

  useEffect(() => {
    fetchFloatingSkills()
  }, [])

  const fetchFloatingSkills = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('floating_skills')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setFloatingSkills(data || [])
    } catch (error) {
      console.error('Error fetching floating skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const supabase = createClient()

      const skillData = {
        name: formData.name,
        icon_url: formData.icon_url,
        alt_text: formData.alt_text || null,
        position_top: formData.position_top || null,
        position_left: formData.position_left || null,
        position_bottom: formData.position_bottom || null,
        position_right: formData.position_right || null,
        width: formData.width,
        height: formData.height,
        display_order: formData.display_order,
        is_active: formData.is_active
      }

      if (editingId) {
        // Update existing skill
        const { error } = await supabase
          .from('floating_skills')
          .update(skillData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create new skill
        const { error } = await supabase
          .from('floating_skills')
          .insert([skillData])

        if (error) throw error
      }

      await fetchFloatingSkills()
      handleCancel()
    } catch (error) {
      console.error('Error saving floating skill:', error)
      alert('Error saving floating skill. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (skill: FloatingSkill) => {
    setFormData({
      name: skill.name,
      icon_url: skill.icon_url,
      alt_text: skill.alt_text || "",
      position_top: skill.position_top || "",
      position_left: skill.position_left || "",
      position_bottom: skill.position_bottom || "",
      position_right: skill.position_right || "",
      width: skill.width,
      height: skill.height,
      display_order: skill.display_order,
      is_active: skill.is_active
    })
    setEditingId(skill.id)
    setIsAdding(true)
  }

  const handleDelete = (skill: FloatingSkill) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Floating Skill',
      message: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('floating_skills')
            .delete()
            .eq('id', skill.id)

          if (error) throw error
          await fetchFloatingSkills()
        } catch (error) {
          console.error('Error deleting floating skill:', error)
          alert('Error deleting floating skill. Please try again.')
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleAddNew = () => {
    setFormData({
      name: "",
      icon_url: "",
      alt_text: "",
      position_top: "",
      position_left: "",
      position_bottom: "",
      position_right: "",
      width: "80px",
      height: "80px",
      display_order: floatingSkills.length + 1,
      is_active: true
    })
    setEditingId(null)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      icon_url: "",
      alt_text: "",
      position_top: "",
      position_left: "",
      position_bottom: "",
      position_right: "",
      width: "80px",
      height: "80px",
      display_order: 0,
      is_active: true
    })
    setEditingId(null)
    setIsAdding(false)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Floating Skills Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Floating Skill' : 'Add New Floating Skill'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Skill name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL *</label>
              <input
                type="url"
                name="icon_url"
                value={formData.icon_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/icon.png"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                name="alt_text"
                value={formData.alt_text}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Alt text for accessibility"
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
                min="0"
              />
            </div>
          </div>

          {/* Position Settings */}
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Position Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Top</label>
                <input
                  type="text"
                  name="position_top"
                  value={formData.position_top}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="30%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Left</label>
                <input
                  type="text"
                  name="position_left"
                  value={formData.position_left}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bottom</label>
                <input
                  type="text"
                  name="position_bottom"
                  value={formData.position_bottom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Right</label>
                <input
                  type="text"
                  name="position_right"
                  value={formData.position_right}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15%"
                />
              </div>
            </div>
          </div>

          {/* Size Settings */}
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Size Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <input
                  type="text"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="80px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="80px"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          {/* Preview */}
          {formData.icon_url && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Preview</h3>
              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={formData.icon_url}
                  alt={formData.alt_text || formData.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim() || !formData.icon_url.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floating Skills List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {floatingSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img
                        src={skill.icon_url}
                        alt={skill.alt_text || skill.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                    {skill.alt_text && (
                      <div className="text-sm text-gray-500">{skill.alt_text}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {[
                        skill.position_top && `Top: ${skill.position_top}`,
                        skill.position_left && `Left: ${skill.position_left}`,
                        skill.position_bottom && `Bottom: ${skill.position_bottom}`,
                        skill.position_right && `Right: ${skill.position_right}`
                      ].filter(Boolean).join(', ') || 'No position set'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{skill.width} × {skill.height}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{skill.display_order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      skill.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {skill.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
