import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [mode, setMode] = useState('login') 
  const { register, login } = useAuth()
  const nav = useNavigate()

  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [yearOfStudy, setYearOfStudy] = useState('')
  const [branch, setBranch] = useState('')

  const [yearOfPassing, setYearOfPassing] = useState('')
  const [company, setCompany] = useState('')
  const [jobRole, setJobRole] = useState('')

  const [error, setError] = useState(null)

  async function handleRegister(e) {
    e.preventDefault()
    const payload = { name, email, password, role }
    if (role === 'student') {
      payload.yearOfStudy = yearOfStudy
      payload.branch = branch
    }
    if (role === 'alumni') {
      payload.yearOfPassing = yearOfPassing
      payload.branch = branch
      payload.company = company
      payload.jobRole = jobRole
    }
    const res = await register(payload)
    if (!res.ok) {
      setError(res.error)
    } else {
      nav('/profile')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    const res = await login({ email, password, role })
    if (!res.ok) {
      setError(res.error)
    } else {
      nav('/profile')
    }
  }

  const sectionStyle = mode === 'register'
    ? { position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '360px', zIndex: 60, background: 'var(--card)', padding: '18px', borderRadius: 10, boxShadow: '0 10px 30px rgba(2,6,23,0.12)' }
    : { maxWidth: '360px', margin: '2rem auto' }

  return (
    <section style={sectionStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontSize: '1.5rem' }}>{mode === 'login' ? 'Login' : 'Register'}</h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        background: 'var(--card)',
        padding: '0.25rem',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <button 
          onClick={() => setMode('login')} 
          className={mode === 'login' ? 'active' : 'text-button'}
          style={{ flex: 1, borderRadius: '6px', padding: '0.5rem' }}
        >
          Login
        </button>
        <button 
          onClick={() => setMode('register')} 
          className={mode === 'register' ? 'active' : 'text-button'}
          style={{ flex: 1, borderRadius: '6px', padding: '0.5rem' }}
        >
          Register
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#ef4444', 
          background: 'rgba(239,68,68,0.1)', 
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="" disabled>Select Role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="admin">Admin</option>
          </select>
          <input 
            type="email" 
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="form-input"
          />
          <input 
            type="password"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="form-input"
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="" disabled>Select Role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
          <input 
            type="text"
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            className="form-input"
          />
          <input 
            type="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="form-input"
          />
          <input 
            type="password"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="form-input"
          />

          {role === 'student' && (
            <>
              <input 
                type="text"
                placeholder="Year of Study"
                value={yearOfStudy} 
                onChange={(e) => setYearOfStudy(e.target.value)} 
                required
                className="form-input"
              />
              <input 
                type="text"
                placeholder="Branch"
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                required
                className="form-input"
              />
            </>
          )}

          {role === 'alumni' && (
            <>
              <input 
                type="text"
                placeholder="Year of Passing"
                value={yearOfPassing} 
                onChange={(e) => setYearOfPassing(e.target.value)} 
                required
                className="form-input"
              />
              <input 
                type="text"
                placeholder="Branch"
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                required
                className="form-input"
              />
              <input 
                type="text"
                placeholder="Company"
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                required
                className="form-input"
              />
              <input 
                type="text"
                placeholder="Job Role"
                value={jobRole} 
                onChange={(e) => setJobRole(e.target.value)} 
                required
                className="form-input"
              />
            </>
          )}

          <button type="submit">Register</button>
        </form>
      )}
    </section>
  )
}
