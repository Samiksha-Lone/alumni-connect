import React, { useEffect, useState } from 'react';
import { Plus, X, Briefcase, GraduationCap, UserCheck, CalendarDays } from 'lucide-react';
import { useToast } from '../context/useToast';
import DashboardTopbar from '../components/common/DashboardTopbar';
import StatCard from '../components/common/StatCard';
import SectionHeader from '../components/common/SectionHeader';
import { dashboardService } from '../services/dashboard.service';
import { jobService } from '../services/job.service';
import DashboardPanel from '../components/common/DashboardPanel';
import FormField from '../components/common/FormField';


export default function AlumniDashboard({ user }) {
  const [stats, setStats] = useState({ jobs: 0, internships: 0, requests: 0, events: 0 });
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', company:'', description:'', link:'', closingDate:'' });
  const [loading, setLoading] = useState(false);
  const [, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title:'', company:'', description:'', link:'', closingDate:'' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await dashboardService.getStats();
        if (!mounted) return;
        setStats({ jobs: p.jobCount || 0, internships: 0, requests: 0, events: p.eventCount || 0 });
      } catch {
        // Ignore dashboard stats loading failures for now.
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(()=>{
    let mounted = true;
    async function loadJobs(){
      try{
        const response = await jobService.getJobs() || [];
        const all = Array.isArray(response) ? response : response?.data || [];
        if (!mounted) return;
        setJobs(all);
        const mine = all.filter(j => {
          if (!j.author) return false;
          const aid = j.author._id || j.author;
          return String(aid) === String(user?._id);
        });
        setMyJobs(mine);
      } catch {
        // Ignore job loading failures for now.
      }
    }
    loadJobs();
    return ()=>{ mounted = false; };
  }, [user]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="px-4 pt-24 pb-10 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
        <DashboardTopbar user={user} />

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-text-secondary font-semibold">Alumni Portal</p>
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Welcome back, {user?.name || 'Alumni'}</h1>
            <p className="max-w-2xl mt-3 text-sm text-text-secondary">Manage alumni opportunities, mentorship, and campus engagement from one central portal.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Jobs Posted" value={stats.jobs} hint="Your listings" icon={<Briefcase size={20} />} accent="blue" />
          <StatCard label="Internship Opportunities" value={stats.internships} hint="Open roles" icon={<GraduationCap size={20} />} accent="green" />
          <StatCard label="Mentorship Requests" value={stats.requests} hint="New requests" icon={<UserCheck size={20} />} accent="purple" />
          <StatCard label="Upcoming Alumni Events" value={stats.events} hint="Manage RSVPs" icon={<CalendarDays size={20} />} accent="amber" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button onClick={() => { setEditingId(null); setShowForm(true); setForm({ title:'', company:'', description:'', link:'', closingDate:'' }); setEditForm({ title:'', company:'', description:'', link:'', closingDate:'' }); }}
            className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold transition border shadow-sm rounded-2xl border-border bg-card text-text-primary hover:bg-gray-100">
            <Plus size={16} /> Create Job / Internship
          </button>
          <button className="w-full px-4 py-3 text-sm font-medium transition border rounded-2xl border-border bg-card text-text-secondary hover:border-blue-300 hover:text-text-primary">View All Jobs</button>
          <button className="w-full px-4 py-3 text-sm font-medium transition border rounded-2xl border-border bg-card text-text-secondary hover:border-blue-300 hover:text-text-primary">View Requests</button>
          <button className="w-full px-4 py-3 text-sm font-medium transition border rounded-2xl border-border bg-card text-text-secondary hover:border-blue-300 hover:text-text-primary">Manage Events</button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardPanel title="Your Posted Jobs" subtitle="Manage opportunities you have shared">
            <div className="mt-5 space-y-4">
              {myJobs.length === 0 ? (
                <div className="p-6 text-sm border border-dashed rounded-3xl border-border bg-card text-text-secondary">
                  No posted jobs yet. Click Create Job / Internship to add your first opportunity.
                </div>
              ) : (
                myJobs.map((j) => (
                  <div key={j._id} className="p-4 border rounded-3xl border-border bg-slate-950">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{j.title}</p>
                        <p className="text-xs text-slate-400">{j.company}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => {
                          setEditingId(j._id);
                          setEditForm({
                            title: j.title || '',
                            company: j.company || '',
                            description: j.description || '',
                            link: j.link || '',
                            closingDate: j.closingDate ? j.closingDate.split('T')[0] : ''
                          });
                          setShowForm(true);
                        }}
                          className="px-3 py-2 text-xs font-semibold transition border rounded-full border-border bg-card text-text-secondary hover:border-blue-300 hover:text-text-primary">
                          Edit
                        </button>
                        <button onClick={async () => {
                          if (!window.confirm('Delete this job?')) return;
                          try {
                            await jobService.deleteJob(j._id);
                            success('Job deleted');
                            setJobs((prev) => prev.filter((item) => item._id !== j._id));
                            setMyJobs((prev) => prev.filter((item) => item._id !== j._id));
                          } catch {
                            error('Delete failed');
                          }
                        }}
                          className="px-3 py-2 text-xs font-semibold text-red-300 transition border rounded-full border-red-700/20 bg-red-900/10 hover:bg-red-900/20">
                          Delete
                        </button>
                      </div>
                    </div>
                    {j.description && <p className="mt-3 text-sm text-text-secondary line-clamp-3">{j.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-text-secondary">
                      {j.closingDate && <span>Closing {new Date(j.closingDate).toLocaleDateString()}</span>}
                      <span>{j.author?.name ? `Posted by ${j.author.name}` : 'Posted by you'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Pending Mentorship Requests" subtitle="Requests from students" className="bg-slate-950">
            <div className="mt-5 space-y-4">
              <div className="p-6 text-sm border border-dashed rounded-3xl border-border bg-slate-950 text-slate-400">
                No new mentorship requests right now. Students will appear here when they request your guidance.
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardPanel title="Recent Student Messages" subtitle="Stay connected with mentorship chats" className="bg-slate-950">
            <div className="mt-5 space-y-3">
              <div className="p-4 border rounded-3xl border-border bg-slate-950">
                <p className="text-sm font-semibold text-white">Rahul Sharma</p>
                <p className="mt-1 text-sm text-slate-400">"I would love your advice on interview preparation."</p>
                <p className="mt-2 text-xs text-slate-400">Today · 09:12 AM</p>
              </div>
              <div className="p-4 border rounded-3xl border-border bg-slate-950">
                <p className="text-sm font-semibold text-white">Sanya Patil</p>
                <p className="mt-1 text-sm text-slate-400">"Can we schedule a campus talk next week?"</p>
                <p className="mt-2 text-xs text-slate-400">Yesterday · 05:34 PM</p>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel title="Alumni Event Invitations" subtitle="Campus and networking events" className="bg-slate-950">
            <div className="mt-5 space-y-3">
              <div className="p-4 border rounded-3xl border-border bg-slate-950">
                <p className="text-sm font-semibold text-white">MGM Alumni Meetup</p>
                <p className="mt-1 text-sm text-slate-400">Invite sent for Aug 20 · Seminar Hall</p>
              </div>
              <div className="p-4 border rounded-3xl border-border bg-slate-950">
                <p className="text-sm font-semibold text-white">Online Mentorship Session</p>
                <p className="mt-1 text-sm text-slate-400">Invitation sent for Aug 26 · Zoom</p>
              </div>
            </div>
          </DashboardPanel>
        </div>

<DashboardPanel title="Recent Activity" subtitle="What you did recently" className="bg-slate-950">
          <div className="mt-5 space-y-4">
            <div className="p-4 border rounded-3xl border-border bg-slate-950">
              <p className="text-sm font-semibold text-white">Posted a new opportunity</p>
              <p className="mt-1 text-sm text-slate-400">Your latest job is now visible to students.</p>
            </div>
            <div className="p-4 border rounded-3xl border-border bg-slate-950">
              <p className="text-sm font-semibold text-white">Checked mentorship requests</p>
              <p className="mt-1 text-sm text-slate-400">No new requests pending right now.</p>
            </div>
          </div>
        </DashboardPanel>

        <div className="flex justify-center">
          <button onClick={() => { setEditingId(null); setShowForm(true); setForm({ title:'', company:'', description:'', link:'', closingDate:'' }); setEditForm({ title:'', company:'', description:'', link:'', closingDate:'' }); }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-full shadow hover:bg-blue-700">
            <Plus size={16} /> Create Job / Internship
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-card shadow-2xl border border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary font-semibold">Alumni Opportunity</p>
                <h2 className="mt-2 text-2xl font-bold text-text-primary">{editingId ? 'Edit Opportunity' : 'Create Job / Internship'}</h2>
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 transition rounded-full text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5 hover:text-text-primary">×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const payload = editingId ? editForm : form;
              if (!payload.title || !payload.company || !payload.description) { error('Title, company, description required'); return; }
              setLoading(true);
              try {
                if (editingId) {
                  await jobService.updateJob(editingId, { ...payload, closingDate: payload.closingDate || null });
                  success('Job updated!');
                } else {
                  await jobService.addJob({ ...payload, closingDate: payload.closingDate || null });
                  success('Job posted!');
                }
                const response = await jobService.getJobs() || [];
                const all = Array.isArray(response) ? response : response?.data || [];
                setJobs(all);
                setMyJobs(all.filter((j) => {
                  const aid = j.author?._id || j.author;
                  return String(aid) === String(user?._id);
                }));
                setShowForm(false);
                setEditingId(null);
                setForm({ title:'', company:'', description:'', link:'', closingDate:'' });
                setEditForm({ title:'', company:'', description:'', link:'', closingDate:'' });
              } catch {
                error(editingId ? 'Update failed' : 'Failed to post job');
              } finally {
                setLoading(false);
              }
            }} className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  id="job-title"
                  label="Title *"
                  name="title"
                  placeholder="e.g. Frontend Engineer"
                  value={editingId ? editForm.title : form.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    editingId ? setEditForm((p) => ({ ...p, title: value })) : setForm((p) => ({ ...p, title: value }));
                  }}
                  required
                />
                <FormField
                  id="job-company"
                  label="Company *"
                  name="company"
                  placeholder="e.g. Google"
                  value={editingId ? editForm.company : form.company}
                  onChange={(e) => {
                    const value = e.target.value;
                    editingId ? setEditForm((p) => ({ ...p, company: value })) : setForm((p) => ({ ...p, company: value }));
                  }}
                  required
                />
                <FormField
                  id="job-link"
                  label="Application Link"
                  name="link"
                  placeholder="https://..."
                  value={editingId ? editForm.link : form.link}
                  onChange={(e) => {
                    const value = e.target.value;
                    editingId ? setEditForm((p) => ({ ...p, link: value })) : setForm((p) => ({ ...p, link: value }));
                  }}
                />
                <FormField
                  id="job-closing-date"
                  label="Closing Date"
                  name="closingDate"
                  type="date"
                  value={editingId ? editForm.closingDate : form.closingDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    editingId ? setEditForm((p) => ({ ...p, closingDate: value })) : setForm((p) => ({ ...p, closingDate: value }));
                  }}
                />
              </div>
              <FormField
                id="job-description"
                label="Description *"
                name="description"
                textarea
                rows={4}
                placeholder="Share a clear summary of the role or internship..."
                value={editingId ? editForm.description : form.description}
                onChange={(e) => {
                  const value = e.target.value;
                  editingId ? setEditForm((p) => ({ ...p, description: value })) : setForm((p) => ({ ...p, description: value }));
                }}
                required
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="w-full px-4 py-3 text-sm font-semibold transition border rounded-2xl border-border bg-card text-text-secondary hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="w-full px-4 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-2xl hover:bg-blue-700">
                  {loading ? (editingId ? 'Saving...' : 'Posting...') : (editingId ? 'Save Changes' : 'Post Opportunity')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
