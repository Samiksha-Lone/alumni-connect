import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/useToast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const config = {
    success: {
      icon: <CheckCircle size={18} />,
      baseCls: 'border-emerald-500/20 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-400',
      iconCls: 'text-emerald-500'
    },
    error: {
      icon: <AlertCircle size={18} />,
      baseCls: 'border-red-500/20 bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-400',
      iconCls: 'text-red-500'
    },
    info: {
      icon: <Info size={18} />,
      baseCls: 'border-blue-500/20 bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-400',
      iconCls: 'text-blue-500'
    },
    warning: {
      icon: <AlertTriangle size={18} />,
      baseCls: 'border-amber-500/20 bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-400',
      iconCls: 'text-amber-500'
    }
  };

  return (
    <div id="toast-container" className="pointer-events-none">
      {toasts.map((toast) => {
        const { icon, baseCls, iconCls } = config[toast.type] || config.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto animate-slide-up max-w-sm w-full ${baseCls}`}
          >
            <div className={`mt-0.5 ${iconCls}`}>
              {icon}
            </div>
            <p className="flex-grow text-sm font-medium leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 transition-opacity opacity-50 hover:opacity-100"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
