import React from 'react';

export default function DashboardPanel({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-border bg-card p-5 shadow-sm ${className}`.trim()}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
