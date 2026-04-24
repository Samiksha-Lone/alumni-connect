import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, ArrowRight, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Events() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/events');
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

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleRsvp = async (eventId, title) => {
    if (!user) { navigate('/auth'); return; }
    try {
      setLoading(true);
      await axios.post(`/events/${eventId}/rsvp`);
      setRsvpStatus(prev => ({ ...prev, [eventId]: true }));
      toast.success(`RSVP confirmed for ${title}`);
      fetchEvents();
    } catch (err) {
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
    <div className="section-container">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
        <p className="text-text-secondary text-sm max-w-md">
          Stay engaged through workshops, reunions, and professional networking meetups.
        </p>
      </div>

      {/* Search */}
      <div className="flex max-w-xl mx-auto mb-10">
        <div className="relative group flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search events..."
            className="form-input pl-10 h-10 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {loading && items.length === 0 ? (
          [1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-border rounded-2xl">
            <Calendar size={40} className="mx-auto text-text-secondary/20 mb-3" />
            <p className="text-lg font-medium text-text-secondary">No events scheduled yet.</p>
            <p className="text-xs text-text-secondary/60">Check back later for new updates.</p>
          </div>
        ) : (
          filteredItems.map((e) => (
            <Card key={e._id} className="flex flex-col h-full group overflow-hidden !p-0">
              <div className="p-4 flex-grow">
                {/* Date Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-primary-soft border border-primary/15 text-primary shrink-0">
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {new Date(e.eventDate).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-lg font-extrabold leading-tight">
                      {new Date(e.eventDate).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5">Upcoming Event</p>
                    <p className="text-[11px] text-text-secondary font-medium">
                      {new Date(e.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1.5 text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {e.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{e.description}</p>
              </div>

              <div className="px-4 py-3 border-t border-border mt-auto bg-gray-50/30 dark:bg-gray-800/10">
                {rsvpStatus[e._id] ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-xs bg-emerald-50 dark:bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 size={14} /> Registered
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRsvp(e._id, e.title)}
                    disabled={loading || e.isFull}
                    variant={e.isFull ? 'secondary' : 'primary'}
                    className="w-full justify-between h-9 text-xs font-semibold px-3"
                  >
                    <span>{e.isFull ? 'Event Full' : 'Register Now'}</span>
                    <ArrowRight size={13} />
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