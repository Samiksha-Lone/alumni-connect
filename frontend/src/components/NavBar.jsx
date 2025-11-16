import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useTheme from '../context/useTheme'

const active = { fontWeight: '600' }

export default function NavBar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme() || { theme: 'light', toggleTheme: () => {} }

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--nav-bg)' }}>
      <nav style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'center',
        padding: '0.6rem 2rem',
        height: '3.5rem'
      }}>
        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: 'var(--accent)',
          marginRight: 'auto'
        }}>
          Alumni Connect
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <NavLink to="/" style={({ isActive }) => (isActive ? active : undefined)}>
            Home
          </NavLink>
          <NavLink to="/about" style={({ isActive }) => (isActive ? active : undefined)}>
            About
          </NavLink>
          <NavLink to="/gallery" style={({ isActive }) => (isActive ? active : undefined)}>
            Gallery
          </NavLink>
          <NavLink to="/events" style={({ isActive }) => (isActive ? active : undefined)}>
            Events
          </NavLink>
          <NavLink to="/alumni" style={({ isActive }) => (isActive ? active : undefined)}>
            Alumni
          </NavLink>
          <NavLink to="/opportunities" style={({ isActive }) => (isActive ? active : undefined)}>
            Opportunities
          </NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(15,23,34,0.08)', paddingLeft: '1.5rem' }}>
          {user ? (
            <>
              <NavLink to="/profile" style={({ isActive }) => (isActive ? active : undefined)}>
                {user.name}
              </NavLink>
            </>
          ) : (
            <NavLink to="/auth" style={({ isActive }) => (isActive ? active : undefined)}>
              Login / Register
            </NavLink>
          )}
          <button 
            onClick={toggleTheme} 
            title="Toggle theme" 
            style={{ 
              padding: '8px', 
              background: 'transparent',
              border: '1px solid rgba(15,23,34,0.08)',
              color: 'var(--text)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  )
}
