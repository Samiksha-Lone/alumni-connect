import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function ImageModal({ image, onClose }) {
  if (!image) return null

  return (
    <div 
      className={`modal-backdrop ${image ? 'active' : ''}`} 
      onClick={onClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img src={image} alt="gallery preview" />
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { user, token } = useAuth()
  const [items, setItems] = useState([])
  const [url, setUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/api/gallery`)
      setItems(res.data || [])
      setError('')
    } catch (err) {
      console.error('Failed to fetch gallery:', err.message)
      setError(err.response?.data?.message || 'Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  function handleImageClick(url) {
    setSelectedImage(url)
    document.body.style.overflow = 'hidden'
  }

  function handleCloseModal() {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  async function add() {
    if (!url || !token) {
      setError(token ? 'URL is required' : 'You must be logged in')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/api/gallery`, { imageUrl: url, description: 'Gallery image' }, { headers: { Authorization: `Bearer ${token}` } })
      setUrl('')
      setError('')
      await fetchGallery()
    } catch (err) {
      console.error('Failed to add image:', err.message)
      setError(err.response?.data?.message || 'Failed to add image')
      setLoading(false)
    }
  }

  async function deleteImage(id, e) {
    // prevent opening modal when clicking delete
    if (e) e.stopPropagation()
    if (!window.confirm('Delete this image?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/api/gallery/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      await fetchGallery()
    } catch (err) {
      console.error('Failed to delete image:', err)
      setError(err.response?.data?.message || 'Failed to delete image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2>Gallery</h2>
          {user?.role === 'admin' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="form-input" style={{ width: 260 }} />
              <button onClick={add} disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
            </div>
          )}
        </div>

        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        <div className="grid">
          {loading ? (
            <div className="card small" style={{ textAlign: 'center' }}>Loading gallery...</div>
          ) : items.length === 0 ? (
            <div className="card small" style={{ textAlign: 'center' }}>No images yet</div>
          ) : (
            items.map((it) => (
              <div key={it._id} className="card" style={{ position: 'relative' }} onClick={() => handleImageClick(it.imageUrl)}>
                {user?.role === 'admin' && (
                  <button
                    aria-label="Delete image"
                    onClick={(e) => deleteImage(it._id, e)}
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
                <div style={{ height: 160, overflow: 'hidden', borderRadius: 8 }}>
                  <img src={it.imageUrl} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <ImageModal image={selectedImage} onClose={handleCloseModal} />
    </>
  )
}
