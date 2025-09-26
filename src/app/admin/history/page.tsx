'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SidebarLayout from '@/components/admin/SidebarLayout'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Save, X } from 'lucide-react'

type HistoryItem = {
  id: string
  year: number
  event: string
  created_at?: string
}

export default function HistoryAdminPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [year, setYear] = useState<string>('')
  const [event, setEvent] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editYear, setEditYear] = useState<string>('')
  const [editEvent, setEditEvent] = useState<string>('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      const json = await res.json()
      if (json.success) setItems(json.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!year || !event) return
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: Number(year), event })
    })
    const json = await res.json()
    if (json.success) {
      setYear('')
      setEvent('')
      await load()
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
    const res = await fetch('/api/history', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, year: Number(editYear), event: editEvent })
    })
    const json = await res.json()
    if (json.success) {
      cancelEdit()
      await load()
    }
  }

  const removeItem = async (id: string) => {
    const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) await load()
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-gray-900"
        >
          History Timeline
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
              <Textarea value={event} onChange={(e) => setEvent(e.target.value)} placeholder="What happened?" />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full">Add</Button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">{loading ? 'Loading…' : `${items.length} items`}</p>
          </div>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="p-4 flex items-start gap-4">
                {editingId === item.id ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-1">
                      <Input type="number" value={editYear} onChange={(e) => setEditYear(e.target.value)} />
                    </div>
                    <div className="md:col-span-4">
                      <Textarea value={editEvent} onChange={(e) => setEditEvent(e.target.value)} />
                    </div>
                    <div className="md:col-span-1 flex items-center gap-2 justify-end">
                      <Button type="button" onClick={saveEdit} variant="default"><Save className="h-4 w-4 mr-2" />Save</Button>
                      <Button type="button" onClick={cancelEdit} variant="secondary"><X className="h-4 w-4 mr-2" />Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-1 font-semibold">{item.year}</div>
                    <div className="md:col-span-4 whitespace-pre-wrap">{item.event}</div>
                    <div className="md:col-span-1 flex items-center gap-2 justify-end">
                      <Button type="button" onClick={() => startEdit(item)} variant="outline"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
                      <Button type="button" onClick={() => removeItem(item.id)} variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SidebarLayout>
  )
}


