import React from 'react';

export default function StatCard({ label, value, hint, icon, accent = 'blue' }) {
  const accentStyles = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  }[accent] || 'bg-blue-50 text-blue-700';

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentStyles}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {hint ? <p className="text-xs text-text-secondary">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
