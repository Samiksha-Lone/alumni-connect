import React from 'react';
import { Bell } from 'lucide-react';

export default function DashboardTopbar({ user }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-sm text-text-secondary">{dateStr} — Here’s what’s happening in your alumni network today.</p>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="rounded-md p-2 text-text-secondary transition-colors hover:bg-primary-soft hover:text-primary">
          <Bell />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </div>
  );
}
