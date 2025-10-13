"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Save, 
  Settings, 
  Eye, 
  EyeOff, 
  Globe, 
  Mail, 
  Phone, 
  Copyright,
  ToggleLeft,
  ToggleRight,
  Info,
  AlertCircle
} from "lucide-react"
import { AdminLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface SiteSetting {
  id: number
  setting_key: string
  setting_value: string | null
  setting_type: string
  description: string | null
}

interface SectionVisibility {
  id: number
  section_name: string
  is_visible: boolean
  display_order: number
  description: string | null
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([])
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const supabase = createClient()
      
      const [siteSettingsResult, sectionVisibilityResult] = await Promise.all([
        supabase.from('site_settings').select('*').order('setting_key'),
        supabase.from('section_visibility').select('*').order('display_order')
      ])

      if (siteSettingsResult.error) {
        console.error('Error fetching site settings:', siteSettingsResult.error)
        return
      }

      if (sectionVisibilityResult.error) {
        console.error('Error fetching section visibility:', sectionVisibilityResult.error)
        return
      }

      setSiteSettings(siteSettingsResult.data || [])
      setSectionVisibility(sectionVisibilityResult.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (id: number, value: string) => {
    setSiteSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, setting_value: value } : setting
    ))
  }

  const handleSectionToggle = async (id: number, isVisible: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('section_visibility')
        .update({ is_visible: isVisible })
        .eq('id', id)

      if (error) {
        console.error('Error updating section visibility:', error)
        return
      }

      // Update local state
      setSectionVisibility(prev => prev.map(section => 
        section.id === id ? { ...section, is_visible: isVisible } : section
      ))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      // Update all site settings
      for (const setting of siteSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: setting.setting_value })
          .eq('id', setting.id)

        if (error) {
          console.error(`Error updating setting ${setting.setting_key}:`, error)
          return
        }
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'site_title':
        return <Globe className="w-5 h-5 text-[#4c9baf]" />
      case 'site_description':
        return <Info className="w-5 h-5 text-[#4c9baf]" />
      case 'copyright_text':
        return <Copyright className="w-5 h-5 text-[#4c9baf]" />
      case 'contact_email':
        return <Mail className="w-5 h-5 text-[#4c9baf]" />
      case 'contact_phone':
        return <Phone className="w-5 h-5 text-[#4c9baf]" />
      case 'logo_text':
        return <Settings className="w-5 h-5 text-[#4c9baf]" />
      default:
        return <Settings className="w-5 h-5 text-[#4c9baf]" />
    }
  }

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'about_section':
        return <Info className="w-4 h-4 text-gray-600" />
      case 'services_section':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'language_skills_section':
        return <Globe className="w-4 h-4 text-gray-600" />
      case 'hard_skills_section':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'experience_section':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'reviews_section':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'projects_section':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'contact_section':
        return <Mail className="w-4 h-4 text-gray-600" />
      default:
        return <Settings className="w-4 h-4 text-gray-600" />
    }
  }

  const formatSectionName = (sectionName: string) => {
    return sectionName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return <AdminLoadingSkeleton type="page" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage site settings and section visibility</p>
        </div>
        <button
          onClick={handleSaveSettings}
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
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <Save className="w-3 h-3 text-[#4c9baf]" />
          </div>
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[#4c9baf]" />
            <h2 className="text-lg font-semibold text-gray-900">Site Settings</h2>
          </div>
          
          <div className="space-y-4">
            {siteSettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  {getSettingIcon(setting.setting_key)}
                  <label className="text-sm font-medium text-gray-700">
                    {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                </div>
                <input
                  type={setting.setting_type === 'number' ? 'number' : 'text'}
                  value={setting.setting_value || ''}
                  onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
                />
                {setting.description && (
                  <p className="text-xs text-gray-500">{setting.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Visibility */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-[#4c9baf]" />
            <h2 className="text-lg font-semibold text-gray-900">Section Visibility</h2>
          </div>
          
          <div className="space-y-4">
            {sectionVisibility.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getSectionIcon(section.section_name)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {formatSectionName(section.section_name)}
                    </h3>
                    {section.description && (
                      <p className="text-xs text-gray-500">{section.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSectionToggle(section.id, !section.is_visible)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    section.is_visible
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {section.is_visible ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Visible
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Hidden
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Settings Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Settings Information</h3>
            <p className="text-sm text-blue-800">
              Site settings control the general information displayed on your portfolio. 
              Section visibility toggles allow you to show or hide specific sections on your website. 
              Changes are saved automatically when you toggle section visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
