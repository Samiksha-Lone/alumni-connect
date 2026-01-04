import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

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

  return (
    <section className="max-w-md mx-auto px-6 py-12">
      <Card className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8">{mode === 'login' ? 'Login' : 'Register'}</h2>

        <div className="seg-toggle mb-6">
          <button onClick={() => setMode('login')} className={`seg-btn ${mode === 'login' ? 'active' : ''}`}>Login</button>
          <button onClick={() => setMode('register')} className={`seg-btn ${mode === 'register' ? 'active' : ''}`}>Register</button>
        </div>

        {error && (
          <div className="mb-6 alert-error">{error}</div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
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
              <Button type="submit" variant="primary" className="w-full">Login</Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
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
                <input type="text" placeholder="Year of Study" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} required className="form-input" />
                <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} required className="form-input" />
              </>
            )}

            {role === 'alumni' && (
              <>
                <input type="text" placeholder="Year of Passing" value={yearOfPassing} onChange={(e) => setYearOfPassing(e.target.value)} required className="form-input" />
                <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} required className="form-input" />
                <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required className="form-input" />
                <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required className="form-input" />
              </>
            )}
            <Button type="submit" variant="primary" className="w-full">Register</Button>
          </form>
        )}
      </Card>
    </section>
  )
}
