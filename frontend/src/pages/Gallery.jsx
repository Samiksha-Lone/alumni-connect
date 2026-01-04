import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LazyImage from '../components/ui/LazyImage'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

function ImageModal({ index, items = [], onClose, setIndex }) {
  if (index === null || index === undefined) return null
  const item = items[index]
  if (!item) return null

  useEffect(() => {
    const kb = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length)
    }
    window.addEventListener('keydown', kb)
    return () => window.removeEventListener('keydown', kb)
  }, [items.length, onClose, setIndex])

  const prev = (e) => { e?.stopPropagation(); setIndex((i) => (i - 1 + items.length) % items.length) }
  const next = (e) => { e?.stopPropagation(); setIndex((i) => (i + 1) % items.length) }

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1200px', width: '90vw'}}>
        <button aria-label="Previous image" className="modal-nav-button prev" onClick={prev}>❮</button>
        <div style={{position:'relative', background:'var(--card)'}}>
          <LazyImage src={item.imageUrl} alt={item.description || 'gallery image'} style={{width:'100%',height:'80vh',objectFit:'contain'}} />
          {item.description && <div style={{padding:'12px',color:'var(--muted)',fontSize:'.95rem'}}>{item.description}</div>}
        </div>
        <button aria-label="Next image" className="modal-nav-button next" onClick={next}>❯</button>
        <button onClick={onClose} className="modal-close">×</button>
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

  function handleImageClick(index) {
    setSelectedImage(index)
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
      <section className="px-6 py-12 mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6 mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Gallery</h2>
          {user?.role === 'admin' && (
            <Card className="w-full max-w-lg p-4">
              <div className="flex gap-3">
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="flex-1 form-input" />
                <Button onClick={add} disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
              </div>
            </Card>
          )}
        </div>

        {error && <div className="mb-6 alert-error">{error}</div>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="py-12 text-center col-span-full">
              <p className="muted">Loading gallery...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center col-span-full">
              <p className="muted">No images yet</p>
            </div>
            ) : (
            items.map((it, idx) => (
              <Card key={it._id} className="relative overflow-hidden cursor-pointer group" onClick={() => handleImageClick(idx)}>
                {user?.role === 'admin' && (
                  <button aria-label="Delete image" onClick={(e) => deleteImage(it._id, e)} title="Delete" style={{position:'absolute',right:12,top:12,width:34,height:34,borderRadius:8,background:'var(--card)',border:'1px solid var(--border)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    ×
                  </button>
                )}
                <div className="h-48 overflow-hidden rounded-t-lg" style={{background:'color-mix(in srgb, var(--card) 95%, transparent 5%)'}}>
                  <LazyImage src={it.imageUrl} alt={it.description || 'gallery'} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
      <ImageModal index={selectedImage} items={items} onClose={handleCloseModal} setIndex={setSelectedImage} />
    </>
  )
}
