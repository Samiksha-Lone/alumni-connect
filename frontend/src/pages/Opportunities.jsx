import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Calendar, ExternalLink, Trash2, Plus, AlertCircle, Search, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Opportunities() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/jobs');
      setItems(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  async function add() {
    if (!title || !company || !desc) {
      toast.error('Required fields: Title, Company, Description');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/jobs', { 
        title, 
        company, 
        description: desc, 
        link, 
        closingDate: closingDate || null 
      });
      
      setTitle(''); setCompany(''); setDesc(''); setLink(''); setClosingDate('');
      toast.success('Opportunity posted successfully');
      await fetchOpportunities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post opportunity');
    } finally {
      setLoading(false);
    }
  }

  async function deleteOpportunity(id) {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      setLoading(true);
      await axios.delete(`/jobs/${id}`);
      toast.success('Opportunity deleted');
      await fetchOpportunities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter(o => 
    o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canAdd = user && (user.role === 'alumni' || user.role === 'admin');

  return (
    <div className="section-container">
      <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
        <div className="max-w-2xl mb-6">
          <h1 className="heading-lg mb-2">Career Opportunities</h1>
          <p className="text-text-secondary text-sm font-medium">
            Exclusive job openings and internships shared by our alumni network. Secure your future with community-verified roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
          <div className="relative group flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" size={16} />
            <input 
              type="text" 
              placeholder="Search roles or companies..." 
              className="form-input pl-10 h-10 text-sm shadow-sm bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {user?.role === 'admin' && (
             <Button 
               variant="primary" 
               className="h-10 px-6 text-xs font-bold shrink-0 shadow-lg shadow-primary/20"
               onClick={() => {
                 const el = document.getElementById('admin-post-form');
                 el?.scrollIntoView({ behavior: 'smooth' });
               }}
             >
               <Plus size={16} className="mr-2" /> Post Role
             </Button>
          )}
        </div>
      </div>

      {/* Admin Post Form */}
      <div id="admin-post-form">
        {canAdd && (
          <Card className="mb-10 p-5 bg-primary-soft/30 border-primary/10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3 text-primary font-bold uppercase tracking-wider text-[10px]">
              <Plus size={14} /> Post New Opportunity
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-[11px]">Job Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Engineer" className="form-input h-9 text-xs" />
                </div>
                <div>
                  <label className="form-label text-[11px]">Company *</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Vercel" className="form-input h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex-grow">
                   <label className="form-label text-[11px]">Application Link</label>
                   <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="form-input h-9 text-xs" />
                </div>
                <div>
                    <label className="form-label text-[11px]">Closing Date</label>
                    <input type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="form-input h-9 text-xs" />
                 </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="form-label text-[11px]">Description *</label>
                  <textarea 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    placeholder="Short summary..." 
                    className="form-input resize-none py-2 text-xs" 
                    rows="1" 
                  />
                </div>
                <Button onClick={add} disabled={loading} className="h-9 px-6 font-bold text-xs mt-6">
                  {loading ? 'Posting...' : 'Post Role'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm font-medium">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && items.length === 0 ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <CardSkeleton key={i} />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-border rounded-2xl bg-gray-50/50 dark:bg-gray-900/10">
             <Briefcase size={40} className="mx-auto text-text-secondary/20 mb-3" />
             <p className="text-lg font-medium text-text-secondary">No opportunities found.</p>
             <p className="text-xs text-text-secondary/60">Try clearing your filters or check back later.</p>
          </div>
        ) : (
          filteredItems.map((o) => (
            <Card key={o._id} className="flex flex-col h-full group relative overflow-hidden !p-0">
              {user?.role === 'admin' && (
                <button
                  onClick={() => deleteOpportunity(o._id)}
                  className="absolute top-3 right-3 p-1.5 text-red-500 bg-white/90 dark:bg-gray-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10 shadow-sm border border-red-100 dark:border-red-900/30"
                  title="Delete Opportunity"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="p-4 flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20">
                    New Opening
                  </span>
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                    {o.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-bold text-[11px] mb-4">
                  <MapPin size={12} /> {o.company}
                </div>

                <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3">
                  {o.description}
                </p>
              </div>

              <div className="px-4 py-3 border-t border-border mt-auto flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                {o.closingDate ? (
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold leading-none mb-0.5">Closing Date</span>
                    <span className="text-[11px] text-text-primary font-semibold flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-red-500" /> 
                      {new Date(o.closingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ) : <div />}
                
                {o.link && (
                  <a 
                    href={o.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="h-8 px-3 text-[10px] font-bold gap-1.5 group/btn border-border">
                      Apply Now <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}