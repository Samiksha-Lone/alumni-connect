import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center">
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
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right: Auth controls + theme */}
        <div className="flex items-center space-x-4">
          {user ? (
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {user.name}
            </NavLink>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Login / Register
            </NavLink>
          )}

          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
}
