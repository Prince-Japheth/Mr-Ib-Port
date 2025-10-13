"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Save, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { ProfileLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface AdminUser {
  id: number
  email: string
  created_at: string
}

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    fetchAdminUser()
  }, [])

  const fetchAdminUser = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('admin')
        .select('id, email, created_at')
        .single()

      if (error) {
        console.error('Error fetching admin user:', error)
        return
      }

      setAdminUser(data)
      setFormData(prev => ({ ...prev, email: data.email }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveEmail = async () => {
    if (!formData.email) {
      setErrorMessage("Email is required")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('admin')
        .update({ email: formData.email })
        .eq('id', adminUser?.id)

      if (error) {
        console.error('Error updating email:', error)
        setErrorMessage("Failed to update email")
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      setAdminUser(prev => prev ? { ...prev, email: formData.email } : null)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage("An error occurred")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("All password fields are required")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New passwords do not match")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsSaving(true)
    try {
      // First verify current password
      const supabase = createClient()
      const { data: adminData, error: fetchError } = await supabase
        .from('admin')
        .select('password_hash')
        .eq('id', adminUser?.id)
        .single()

      if (fetchError) {
        console.error('Error fetching admin data:', fetchError)
        setErrorMessage("Failed to verify current password")
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      // Verify current password
      const bcrypt = require('bcryptjs')
      const isValidPassword = await bcrypt.compare(formData.currentPassword, adminData.password_hash)
      
      if (!isValidPassword) {
        setErrorMessage("Current password is incorrect")
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      // Hash new password
      const saltRounds = 10
      const newPasswordHash = await bcrypt.hash(formData.newPassword, saltRounds)

      // Update password
      const { error: updateError } = await supabase
        .from('admin')
        .update({ password_hash: newPasswordHash })
        .eq('id', adminUser?.id)

      if (updateError) {
        console.error('Error updating password:', updateError)
        setErrorMessage("Failed to update password")
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      // Clear password fields
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      }))
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage("An error occurred")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <ProfileLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your admin account settings</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-green-600" />
          </div>
          <p className="text-green-800 font-medium">Settings updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-3 h-3 text-red-600" />
          </div>
          <p className="text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
            
            <button
              onClick={handleSaveEmail}
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
                  Update Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Password Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Password Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
            <p className="text-sm text-gray-900">{adminUser?.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-sm text-gray-900">
              {adminUser?.created_at ? new Date(adminUser.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
