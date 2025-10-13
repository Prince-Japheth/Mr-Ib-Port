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
  Link as LinkIcon, 
  ExternalLink,
  Globe,
  Share2,
  Github, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone,
  Code,
  MessageSquare
} from "lucide-react"
import { SocialLinksLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface SocialLink {
  id: number
  platform: string
  url: string
  icon_class: string
  display_order: number
  is_active: boolean
}

const socialPlatforms = [
  { value: 'github', label: 'GitHub', icon: Github, color: 'bg-gray-800' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-700' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600' },
  { value: 'behance', label: 'Behance', icon: Globe, color: 'bg-blue-500' },
  { value: 'dribbble', label: 'Dribbble', icon: Globe, color: 'bg-pink-500' },
  { value: 'medium', label: 'Medium', icon: MessageSquare, color: 'bg-gray-700' },
  { value: 'dev', label: 'Dev.to', icon: Code, color: 'bg-gray-600' },
  { value: 'codepen', label: 'CodePen', icon: Code, color: 'bg-gray-800' },
  { value: 'stackoverflow', label: 'Stack Overflow', icon: MessageSquare, color: 'bg-orange-500' },
  { value: 'website', label: 'Personal Website', icon: Globe, color: 'bg-green-600' },
  { value: 'email', label: 'Email', icon: Mail, color: 'bg-gray-600' },
  { value: 'phone', label: 'Phone', icon: Phone, color: 'bg-green-500' }
]

export default function SocialLinksPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon_class: "",
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  useEffect(() => {
    // Check current pathname for modal state
    if (pathname === '/admin/social-links/new') {
      handleAddNew()
    } else if (pathname.startsWith('/admin/social-links/edit/')) {
      const id = pathname.split('/').pop()
      if (id) {
        const socialLinkId = parseInt(id)
        const socialLink = socialLinks.find(s => s.id === socialLinkId)
        if (socialLink) {
          handleEdit(socialLink)
        }
      }
    } else if (pathname === '/admin/social-links') {
      // Close any open modals and reset form
      setIsAdding(false)
      setEditingId(null)
      setFormData({ 
        platform: "", 
        url: "", 
        icon_class: "", 
        display_order: 0, 
        is_active: true 
      })
    }
  }, [pathname, socialLinks])

  const fetchSocialLinks = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order')

      if (error) {
        console.error('Error fetching social links:', error)
        return
      }

      setSocialLinks(data || [])
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

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platform: platform,
      icon_class: platform // Store platform name as icon_class for database compatibility
    }))
  }

  const handleAddSocialLink = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      if (editingId) {
        // Update existing social link
        const { error } = await supabase
          .from('social_links')
          .update({
            platform: formData.platform,
            url: formData.url,
            icon_class: formData.icon_class,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          })
          .eq('id', editingId)

        if (error) {
          console.error('Error updating social link:', error)
          return
        }
        setEditingId(null)
      } else {
        // Add new social link
        const { error } = await supabase
          .from('social_links')
          .insert([{
            platform: formData.platform,
            url: formData.url,
            icon_class: formData.icon_class,
            display_order: parseInt(formData.display_order.toString()),
            is_active: formData.is_active
          }])

        if (error) {
          console.error('Error adding social link:', error)
          return
        }
      }
      
      await fetchSocialLinks() // Refresh data
      setFormData({ 
        platform: "", 
        url: "", 
        icon_class: "", 
        display_order: 0, 
        is_active: true 
      })
      setIsAdding(false)
      setEditingId(null)
      // Navigate back to list view
      router.push('/admin/social-links')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (socialLink: SocialLink) => {
    setFormData({
      platform: socialLink.platform,
      url: socialLink.url,
      icon_class: socialLink.icon_class,
      display_order: socialLink.display_order,
      is_active: socialLink.is_active
    })
    setEditingId(socialLink.id)
    setIsAdding(true)
    // Navigate to edit route
    router.push(`/admin/social-links/edit/${socialLink.id}`)
  }

  const handleAddNew = () => {
    setFormData({ 
      platform: "", 
      url: "", 
      icon_class: "", 
      display_order: 0, 
      is_active: true 
    })
    setEditingId(null)
    setIsAdding(true)
    // Navigate to add route
    router.push('/admin/social-links/new')
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      platform: "", 
      url: "", 
      icon_class: "", 
      display_order: 0, 
      is_active: true 
    })
    // Navigate back to list view
    router.push('/admin/social-links')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting social link:', error)
        return
      }

      await fetchSocialLinks() // Refresh data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getPlatformInfo = (platform: string) => {
    return socialPlatforms.find(p => p.value === platform) || { 
      label: platform, 
      icon: LinkIcon, 
      color: 'bg-gray-500' 
    }
  }

  if (isLoading) {
    return <SocialLinksLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
          <p className="text-gray-600 mt-1">Manage your social media and contact links</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Social Link" : "Add New Social Link"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/your-profile"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon Preview</label>
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md bg-gray-50">
                {formData.platform ? (
                  <>
                    <div className={`w-8 h-8 ${getPlatformInfo(formData.platform).color} rounded-lg flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = getPlatformInfo(formData.platform).icon
                        return <IconComponent className="w-4 h-4 text-white" />
                      })()}
                    </div>
                    <span className="text-sm text-gray-700">
                      {getPlatformInfo(formData.platform).label} icon
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Select a platform to see icon preview</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Icon is automatically selected based on the platform
              </p>
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
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleAddSocialLink}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Social Link" : "Add Social Link"}
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

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((socialLink) => {
          const platformInfo = getPlatformInfo(socialLink.platform)
          return (
            <div key={socialLink.id} className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${socialLink.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${platformInfo.color} rounded-lg flex items-center justify-center`}>
                    <platformInfo.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 capitalize">{platformInfo.label}</h3>
                    <p className="text-xs text-gray-500">{socialLink.platform}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(socialLink)}
                    className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-1"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(socialLink.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <a 
                  href={socialLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 break-all"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{socialLink.url}</span>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  socialLink.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {socialLink.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {socialLink.display_order}</span>
              </div>
            </div>
          )
        })}
      </div>

      {socialLinks.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No social links yet</h3>
          <p className="text-gray-600 mb-4">Add your social media profiles and contact links.</p>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Social Link
          </button>
        </div>
      )}
    </div>
  )
}
