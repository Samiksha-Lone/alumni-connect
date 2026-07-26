import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogIn, MessageSquare, LogOut } from 'lucide-react';
import UiNavLink from './ui/UiNavLink';
import { useAuth } from '../context/AuthContext';
import useTheme from '../context/useTheme';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme() || { theme: 'dark', toggleTheme: () => {} };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/',             label: 'Home' },
    { to: '/alumni',       label: 'Directory' },
    { to: '/opportunities',label: 'Opportunities' },
    { to: '/events',       label: 'Events' },
    { to: '/gallery',      label: 'Gallery' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-primary sm:text-base">
          <img src="/MGM-logo.jpg" alt="MGM College of Engineering logo" className="h-8 w-8 rounded-lg object-cover" />
          <span className="text-text-primary">MGM Alumni Portal</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <UiNavLink key={item.to} to={item.to} className="px-3 py-1.5 text-[13px] font-medium rounded-lg">
              {item.label}
            </UiNavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-primary-soft hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Chat (logged in) */}
          {user && (
            <Link
              to="/chat"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-soft hover:text-primary"
              title="Messages"
            >
              <MessageSquare size={16} />
            </Link>
          )}

          {/* Profile / Login — desktop */}
          <div className="hidden md:block ml-1">
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/profile'}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-primary-soft hover:border-primary/40 hover:text-primary transition-all"
                >
                  <div className={`w-5 h-5 rounded-md text-white flex items-center justify-center text-[10px] font-bold ${user.role === 'admin' ? 'bg-amber-500' : 'bg-primary'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:text-primary md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-border bg-card shadow-lg md:hidden">
          <div className="px-4 py-3 flex flex-col gap-0.5">
            {navItems.map((item) => (
              <UiNavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg"
              >
                {item.label}
              </UiNavLink>
            ))}
          </div>

          <div className="px-4 pb-3 pt-1 border-t border-border/60">
            {user ? (
              <div className="flex flex-col gap-1">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/profile'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-soft text-sm font-medium text-text-primary transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold ${user.role === 'admin' ? 'bg-amber-500' : 'bg-primary'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{user.role === 'admin' ? 'Admin Dashboard' : 'View Profile'}</p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                    <LogOut size={14} />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary-soft transition-colors"
              >
                <LogIn size={16} />
                Sign In / Create Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
