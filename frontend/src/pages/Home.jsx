import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight, Users, Briefcase, CalendarDays,
  MessageSquare, GraduationCap, BookOpen, Network,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Small mock UI preview card shown in the Hero ── */
function HeroPreviewCard({ profiles, totalAlumni, onNavigate }) {
  // Use real profiles or fallback to empty array while loading
  const displayProfiles = profiles || [];
  
  return (
    <div className="w-full max-w-xs rounded-2xl border border-border bg-card shadow-sm overflow-hidden select-none">
      {/* Card header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between cursor-default">
        <span className="text-xs font-bold text-text-primary">Alumni Directory</span>
        <span className="text-[10px] text-primary font-semibold bg-primary-soft px-2 py-0.5 rounded-full border border-primary/20">
          Live
        </span>
      </div>
      {/* Profile list */}
      <div className="divide-y divide-border">
        {displayProfiles.length > 0 ? (
          displayProfiles.map((p) => {
            const roleText = p.company ? `${p.courseStudied || 'Alumnus'} · ${p.company}` : (p.courseStudied || 'Alumnus');
            return (
              <div key={p._id || p.name} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors" onClick={onNavigate}>
                <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs border border-primary/10 shrink-0">
                  {p.name ? p.name.charAt(0) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text-primary truncate">{p.name}</p>
                  <p className="text-[10px] text-text-secondary truncate">{roleText}</p>
                </div>
                {p.mentorAvailable && (
                  <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0">
                    Mentor
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-4 py-8 flex justify-center">
            <span className="text-xs text-text-secondary">Loading alumni...</span>
          </div>
        )}
      </div>
      {/* Footer */}
      <div 
        className="px-4 py-3 border-t border-border bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
        onClick={onNavigate}
      >
        <span className="text-[10px] text-text-secondary">{totalAlumni > 0 ? `${totalAlumni} alumni shown` : 'Connecting...'}</span>
        <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
          View all <ArrowRight size={10} />
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alumniList, setAlumniList] = useState([]);
  const [totalAlumni, setTotalAlumni] = useState(0);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get('/users/alumni');
        const list = res.data || [];
        setTotalAlumni(list.length);
        // Show up to 3 recent or prominent alumni
        setAlumniList(list.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch alumni for home page", err);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="section-container pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* Left — copy */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-text-primary mb-4">
              {user
                ? `Welcome back, ${user.name.split(' ')[0]}.`
                : <>Stay connected with<br className="hidden sm:block" /> your alumni network.</>
              }
            </h1>

            <p className="text-base text-text-secondary leading-relaxed max-w-lg mb-7">
              {user
                ? 'Explore the directory, find opportunities, or check what events are coming up.'
                : 'A platform for students and alumni to connect, share opportunities, and stay engaged with their institution — even after graduation.'
              }
            </p>

            <div className="flex flex-wrap gap-3">
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
                    Get Started <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/alumni"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-card text-text-primary text-sm font-medium rounded-xl border border-border hover:border-primary/40 transition-colors"
                  >
                    Explore Directory
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right — mock UI preview */}
          <div className="hidden lg:flex justify-center lg:justify-end flex-shrink-0 opacity-90">
            <HeroPreviewCard 
              profiles={alumniList} 
              totalAlumni={totalAlumni} 
              onNavigate={() => navigate('/alumni')} 
            />
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