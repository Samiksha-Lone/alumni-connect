import React from 'react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}) {
  return (
    <div className={`mx-auto max-w-md rounded-2xl border border-dashed border-border bg-gray-50/70 px-8 py-16 text-center shadow-sm dark:bg-gray-900/10 ${className}`}>
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-text-secondary">
          <Icon size={22} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
