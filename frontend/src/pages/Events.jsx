import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export default function Events() {
  const { user } = useAuth() // No longer need 'token' from context
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rsvpStatus, setRsvpStatus] = useState({});

  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      // withCredentials is true by default in our global axios config
      const res = await axios.get(`${API_BASE}/events`)
      setItems(res.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function add() {
    if (!title) {
      setError('Event title is required')
      return
    }

    try {
      setLoading(true)
      // Headers are removed because cookies handle Auth automatically
      await axios.post(`${API_BASE}/events`, {
        title,
        description: desc,
        eventDate: date
      })

      setTitle('')
      setDate('')
      setDesc('')
      setError('')
      await fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add event')
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      setLoading(true)
      await axios.delete(`${API_BASE}/events/${id}`)
      await fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event')
    } finally {
      setLoading(false)
    }
  }

  const handleRsvp = async (eventId, title) => {
  if (!user) {
    navigate('/auth');
    return;
  }
  try {
    setLoading(true);  // ← Add
    await axios.post(`${API_BASE}/events/${eventId}/rsvp`);
    setRsvpStatus(prev => ({...prev, [eventId]: true}));
    toast.success(`RSVP'd for ${title}!`);
    fetchEvents();  // ← Refresh list (capacity updates)
  } catch(err) {
    toast.error(err.response?.data?.message || 'Event full');
  } finally {
    setLoading(false);  // ← Add
  }
};

  return (
    <section className="px-6 py-12 mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Campus Events</h2>
          <p className="mt-2 text-slate-500">Stay updated with the latest alumni meetups and seminars.</p>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <Card className="w-full max-w-2xl p-6 border-blue-100 bg-blue-50/50 dark:bg-slate-900 dark:border-slate-800">
            <h4 className="mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase">Create New Event</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Name" className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description..." className="p-2 border rounded dark:bg-slate-800 dark:border-slate-700 sm:col-span-2" rows="2" />
              <Button onClick={add} disabled={loading} className="py-2 text-white bg-blue-600 sm:col-span-2 hover:bg-blue-700">
                {loading ? 'Publishing...' : 'Publish Event'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50 animate-in fade-in slide-in-from-top-2">
          ⚠️ {error}
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <p className="font-medium text-slate-500">Syncing events...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xl text-slate-400">No upcoming events scheduled.</p>
          </div>
        ) : (
          items.map((e) => (
            <div key={e._id} className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border group dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-xl">

              {user?.role === 'admin' && (
                <button
                  onClick={() => deleteEvent(e._id)}
                  className="absolute z-10 p-2 text-red-500 transition-opacity rounded-full opacity-0 top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm group-hover:opacity-100 hover:bg-red-50"
                  title="Delete Event"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              <div className="flex-grow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">Upcoming</span>
                  <span className="text-xs text-slate-500">📅 {new Date(e.eventDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="mb-3 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-blue-600">{e.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                  {e.description}
                </p>
              </div>

              {/* <div className="px-6 py-4 border-t bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800">
                <button className="flex items-center text-sm font-semibold text-blue-600 transition-all dark:text-blue-400 hover:gap-2">
                  Register for Event <span className="ml-1">→</span>
                </button>
              </div> */}

              <div className="px-6 py-4 border-t bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800">
                {rsvpStatus[e._id] ? (
                  <span className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
                    ✓ RSVP Confirmed
                  </span>
                ) : (
                  <button
                    onClick={() => handleRsvp(e._id, e.title)}
                    disabled={loading || e.isFull}
                    className="flex items-center text-sm font-semibold text-blue-600 transition-all dark:text-blue-400 hover:gap-2 disabled:opacity-50"
                  >
                    Register for Event <span className="ml-1">→</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </section>
  )
}