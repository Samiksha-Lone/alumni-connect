// import React, { useEffect, useState, useCallback } from 'react'
// import axios from 'axios'
// import { useAuth } from '../context/AuthContext'
// import Card from '../components/ui/Card'
// import Button from '../components/ui/Button'
// import LazyImage from '../components/ui/LazyImage'

// const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

// function ImageModal({ index, items = [], onClose, setIndex }) {
//   if (index === null || index === undefined) return null
//   const item = items[index]
//   if (!item) return null

//   useEffect(() => {
//     const kb = (e) => {
//       if (e.key === 'Escape') onClose()
//       if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length)
//       if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length)
//     }
//     window.addEventListener('keydown', kb)
//     return () => window.removeEventListener('keydown', kb)
//   }, [items.length, onClose, setIndex])

//   const prev = (e) => { e?.stopPropagation(); setIndex((i) => (i - 1 + items.length) % items.length) }
//   const next = (e) => { e?.stopPropagation(); setIndex((i) => (i + 1) % items.length) }

//   return (
//     <div className="modal-backdrop active" onClick={onClose}>
//       <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1200px', width: '90vw'}}>
//         <button aria-label="Previous image" className="modal-nav-button prev" onClick={prev}>❮</button>
//         <div style={{position:'relative', background:'var(--card)'}}>
//           <LazyImage src={item.imageUrl} alt={item.description || 'gallery image'} style={{width:'100%',height:'80vh',objectFit:'contain'}} />
//           {item.description && <div style={{padding:'12px',color:'var(--muted)',fontSize:'.95rem'}}>{item.description}</div>}
//         </div>
//         <button aria-label="Next image" className="modal-nav-button next" onClick={next}>❯</button>
//         <button onClick={onClose} className="modal-close">×</button>
//       </div>
//     </div>
//   )
// }

// export default function Gallery() {
//   const { user, token } = useAuth()
//   const [items, setItems] = useState([])
//   const [url, setUrl] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const fetchGallery = useCallback(async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(`${API_BASE}/api/gallery`)
//       setItems(res.data || [])
//       setError('')
//     } catch (err) {
//       console.error('Failed to fetch gallery:', err.message)
//       setError(err.response?.data?.message || 'Failed to load gallery')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchGallery()
//   }, [fetchGallery])

//   function handleImageClick(index) {
//     setSelectedImage(index)
//     document.body.style.overflow = 'hidden'
//   }

//   function handleCloseModal() {
//     setSelectedImage(null)
//     document.body.style.overflow = 'auto'
//   }

//   async function add() {
//     if (!url || !token) {
//       setError(token ? 'URL is required' : 'You must be logged in')
//       return
//     }
//     try {
//       setLoading(true)
//       await axios.post(`${API_BASE}/api/gallery`, { imageUrl: url, description: 'Gallery image' }, { headers: { Authorization: `Bearer ${token}` } })
//       setUrl('')
//       setError('')
//       await fetchGallery()
//     } catch (err) {
//       console.error('Failed to add image:', err.message)
//       setError(err.response?.data?.message || 'Failed to add image')
//       setLoading(false)
//     }
//   }

//   async function deleteImage(id, e) {
//     if (e) e.stopPropagation()
//     if (!window.confirm('Delete this image?')) return
//     try {
//       setLoading(true)
//       await axios.delete(`${API_BASE}/api/gallery/${id}`, { headers: { Authorization: `Bearer ${token}` } })
//       await fetchGallery()
//     } catch (err) {
//       console.error('Failed to delete image:', err)
//       setError(err.response?.data?.message || 'Failed to delete image')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <section className="px-6 py-12 mx-auto max-w-7xl">
//         <div className="flex items-start justify-between gap-6 mb-8">
//           <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Gallery</h2>
//           {user?.role === 'admin' && (
//             <Card className="w-full max-w-lg p-4">
//               <div className="flex gap-3">
//                 <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="flex-1 form-input" />
//                 <Button onClick={add} disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
//               </div>
//             </Card>
//           )}
//         </div>

