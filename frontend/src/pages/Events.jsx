import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

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
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-start mb-8 gap-6">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Events</h2>
        {user?.role === 'admin' && (
          <div className="card-base p-4 w-full max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={add}
                disabled={loading}
                className="btn-primary col-span-1 sm:col-span-2 lg:col-span-1"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading events...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No events yet</p>
          </div>
        ) : (
          items.map((e) => (
            <div key={e._id} className="card-base p-6 relative hover:shadow-xl transition-shadow">
              {user?.role === 'admin' && (
                <button
                  aria-label="Delete event"
                  onClick={() => deleteEvent(e._id)}
                  title="Delete"
                  className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center font-semibold transition-colors"
                >
                  ×
                </button>
              )}
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{e.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                📅 {new Date(e.eventDate).toLocaleDateString()}
              </p>
              <p className="text-slate-700 dark:text-slate-300">{e.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
