import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CalendarDays, Users, MessageCircle } from 'lucide-react';
import DashboardTopbar from '../components/common/DashboardTopbar';
import StatCard from '../components/common/StatCard';
import SectionHeader from '../components/common/SectionHeader';
import ActivityItem from '../components/common/ActivityItem';
import DashboardPanel from '../components/common/DashboardPanel';
import FormField from '../components/common/FormField';
import { dashboardService } from '../services/dashboard.service';
import { jobService } from '../services/job.service';
import { eventService } from '../services/event.service';
import { chatService } from '../services/chat.service';

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ alumni: 0, jobs: 0, events: 0 });
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [statsRes, jobsRes, eventsRes, convRes] = await Promise.allSettled([
          dashboardService.getStats(),
          jobService.getJobs(),
          eventService.getEvents(),
          chatService.getConversations(),
        ]);

        if (!mounted) return;

        if (statsRes.status === 'fulfilled') {
          const p = statsRes.value || {};
          setStats({ alumni: p.alumniCount || 0, jobs: p.jobCount || 0, events: p.eventCount || 0 });
        }

        if (jobsRes.status === 'fulfilled') {
          setJobs(jobsRes.value || []);
        }

        if (eventsRes.status === 'fulfilled') {
          setEvents(eventsRes.value || []);
        }

        if (convRes.status === 'fulfilled') {
          setConversations(Array.isArray(convRes.value) ? convRes.value : []);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const unreadMessages = conversations.reduce((total, item) => total + (item.unreadCount || 0), 0);
  const recentJobs = jobs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const upcomingEvents = events
    .slice()
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 2);

  const completionScore = Math.min(100, Math.max(0, [
    user?.name ? 1 : 0,
    user?.email ? 1 : 0,
    user?.bio ? 1 : 0,
    user?.skills?.length ? 1 : 0,
    user?.company || user?.course || user?.graduationYear || user?.yearOfStudying ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0) * 20));

  return (
    <div className="min-h-screen bg-transparent">
      <div className="px-4 py-6 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
        <DashboardTopbar user={user} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Jobs Available" value={stats.jobs || '0'} hint="Open roles" icon={<Briefcase size={20} />} accent="blue" />
          <StatCard label="Upcoming Events" value={stats.events || '0'} hint="Scheduled events" icon={<CalendarDays size={20} />} accent="green" />
          <StatCard label="Alumni Connections" value={stats.alumni || '0'} hint="Active network" icon={<Users size={20} />} accent="purple" />
          <StatCard label="Unread Messages" value={unreadMessages || '0'} hint="Chat updates" icon={<MessageCircle size={20} />} accent="amber" />
        </div>

        <DashboardPanel
          title="Profile Completion"
          subtitle="Add skills, experience, and details to complete your student profile."
          action={
            <button
              type="button"
              onClick={() => navigate('/profile?edit=1')}
              className="min-h-[44px] rounded-xl bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Complete Profile
            </button>
          }
        >
          <div className="mt-2">
            <div className="h-2 overflow-hidden rounded-full bg-slate-900/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${completionScore}%` }} />
            </div>
          </div>
        </DashboardPanel>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-5 border shadow-sm bg-card border-border rounded-2xl">
            <SectionHeader title="Recent Jobs" subtitle="Latest roles shared by alumni and partners" />
            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 rounded-2xl bg-slate-900/10" />
                  <div className="h-16 rounded-2xl bg-slate-900/10" />
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="p-5 text-sm border rounded-3xl border-border bg-slate-950 text-slate-400">No recent jobs available yet.</div>
              ) : (
                recentJobs.map((job) => (
                  <div key={job._id} className="p-4 border rounded-3xl border-border bg-slate-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.company} · {job.location || 'Remote'}</p>
                      </div>
                      <p className="text-xs text-slate-500">{job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}</p>
                    </div>
                    {job.salary && <p className="mt-3 text-xs text-slate-400">{job.salary}</p>}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => navigate('/opportunities')}
                className="border border-border hover:border-primary hover:text-primary rounded-xl px-4 py-2 font-medium transition-colors min-h-[44px]"
              >
                View all jobs
              </button>
            </div>
          </div>

          <div className="p-5 border shadow-sm bg-card border-border rounded-2xl">
            <SectionHeader title="Upcoming Events" subtitle="Campus and alumni activities" />
            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 rounded-2xl bg-slate-900/10" />
                  <div className="h-16 rounded-2xl bg-slate-900/10" />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="p-5 text-sm border rounded-3xl border-border bg-slate-950 text-slate-400">No upcoming events scheduled yet.</div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event._id} className="p-4 border rounded-3xl border-border bg-slate-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{event.title}</p>
                        <p className="text-xs text-slate-400">{new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {event.description?.slice(0, 40)}</p>
                      </div>
                      <p className="text-xs text-slate-500">{event.attendees?.length || 0} going</p>
                    </div>
                    <div className="mt-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate('/events')}
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-xl bg-primary hover:bg-primary-dark"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-5 border shadow-sm bg-card border-border rounded-2xl">
          <SectionHeader title="Recent Activity" subtitle="Your recent actions on the platform" />
          <div className="mt-3 divide-y divide-border">
            <ActivityItem
              icon={<Briefcase size={18} />}
              title={`${jobs.length} job${jobs.length === 1 ? '' : 's'} viewed`}
              when={loading ? 'Loading…' : `${recentJobs.length} new jobs available`}
            />
            <ActivityItem
              icon={<CalendarDays size={18} />}
              title={`${upcomingEvents.length} upcoming event${upcomingEvents.length === 1 ? '' : 's'}`}
              when={loading ? 'Loading…' : `${events.length} total events`}
            />
            <ActivityItem
              icon={<MessageCircle size={18} />}
              title={`${unreadMessages} unread message${unreadMessages === 1 ? '' : 's'}`}
              when={loading ? 'Loading…' : `${conversations.length} conversation${conversations.length === 1 ? '' : 's'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            className="bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-2 font-medium transition-colors min-h-[44px]"
          >
            Browse Jobs
          </button>
          <button
            type="button"
            onClick={() => navigate('/alumni')}
            className="border border-border hover:border-primary text-text-secondary hover:text-primary rounded-xl px-4 py-2 font-medium transition-colors min-h-[44px]"
          >
            Find Alumni
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="border border-border hover:border-primary text-text-secondary hover:text-primary rounded-xl px-4 py-2 font-medium transition-colors min-h-[44px]"
          >
            View Events
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="border border-border hover:border-primary text-text-secondary hover:text-primary rounded-xl px-4 py-2 font-medium transition-colors min-h-[44px]"
          >
            Edit Profile
          </button>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-600 border rounded-2xl border-red-500/20 bg-red-500/10">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
