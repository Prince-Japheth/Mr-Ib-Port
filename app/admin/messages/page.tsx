"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Mail, 
  User, 
  Calendar, 
  Eye, 
  EyeOff, 
  Trash2, 
  Reply,
  Search,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react"
import { MessagesLoadingSkeleton } from "@/components/admin/loading-skeleton"

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id)

      if (error) {
        console.error('Error marking message as read:', error)
        return
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ))
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null)
      }

      // Dispatch custom event to update sidebar notification
      window.dispatchEvent(new CustomEvent('messageStatusChanged'))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const markAsUnread = async (id: number) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: false })
        .eq('id', id)

      if (error) {
        console.error('Error marking message as unread:', error)
        return
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, is_read: false } : msg
      ))
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, is_read: false } : null)
      }

      // Dispatch custom event to update sidebar notification
      window.dispatchEvent(new CustomEvent('messageStatusChanged'))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting message:', error)
        return
      }

      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== id))
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRead === "all" || 
                         (filterRead === "read" && message.is_read) ||
                         (filterRead === "unread" && !message.is_read)
    
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(msg => !msg.is_read).length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return <MessagesLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {messages.length} total messages • {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as "all" | "read" | "unread")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-green-50 border-green-200' : ''
                    } ${!message.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{message.name}</h3>
                          <p className="text-xs text-gray-500">{message.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!message.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedMessage.name}</h2>
                      <p className="text-green-600">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedMessage.is_read 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedMessage.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedMessage.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedMessage.is_read ? (
                    <button
                      onClick={() => markAsUnread(selectedMessage.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      <EyeOff className="w-4 h-4" />
                      Mark as Unread
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                  
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message`}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </a>
                  
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-600">Choose a message from the list to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
