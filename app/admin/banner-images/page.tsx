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
  Upload,
  CloudUpload
} from "lucide-react"
import { ConfirmationModal } from "@/components/admin/confirmation-modal"

interface BannerImage {
  id: number
  image_type: string
  image_url: string
  alt_text: string | null
  is_default: boolean
  is_active: boolean
}

export default function BannerImagesPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([])

  const [formData, setFormData] = useState({
    image_type: "background",
    image_url: "",
    alt_text: "",
    is_default: false,
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
    fetchBannerImages()
  }, [])

  const fetchBannerImages = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('banner_images')
        .select('*')
        .order('image_type', { ascending: true })

      if (error) throw error
      setBannerImages(data || [])
    } catch (error) {
      console.error('Error fetching banner images:', error)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }))
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const supabase = createClient()

      const imageData = {
        image_type: formData.image_type,
        image_url: formData.image_url,
        alt_text: formData.alt_text || null,
        is_default: formData.is_default,
        is_active: formData.is_active
      }

      if (editingId) {
        // Update existing image
        const { error } = await supabase
          .from('banner_images')
          .update(imageData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create new image
        const { error } = await supabase
          .from('banner_images')
          .insert([imageData])

        if (error) throw error
      }

      await fetchBannerImages()
      handleCancel()
    } catch (error) {
      console.error('Error saving banner image:', error)
      alert('Error saving banner image. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (image: BannerImage) => {
    setFormData({
      image_type: image.image_type,
      image_url: image.image_url,
      alt_text: image.alt_text || "",
      is_default: image.is_default,
      is_active: image.is_active
    })
    setEditingId(image.id)
    setIsAdding(true)
  }

  const handleDelete = (image: BannerImage) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Banner Image',
      message: `Are you sure you want to delete this ${image.image_type} image? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('banner_images')
            .delete()
            .eq('id', image.id)

          if (error) throw error
          await fetchBannerImages()
        } catch (error) {
          console.error('Error deleting banner image:', error)
          alert('Error deleting banner image. Please try again.')
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleAddNew = () => {
    setFormData({
      image_type: "background",
      image_url: "",
      alt_text: "",
      is_default: false,
      is_active: true
    })
    setEditingId(null)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setFormData({
      image_type: "background",
      image_url: "",
      alt_text: "",
      is_default: false,
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
        <h1 className="text-2xl font-bold text-gray-900">Banner Images Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Image
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Banner Image' : 'Add New Banner Image'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Type *</label>
              <select
                name="image_type"
                value={formData.image_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="background">Background</option>
                <option value="person">Person</option>
              </select>
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
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Upload Section */}
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">Or upload an image:</div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                  <span className="text-green-600">Uploading...</span>
                </div>
              ) : (
                <div>
                  <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                  <p className="text-sm text-gray-600">Upload an image</p>
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

          {/* Preview */}
          {formData.image_url && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Preview</h3>
              <div className="relative w-48 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt={formData.alt_text || formData.image_type}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Default Image</span>
            </label>
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

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.image_url.trim()}
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

      {/* Banner Images List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alt Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
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
              {bannerImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-12 flex items-center justify-center">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || image.image_type}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">{image.image_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{image.alt_text || 'No alt text'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      image.is_default 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {image.is_default ? 'Default' : 'Custom'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      image.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
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
