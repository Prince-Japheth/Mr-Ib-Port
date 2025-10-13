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

  useEffect(() => {
    fetchProjects()
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
        .select('*')
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
      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }))
      
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
        setEditingId(null)
      } else {
        // Add new project
        const { error } = await supabase
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

        if (error) {
          console.error('Error adding project:', error)
          return
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
    // Navigate back to list view
    router.push('/admin/projects')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
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
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="API">API</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Laravel">Laravel</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Vue.js">Vue.js</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              
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
                      <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                      <span className="text-green-600">Uploading...</span>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm text-gray-600">Drag & drop an image here</p>
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
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddProject}
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
                  <FolderOpen className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-gray-400 hover:text-green-600 transition-colors duration-200"
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
                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
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
                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
