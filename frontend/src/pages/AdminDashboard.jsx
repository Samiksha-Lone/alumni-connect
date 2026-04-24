import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/useToast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  Users, GraduationCap, Briefcase, CalendarDays, Image as ImageIcon,
  Trash2, ShieldCheck, ShieldOff, Plus, X, RefreshCw, LayoutDashboard,
  UserCheck, AlertCircle, LogOut
} from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';

/* ── Tab IDs ── */
const TABS = [
  { id: 'overview', label: 'Overview',   icon: <LayoutDashboard size={15}/> },
  { id: 'users',    label: 'Users',      icon: <Users size={15}/> },
  { id: 'events',   label: 'Events',     icon: <CalendarDays size={15}/> },
  { id: 'jobs',     label: 'Jobs',       icon: <Briefcase size={15}/> },
  { id: 'gallery',  label: 'Gallery',    icon: <ImageIcon size={15}/> },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/', { replace: true });
  }, [user, navigate]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, eventsRes, jobsRes, galleryRes] = await Promise.allSettled([
        axios.get('/debug/status'),
        axios.get('/users'),
        axios.get('/events'),
        axios.get('/jobs'),
        axios.get('/gallery'),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.counts);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data || []);
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data || []);
      if (galleryRes.status === 'fulfilled') setGallery(Array.isArray(galleryRes.value.data) ? galleryRes.value.data : galleryRes.value.data?.gallery || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <ShieldCheck size={22} className="text-primary" /> Admin Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage all platform content and users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={fetchAll} className="h-9 px-4 gap-2 text-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/> Refresh
          </Button>
          <Button 
            onClick={logout} 
            className="h-9 px-4 gap-2 text-sm bg-red-500 text-white border-transparent hover:bg-red-600"
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
              ${tab === t.id ? 'bg-card shadow-sm text-primary border border-border' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab stats={stats} users={users} events={events} jobs={jobs} gallery={gallery} loading={loading} />}
      {tab === 'users'    && <UsersTab users={users} reload={fetchAll} success={success} error={error} />}
      {tab === 'events'   && <EventsTab events={events} reload={fetchAll} success={success} error={error} />}
      {tab === 'jobs'     && <JobsTab jobs={jobs} reload={fetchAll} success={success} error={error} />}
      {tab === 'gallery'  && <GalleryTab gallery={gallery} reload={fetchAll} success={success} error={error} />}
    </div>
  );
}

