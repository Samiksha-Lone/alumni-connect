// import React, { useState } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'

// export default function AuthPage() {
//   const [mode, setMode] = useState('login') 
//   const { register, login } = useAuth()
//   const nav = useNavigate()

//   const [role, setRole] = useState('student')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')

//   const [yearOfStudy, setYearOfStudy] = useState('')
//   const [branch, setBranch] = useState('')

//   const [yearOfPassing, setYearOfPassing] = useState('')
//   const [company, setCompany] = useState('')
//   const [jobRole, setJobRole] = useState('')

//   const [error, setError] = useState(null)

//   async function handleRegister(e) {
//     e.preventDefault()
//     const payload = { name, email, password, role }
//     if (role === 'student') {
//       payload.yearOfStudy = yearOfStudy
//       payload.branch = branch
//     }
//     if (role === 'alumni') {
//       payload.yearOfPassing = yearOfPassing
//       payload.branch = branch
//       payload.company = company
//       payload.jobRole = jobRole
//     }
//     const res = await register(payload)
//     if (!res.ok) {
//       setError(res.error)
//     } else {
//       nav('/profile')
//     }
//   }

//   async function handleLogin(e) {
//     e.preventDefault()
//     const res = await login({ email, password, role })
//     if (!res.ok) {
//       setError(res.error)
//     } else {
//       nav('/profile')
//     }
//   }

//   return (
//     <section className="max-w-md px-6 py-12 mx-auto">
//       <div className="p-8 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950">
//         <h2 className="mb-8 text-3xl font-bold text-center text-slate-900 dark:text-slate-50">{mode === 'login' ? 'Login' : 'Register'}</h2>

//         <div className="flex gap-2 p-1 mb-8 rounded-lg bg-slate-100 dark:bg-slate-900">
//           <button 
//             onClick={() => setMode('login')} 
//             className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-150 ${mode === 'login' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
//           >
//             Login
//           </button>
//           <button 
//             onClick={() => setMode('register')} 
//             className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors duration-150 ${mode === 'register' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
//           >
//             Register
//           </button>
//         </div>

//         {error && (
//           <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
//             {error}
//           </div>
//         )}

//         {mode === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-5">
//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Role</label>
//               <select 
//                 value={role} 
//                 onChange={(e) => setRole(e.target.value)} 
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="" disabled>Select Role</option>
//                 <option value="student">Student</option>
//                 <option value="alumni">Alumni</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Email</label>
//               <input 
//                 type="email" 
//                 placeholder="your@email.com"
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 required
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Password</label>
//               <input 
//                 type="password"
//                 placeholder="••••••••"
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <button 
//               type="submit" 
//               className="w-full px-4 py-2 font-medium text-white transition-colors duration-150 bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             >
//               Login
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleRegister} className="space-y-5">
//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Role</label>
//               <select 
//                 value={role} 
//                 onChange={(e) => setRole(e.target.value)} 
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="" disabled>Select Role</option>
//                 <option value="student">Student</option>
//                 <option value="alumni">Alumni</option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Full Name</label>
//               <input 
//                 type="text"
//                 placeholder="John Doe"
//                 value={name} 
//                 onChange={(e) => setName(e.target.value)} 
//                 required
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Email</label>
//               <input 
//                 type="email"
//                 placeholder="your@email.com"
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 required
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Password</label>
//               <input 
//                 type="password"
//                 placeholder="••••••••"
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required
//                 className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {role === 'student' && (
//               <>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Year of Study</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., 2024" 
//                     value={yearOfStudy} 
//                     onChange={(e) => setYearOfStudy(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Branch</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., Computer Science" 
//                     value={branch} 
//                     onChange={(e) => setBranch(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </>
//             )}

//             {role === 'alumni' && (
//               <>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Year of Passing</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., 2020" 
//                     value={yearOfPassing} 
//                     onChange={(e) => setYearOfPassing(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Branch</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., Computer Science" 
//                     value={branch} 
//                     onChange={(e) => setBranch(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Company</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., Tech Corp" 
//                     value={company} 
//                     onChange={(e) => setCompany(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Job Role</label>
//                   <input 
//                     type="text" 
//                     placeholder="e.g., Software Engineer" 
//                     value={jobRole} 
//                     onChange={(e) => setJobRole(e.target.value)} 
//                     required 
//                     className="w-full px-4 py-2 transition-colors duration-150 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </>
//             )}

//             <button 
//               type="submit" 
//               className="w-full px-4 py-2 font-medium text-white transition-colors duration-150 bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             >
//               Register
//             </button>
//           </form>
//         )}
//       </div>
//     </section>
//   )
// }





