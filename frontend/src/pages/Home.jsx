import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Users, Briefcase, CalendarDays,
  MessageSquare, GraduationCap, BookOpen, Network,
  CheckCircle2, Building2, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import { userService } from '../services/user.service';
import { dashboardService } from '../services/dashboard.service';

/* ── Small mock UI preview card shown in the Hero ── */
function HeroPreviewCard({ profiles, totalAlumni, onNavigate }) {
  const displayProfiles = profiles || [];

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/20 bg-slate-950/90 text-white shadow-2xl shadow-slate-900/30">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">MGM Alumni Network</span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
          Live
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {displayProfiles.length > 0 ? (
          displayProfiles.map((p) => {
            const roleText = p.company ? `${p.courseStudied || 'Alumnus'} · ${p.company}` : (p.courseStudied || 'Alumnus');
            return (
              <div key={p._id || p.name} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/10" onClick={onNavigate}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-xs font-bold text-slate-100">
                  {p.name ? p.name.charAt(0) : '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-slate-100">{p.name}</p>
                  <p className="truncate text-[10px] text-slate-400">{roleText}</p>
                </div>
                {p.mentorAvailable ? (
                  <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
                    Mentor
                  </span>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="flex justify-center px-4 py-8 text-sm text-slate-400">Loading alumni...</div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alumniList, setAlumniList] = useState([]);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [stats, setStats] = useState({ alumni: 0, jobs: 0, events: 0 });

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await userService.getAlumni({ page: 1, limit: 4 });
        const list = Array.isArray(data) ? data : data.data || [];
        setTotalAlumni(Array.isArray(data) ? data.length : data.pagination?.total || list.length);
        setAlumniList(list.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch alumni for home page', err);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const payload = await dashboardService.getStats();
        setStats({
          alumni: payload.alumniCount || payload.summary?.alumni || 0,
          jobs: payload.jobCount || payload.summary?.jobs || 0,
          events: payload.eventCount || payload.summary?.events || 0,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };

    fetchAlumni();
    fetchDashboardStats();
  }, []);

  const statItems = [
    { label: 'Active Alumni', value: stats.alumni ? `${stats.alumni}+` : '420+', hint: 'Growing network', icon: <Users size={18} />, accent: 'blue' },
    { label: 'Jobs Shared', value: stats.jobs ? `${stats.jobs}` : '36', hint: 'Updated weekly', icon: <Briefcase size={18} />, accent: 'emerald' },
    { label: 'Upcoming Events', value: stats.events ? `${stats.events}` : '8', hint: 'Campus & alumni meets', icon: <CalendarDays size={18} />, accent: 'amber' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 shadow-xl sm:px-8 md:px-10 md:py-14 lg:px-12">
        <div className="absolute inset-0 bg-[url('/MGM-main.jpg')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="max-w-2xl flex-1">
            <span className="mb-4 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              MGM College of Engineering • Nanded
            </span>
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {user ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Reconnect with MGM Alumni'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {user
                ? 'Explore the directory, find opportunities, and keep up with campus events that matter to your career.'
                : 'Stay connected with the alumni network of MGM’s College of Engineering, Nanded — from campus to career and beyond.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link to="/alumni" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400">
                    Join the Network <ArrowRight size={15} />
                  </Link>
                  <Link to="/opportunities" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/20">
                    Explore Opportunities
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400">
                    Join the Network <ArrowRight size={15} />
                  </Link>
                  <Link to="/alumni" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/20">
                    Explore Opportunities
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {statItems.map((item) => (
                <StatCard key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="w-full max-w-md lg:justify-end">
            <HeroPreviewCard profiles={alumniList} totalAlumni={totalAlumni} onNavigate={() => navigate('/alumni')} />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ══════════════════════════════════
          CORE VALUE CARDS
      ══════════════════════════════════ */}
      <section className="section-container py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-1">
          What you can do on Alumni Connect
        </h2>
        <p className="text-sm text-text-secondary mb-8 max-w-lg">
          Three focused ways students and alumni make the most of this platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Users size={18} />,
              color: 'blue',
              title: 'Find Alumni',
              desc: 'Browse graduate profiles by batch, department, or company. Send a direct message or request mentorship from those who\'ve opted in.',
              to: '/alumni',
              cta: 'Open Directory',
            },
            {
              icon: <Briefcase size={18} />,
              color: 'emerald',
              title: 'Explore Opportunities',
              desc: 'Jobs and internships posted directly by alumni — relevant, community-sourced, and updated regularly.',
              to: '/opportunities',
              cta: 'View Openings',
            },
            {
              icon: <CalendarDays size={18} />,
              color: 'purple',
              title: 'Join Events',
              desc: 'Register for campus workshops, alumni meets, and networking sessions. Stay updated on what\'s happening.',
              to: '/events',
              cta: 'Browse Events',
            },
          ].map((card) => {
            const colorMap = {
              blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
              emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
              purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
            };
            return (
              <div
                key={card.title}
                className="group flex flex-col p-5 bg-card border border-border rounded-2xl
                           hover:border-primary/40 hover:-translate-y-1 hover:shadow-md
                           transition-all duration-200 cursor-default"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3.5 border ${colorMap[card.color]} group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-1.5">{card.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed flex-1">{card.desc}</p>
                <Link
                  to={card.to}
                  className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-primary hover:text-primary-hover group/link"
                >
                  {card.cta}
                  <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Messaging note */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-3 bg-card border border-border rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center border border-primary/10 shrink-0">
              <MessageSquare size={14} />
            </div>
            <p className="text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Direct Messaging</span> — connect one-on-one with alumni for guidance or collaboration.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ══════════════════════════════════
          PLATFORM PREVIEW — wider/centered variant
      ══════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-gray-50/60 dark:bg-gray-900/10">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
              A focused platform built around real needs.
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              No bloat. Just the things that actually help students and alumni stay connected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <GraduationCap size={18} />,
                color: 'blue',
                title: 'Alumni Profiles',
                desc: 'Filterable by batch, department, and company. Alumni can opt in as mentors so students can reach out directly.',
              },
              {
                icon: <Network size={18} />,
                color: 'emerald',
                title: 'Opportunities Board',
                desc: 'Job and internship listings from alumni — organized by role and company, with direct application links.',
              },
              {
                icon: <BookOpen size={18} />,
                color: 'purple',
                title: 'Events & Community',
                desc: 'Campus and alumni events with RSVP support. Stay informed about reunions, workshops, and meetups.',
              },
            ].map((item) => {
              const colorMap = {
                blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
                emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
                purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
              };
              return (
                <div key={item.title} className="p-5 bg-card border border-border rounded-2xl">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 border ${colorMap[item.color]}`}>
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold text-text-primary mb-1.5">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ══════════════════════════════════
          WHY THIS PLATFORM — 2-col benefit cards
      ══════════════════════════════════ */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            A more connected campus doesn't end at graduation.
          </h2>
          <p className="text-sm text-text-secondary mb-8 max-w-xl leading-relaxed">
            Most students lose touch with their alumni network right when they need it most. Alumni Connect was built to fix that.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <CheckCircle2 size={14} />,
                title: 'Easier access to alumni',
                desc: 'Find and reach out to graduates — no informal WhatsApp groups or word of mouth needed.',
              },
              {
                icon: <CheckCircle2 size={14} />,
                title: 'Opportunities from people who care',
                desc: 'Jobs shared by alumni who want to give back — more trusted than generic job boards.',
              },
              {
                icon: <CheckCircle2 size={14} />,
                title: 'Direct guidance via chat',
                desc: 'Have real conversations with mentors and working professionals without needing an introduction.',
              },
              {
                icon: <CheckCircle2 size={14} />,
                title: 'A living campus community',
                desc: 'Events and announcements keep students and alumni engaged with the institution year-round.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl">
                <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary mb-0.5">{item.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ══════════════════════════════════
          FINAL CTA
      ══════════════════════════════════ */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {user ? 'Pick up where you left off.' : 'Ready to get started?'}
          </h2>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {user
              ? 'Your alumni network is waiting. Browse the directory, check opportunities, or start a conversation.'
              : 'Create a free account to access the alumni directory, explore career opportunities, and join campus events.'
            }
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <>
                <Link
                  to="/alumni"
                  className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Browse Alumni <ArrowRight size={15} />
                </Link>
                <Link
                  to="/opportunities"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-card text-text-primary text-sm font-medium rounded-xl border border-border hover:border-primary/40 transition-colors"
                >
                  View Opportunities
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Create Account <ArrowRight size={15} />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-card text-text-primary text-sm font-medium rounded-xl border border-border hover:border-primary/40 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-text-secondary opacity-60 text-center">
            Start exploring the network built around your institution.
          </p>
        </div>
      </section>

    </div>
  );
}