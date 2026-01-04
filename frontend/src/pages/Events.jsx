import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export default function Events() {
  const { user, token } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/events`)
      setItems(res.data || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch events:', err.message)
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function add() {
    if (!title || !token) {
      setError(token ? 'Title is required' : 'You must be logged in')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/api/events`, { title, description: desc, eventDate: date }, { headers: { Authorization: `Bearer ${token}` } })
      setTitle('')
      setDate('')
      setDesc('')
      setError('')
      await fetchEvents()
    } catch (err) {
      console.error('Failed to add event:', err.message)
      setError(err.response?.data?.message || 'Failed to add event')
      setLoading(false)
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Delete this event?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      await fetchEvents()
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError(err.response?.data?.message || 'Failed to delete event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 py-12 mx-auto max-w-7xl">
      <div className="flex items-start justify-between gap-6 mb-8">
        <h2 className="text-4xl font-bold">Events</h2>
        {user?.role === 'admin' && (
          <Card className="w-full max-w-3xl p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="form-input" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
              <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="form-input" />
              <Button onClick={add} disabled={loading} className="col-span-1 sm:col-span-2 lg:col-span-1">{loading ? 'Adding...' : 'Add'}</Button>
            </div>
          </Card>
        )}
      </div>

      {error && <div className="mb-6 alert-error">{error}</div>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="py-12 text-center col-span-full">
            <p className="muted">Loading events...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center col-span-full">
            <p className="muted">No events yet</p>
          </div>
        ) : (
          items.map((e) => (
            <div key={e._id} className="relative flex flex-col h-full p-6 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900">
              {user?.role === 'admin' && (
                <button 
                  aria-label="Delete event" 
                  onClick={() => deleteEvent(e._id)} 
                  title="Delete"
                  className="absolute flex items-center justify-center w-8 h-8 text-red-600 transition-colors duration-150 bg-white border rounded-lg cursor-pointer top-4 right-4 border-slate-200 dark:border-slate-700 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
                >
                  ×
                </button>
              )}
              
              <div className="flex-grow pr-8">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{e.title}</h3>
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">📅 {new Date(e.eventDate).toLocaleDateString()}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{e.description}</p>
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <a href="#" className="text-sm font-medium text-blue-600 transition-colors duration-150 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  View details →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