import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export default function AuthPage() {
  const [mode, setMode] = useState('login') 
  const { register, login, loading } = useAuth()
  const nav = useNavigate()

  // Form States
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
  const [success, setSuccess] = useState(null)
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)
    
    const payload = { name, email, password, role }
    if (role === 'student') {
      payload.yearOfStudy = yearOfStudy
      payload.course = branch
    } else if (role === 'alumni') {
      payload.graduationYear = yearOfPassing
      payload.courseStudied = branch
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
    setError(null)
    
    const res = await login({ email, password, role })
    
    if (!res.ok) {
      setError(res.error)
    } else {
      nav('/profile')
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setForgotLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(`${API_BASE}/auth/forgot-password`, { 
        email: forgotEmail 
      })
      setSuccess('If email exists, a reset link has been sent')
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken)
        setShowResetForm(true)
        setForgotEmail('')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setForgotLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setForgotLoading(true)

    try {
      await axios.post(`${API_BASE}/auth/reset-password/${resetToken}`, {
        newPassword,
        confirmPassword
      })
      setSuccess('Password reset successful! You can now login.')
      setShowForgotModal(false)
      setShowResetForm(false)
      setResetToken('')
      setNewPassword('')
      setConfirmPassword('')
      setForgotEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <section className="max-w-md px-6 py-12 mx-auto">
      <div className="p-8 bg-white border rounded-lg shadow-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="mb-8 text-3xl font-bold text-center text-slate-900 dark:text-slate-50">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* Mode Switcher */}
        <div className="flex gap-2 p-1 mb-8 rounded-lg bg-slate-100 dark:bg-slate-900">
          <button 
            disabled={loading}
            onClick={() => { setMode('login'); setError(null); }} 
            className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-950 shadow-md' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button 
            disabled={loading}
            onClick={() => { setMode('register'); setError(null); }} 
            className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${mode === 'register' ? 'bg-white dark:bg-slate-950 shadow-md' : 'text-slate-500'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 text-sm text-green-600 border border-green-200 rounded-lg bg-green-50 animate-pulse">
            {success}
          </div>
        )}

        {/* Dynamic Form Render */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          
          {/* Role is needed for both to help the backend filter the user table */}
          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">I am a...</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md outline-none dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              {mode === 'login' && <option value="admin">Admin</option>}
            </select>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" placeholder="John Doe" />
            </div>
          )}

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" placeholder="name@college.edu" />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" placeholder="••••••••" />
          </div>

          {/* Conditional Fields for Registration */}
          {mode === 'register' && role === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Year (2025)" value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className="px-4 py-2 border rounded-md dark:bg-slate-900" />
              <input type="text" placeholder="Branch" value={branch} onChange={e => setBranch(e.target.value)} className="px-4 py-2 border rounded-md dark:bg-slate-900" />
            </div>
          )}

          {mode === 'register' && role === 'alumni' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Year of Passing" value={yearOfPassing} onChange={e => setYearOfPassing(e.target.value)} className="px-4 py-2 border rounded-md dark:bg-slate-900" />
                <input type="text" placeholder="Branch" value={branch} onChange={e => setBranch(e.target.value)} className="px-4 py-2 border rounded-md dark:bg-slate-900" />
              </div>
              <input type="text" placeholder="Current Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-slate-900" />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 font-bold text-white transition-colors bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Forgot Password Link - Only show on login mode */}
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => { setShowForgotModal(true); setError(null); }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="p-8 bg-white rounded-lg shadow-xl dark:bg-slate-950 w-full max-w-sm mx-4">
            <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-50">Reset Password</h3>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 mb-4 text-sm text-green-600 border border-green-200 rounded-lg bg-green-50">
                {success}
              </div>
            )}

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Email Address</label>
                  <input 
                    type="email" 
                    value={forgotEmail} 
                    onChange={e => setForgotEmail(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" 
                    placeholder="your@email.com" 
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowForgotModal(false); setError(null); setSuccess(null); }}
                    className="flex-1 py-2 font-bold text-slate-600 border border-slate-300 rounded-md dark:text-slate-400 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" 
                    placeholder="••••••••" 
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-50">Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700" 
                    placeholder="••••••••" 
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { 
                      setShowForgotModal(false)
                      setShowResetForm(false)
                      setResetToken('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setError(null)
                      setSuccess(null)
                    }}
                    className="flex-1 py-2 font-bold text-slate-600 border border-slate-300 rounded-md dark:text-slate-400 dark:border-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}