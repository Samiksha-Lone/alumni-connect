import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight, Trash2, Plus, Image as ImageIcon, Maximize2, Upload, Link as LinkIcon, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LazyImage from '../components/ui/LazyImage';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';

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
          src={item.imageUrl.startsWith('/uploads') ? `${axios.defaults.baseURL.replace('/api', '')}${item.imageUrl}` : item.imageUrl} 
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        return toast.error('File size too large (max 5MB)');
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearUpload = () => {
    setFile(null);
    setPreview(null);
    setUrl('');
  };

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/gallery');
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
    if (uploadMode === 'url' && !url) return toast.error('Please provide an image URL');
    if (uploadMode === 'file' && !file) return toast.error('Please select an image file');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('description', desc || 'Campus Life');

      if (uploadMode === 'url') {
        formData.append('imageUrl', url);
      } else {
        formData.append('file', file);
      }

      await axios.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUrl('');
      setDesc('');
      setFile(null);
      setPreview(null);
      toast.success('Image added to gallery');
      await fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(id, e) {
    if (e) e.stopPropagation();
    if (!window.confirm('Remove this image from gallery?')) return;
    try {
      setLoading(true);
      await axios.delete(`/gallery/${id}`);
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
      <div className="flex flex-col items-center text-center mb-8 animate-slide-up">
        <div className="max-w-2xl">
          <h1 className="heading-lg mb-1.5">Campus Gallery</h1>
          <p className="text-text-secondary text-sm font-medium">
            Explore photos of campus events and student life.
          </p>
        </div>
      </div>
      
      {user?.role === 'admin' && (
        <div className="w-full max-w-2xl mx-auto mb-12 animate-slide-up">
          <Card className="p-4 bg-primary-soft/5 border-primary/10 border-dashed rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase tracking-wider text-[10px]">
              <Plus size={14} /> Add to Gallery
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="uploadMode" 
                    checked={uploadMode === 'url'} 
                    onChange={() => { setUploadMode('url'); clearUpload(); }}
                    className="w-3.5 h-3.5 text-primary focus:ring-primary/20"
                  />
                  <span className="text-[11px] font-bold text-text-secondary group-hover:text-primary transition-colors">Image URL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="uploadMode" 
                    checked={uploadMode === 'file'} 
                    onChange={() => { setUploadMode('file'); clearUpload(); }}
                    className="w-3.5 h-3.5 text-primary focus:ring-primary/20"
                  />
                  <span className="text-[11px] font-bold text-text-secondary group-hover:text-primary transition-colors">Local File</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-0.5">
                    {uploadMode === 'url' ? 'Image Link *' : 'Select Photo *'}
                  </label>
                  {uploadMode === 'url' ? (
                    <input 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      placeholder="https://example.com/image.jpg" 
                      className="form-input h-9 text-xs" 
                    />
                  ) : (
                    <div className="relative h-9 border border-border bg-card rounded-lg flex items-center px-3 gap-2 overflow-hidden hover:border-primary/50 transition-colors">
                      {preview ? (
                        <div className="flex items-center gap-2 w-full">
                          <img src={preview} alt="Preview" className="w-5 h-5 object-cover rounded-md" />
                          <span className="text-[10px] truncate flex-1">{file?.name}</span>
                          <X size={14} className="cursor-pointer text-text-secondary hover:text-red-500" onClick={clearUpload} />
                        </div>
                      ) : (
                        <>
                          <Camera className="text-text-secondary" size={14} />
                          <span className="text-[10px] text-text-secondary">Click to upload</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-0.5">Short Caption *</label>
                  <input 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    placeholder="e.g. Graduation 2024" 
                    className="form-input h-9 text-xs" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <p className="text-[9px] text-text-secondary/60 italic">* Required fields</p>
                <div className="flex gap-2">
                  {(url || file || desc) && (
                    <Button 
                      variant="ghost" 
                      onClick={() => { clearUpload(); setDesc(''); }}
                      className="h-9 px-4 text-[11px] font-bold"
                    >
                      Reset
                    </Button>
                  )}
                  <Button 
                    onClick={add} 
                    disabled={loading} 
                    className="h-9 px-6 font-bold text-[11px] shadow-lg shadow-primary/10"
                  >
                    {loading ? 'Adding...' : 'Add to Gallery'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

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
                src={it.imageUrl.startsWith('/uploads') ? `${axios.defaults.baseURL.replace('/api', '')}${it.imageUrl}` : it.imageUrl} 
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