//         {error && <div className="mb-6 alert-error">{error}</div>}

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {loading ? (
//             <div className="py-12 text-center col-span-full">
//               <p className="muted">Loading gallery...</p>
//             </div>
//           ) : items.length === 0 ? (
//             <div className="py-12 text-center col-span-full">
//               <p className="muted">No images yet</p>
//             </div>
//             ) : (
//             items.map((it, idx) => (
//               <Card key={it._id} className="relative overflow-hidden cursor-pointer group" onClick={() => handleImageClick(idx)}>
//                 {user?.role === 'admin' && (
//                   <button aria-label="Delete image" onClick={(e) => deleteImage(it._id, e)} title="Delete" style={{position:'absolute',right:12,top:12,width:34,height:34,borderRadius:8,background:'var(--card)',border:'1px solid var(--border)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
//                     ×
//                   </button>
//                 )}
//                 <div className="h-48 overflow-hidden rounded-t-lg" style={{background:'color-mix(in srgb, var(--card) 95%, transparent 5%)'}}>
//                   <LazyImage src={it.imageUrl} alt={it.description || 'gallery'} style={{width:'100%',height:'100%',objectFit:'cover'}} />
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>
//       </section>
//       <ImageModal index={selectedImage} items={items} onClose={handleCloseModal} setIndex={setSelectedImage} />
//     </>
//   )
// }


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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button 
        onClick={onClose} 
        className="absolute text-4xl text-white transition-colors top-6 right-6 hover:text-slate-300"
      >
        &times;
      </button>

      <button 
        className="absolute p-4 text-3xl text-white transition-all rounded-full left-4 hover:bg-white/10"
        onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length) }}
      >
        &#10094;
      </button>

      <div className="flex flex-col items-center w-full max-w-5xl" onClick={e => e.stopPropagation()}>
        <img 
          src={item.imageUrl} 
          alt={item.description || 'gallery'} 
          className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain"
        />
        {item.description && (
          <p className="px-6 py-2 mt-4 text-lg font-medium text-center text-white rounded-full bg-black/50">
            {item.description}
          </p>
        )}
      </div>

      <button 
        className="absolute p-4 text-3xl text-white transition-all rounded-full right-4 hover:bg-white/10"
        onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length) }}
      >
        &#10095;
      </button>
    </div>
  )
}

export default function Gallery() {
  const { user } = useAuth()
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
    if (!url) return setError('Please provide an image URL')
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/api/gallery`, { imageUrl: url, description: 'Campus Life' })
      setUrl('')
      setError('')
      await fetchGallery()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage(id, e) {
    if (e) e.stopPropagation()
    if (!window.confirm('Remove this image from gallery?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/api/gallery/${id}`)
      await fetchGallery()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="px-6 py-12 mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Campus Gallery</h2>
            <p className="mt-2 text-slate-500">A glimpse into our vibrant alumni community.</p>
          </div>
          
          {user?.role === 'admin' && (
            <Card className="w-full p-4 md:w-auto bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                <input 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Paste Image URL..." 
                  className="flex-1 px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700" 
                />
                <Button onClick={add} disabled={loading} className="whitespace-nowrap">
                  {loading ? 'Uploading...' : 'Add Photo'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && items.length === 0 ? (
            <div className="py-20 text-center col-span-full">
              <div className="w-8 h-8 mx-auto border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed col-span-full rounded-2xl">
              <p className="text-slate-400">The gallery is currently empty.</p>
            </div>
          ) : (
            items.map((it, idx) => (
              <div 
                key={it._id} 
                className="relative overflow-hidden transition-all shadow-sm cursor-pointer group aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:shadow-xl"
                onClick={() => handleImageClick(idx)}
              >
                <LazyImage 
                  src={it.imageUrl} 
                  alt={it.description} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                
                {user?.role === 'admin' && (
                  <button 
                    onClick={(e) => deleteImage(it._id, e)}
                    className="absolute p-2 text-white transition-opacity bg-red-500 rounded-lg shadow-lg opacity-0 top-3 right-3 group-hover:opacity-100 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <div className="absolute inset-0 flex items-end p-4 transition-opacity opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{it.description || 'View Image'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ImageModal 
        index={selectedImage} 
        items={items} 
        onClose={handleCloseModal} 
        setIndex={setSelectedImage} 
      />
    </>
  )
}