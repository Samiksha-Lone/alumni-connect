import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function DetailModal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-3xl rounded-3xl bg-card p-6 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && <h3 className="text-2xl font-semibold leading-tight text-text-primary truncate">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-text-secondary truncate">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="ml-4 p-2 text-text-secondary hover:text-text-primary rounded-full">
            <X />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-auto text-sm text-text-secondary space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
