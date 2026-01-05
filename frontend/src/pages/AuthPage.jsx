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

export default function AuthPage() {
  const [mode, setMode] = useState('login') 
  const { register, login, loading } = useAuth() // Added loading from context
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

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)
    
    const payload = { name, email, password, role }
    if (role === 'student') {
      payload.yearOfStudy = yearOfStudy
      payload.course = branch // Backend might expect 'course' instead of 'branch'
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
      // res.ok is true, AuthContext has updated the user state
      nav('/profile')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    
    // We send role just in case your backend requires it for filtering
    const res = await login({ email, password, role })
    
    if (!res.ok) {
      setError(res.error)
    } else {
      // Redirect to profile. The cookie is already set in the browser.
      nav('/profile')
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
      </div>
    </section>
  )
}