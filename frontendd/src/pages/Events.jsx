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
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Events</h2>
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="form-input" style={{ width: 160 }} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" style={{ width: 120 }} />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="form-input" style={{ width: 220 }} />
            <button onClick={add} disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <div className="horizontal-cards">
        {loading ? (
          <div className="horizontal-card" style={{ justifyContent: 'center' }}>
            <div className="card-content" style={{ textAlign: 'center' }}>Loading events...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="horizontal-card" style={{ justifyContent: 'center' }}>
            <div className="card-content" style={{ textAlign: 'center' }}>No events yet</div>
          </div>
        ) : (
          items.map((e) => (
            <div key={e._id} className="horizontal-card" style={{ position: 'relative' }}>
              {user?.role === 'admin' && (
                <button
                  aria-label="Delete event"
                  onClick={() => deleteEvent(e._id)}
                  title="Delete"
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: 12,
                    width: 28,
                    height: 28,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b00'
                  }}
                >
                  ×
                </button>
              )}
              <div className="card-content">
                <h3 className="card-title">{e.title}</h3>
                <div className="card-subtitle">{new Date(e.eventDate).toLocaleDateString()}</div>
                <div className="card-description">{e.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
