import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Calendar, AlertCircle, Search, X, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import DetailModal from '../components/ui/DetailModal';
import { CardSkeleton } from '../components/ui/Skeleton';
import SectionHeader from '../components/common/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import EventCard from '../components/events/EventCard';
import { eventService } from '../services/event.service';

export default function Events() {
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const topRef = useRef(null);

  const fetchEvents = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await eventService.getEventsPaged({
        page,
        limit: pagination.limit,
        search: searchQuery.trim(),
        category: categoryFilter.trim(),
        location: locationFilter.trim()
      });
      setItems(res?.data || []);
      setPagination(res?.pagination || { page, limit: pagination.limit, total: 0, pages: 1 });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
      try { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch { /* ignore scroll errors */ }
    }
  }, [pagination.limit, categoryFilter, locationFilter, searchQuery]);

  useEffect(() => { fetchEvents(1); }, [fetchEvents]);

  const filteredItems = items.filter(e =>
    (e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || e.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    && (categoryFilter ? (e.category || '').toLowerCase() === categoryFilter.toLowerCase() : true)
    && (locationFilter ? (e.location || '').toLowerCase().includes(locationFilter.toLowerCase()) : true)
  );

  return (
    <div className="section-container">
      <SectionHeader
        eyebrow="MGM Events"
        title="Upcoming campus and alumni events"
        description="Join workshops, alumni meets, and networking sessions designed to keep the community connected."
        align="center"
      />

      {/* Search + Filters (aligned with Alumni page layout) */}
      <div className="flex flex-col max-w-5xl gap-3 p-4 mx-auto mb-6 border shadow-sm rounded-2xl border-border bg-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full h-10 pl-10 text-sm bg-white border shadow-sm outline-none rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchEvents(1); }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Category (e.g. Workshop)"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-white border outline-none rounded-xl border-border focus:border-primary dark:bg-slate-900"
          />

          <input
            type="text"
            placeholder="Location (e.g. Seminar Hall)"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-white border outline-none rounded-xl border-border focus:border-primary dark:bg-slate-900"
          />

          <Button variant="secondary" onClick={() => fetchEvents(1)} className="h-10 px-4 shrink-0 border-border">
            <RefreshCw size={15} className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-text-secondary">
          Showing {items.length} of {pagination.total} events
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchEvents(pagination.page - 1)}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium transition-colors border rounded-xl border-border bg-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
            >
              Previous
            </button>
            <span className="text-xs text-text-secondary">Page {pagination.page} of {pagination.pages}</span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchEvents(pagination.page + 1)}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium transition-colors border rounded-xl border-border bg-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div ref={topRef} className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
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
          filteredItems.map((e) => (
            <EventCard
              key={e._id}
              event={{
                ...e,
                location: e.location || 'Seminar Hall, MGM Campus',
                eventTime: e.eventTime || '10:30 AM · 2 hours',
                category: e.category || 'Alumni Event',
              }}
              onOpen={() => setSelectedEvent(e)}
            />
          ))
        )}
      </div>

      {/* bottom pagination + about */}
      <div className="mt-8">
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 border rounded-lg border-border bg-card"
              disabled={pagination.page <= 1}
              onClick={() => fetchEvents(pagination.page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-text-secondary">Page {pagination.page} of {pagination.pages}</span>
            <button
              className="px-4 py-2 border rounded-lg border-border bg-card"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchEvents(pagination.page + 1)}
            >
              Next
            </button>
          </div>
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

          <div className="flex gap-3 mt-6">
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
              className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-primary"
            >
              Register
            </button>
            <button
              onClick={() => {
                if (!user) { showError('Please sign in to add to calendar'); return; }
                success('Added to calendar');
                setSelectedEvent(null);
              }}
              className="px-4 py-2 text-sm font-semibold border rounded-xl border-border"
            >
              Add to Calendar
            </button>
          </div>
        </DetailModal>
      )}
    </div>
  );
}