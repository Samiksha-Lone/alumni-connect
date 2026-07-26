import React from 'react';

export default function SectionHeader({ title, subtitle, align = 'left' }) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align] || 'text-left';

  return (
    <div className={alignClasses}>
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
    </div>
  );
}
