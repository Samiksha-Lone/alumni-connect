import React from 'react';
import { Link } from 'react-router-dom';
import UiNavLink from './ui/UiNavLink';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';

export default function NavBar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme() || { theme: 'dark', toggleTheme: () => {} };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/events', label: 'Events' },
    { to: '/alumni', label: 'Alumni' },
    { to: '/opportunities', label: 'Opportunities' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150">
            Alumni Connect
          </Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <UiNavLink key={item.to} to={item.to}>
              {item.label}
            </UiNavLink>
          ))}
        </div>

        {/* Right: Auth controls + theme */}
        <div className="flex items-center gap-3">
          {user ? (
            <UiNavLink to="/profile">{user.name}</UiNavLink>
          ) : (
            <UiNavLink to="/auth">Login / Register</UiNavLink>
          )}

          <button 
            onClick={toggleTheme} 
            title="Toggle theme"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors duration-150"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
}
