import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function Opportunities() {
  const { user, token } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [desc, setDesc] = useState('')
  const [link, setLink] = useState('')
  const [closingDate, setClosingDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/jobs`)
      setItems(res.data || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch opportunities:', err.message)
      setError(err.response?.data?.message || 'Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  async function add() {
    if (!title || !token) {
      setError(token ? 'Title is required' : 'You must be logged in')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/api/jobs`, { title, company, description: desc, link: link || '', closingDate: closingDate || null }, { headers: { Authorization: `Bearer ${token}` } })
      setTitle('')
      setCompany('')
      setDesc('')
      setLink('')
      setClosingDate('')
      setError('')
      await fetchOpportunities()
    } catch (err) {
      console.error('Failed to add opportunity:', err.message)
      setError(err.response?.data?.message || 'Failed to add opportunity')
      setLoading(false)
    }
  }

  async function deleteOpportunity(id) {
    if (!window.confirm('Delete this opportunity?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      await fetchOpportunities()
    } catch (err) {
      console.error('Failed to delete opportunity:', err)
      setError(err.response?.data?.message || 'Failed to delete opportunity')
    } finally {
      setLoading(false)
    }
  }

  const canAdd = user && (user.role === 'alumni' || user.role === 'admin')

  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <h2>Opportunities</h2>
        {canAdd && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8, 
            marginTop: 12,
            padding: '12px',
            backgroundColor: 'var(--card)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" className="form-input" />
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company *" className="form-input" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description *" className="form-input" />
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Apply URL" className="form-input" />
            <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="form-input" />
            <button onClick={add} disabled={loading} style={{ padding: '8px 16px' }}>{loading ? 'Posting...' : 'Post'}</button>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <div className="horizontal-cards">
        {loading ? (
          <div className="horizontal-card" style={{ justifyContent: 'center' }}>
            <div className="card-content" style={{ textAlign: 'center' }}>Loading opportunities...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="horizontal-card" style={{ justifyContent: 'center' }}>
            <div className="card-content" style={{ textAlign: 'center' }}>No opportunities yet</div>
          </div>
        ) : (
          items.map((o) => (
            <div key={o._id} className="horizontal-card" style={{ position: 'relative' }}>
              {user?.role === 'admin' && (
                <button
                  aria-label="Delete opportunity"
                  onClick={() => deleteOpportunity(o._id)}
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
                <h3 className="card-title">{o.title}</h3>
                <div className="card-subtitle">{o.company}</div>
                <div className="card-description">{o.description}</div>
                {o.closingDate && (
                  <div className="card-subtitle">Closing: {new Date(o.closingDate).toLocaleDateString()}</div>
                )}
                {o.link && (
                  <div style={{ marginTop: 8 }}>
                    <a href={o.link} target="_blank" rel="noopener noreferrer">Apply / More info</a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
