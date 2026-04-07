import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Briefcase, GraduationCap, MessageSquare, RefreshCw, ArrowUpRight } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/alumni', {
        withCredentials: true,
      });
      
      const list = (res.data || []).filter(a => a._id !== user?.id);
      setAlumni(list);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view the alumni directory');
      } else {
        setError(err.response?.data?.message || 'Failed to load alumni');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const filteredAlumni = alumni.filter(a => 
    (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.courseStudied || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (alumniUser) => {
    navigate('/chat', { 
      state: { 
        partnerId: alumniUser._id,
        partnerName: alumniUser.name 
      } 
    });
  };

  return (
    <div className="section-container">
      <div className="flex flex-col items-center mb-10 text-center animate-slide-up">
        <div className="max-w-2xl mb-6">
          <h1 className="mb-2 heading-lg">Alumni Directory</h1>
          <p className="text-sm font-medium text-text-secondary">
            Connect with our global network of professional graduates.
          </p>
        </div>
        
        <div className="flex flex-col w-full max-w-lg gap-2 sm:flex-row">
          <div className="relative flex-grow group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" size={16} />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="h-10 pl-10 text-sm shadow-sm form-input bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={fetchAlumni} className="h-10 px-4 shrink-0 border-border">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <Card className="max-w-md p-8 mx-auto text-center border-red-100 bg-red-50/30 dark:bg-red-950/10">
          <p className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="primary" onClick={fetchAlumni} className="px-6 text-xs h-9">Try Again</Button>
        </Card>
      ) : filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in">
          {filteredAlumni.map((a) => (
            <AlumniCard key={a._id} alumni={a} onMessage={() => handleMessageClick(a)} />
          ))}
        </div>
      ) : (
        <div className="max-w-md py-16 mx-auto text-center border border-dashed bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border-border">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-white border rounded-lg shadow-sm dark:bg-gray-800 text-text-secondary border-border">
             <Search size={24} />
          </div>
          <h3 className="mb-1 heading-sm">No results found</h3>
          <p className="text-xs text-text-secondary">Try searching for a different name or company.</p>
        </div>
      )}
    </div>
  );
}

function AlumniCard({ alumni, onMessage }) {
  return (
    <Card className="flex flex-col h-full group hover:border-primary/30 transition-all duration-300 !p-0 overflow-hidden bg-card">
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 text-lg font-bold transition-transform duration-300 border rounded-xl bg-primary-soft text-primary group-hover:scale-105 border-primary/10">
            {alumni.name?.charAt(0)}
          </div>
          {alumni.linkedin && (
             <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-text-secondary hover:text-blue-600 transition-colors border border-border">
               <FaLinkedin size={14} />
             </a>
          )}
        </div>

        <h3 className="mb-1 text-sm font-bold leading-tight truncate transition-colors group-hover:text-primary">{alumni.name}</h3>
        
        <div className="space-y-1.5 mb-4">
           <div className="flex items-center gap-2 text-text-secondary text-[11px]">
             <Briefcase size={12} className="text-primary/60 shrink-0" />
             <span className="font-semibold truncate">{alumni.company || 'Professional Member'}</span>
           </div>
           <div className="flex items-center gap-2 text-text-secondary text-[11px]">
             <GraduationCap size={12} className="text-primary/60 shrink-0" />
             <span className="truncate">Class of {alumni.graduationYear || 'N/A'} • {alumni.courseStudied || 'Member'}</span>
           </div>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-t bg-gray-50/50 dark:bg-gray-800/10 border-border">
        <Button onClick={onMessage} variant="primary" className="flex-1 text-[10px] h-8 font-bold">
           <MessageSquare size={12} className="mr-1.2" /> Message
        </Button>
        {alumni.resumeUrl && (
          <a href={alumni.resumeUrl} target="_blank" rel="noopener noreferrer">
             <Button variant="secondary" className="h-8 px-2 border-border bg-card">
                <ArrowUpRight size={12} />
             </Button>
          </a>
        )}
      </div>
    </Card>
  );
}