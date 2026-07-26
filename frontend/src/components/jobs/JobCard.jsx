import React from 'react';
import { Briefcase, CalendarDays, MapPin, DollarSign, Clock3 } from 'lucide-react';
import Button from '../ui/Button';

const badgeStyles = {
  Internship: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
  'Full Time': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  Remote: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
  Hybrid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
};

export default function JobCard({ job, onOpen }) {
  const badges = ['Internship', 'Full Time', 'Remote'];
  const skills = job.skills || ['React', 'Node.js', 'Communication'];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex-1 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-gray-50 text-primary dark:bg-gray-800/70">
            <Briefcase size={18} />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {badges.map((badge) => (
              <span key={badge} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[badge]}`}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-base font-semibold text-text-primary">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-text-secondary">{job.company}</p>
        </div>

        <p className="mb-2 text-sm leading-tight text-text-secondary line-clamp-3">{job.description}</p>

        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0 text-primary/70" />
            <span>{job.location || 'Pune, India'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={12} className="shrink-0 text-primary/70" />
            <span>{job.salary || '₹ 3 - 6 LPA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={12} className="shrink-0 text-primary/70" />
            <span>Posted {job.postedDate || '2 days ago'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={12} className="shrink-0 text-primary/70" />
            <span>Apply by {job.closingDate ? new Date(job.closingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Aug 24'}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded-full border border-border bg-gray-50 px-2.5 py-1 text-[10px] font-medium text-text-secondary dark:bg-gray-800/60">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-gray-50/60 p-3 dark:bg-gray-800/20">
        <div className="flex">
          <Button variant="primary" className="w-full justify-center text-xs font-semibold" onClick={onOpen}>
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}
