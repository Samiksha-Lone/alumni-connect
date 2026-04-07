import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-5 border-t bg-card border-border mt-auto">
      <div className="flex flex-col items-center justify-center px-4 mx-auto max-w-7xl gap-3">
        <div className="text-xs text-text-secondary">
          © {currentYear} Alumni Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
