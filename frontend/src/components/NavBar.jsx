import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogIn, MessageSquare } from 'lucide-react';
import UiNavLink from './ui/UiNavLink';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';

export default function NavBar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme() || { theme: 'dark', toggleTheme: () => {} };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/events', label: 'Events' },
    { to: '/alumni', label: 'Alumni' },
    { to: '/opportunities', label: 'Opportunities' },
    { to: '/recommendations', label: 'For You' },
    { to: '/discussion', label: 'Forum' },
    { to: '/mentorship', label: 'Mentorship' },
    { to: '/chatbot', label: 'AI Help' },
  ];

  return (
    <header className="glass-header">
      <nav className="flex items-center justify-between h-14 px-4 mx-auto max-w-7xl">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg font-bold tracking-tight transition-colors text-primary">
            Alumni Connect
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden gap-0.5 md:flex">
          {navItems.map((item) => (
            <UiNavLink key={item.to} to={item.to} className="px-2.5 py-1.5 text-[13px]">
              {item.label}
            </UiNavLink>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 transition-colors rounded-lg text-text-secondary hover:bg-primary-soft hover:text-primary"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Chat Icon (if logged in) */}
          {user && (
            <Link
              to="/chat"
              className="p-1.5 transition-colors rounded-lg text-text-secondary hover:bg-primary-soft hover:text-primary"
              title="Messages"
            >
              <MessageSquare size={18} />
            </Link>
          )}

          {/* User / Login */}
          <div className="hidden md:block">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-semibold transition-colors border rounded-lg border-border hover:bg-primary-soft hover:border-primary hover:text-primary"
              >
                <User size={14} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary-hover"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 md:hidden text-text-secondary hover:text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 p-4 border-b md:hidden bg-card border-border animate-slide-up">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <UiNavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-base rounded-lg hover:bg-primary-soft"
              >
                {item.label}
              </UiNavLink>
            ))}
            <hr className="my-2 border-border" />
            {user ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-soft text-text-primary"
              >
                <User size={20} />
                <span>My Profile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-soft text-text-primary"
              >
                <LogIn size={20} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
