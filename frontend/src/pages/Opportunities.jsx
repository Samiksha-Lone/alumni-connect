import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

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
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-8">Opportunities</h2>

      {canAdd && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Post New Opportunity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" className="form-input" />
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company *" className="form-input" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description *" className="form-input" />
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Apply URL" className="form-input" />
            <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="form-input" />
            <Button onClick={add} disabled={loading} className="col-span-1 sm:col-span-2 lg:col-span-1">{loading ? 'Posting...' : 'Post'}</Button>
          </div>
        </Card>
      )}

      {error && <div className="mb-6 alert-error">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="muted">Loading opportunities...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="muted">No opportunities yet</p>
          </div>
        ) : (
          items.map((o) => (
            <Card key={o._id} className="p-6 relative">
              {user?.role === 'admin' && (
                <button aria-label="Delete opportunity" onClick={() => deleteOpportunity(o._id)} title="Delete" style={{position:'absolute',right:12,top:12,width:34,height:34,borderRadius:8,background:'var(--card)',border:'1px solid var(--border)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>×</button>
              )}
              <h3 className="text-xl font-semibold mb-2">{o.title}</h3>
              <p className="text-sm muted font-medium mb-2">🏢 {o.company}</p>
              <p className="muted mb-4">{o.description}</p>
              {o.closingDate && (
                <p className="text-xs muted mb-3">Closing: {new Date(o.closingDate).toLocaleDateString()}</p>
              )}
              {o.link && (
                <a href={o.link} target="_blank" rel="noopener noreferrer"><Button variant="primary" className="text-sm mt-2">Apply / More Info</Button></a>
              )}
            </Card>
          ))
        )}
      </div>
    </section>
  )
}
