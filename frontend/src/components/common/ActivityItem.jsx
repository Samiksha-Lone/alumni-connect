import React from 'react';

export default function ActivityItem({ icon, title, when }) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-border flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium">{title}</p>
        <p className="mt-1 text-xs text-text-secondary">{when}</p>
      </div>
    </div>
  );
}
