import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/users/alumni`)
      setAlumni(res.data || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch alumni:', err.message)
      setError(err.response?.data?.message || 'Failed to load alumni')
      setAlumni([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlumni()
  }, [fetchAlumni])

  return (
    <section>
      <h2>Alumni</h2>

      {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading alumni...</div>}
      {error && <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="horizontal-cards">
          {alumni.length === 0 ? (
            <div className="horizontal-card" style={{ justifyContent: 'center' }}>
              <div className="card-content" style={{ textAlign: 'center' }}>No alumni registered yet</div>
            </div>
          ) : (
            alumni.map((a) => {
              try {
                return (
                  <div key={a._id || a.id || Math.random()} className="horizontal-card">
                    <div className="card-content">
                      <h3 className="card-title">{a.name || 'N/A'}</h3>
                      <div className="card-subtitle">{a.email || 'N/A'}</div>
                      <div className="card-description">
                        <div style={{ marginBottom: 4 }}>
                          {a.graduationYear && <span>Year: {a.graduationYear}</span>}
                          {a.courseStudied && <span> • {a.courseStudied}</span>}
                        </div>
                        {a.company && <div>Company: {a.company}</div>}
                      </div>
                    </div>
                  </div>
                )
              } catch (e) {
                console.error('Error rendering alumni item:', e)
                return null
              }
            })
          )}
        </div>
      )}
    </section>
  )
}
