import React from 'react';
import { Briefcase, GraduationCap, MapPin, Sparkles, BadgeCheck } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import Card from '../ui/Card';

export default function AlumniCard({ alumni, onMessage, onMentor }) {
  const displaySkills = Array.isArray(alumni.skills) && alumni.skills.length > 0
    ? alumni.skills.slice(0, 4)
    : ['Leadership', 'Communication'];

  return (
    <Card className="flex h-full flex-col overflow-hidden bg-card p-0">
      <div className="flex-1 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-lg font-bold text-primary">
            {alumni.name?.charAt(0) || 'A'}
          </div>
          <div className="flex items-center gap-2">
            {alumni.mentorAvailable ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                Mentor
              </span>
            ) : null}
            {alumni.linkedin ? (
              <a
                href={alumni.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-white p-1.5 text-text-secondary transition-colors hover:border-blue-300 hover:text-blue-600 dark:bg-transparent"
                aria-label={`View ${alumni.name}'s LinkedIn profile`}
              >
                <FaLinkedin size={13} />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mb-2 flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-text-primary">{alumni.name}</h3>
          {alumni.isVerified ? <BadgeCheck size={14} className="text-emerald-500" /> : null}
        </div>

        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="shrink-0 text-primary/70" />
            <span className="font-medium text-text-primary">{alumni.company || 'Professional Member'}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={12} className="shrink-0 text-primary/70" />
            <span>Batch {alumni.graduationYear || 'N/A'} · {alumni.courseStudied || 'Member'}</span>
          </div>
          {alumni.location ? (
            <div className="flex items-center gap-2">
              <MapPin size={12} className="shrink-0 text-primary/70" />
              <span>{alumni.location}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {displaySkills.map((skill) => (
            <span key={skill} className="rounded-full border border-border bg-gray-50 px-2.5 py-1 text-[10px] font-medium text-text-secondary dark:bg-gray-800/60">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-gray-50/60 p-3 dark:bg-gray-800/20">
        <button
          onClick={alumni.mentorAvailable ? onMentor : onMessage}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Sparkles size={14} />
          {alumni.mentorAvailable ? 'Request Mentorship' : 'Message Alumni'}
        </button>
      </div>
    </Card>
  );
}
