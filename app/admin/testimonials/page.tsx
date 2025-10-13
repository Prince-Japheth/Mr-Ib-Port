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
  Quote, 
  Star,
  User,
  Building
} from "lucide-react"
import { TestimonialsLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface Review {
  id: number
  client_name: string
  company: string
  client_avatar_url: string | null
  review_text: string
  rating: number | null
  display_order: number
  is_active: boolean
}

export default function TestimonialsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  const [formData, setFormData] = useState({
    client_name: "",
    company: "",
    client_avatar_url: "",
    review_text: "",
    rating: 5,
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/testimonials/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/testimonials/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const reviewId = parseInt(id)
        const review = reviews.find(r => r.id === reviewId)
        if (review) {
          handleEdit(review)
        }
      }
    } else if (pathname === '/admin/testimonials') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        client_name: "", 
        company: "", 
        client_avatar_url: "", 
        review_text: "", 
        rating: 5, 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, reviews])

  const fetchReviews = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching reviews:', error)
        return
      }

      setReviews(data || [])
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
        alert(`Error uploading image: ${error.message}`)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Update form data with the new URL
      setFormData(prev => ({ ...prev, client_avatar_url: publicUrl }))
      
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

  const handleAddReview = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing testimonial
        const { error } = await supabase
          .from('reviews')
          .update({
            client_name: formData.client_name,
            company: formData.company,
            client_avatar_url: formData.client_avatar_url || null,
            review_text: formData.review_text,
            rating: parseInt(formData.rating.toString()),
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating testimonial:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new testimonial
        const { error } = await supabase
          .from('reviews')
          .insert([{
            client_name: formData.client_name,
            company: formData.company,
            client_avatar_url: formData.client_avatar_url || null,
            review_text: formData.review_text,
            rating: parseInt(formData.rating.toString()),
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding testimonial:', error)
          return
        }
      }
      
      await fetchReviews() // Refresh data
      setFormData({ 
        client_name: "", 
        company: "", 
        client_avatar_url: "", 
        review_text: "", 
        rating: 5, 
        display_order: 0, 
        is_active: true 
      })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/testimonials')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (review: Review) => {
    setFormData({
      client_name: review.client_name,
      company: review.company,
      client_avatar_url: review.client_avatar_url || "",
      review_text: review.review_text,
      rating: review.rating || 5,
      display_order: review.display_order,
      is_active: review.is_active
    })
    setEditingId(review.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/testimonials/edit/${review.id}`)
  }

  const handleAddNew = () => {
    setFormData({ 
      client_name: "", 
      company: "", 
      client_avatar_url: "", 
      review_text: "", 
      rating: 5, 
      display_order: 0, 
      is_active: true 
    })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/testimonials/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      client_name: "", 
      company: "", 
      client_avatar_url: "", 
      review_text: "", 
      rating: 5, 
      display_order: 0, 
      is_active: true 
    })
    // Navigate back to list view
    router.push('/admin/testimonials')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting review:', error)
        return
      }

      await fetchReviews() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (isLoading) {
    return <TestimonialsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Manage client reviews and testimonials</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Review" : "Add New Review"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., John Smith"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Text</label>
              <textarea
                name="review_text"
                value={formData.review_text}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter the client's testimonial..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Avatar</label>
              
              {/* URL Input */}
              <input
                type="url"
                name="client_avatar_url"
                value={formData.client_avatar_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                placeholder="https://example.com/avatar.jpg"
              />
              
              {/* Upload Section */}
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Or upload an image:</div>
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
                      <p className="text-sm text-gray-600">Drag & drop an image here</p>
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
              onClick={handleAddReview}
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
                  {editingId ? "Update Review" : "Add Review"}
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

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${review.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  {review.client_avatar_url ? (
                    <img 
                      src={review.client_avatar_url} 
                      alt={review.client_name} 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="w-6 h-6 text-[#4c9baf]" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.client_name}</h3>
                  <p className="text-[#4c9baf] text-sm flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {review.company}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-gray-400 hover:text-[#4c9baf] transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                {renderStars(review.rating || 5)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Quote className="w-4 h-4" />
                <span>Review</span>
              </div>
            </div>

            <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
              "{review.review_text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                review.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {review.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-500">Order: {review.display_order}</span>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Add your first client review to get started.</p>
          <button
            onClick={handleAddNew}
            className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        </div>
      )}
    </div>
  )
}
