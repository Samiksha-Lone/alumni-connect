import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, AlertCircle, Search, MapPin, Users, Clock3, Sparkles, X } from 'lucide-react';
import Card from '../components/ui/Card';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import DetailModal from '../components/ui/DetailModal';
import { CardSkeleton } from '../components/ui/Skeleton';
import SectionHeader from '../components/common/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { eventService } from '../services/event.service';

export default function Events() {
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && Array.isArray(data.data)) {
        setItems(data.data);
      } else if (data && Array.isArray(data.events)) {
        setItems(data.events);
      } else {
        setItems([]);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load events');
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
      <SectionHeader
        eyebrow="MGM Events"
        title="Upcoming campus and alumni events"
        description="Join workshops, alumni meets, and networking sessions designed to keep the community connected."
        align="center"
      />

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
          <div className="col-span-full">
            <EmptyState
              icon={Calendar}
              title="No events scheduled yet"
              description={searchQuery ? 'Try a different keyword to search for something else.' : 'Check back later for new updates from the community.'}
            />
          </div>
        ) : (
          filteredItems.map((e) => {
            const eventDate = new Date(e.eventDate);
            return (
                <Card key={e._id} className="flex h-full flex-col overflow-hidden p-0">
                  <div className="h-28 bg-gradient-to-br from-sky-600 to-indigo-700" />
                  <div className="flex-1 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/15 bg-primary-soft text-primary">
                      <span className="text-[10px] font-bold uppercase leading-none">
                        {eventDate.toLocaleDateString(undefined, { month: 'short' })}
                      </span>
                      <span className="text-base font-extrabold leading-tight">
                        {eventDate.getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">Upcoming Event</p>
                      <p className="text-[11px] font-medium text-text-secondary">
                        {eventDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <h3 className="mb-2 text-sm font-bold leading-snug text-text-primary">{e.title}</h3>
                  <p className="text-sm leading-tight text-text-secondary line-clamp-3">{e.description}</p>

                  <div className="mt-4 space-y-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-primary/70" /><span>Seminar Hall, MGM Campus</span></div>
                    <div className="flex items-center gap-2"><Clock3 size={12} className="text-primary/70" /><span>10:30 AM · 2 hours</span></div>
                    <div className="flex items-center gap-2"><Users size={12} className="text-primary/70" /><span>92 attendees registered</span></div>
                  </div>
                </div>

                <div className="border-t border-border bg-gray-50/60 p-3 dark:bg-gray-800/20">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-secondary">Want to know more?</div>
                    <div>
                      <button
                        onClick={(ev) => { ev.stopPropagation(); setSelectedEvent(e); }}
                        className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {selectedEvent && (
        <DetailModal
          open={true}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          subtitle={new Date(selectedEvent.eventDate).toLocaleString()}
        >
          <p>{selectedEvent.description}</p>
          <div className="mt-4 space-y-2">
            <div>Venue: Seminar Hall, MGM Campus</div>
            <div>Time: 10:30 AM · 2 hours</div>
            <div>Attendees: {selectedEvent.attendees?.length || 0} registered</div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={async () => {
                if (!user) {
                  showError('Please sign in to register');
                  return;
                }
                try {
                  await eventService.registerForEvent(selectedEvent._id);
                  success('Registered for event');
                  setSelectedEvent(null);
                } catch (err) {
                  showError(err.message || 'Failed to register');
                }
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Register
            </button>
            <button
              onClick={() => {
                if (!user) { showError('Please sign in to add to calendar'); return; }
                success('Added to calendar');
                setSelectedEvent(null);
              }}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            >
              Add to Calendar
            </button>
          </div>
        </DetailModal>
      )}
    </div>
  );
}