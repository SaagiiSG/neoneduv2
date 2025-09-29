'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SidebarLayout from '@/components/admin/SidebarLayout'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Save, X, Plus, Calendar, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

type HistoryItem = {
  id: string
  year: number
  event: string
  created_at?: string
}

export default function HistoryAdminPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [year, setYear] = useState<string>('')
  const [event, setEvent] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editYear, setEditYear] = useState<string>('')
  const [editEvent, setEditEvent] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [tableNotFound, setTableNotFound] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      const json = await res.json()
      if (json.success) {
        const sortedItems = json.data.sort((a: HistoryItem, b: HistoryItem) => {
          return sortOrder === 'desc' ? b.year - a.year : a.year - b.year
        })
        setItems(sortedItems)
      } else {
        if (json.error === 'Table not found') {
          setTableNotFound(true)
          toast.error('History table not found. Please create it in Supabase dashboard.')
        } else {
          toast.error('Failed to load history items')
        }
      }
    } catch (error) {
      toast.error('Error loading history items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [sortOrder])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!year || !event) {
      toast.error('Please fill in both year and event')
      return
    }
    
    const yearNum = Number(year)
    if (yearNum < 1900 || yearNum > 2100) {
      toast.error('Year must be between 1900 and 2100')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: yearNum, event })
      })
      const json = await res.json()
      if (json.success) {
        toast.success('History item added successfully')
        setYear('')
        setEvent('')
        setShowAddForm(false)
        await load()
      } else {
        toast.error(json.message || 'Failed to add history item')
      }
    } catch (error) {
      toast.error('Error adding history item')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (item: HistoryItem) => {
    setEditingId(item.id)
    setEditYear(String(item.year))
    setEditEvent(item.event)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditYear('')
    setEditEvent('')
  }

  const saveEdit = async () => {
    if (!editingId) return
    
    if (!editYear || !editEvent) {
      toast.error('Please fill in both year and event')
      return
    }
    
    const yearNum = Number(editYear)
    if (yearNum < 1900 || yearNum > 2100) {
      toast.error('Year must be between 1900 and 2100')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, year: yearNum, event: editEvent })
      })
      const json = await res.json()
      if (json.success) {
        toast.success('History item updated successfully')
        cancelEdit()
        await load()
      } else {
        toast.error(json.message || 'Failed to update history item')
      }
    } catch (error) {
      toast.error('Error updating history item')
    } finally {
      setSaving(false)
    }
  }

  const removeItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this history item?')) return
    
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        toast.success('History item deleted successfully')
        await load()
      } else {
        toast.error(json.message || 'Failed to delete history item')
      }
    } catch (error) {
      toast.error('Error deleting history item')
    }
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            History Timeline
          </h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              variant="outline"
              size="sm"
            >
              Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add History Item
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-6 overflow-hidden"
            >
              <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <Input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    placeholder="2025"
                    min="1900"
                    max="2100"
                    className="text-black"
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
                  <Textarea 
                    value={event} 
                    onChange={(e) => setEvent(e.target.value)} 
                    placeholder="What happened?"
                    rows={3}
                    className="text-black"
                    required
                  />
                </div>
                <div className="md:col-span-1 flex items-end gap-2">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? 'Adding...' : 'Add'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {loading ? 'Loading…' : `${items.length} history items`}
            </p>
            {items.length > 0 && (
              <p className="text-xs text-gray-500">
                {sortOrder === 'desc' ? 'Newest to Oldest' : 'Oldest to Newest'}
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading history items...</p>
            </div>
          ) : tableNotFound ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-medium">History table not found</p>
              <div className="text-sm text-gray-500 space-y-2 max-w-md mx-auto">
                <p>To set up the history feature, please:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                  <li>Select your project and go to SQL Editor</li>
                  <li>Run the SQL from <code className="bg-gray-100 px-1 rounded">server/database/migrations/005_create_history.sql</code></li>
                  <li>Refresh this page</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Quick SQL:</strong> Copy and paste the table creation SQL from the migration file into Supabase SQL Editor.
                  </p>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No history items yet</p>
              <p className="text-sm text-gray-500">Click "Add History Item" to get started</p>
            </div>
          ) : (
            <ul className="divide-y">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {editingId === item.id ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full grid grid-cols-1 md:grid-cols-6 gap-4"
                      >
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                          <Input 
                            type="number" 
                            value={editYear} 
                            onChange={(e) => setEditYear(e.target.value)}
                            min="1900"
                            max="2100"
                            className="text-black"
                            required
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Event</label>
                          <Textarea 
                            value={editEvent} 
                            onChange={(e) => setEditEvent(e.target.value)}
                            rows={3}
                            className="text-black"
                            required
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end gap-2">
                          <Button 
                            type="button" 
                            onClick={saveEdit} 
                            disabled={saving}
                            size="sm"
                            className="flex-1"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button 
                            type="button" 
                            onClick={cancelEdit} 
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="font-semibold text-lg text-gray-900">{item.year}</span>
                          </div>
                          {item.created_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Added {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-4">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.event}</p>
                        </div>
                        <div className="md:col-span-1 flex items-start gap-2 justify-end">
                          <Button 
                            type="button" 
                            onClick={() => startEdit(item)} 
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            onClick={() => removeItem(item.id)} 
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </div>
    </SidebarLayout>
  )
}


