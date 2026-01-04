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
    <header className="sticky top-0 z-50">
      <nav className="nav max-w-6xl mx-auto px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center mr-4">
          <Link to="/" className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Alumni Connect
          </Link>
        </div>

        {/* Center: Nav links (centered) */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <UiNavLink key={item.to} to={item.to}>
                {item.label}
              </UiNavLink>
            ))}
          </div>
        </div>

        {/* Right: Auth controls + theme */}
        <div className="flex items-center space-x-4">
          {user ? (
            <UiNavLink to="/profile">{user.name}</UiNavLink>
          ) : (
            <UiNavLink to="/auth">Login / Register</UiNavLink>
          )}

          <button onClick={toggleTheme} title="Toggle theme" className="p-2 rounded-md border" style={{borderColor:'var(--border)', color:'var(--text)'}}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
}
