"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Edit, 
  Save, 
  X, 
  Upload, 
  CloudUpload, 
  Loader2, 
  User, 
  MapPin, 
  FileText 
} from "lucide-react"
import { PersonalInfoLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface UserProfile {
  id: number
  first_name: string
  last_name: string
  title: string
  location: string
  bio: string
  avatar_url: string | null
  signature_image_url: string | null
}

export default function PersonalInfoPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    location: "",
    bio: "",
    avatar_url: "",
    signature_image_url: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    // Check current pathname for edit mode
    if (pathname === '/admin/personal-info/edit') {
      setIsEditing(true)
    } else if (pathname === '/admin/personal-info') {
      // Close edit mode
      setIsEditing(false)
    }
  }, [pathname])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        title: data.title || "",
        location: data.location || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        signature_image_url: data.signature_image_url || ""
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const uploadImage = async (file: File, fieldName: string) => {
    setIsUploading(true)
    setUploadingField(fieldName)
    
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
      setFormData(prev => ({ ...prev, [fieldName]: publicUrl }))
      
    } catch (error) {
      console.error('Error:', error)
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      setUploadingField(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file, fieldName)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldName: string) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      uploadImage(file, fieldName)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_profile')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          title: formData.title,
          location: formData.location,
          bio: formData.bio,
          avatar_url: formData.avatar_url || null,
          signature_image_url: formData.signature_image_url || null
        })
        .eq('id', profile?.id)

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      await fetchProfile() // Refresh data
      setIsEditing(false)
      // Navigate back to view mode
      router.push('/admin/personal-info')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false)
      router.push('/admin/personal-info')
    } else {
      setIsEditing(true)
      router.push('/admin/personal-info/edit')
    }
  }

  if (isLoading) {
    return <PersonalInfoLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
          <p className="text-gray-600 mt-1">Manage your personal details and professional information</p>
        </div>
        <button
          onClick={handleEditToggle}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-[#60aec1] transition-colors duration-200 flex items-center gap-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#4c9baf]" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#4c9baf]" />
              Location & Images
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Image</label>
              
              {/* URL Input */}
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 mb-2"
                placeholder="https://example.com/avatar.jpg"
              />
              
              {/* Upload Section */}
              {isEditing && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Or upload an image:</div>
                  <div
                    onDrop={(e) => handleDrop(e, 'avatar_url')}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      uploadingField === 'avatar_url' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {uploadingField === 'avatar_url' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 text-[#4c9baf] animate-spin" />
                        <span className="text-[#4c9baf]">Uploading...</span>
                      </div>
                    ) : (
                      <div>
                        <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                        <p className="text-sm text-gray-600">Drag & drop an image here</p>
                        <p className="text-xs text-gray-500">or</p>
                        <label className="inline-block mt-2 px-3 py-1 bg-[#4c9baf] text-white text-sm rounded-md hover:bg-[#60aec1] cursor-pointer">
                          <Upload className="w-3 h-3 mr-1 inline" />
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'avatar_url')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature Image</label>
              
              {/* URL Input */}
              <input
                type="url"
                name="signature_image_url"
                value={formData.signature_image_url}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 mb-2"
                placeholder="https://example.com/signature.png"
              />
              
              {/* Upload Section */}
              {isEditing && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Or upload an image:</div>
                  <div
                    onDrop={(e) => handleDrop(e, 'signature_image_url')}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      uploadingField === 'signature_image_url' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {uploadingField === 'signature_image_url' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 text-[#4c9baf] animate-spin" />
                        <span className="text-[#4c9baf]">Uploading...</span>
                      </div>
                    ) : (
                      <div>
                        <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                        <p className="text-sm text-gray-600">Drag & drop an image here</p>
                        <p className="text-xs text-gray-500">or</p>
                        <label className="inline-block mt-2 px-3 py-1 bg-[#4c9baf] text-white text-sm rounded-md hover:bg-[#60aec1] cursor-pointer">
                          <Upload className="w-3 h-3 mr-1 inline" />
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'signature_image_url')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#4c9baf]" />
            Professional Bio
          </h3>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Tell us about yourself, your experience, and what makes you unique..."
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#4c9baf] text-white px-6 py-2 rounded-lg hover:bg-[#60aec1] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
