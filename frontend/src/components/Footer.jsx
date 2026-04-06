import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t bg-card border-border mt-auto">
      <div className="flex flex-col items-center justify-between px-4 mx-auto max-w-7xl md:flex-row gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="text-base font-bold text-primary">
            Alumni Connect
          </Link>
          <p className="text-[13px] text-text-secondary text-center md:text-left">
            Empowering connections between students and alumni.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link to="/about" className="text-sm transition-colors text-text-secondary hover:text-primary">About</Link>
          <Link to="/gallery" className="text-sm transition-colors text-text-secondary hover:text-primary">Gallery</Link>
          <Link to="/events" className="text-sm transition-colors text-text-secondary hover:text-primary">Events</Link>
          <Link to="/alumni" className="text-sm transition-colors text-text-secondary hover:text-primary">Alumni</Link>
          <Link to="/opportunities" className="text-sm transition-colors text-text-secondary hover:text-primary">Jobs</Link>
        </div>

        <div className="text-sm text-text-secondary">
          © {currentYear} Alumni Connect.
        </div>
      </div>
    </footer>
  );
}