/* ── OVERVIEW ── */
function OverviewTab({ stats, users, events, jobs, gallery, loading }) {
  const statCards = [
    { label: 'Students', value: stats?.students ?? users.filter(u=>u.role==='student').length, color: 'blue',   icon: <GraduationCap size={18}/> },
    { label: 'Alumni',   value: stats?.alumni   ?? users.filter(u=>u.role==='alumni').length,  color: 'emerald', icon: <UserCheck size={18}/> },
    { label: 'Events',   value: stats?.events   ?? events.length,  color: 'amber',   icon: <CalendarDays size={18}/> },
    { label: 'Jobs',     value: stats?.jobs     ?? jobs.length,    color: 'purple',  icon: <Briefcase size={18}/> },
    { label: 'Gallery',  value: gallery.length,                    color: 'rose',    icon: <ImageIcon size={18}/> },
    { label: 'Total Users', value: users.length,                   color: 'slate',   icon: <Users size={18}/> },
  ];
  const colorMap = {
    blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600',
    amber:   'bg-amber-50 dark:bg-amber-500/10 text-amber-600',
    purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-600',
    rose:    'bg-rose-50 dark:bg-rose-500/10 text-rose-600',
    slate:   'bg-slate-100 dark:bg-slate-500/10 text-slate-600',
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(s => (
          <Card key={s.label} className="p-4 flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[s.color]}`}>{s.icon}</div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">{s.label}</p>
            <p className="text-2xl font-extrabold leading-none text-text-primary">{loading ? '…' : s.value ?? 0}</p>
          </Card>
        ))}
      </div>
      {/* Recent Users */}
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Recent Registrations</p>
        <div className="space-y-2">
          {users.slice(0,5).map(u => (
            <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">{u.name?.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                <p className="text-xs text-text-secondary truncate">{u.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                ${u.role==='admin' ? 'bg-red-50 text-red-600 dark:bg-red-500/10' :
                  u.role==='alumni' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                  'bg-blue-50 text-blue-600 dark:bg-blue-500/10'}`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── USERS ── */
function UsersTab({ users, reload, success, error }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || filter === 'pending' || u.role === filter;
    const matchPending = filter !== 'pending' || !u.isVerified;
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchPending && matchSearch;
  });

  const toggleVerify = async (u) => {
    setLoading(true);
    try {
      await axios.patch(`/users/${u._id}/verify`, { isVerified: !u.isVerified });
      success(`${u.name} ${u.isVerified ? 'unverified' : 'verified'}!`);
      reload();
    } catch { error('Action failed'); } finally { setLoading(false); }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`/users/${u._id}`);
      success('User deleted');
      reload();
    } catch { error('Delete failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="form-input flex-1 h-10 text-sm"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {['all','pending','student','alumni','admin'].map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                ${filter===r ? 'bg-primary text-white' : 'bg-card border border-border text-text-secondary hover:border-primary/40'}`}
            >{r}</button>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden !p-0">
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-text-secondary text-sm">No users found.</div>
          ) : filtered.map(u => (
            <div key={u._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold text-sm shrink-0">{u.name?.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                <p className="text-xs text-text-secondary truncate">{u.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0
                ${u.role==='admin'?'bg-red-50 text-red-600':u.role==='alumni'?'bg-emerald-50 text-emerald-600':'bg-blue-50 text-blue-600'}`}>
                {u.role}
              </span>
              {u.role !== 'admin' && (
                <button
                  onClick={() => toggleVerify(u)}
                  disabled={loading}
                  title={u.isVerified ? 'Unverify' : 'Verify'}
                  className={`p-1.5 rounded-lg transition-colors shrink-0
                    ${u.isVerified ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-text-secondary hover:bg-primary-soft hover:text-primary'}`}
                >
                  {u.isVerified ? <ShieldCheck size={14}/> : <ShieldOff size={14}/>}
                </button>
              )}
              {u.role !== 'admin' && (
                <button
                  onClick={() => deleteUser(u)}
                  disabled={loading}
                  className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
                  title="Delete user"
                >
                  <Trash2 size={14}/>
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── EVENTS ── */
function EventsTab({ events, reload, success, error }) {
  const [form, setForm] = useState({ title:'', eventDate:'', description:'' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.eventDate) { error('Title and date are required'); return; }
    setLoading(true);
    try {
      await axios.post('/events', form);
      success('Event created!');
      setForm({ title:'', eventDate:'', description:'' });
      setShowForm(false);
      reload();
    } catch { error('Failed to create event'); } finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    setLoading(true);
    try { await axios.delete(`/events/${id}`); success('Event deleted'); reload(); }
    catch { error('Delete failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-text-primary">{events.length} events total</p>
        <Button onClick={() => setShowForm(!showForm)} className="h-9 px-4 text-sm gap-2">
          {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> New Event</>}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 bg-primary-soft/10 border-primary/15 animate-slide-up">
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Event Title *</label>
                <input className="form-input h-9 text-sm" placeholder="e.g. Annual Alumni Meet" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/>
              </div>
              <div>
                <label className="form-label">Event Date *</label>
                <input type="date" className="form-input h-9 text-sm" value={form.eventDate} onChange={e=>setForm(p=>({...p,eventDate:e.target.value}))} required/>
              </div>
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input text-sm resize-none" rows={2} placeholder="Describe the event..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={()=>setShowForm(false)} className="h-9 px-4 text-sm">Cancel</Button>
              <Button type="submit" disabled={loading} className="h-9 px-5 text-sm font-semibold">{loading?'Publishing...':'Publish Event'}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl text-text-secondary">
            <CalendarDays size={36} className="mx-auto mb-2 opacity-20"/><p>No events yet.</p>
          </div>
        ) : events.map(ev => (
          <Card key={ev._id} className="p-4 flex flex-col gap-2 group relative">
            <button onClick={()=>del(ev._id)} className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 bg-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100">
              <Trash2 size={13}/>
            </button>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CalendarDays size={18}/>
            </div>
            <p className="text-sm font-bold text-text-primary pr-6">{ev.title}</p>
            <p className="text-xs text-text-secondary">{ev.eventDate ? new Date(ev.eventDate).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : 'No date'}</p>
            {ev.description && <p className="text-xs text-text-secondary line-clamp-2">{ev.description}</p>}
            <p className="text-[10px] text-text-secondary/60">{ev.attendees?.length || 0} RSVPs</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── JOBS ── */
function JobsTab({ jobs, reload, success, error }) {
  const [form, setForm] = useState({ title:'', company:'', description:'', link:'', closingDate:'' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) { error('Title, company, description required'); return; }
    setLoading(true);
    try {
      await axios.post('/jobs', { ...form, closingDate: form.closingDate || null });
      success('Job posted!');
      setForm({ title:'', company:'', description:'', link:'', closingDate:'' });
      setShowForm(false);
      reload();
    } catch { error('Failed to post job'); } finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    setLoading(true);
    try { await axios.delete(`/jobs/${id}`); success('Job deleted'); reload(); }
    catch { error('Delete failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-text-primary">{jobs.length} opportunities total</p>
        <Button onClick={() => setShowForm(!showForm)} className="h-9 px-4 text-sm gap-2">
          {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Post Job</>}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 bg-primary-soft/10 border-primary/15 animate-slide-up">
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="form-label">Job Title *</label><input className="form-input h-9 text-sm" placeholder="e.g. Frontend Engineer" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
              <div><label className="form-label">Company *</label><input className="form-input h-9 text-sm" placeholder="e.g. Google" value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} required/></div>
              <div><label className="form-label">Application Link</label><input className="form-input h-9 text-sm" placeholder="https://..." value={form.link} onChange={e=>setForm(p=>({...p,link:e.target.value}))}/></div>
              <div><label className="form-label">Closing Date</label><input type="date" className="form-input h-9 text-sm" value={form.closingDate} onChange={e=>setForm(p=>({...p,closingDate:e.target.value}))}/></div>
            </div>
            <div><label className="form-label">Description *</label><textarea className="form-input text-sm resize-none" rows={2} placeholder="Brief description..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={()=>setShowForm(false)} className="h-9 px-4 text-sm">Cancel</Button>
              <Button type="submit" disabled={loading} className="h-9 px-5 text-sm font-semibold">{loading?'Posting...':'Post Job'}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl text-text-secondary">
            <Briefcase size={36} className="mx-auto mb-2 opacity-20"/><p>No jobs posted yet.</p>
          </div>
        ) : jobs.map(j => (
          <Card key={j._id} className="p-4 flex flex-col gap-2 group relative">
            <button onClick={()=>del(j._id)} className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 bg-red-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100">
              <Trash2 size={13}/>
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center"><Briefcase size={18}/></div>
            <p className="text-sm font-bold text-text-primary pr-6">{j.title}</p>
            <p className="text-xs font-medium text-text-secondary">{j.company}</p>
            {j.description && <p className="text-xs text-text-secondary line-clamp-2">{j.description}</p>}
            {j.closingDate && <p className="text-[10px] text-amber-600">Closes {new Date(j.closingDate).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── GALLERY ── */
function GalleryTab({ gallery, reload, success, error }) {
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!url) { error('Image URL required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('imageUrl', url);
      fd.append('description', desc || 'Campus Life');
      await axios.post('/gallery', fd, { headers: {'Content-Type':'multipart/form-data'} });
      success('Image added!');
      setUrl(''); setDesc(''); setShowForm(false);
      reload();
    } catch { error('Upload failed'); } finally { setLoading(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Remove this image?')) return;
    setLoading(true);
    try { await axios.delete(`/gallery/${id}`); success('Image removed'); reload(); }
    catch { error('Delete failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-text-primary">{gallery.length} images total</p>
        <Button onClick={() => setShowForm(!showForm)} className="h-9 px-4 text-sm gap-2">
          {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Image</>}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5 bg-primary-soft/10 border-primary/15 animate-slide-up">
          <form onSubmit={submit} className="space-y-3">
            <div><label className="form-label">Image URL *</label><input className="form-input h-9 text-sm" placeholder="https://example.com/image.jpg" value={url} onChange={e=>setUrl(e.target.value)} required/></div>
            <div><label className="form-label">Caption</label><input className="form-input h-9 text-sm" placeholder="e.g. Graduation 2024" value={desc} onChange={e=>setDesc(e.target.value)}/></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={()=>setShowForm(false)} className="h-9 px-4 text-sm">Cancel</Button>
              <Button type="submit" disabled={loading} className="h-9 px-5 text-sm font-semibold">{loading?'Adding...':'Add to Gallery'}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {gallery.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl text-text-secondary">
            <ImageIcon size={36} className="mx-auto mb-2 opacity-20"/><p>Gallery is empty.</p>
          </div>
        ) : gallery.map(img => (
          <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-gray-100">
            <img src={img.imageUrl} alt={img.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={()=>del(img._id)} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                <Trash2 size={14}/>
              </button>
            </div>
            {img.description && (
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[9px] text-white/90 truncate">{img.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
