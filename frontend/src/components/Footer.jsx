import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-auto border-t border-border bg-card">
      <div className="px-4 mx-auto text-xs text-center max-w-7xl text-text-secondary">
        <div>© {currentYear} MGM Alumni Portal</div>
        <div className="mt-1">Built for community connections and career growth.</div>
      </div>
    </footer>
  );
}
