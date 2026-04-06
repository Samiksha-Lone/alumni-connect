import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash2, CheckCircle2, ArrowRight, AlertCircle, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';

const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

export default function Events() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/events`);
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else if (res.data && Array.isArray(res.data.events)) {
        setItems(res.data.events);
      } else {
        setItems([]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function add() {
    if (!title || !date) {
      toast.error('Event title and date are required');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/events`, {
        title,
        description: desc,
        eventDate: date
      });

      setTitle('');
      setDate('');
      setDesc('');
      toast.success('Event published successfully');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add event');
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/events/${id}`);
      toast.success('Event deleted');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  }

  const handleRsvp = async (eventId, title) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/events/${eventId}/rsvp`);
      setRsvpStatus(prev => ({...prev, [eventId]: true}));
      toast.success(`RSVP confirmed for ${title}`);
      fetchEvents();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Failed to RSVP');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(e => 
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-container text-balance">
      <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
        <div className="max-w-2xl mb-6">
          <h1 className="heading-lg mb-2">Campus Events</h1>
          <p className="text-text-secondary text-sm font-medium">
            Stay engaged with your alma mater through workshops, reunions, and professional networking meetups.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
          <div className="relative group flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-primary" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
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
                 const el = document.getElementById('admin-event-form');
                 el?.scrollIntoView({ behavior: 'smooth' });
               }}
             >
               <Plus size={16} className="mr-2" /> Post Event
             </Button>
          )}
        </div>
      </div>

      {/* Admin Create Event Form */}
      <div id="admin-event-form">
        {user?.role === 'admin' && (
          <Card className="mb-10 p-5 bg-primary-soft/30 border-primary/10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3 text-primary font-bold uppercase tracking-wider text-[10px]">
              <Plus size={14} /> Create New Event
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-[11px]">Event Title *</label>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Annual Alumni Meet" 
                    className="form-input h-9 text-xs" 
                  />
                </div>
                <div>
                  <label className="form-label text-[11px]">Event Date *</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="form-input h-9 text-xs" 
                  />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="form-label text-[11px]">Description *</label>
                  <textarea 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    placeholder="Briefly describe the event..." 
                    className="form-input resize-none py-2 text-xs" 
                    rows="1" 
                  />
                </div>
                <Button onClick={add} disabled={loading} className="h-9 px-6 font-bold text-xs mt-6">
                  {loading ? 'Publishing...' : 'Publish Event'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {loading && items.length === 0 ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <CardSkeleton key={i} />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-border rounded-2xl">
             <Calendar size={40} className="mx-auto text-text-secondary/20 mb-3" />
             <p className="text-lg font-medium text-text-secondary">No events scheduled yet.</p>
             <p className="text-xs text-text-secondary/60">Check back later for new updates.</p>
          </div>
        ) : (
          filteredItems.map((e) => (
            <Card key={e._id} className="flex flex-col h-full group relative overflow-hidden !p-0">
              {user?.role === 'admin' && (
                <button
                  onClick={() => deleteEvent(e._id)}
                  className="absolute top-3 right-3 p-1.5 text-red-500 bg-white/90 dark:bg-gray-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10 shadow-sm border border-red-100 dark:border-red-900/30"
                  title="Delete Event"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="p-4 flex-grow">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1 rounded-lg bg-primary-soft text-primary border border-primary/10">
                    <Calendar size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5">Upcoming</span>
                    <span className="text-[11px] text-text-secondary flex items-center gap-1 font-semibold">
                      <Clock size={10} /> {new Date(e.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold mb-1.5 text-text-primary group-hover:text-primary transition-colors leading-tight">
                  {e.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">
                  {e.description}
                </p>
              </div>

              <div className="px-4 py-3 border-t border-border mt-auto bg-gray-50/30 dark:bg-gray-800/10">
                {rsvpStatus[e._id] ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 size={14} /> Joined Successfully
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRsvp(e._id, e.title)}
                    disabled={loading || e.isFull}
                    variant={e.isFull ? 'ghost' : 'secondary'}
                    className="w-full justify-between h-8 text-[11px] font-bold px-3"
                  >
                    <span>{e.isFull ? 'Event Full' : 'Register Now'}</span>
                    <ArrowRight size={14} />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}