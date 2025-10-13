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
  FolderOpen, 
  Github, 
  ExternalLink 
} from "lucide-react"
import { ProjectsLoadingSkeleton } from "@/components/admin/loading-skeleton"
import { ConfirmationModal } from "@/components/admin/confirmation-modal"

interface Project {
  id: number
  title: string
  category: string
  description: string | null
  detailed_description: string | null
  client_name: string | null
  project_date: string | null
  github_url: string | null
  live_url: string | null
  featured_image_url: string | null
  display_order: number
  is_active: boolean
  project_images?: Array<{
    id: number
    image_url: string
    alt_text: string | null
    display_order: number
  }>
}

export default function ProjectsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    detailed_description: "",
    client_name: "",
    project_date: "",
    github_url: "",
    live_url: "",
    featured_image_url: "",
    display_order: 0,
    is_active: true
  })
  const [projectImages, setProjectImages] = useState<Array<{
    id?: number
    image_url: string
    alt_text: string
    display_order: number
  }>>([])
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
    fetchProjects()
    fetchCategories()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/projects/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/projects/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const projectId = parseInt(id)
        const project = projects.find(p => p.id === projectId)
        if (project) {
          handleEdit(project)
        }
      }
    } else if (pathname === '/admin/projects') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        title: "", 
        category: "", 
        description: "", 
        detailed_description: "", 
        client_name: "", 
        project_date: "", 
        github_url: "", 
        live_url: "", 
        featured_image_url: "", 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, projects])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images (
            id,
            image_url,
            alt_text,
            display_order
          )
        `)
        .order('display_order')

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      setProjects(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
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
          showAlert('Storage Error', 'Images bucket not found. Please create an "images" bucket in your Supabase Storage first.', 'danger')
        } else if (error.message.includes('JWT')) {
          showAlert('Authentication Error', 'Authentication error. Please check your Supabase configuration.', 'danger')
        } else if (error.message.includes('permission')) {
          showAlert('Permission Error', 'Permission denied. Please check your Supabase Storage policies.', 'danger')
        } else {
          showAlert('Upload Error', `Error uploading image: ${error.message}`, 'danger')
        }
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Update form data with the new URL
      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }))
      
    } catch (error) {
      console.error('Error:', error)
      showAlert('Upload Error', `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`, 'danger')
    } finally {
      setIsUploading(false)
    }
  }

  const uploadProjectImage = async (file: File) => {
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
          showAlert('Storage Error', 'Images bucket not found. Please create an "images" bucket in your Supabase Storage first.', 'danger')
        } else if (error.message.includes('JWT')) {
          showAlert('Authentication Error', 'Authentication error. Please check your Supabase configuration.', 'danger')
        } else if (error.message.includes('permission')) {
          showAlert('Permission Error', 'Permission denied. Please check your Supabase Storage policies.', 'danger')
        } else {
          showAlert('Upload Error', `Error uploading image: ${error.message}`, 'danger')
        }
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Add to project images array
      const newImage = {
        image_url: publicUrl,
        alt_text: file.name.split('.')[0],
        display_order: projectImages.length
      }
      
      setProjectImages(prev => [...prev, newImage])
      
    } catch (error) {
      console.error('Error:', error)
      showAlert('Upload Error', `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`, 'danger')
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

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (projectImages.length < 6) {
          uploadProjectImage(file)
        } else {
          showAlert('Maximum Images Reached', 'Maximum 6 images allowed per project', 'warning')
        }
      })
    }
  }

  const removeProjectImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index))
  }

  const updateImageAltText = (index: number, altText: string) => {
    setProjectImages(prev => prev.map((img, i) => 
      i === index ? { ...img, alt_text: altText } : img
    ))
  }

  const replaceProjectImage = async (index: number, file: File) => {
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
        showAlert('Error uploading image', error.message, 'danger')
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      // Replace the image at the specified index
      setProjectImages(prev => prev.map((img, i) => 
        i === index ? { ...img, image_url: publicUrl } : img
      ))
      
    } catch (error) {
      console.error('Error:', error)
      showAlert('Error uploading image', error instanceof Error ? error.message : 'Unknown error', 'danger')
    } finally {
      setIsUploading(false)
    }
  }

  const addImageFromUrl = (url: string, altText: string = '') => {
    if (projectImages.length >= 6) {
      showAlert('Maximum images reached', 'You can only add up to 6 images per project.', 'warning')
      return
    }

    const newImage = {
      image_url: url,
      alt_text: altText,
      display_order: projectImages.length
    }
    
    setProjectImages(prev => [...prev, newImage])
  }

  const showAlert = (title: string, message: string, type: 'danger' | 'warning' | 'info' = 'warning') => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {},
      type
    })
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

  const handleAddProject = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            category: formData.category,
            description: formData.description || null,
            detailed_description: formData.detailed_description || null,
            client_name: formData.client_name || null,
            project_date: formData.project_date || null,
            github_url: formData.github_url || null,
            live_url: formData.live_url || null,
            featured_image_url: formData.featured_image_url || null,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating project:', error)
          return
        }

        // Update project images
        if (projectImages.length > 0) {
          // Delete existing images
          await supabase
            .from('project_images')
            .delete()
            .eq('project_id', editingId)

          // Insert new images
          const imagesToInsert = projectImages.map(img => ({
            project_id: editingId,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: img.display_order
          }))

          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(imagesToInsert)

          if (imagesError) {
            console.error('Error updating project images:', imagesError)
          }
        }

        setEditingId(null)
      } else {
        // Add new project
        const { data: newProject, error } = await supabase
          .from('projects')
          .insert([{
            title: formData.title,
            category: formData.category,
            description: formData.description || null,
            detailed_description: formData.detailed_description || null,
            client_name: formData.client_name || null,
            project_date: formData.project_date || null,
            github_url: formData.github_url || null,
            live_url: formData.live_url || null,
            featured_image_url: formData.featured_image_url || null,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])
          .select()
          .single()

        if (error) {
          console.error('Error adding project:', error)
          return
        }

        // Add project images
        if (projectImages.length > 0 && newProject) {
          const imagesToInsert = projectImages.map(img => ({
            project_id: newProject.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: img.display_order
          }))

          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(imagesToInsert)

          if (imagesError) {
            console.error('Error adding project images:', imagesError)
          }
        }
      }
      
      await fetchProjects() // Refresh data
      setFormData({ 
        title: "", 
        category: "", 
        description: "", 
        detailed_description: "", 
        client_name: "", 
        project_date: "", 
        github_url: "", 
        live_url: "", 
        featured_image_url: "", 
        display_order: 0, 
        is_active: true 
      })
      setProjectImages([])
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description || "",
      detailed_description: project.detailed_description || "",
      client_name: project.client_name || "",
      project_date: project.project_date || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      featured_image_url: project.featured_image_url || "",
      display_order: project.display_order,
      is_active: project.is_active
    })
    
    // Load project images
    if (project.project_images) {
      setProjectImages(project.project_images.map(img => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || "",
        display_order: img.display_order
      })))
    } else {
      setProjectImages([])
    }
    
    setEditingId(project.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/projects/edit/${project.id}`)
  }

  const handleAddNew = () => {
    setFormData({ 
      title: "", 
      category: "", 
      description: "", 
      detailed_description: "", 
      client_name: "", 
      project_date: "", 
      github_url: "", 
      live_url: "", 
      featured_image_url: "", 
      display_order: 0, 
      is_active: true 
    })
    setProjectImages([])
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/projects/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      title: "", 
      category: "", 
      description: "", 
      detailed_description: "", 
      client_name: "", 
      project_date: "", 
      github_url: "", 
      live_url: "", 
      featured_image_url: "", 
      display_order: 0, 
      is_active: true 
    })
    setProjectImages([])
    // Navigate back to list view
    router.push('/admin/projects')
  }

  const handleDelete = async (id: number) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: () => deleteProject(id),
      type: 'danger'
    })
  }

  const deleteProject = async (id: number) => {
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting project:', error)
        return
      }

      await fetchProjects() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return <ProjectsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#4c9baf] text-white px-4 py-2 rounded-lg hover:bg-gren-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., E-Commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., TechCorp Solutions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Date</label>
              <input
                type="date"
                name="project_date"
                value={formData.project_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://project-demo.com"
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

            {/* Images Section - Featured Image and Project Images in same row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                
                {/* Image Preview */}
                {formData.featured_image_url && (
                  <div className="mb-4">
                    <img 
                      src={formData.featured_image_url} 
                      alt="Featured image preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {/* URL Input */}
                <input
                  type="url"
                  name="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                  placeholder="https://example.com/project-image.jpg"
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

              {/* Project Images */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Images (Max 6)
              </label>
              
              {/* Add Image from URL */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.trim()) {
                          addImageFromUrl(input.value.trim())
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        addImageFromUrl(input.value.trim())
                        input.value = ''
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>
              
              {/* Upload Section */}
              <div className="space-y-2">
                <div
                  onDrop={(e) => {
                    e.preventDefault()
                    const files = e.dataTransfer.files
                    Array.from(files).forEach(file => {
                      if (file.type.startsWith('image/') && projectImages.length < 6) {
                        uploadProjectImage(file)
                      } else if (projectImages.length >= 6) {
                        showAlert('Maximum Images Reached', 'Maximum 6 images allowed per project', 'warning')
                      }
                    })
                  }}
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
                      <p className="text-sm text-gray-600">Drag & drop images here</p>
                      <p className="text-xs text-gray-500">or</p>
                      <label className="inline-block mt-2 px-3 py-1 bg-[#4c9baf] text-white text-sm rounded-md hover:bg-gren-700 cursor-pointer">
                        <Upload className="w-3 h-3 mr-1 inline" />
                        Choose Files
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProjectImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {projectImages.length}/6 images uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Display uploaded images */}
              {projectImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {projectImages.map((image, index) => (
                      <div key={index} className="relative border rounded-lg p-2">
                        <img 
                          src={image.image_url} 
                          alt={image.alt_text}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                        <button
                          onClick={() => removeProjectImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <div className="mt-2 space-y-1">
                          <input
                            type="text"
                            value={image.alt_text}
                            onChange={(e) => updateImageAltText(index, e.target.value)}
                            placeholder="Alt text"
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  replaceProjectImage(index, file)
                                }
                              }}
                              className="hidden"
                            />
                            <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                              Replace image
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
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
              placeholder="Brief project description..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              name="detailed_description"
              value={formData.detailed_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Detailed project description with features, technologies used, etc..."
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
              onClick={handleAddProject}
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
                  {editingId ? "Update Project" : "Add Project"}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${project.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                {project.featured_image_url ? (
                  <img src={project.featured_image_url} alt={project.title} className="w-8 h-8 rounded" />
                ) : (
                  <FolderOpen className="w-6 h-6 text-[#4c9baf]" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-gray-400 hover:text-[#4c9baf] transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{project.description}</p>
            <p className="text-gray-500 text-xs mb-3">{project.category}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Order: {project.display_order}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {project.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2">
              {project.github_url && (
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4c9baf] hover:text-gren-700 text-sm flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              )}
              {project.live_url && (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4c9baf] hover:text-gren-700 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />
    </div>
  )
}
