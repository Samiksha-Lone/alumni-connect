import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

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
        <h2 className="text-4xl font-bold">Events</h2>
        {user?.role === 'admin' && (
          <Card className="p-4 w-full max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="form-input" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
              <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="form-input" />
              <Button onClick={add} disabled={loading} className="col-span-1 sm:col-span-2 lg:col-span-1">{loading ? 'Adding...' : 'Add'}</Button>
            </div>
          </Card>
        )}
      </div>

      {error && <div className="mb-6 alert-error">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="muted">Loading events...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="muted">No events yet</p>
          </div>
        ) : (
          items.map((e) => (
            <Card key={e._id} className="p-6 relative">
              {user?.role === 'admin' && (
                <button aria-label="Delete event" onClick={() => deleteEvent(e._id)} title="Delete" style={{position:'absolute',right:12,top:12,width:34,height:34,borderRadius:8,background:'var(--card)',border:'1px solid var(--border)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                  ×
                </button>
              )}
              <h3 className="text-xl font-semibold mb-2">{e.title}</h3>
              <p className="text-sm muted mb-3">📅 {new Date(e.eventDate).toLocaleDateString()}</p>
              <p className="muted">{e.description}</p>
            </Card>
          ))
        )}
      </div>
    </section>
  )
}
