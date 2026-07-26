import React from 'react';
import { CalendarDays, MapPin, Clock3, Users } from 'lucide-react';
import Button from '../ui/Button';

const badgeStyles = {
  'Alumni Event': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  Workshop: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
  Meetup: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  Conference: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
};

export default function EventCard({ event, onOpen }) {
  const eventDate = event.eventDate ? new Date(event.eventDate) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBA';

  return (
    <article className="flex flex-col h-full overflow-hidden transition-all border shadow-sm rounded-2xl border-border bg-card hover:-translate-y-1 hover:shadow-lg">
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center justify-center border h-11 w-11 rounded-2xl border-border bg-gray-50 text-primary dark:bg-gray-800/70">
            <CalendarDays size={18} />
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[event.category] || badgeStyles['Alumni Event']}`}>
            {event.category || 'Alumni Event'}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text-primary">{event.title}</h3>
        <p className="mt-1 text-sm font-medium text-text-secondary">{event.description}</p>

        <div className="mt-4 space-y-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <CalendarDays size={12} className="text-primary/70" />
            <span>{formattedDate}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-primary/70" />
              <span>{event.location}</span>
            </div>
          )}
          {event.eventTime && (
            <div className="flex items-center gap-2">
              <Clock3 size={12} className="text-primary/70" />
              <span>{event.eventTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users size={12} className="text-primary/70" />
            <span>{event.attendees?.length || 0} attendees</span>
          </div>
        </div>
      </div>

      {onOpen ? (
        <div className="p-3 border-t border-border bg-gray-50/60 dark:bg-gray-800/20">
          <Button variant="primary" className="justify-center w-full text-xs font-semibold" onClick={onOpen}>
            Details
          </Button>
        </div>
      ) : null}
    </article>
  );
}
