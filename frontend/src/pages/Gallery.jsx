import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function ImageModal({ image, onClose }) {
  if (!image) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <img src={image} alt="gallery preview" className="w-full h-full object-contain" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-2xl font-semibold transition-colors"
        >
          ×
        </button>
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
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8 gap-6">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Gallery</h2>
          {user?.role === 'admin' && (
            <div className="card-base p-4 w-full max-w-lg">
              <div className="flex gap-3">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={add} disabled={loading} className="btn-primary">
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
              <p className="text-slate-600 dark:text-slate-400">Loading gallery...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No images yet</p>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it._id}
                className="card-base overflow-hidden cursor-pointer relative group hover:shadow-xl transition-shadow"
                onClick={() => handleImageClick(it.imageUrl)}
              >
                {user?.role === 'admin' && (
                  <button
                    aria-label="Delete image"
                    onClick={(e) => deleteImage(it._id, e)}
                    title="Delete"
                    className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center font-semibold transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                )}
                <div className="h-48 overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={it.imageUrl}
                    alt="gallery"
                    className="w-full h-full object-cover"
                  />
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
