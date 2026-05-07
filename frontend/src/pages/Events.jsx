import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Calendar, AlertCircle, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredItems = items.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-container">
      {/* Page Header */}
      <div className="flex flex-col items-center mb-10 text-center animate-slide-up">
        <h1 className="mb-2 text-3xl font-bold">Campus Events</h1>
        <p className="max-w-md text-sm text-text-secondary">
          Stay engaged through workshops, reunions, and professional networking meetups.
        </p>
      </div>

      {/* Search */}
      <div className="flex max-w-xl mx-auto mb-10">
        <div className="relative flex-grow group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full h-10 pl-10 text-sm form-input"
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
      <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          [1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-border rounded-2xl">
            <Calendar size={40} className="mx-auto mb-3 text-text-secondary/20" />
            <p className="text-lg font-medium text-text-secondary">No events scheduled yet.</p>
            <p className="text-xs text-text-secondary/60">Check back later for new updates.</p>
          </div>
        ) : (
          filteredItems.map((e) => (
            <Card key={e._id} className="flex flex-col h-full overflow-hidden group">
              <div className="flex-grow p-4">
                {/* Date Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center justify-center border w-11 h-11 rounded-xl bg-primary-soft border-primary/15 text-primary shrink-0">
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
                <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">{e.description}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}