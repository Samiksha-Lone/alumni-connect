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

  return (
    <section className="max-w-md mx-auto px-6 py-12">
      <div className="card-base p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>
        
        <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setMode('login')} 
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('register')} 
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input 
              type="password"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input 
              type="email"
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input 
              type="password"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {role === 'student' && (
              <>
                <input 
                  type="text"
                  placeholder="Year of Study"
                  value={yearOfStudy} 
                  onChange={(e) => setYearOfStudy(e.target.value)} 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input 
                  type="text"
                  placeholder="Branch"
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)} 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input 
                  type="text"
                  placeholder="Branch"
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)} 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input 
                  type="text"
                  placeholder="Company"
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input 
                  type="text"
                  placeholder="Job Role"
                  value={jobRole} 
                  onChange={(e) => setJobRole(e.target.value)} 
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </>
            )}

            <button type="submit" className="btn-primary w-full">Register</button>
          </form>
        )}
      </div>
    </section>
  )
}
