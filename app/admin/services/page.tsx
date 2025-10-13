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
  Briefcase, 
  ExternalLink 
} from "lucide-react"
import { ServicesLoadingSkeleton } from "@/components/admin/loading-skeleton"
import { ConfirmationModal } from "@/components/admin/confirmation-modal"

interface Service {
  id: number
  title: string
  description: string
  icon_url: string | null
  link_url: string | null
  display_order: number
  is_active: boolean
}

export default function ServicesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [services, setServices] = useState<Service[]>([])

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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_url: "",
    link_url: "",
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/services/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/services/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const serviceId = parseInt(id)
        const service = services.find(s => s.id === serviceId)
        if (service) {
          handleEdit(service)
        }
      }
    } else if (pathname === '/admin/services') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        title: "", 
        description: "", 
        icon_url: "", 
        link_url: "", 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, services])

  const fetchServices = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching services:', error)
        return
      }

      setServices(data || [])
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

  const handleAddService = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            title: formData.title,
            description: formData.description,
            icon_url: formData.icon_url || null,
            link_url: formData.link_url || null,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating service:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new service
        const { error } = await supabase
          .from('services')
          .insert([{
            title: formData.title,
            description: formData.description,
            icon_url: formData.icon_url || null,
            link_url: formData.link_url || null,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding service:', error)
          return
        }
      }
      
      await fetchServices() // Refresh data
      setFormData({ title: "", description: "", icon_url: "", link_url: "", display_order: 0, is_active: true })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/services')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon_url: service.icon_url || "",
      link_url: service.link_url || "",
      display_order: service.display_order,
      is_active: service.is_active
    })
    setEditingId(service.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/services/edit/${service.id}`)
  }

  const handleAddNew = () => {
    setFormData({ title: "", description: "", icon_url: "", link_url: "", display_order: 0, is_active: true })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/services/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: "", description: "", icon_url: "", link_url: "", display_order: 0, is_active: true })
    // Navigate back to list view
    router.push('/admin/services')
  }

  const handleDelete = (service: Service) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Service',
      message: `Are you sure you want to delete "${service.title}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', service.id)

          if (error) {
            console.error('Error deleting service:', error)
            alert('Error deleting service. Please try again.')
            return
          }

          await fetchServices() // Refresh data
        } catch (error) {
          console.error('Error:', error)
          alert('Error deleting service. Please try again.')
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  if (isLoading) {
    return <ServicesLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Service" : "Add New Service"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Web Development"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Icon</label>
              
              {/* URL Input */}
              <input
                type="url"
                name="icon_url"
                value={formData.icon_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                placeholder="https://example.com/icon.svg"
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
                      <Loader2 className="w-4 h-4 text-[#4c9baf] animate-spin" />
                      <span className="text-[#4c9baf]">Uploading...</span>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Drag & drop an icon here</p>
                      <p className="text-xs text-gray-500">or</p>
                      <label className="inline-block mt-2 px-3 py-1 bg-[#4c9baf] text-white text-sm rounded-md hover:bg-gren-700 cursor-pointer">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
              <input
                type="url"
                name="link_url"
                value={formData.link_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/service"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your service..."
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

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddService}
              disabled={isSaving}
              className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Service" : "Add Service"}
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${service.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                {service.icon_url ? (
                  <img src={service.icon_url} alt={service.title} className="w-8 h-8" />
                ) : (
                  <Briefcase className="w-6 h-6 text-[#4c9baf]" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-gray-400 hover:text-[#4c9baf] transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Order: {service.display_order}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {service.link_url && (
              <div className="mt-4">
                <a 
                  href={service.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4c9baf] hover:text-gren-700 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Service
                </a>
              </div>
            )}
          </div>
        ))}
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
