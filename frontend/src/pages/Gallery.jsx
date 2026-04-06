import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight, Trash2, Plus, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LazyImage from '../components/ui/LazyImage';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';

const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

function ImageModal({ index, items = [], onClose, setIndex }) {
  if (index === null || index === undefined) return null;
  const item = items[index];
  if (!item) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, onClose, setIndex]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={onClose}>
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full"
      >
        <X size={24} />
      </button>

      <button 
        className="absolute left-6 p-3 text-white/50 hover:text-white transition-all bg-white/10 rounded-full hover:scale-110"
        onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length); }}
      >
        <ChevronLeft size={32} />
      </button>

      <div className="flex flex-col items-center w-full max-w-5xl gap-6" onClick={e => e.stopPropagation()}>
        <img 
          src={item.imageUrl} 
          alt={item.description || 'gallery'} 
          className="max-h-[75vh] w-auto rounded-2xl shadow-3xl object-contain"
        />
        {item.description && (
          <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium text-center max-w-2xl">
            {item.description}
          </div>
        )}
      </div>

      <button 
        className="absolute right-6 p-3 text-white/50 hover:text-white transition-all bg-white/10 rounded-full hover:scale-110"
        onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length); }}
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

export default function Gallery() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/gallery`);
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else if (res.data && Array.isArray(res.data.gallery)) {
        setItems(res.data.gallery);
      } else {
        setItems([]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  function handleImageClick(index) {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  }

  function handleCloseModal() {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  }

  async function add() {
    if (!url) return toast.error('Please provide an image URL');
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/gallery`, { imageUrl: url, description: desc || 'Campus Life' });
      setUrl('');
      setDesc('');
      toast.success('Image added to gallery');
      await fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(id, e) {
    if (e) e.stopPropagation();
    if (!window.confirm('Remove this image from gallery?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/gallery/${id}`);
      toast.success('Image removed');
      await fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-container">
      <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
        <div className="max-w-2xl mb-4">
          <h1 className="heading-lg mb-2">Campus Gallery</h1>
          <p className="text-text-secondary text-sm font-medium">
            Explore photos of campus events and student life.
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Card className="w-full lg:max-w-xl p-4 bg-primary-soft/30 border-primary/10">
            <div className="flex items-center gap-2 mb-3 text-primary font-bold uppercase tracking-wider text-[10px]">
              <Plus size={14} /> Add New Photo
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <input 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Paste image URL here..." 
                  className="form-input h-9 text-xs shadow-sm" 
                />
              </div>
              <div>
                <label className="form-label text-xs">Caption</label>
                <input 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="Brief description..." 
                  className="form-input h-10 text-sm" 
                />
              </div>
              <Button onClick={add} disabled={loading} className="w-full h-10 font-bold text-xs">
                {loading ? 'Adding...' : 'Add to Gallery'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 py-3 px-4 text-xs">
          {error}
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && items.length === 0 ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))
        ) : items.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed col-span-full border-border rounded-xl bg-gray-50/50 dark:bg-gray-900/10">
             <ImageIcon size={40} className="mx-auto text-text-secondary/20 mb-3" />
             <p className="text-lg font-medium text-text-secondary">Gallery is empty</p>
          </div>
        ) : (
          items.map((it, idx) => (
            <div 
              key={it._id} 
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-800 border border-border"
              onClick={() => handleImageClick(idx)}
            >
              <LazyImage 
                src={it.imageUrl} 
                alt={it.description} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Maximize2 className="text-white" size={24} />
              </div>

              {user?.role === 'admin' && (
                <button 
                  onClick={(e) => deleteImage(it._id, e)}
                  className="absolute top-3 right-3 p-1.5 text-white bg-red-500/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md z-10"
                  title="Remove Image"
                >
                  <Trash2 size={14} />
                </button>
              )}

              {it.description && (
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] font-bold text-white truncate uppercase tracking-wider">{it.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ImageModal 
        index={selectedImage} 
        items={items} 
        onClose={handleCloseModal} 
        setIndex={setSelectedImage} 
      />
    </div>
  );
}
