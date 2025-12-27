import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <p className="m-0 text-slate-600 dark:text-slate-400 text-sm text-center">
          © {currentYear} Alumni Connect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
