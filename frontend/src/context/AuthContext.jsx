// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useContext, useEffect, useState } from 'react'
// import axios from 'axios'

// const AuthContext = createContext(null)

// function readStorage(key, fallback) {
//   try {
//     const raw = localStorage.getItem(key)
//     return raw ? JSON.parse(raw) : fallback
//   } catch {
//     return fallback
//   }
// }

// function writeStorage(key, value) {
//   localStorage.setItem(key, JSON.stringify(value))
// }

// function decodeJwt(token) {
//   try {
//     const payload = token.split('.')[1]
//     return JSON.parse(atob(payload))
//   } catch {
//     return null
//   }
// }

// const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => readStorage('currentUser', null))
//   const [token, setToken] = useState(() => readStorage('authToken', null))
//   const [users, setUsers] = useState(() => readStorage('users', []))
//   const [loading, setLoading] = useState(false)

//   axios.defaults.baseURL = API_BASE
//   axios.defaults.withCredentials = false

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//     } else {
//       delete axios.defaults.headers.common['Authorization']
//     }
//   }, [token])

//   useEffect(() => writeStorage('currentUser', user), [user])
//   useEffect(() => writeStorage('authToken', token), [token])
//   useEffect(() => writeStorage('users', users), [users])

//   useEffect(() => {
//     try {
//       if (token) {
//         const payload = decodeJwt(token)
//         if (!payload) {
//           setToken(null)
//           setUser(null)
//         } else if (payload.exp && Date.now() / 1000 > payload.exp) {
//           setToken(null)
//           setUser(null)
//         } else {
//           setUser((u) => u || { id: payload.id, role: payload.role, email: payload.email, name: payload.name || '' })
//         }
//       }
//     } catch {
//       setToken(null)
//       setUser(null)
//     }
//   }, [])

//   useEffect(() => {
//     let mounted = true
//     async function validate() {
//       if (!token) return
//       try {
//         const res = await axios.get('/auth/me')
//         if (mounted && res && res.data) {
//           setUser(res.data)
//           if (res.data.role === 'admin') {
//             try {
//               const usersRes = await axios.get('/users')
//               if (usersRes && usersRes.data) setUsers(usersRes.data)
//             } catch (err) {
//               console.error('Failed to fetch users for admin dashboard', err)
//             }
//           }
//         }
//       } catch {
//         setToken(null)
//         setUser(null)
//       }
//     }
//     validate()
//     return () => { mounted = false }
//   }, [token])

//   async function register(newUser) {
//     const body = {
//       role: newUser.role,
//       name: newUser.name,
//       email: newUser.email,
//       password: newUser.password
//     }
//     if (newUser.role === 'alumni') {
//       body.courseStudied = newUser.branch || newUser.courseStudied
//       body.company = newUser.company
//       body.graduationYear = newUser.yearOfPassing || newUser.graduationYear
//     }
//     if (newUser.role === 'student') {
//       body.yearOfStudying = newUser.yearOfStudy
//       body.course = newUser.branch
//     }

//     try {
//       setLoading(true)
//       await axios.post('/auth/register', body)
//       const loginRes = await axios.post('/auth/login', { email: newUser.email, password: newUser.password, role: newUser.role })
//       if (loginRes && loginRes.data && loginRes.data.token) {
//         const t = loginRes.data.token
//         setToken(t)
//         const payload = decodeJwt(t)
//         setUser({ id: payload?.id, role: payload?.role, email: payload?.email, name: newUser.name })
//         return { ok: true }
//       }
//       return { ok: false, error: 'Registration succeeded but login failed' }
//     } catch (err) {
//       const message = err?.response?.data?.message || err?.response?.data || err.message || 'Registration error'
//       return { ok: false, error: message }
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function login({ email, password, role }) {
//     try {
//       setLoading(true)
//       const res = await axios.post('/auth/login', { email, password, role })
//       if (res && res.data && res.data.token) {
//         const t = res.data.token
//         setToken(t)
//         const payload = decodeJwt(t)
//         setUser({ id: payload?.id, role: payload?.role, email: payload?.email, name: payload?.name || '' })
//         return { ok: true, user: { id: payload?.id, role: payload?.role, email: payload?.email } }
//       }
//       return { ok: false, error: 'Login failed' }
//     } catch (err) {
//       const message = err?.response?.data?.message || err?.response?.data || err.message || 'Login error'
//       return { ok: false, error: message }
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function logout() {
//     try {
//       await axios.get('/auth/logout')
//     } catch {
//       console.warn('Logout request failed, clearing local session anyway');
//     }
//     setToken(null)
//     setUser(null)
//   }

//   const value = { user, token, users, setUsers, loading, register, login, logout, setUser, setToken }
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }


/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Helpers for storage
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function writeStorage(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value))
  else localStorage.removeItem(key)
}

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

// Global Axios Config
axios.defaults.baseURL = API_BASE
axios.defaults.withCredentials = true; // MANDATORY: This allows the cookie to work

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('currentUser', null))
  const [loading, setLoading] = useState(true) // Start true to check auth on load
  const [users, setUsers] = useState([])

  // 1. Sync User to Storage
  useEffect(() => {
    writeStorage('currentUser', user)
  }, [user])

  // 2. Validate Session on Mount
  // This checks if the user has a valid cookie on the backend
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get('/auth/me')
        if (res.data) {
          setUser(res.data)
          // If admin, fetch users
          if (res.data.role === 'admin') {
            const uRes = await axios.get('/users')
            setUsers(uRes.data)
          }
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  async function login({ email, password, role }) {
    try {
      setLoading(true)
      const res = await axios.post('/auth/login', { email, password, role })
      
      // The backend sets the cookie automatically because withCredentials is true
      if (res.data) {
        setUser(res.data.user || res.data) 
        return { ok: true }
      }
      return { ok: false, error: 'Invalid response from server' }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  async function register(newUser) {
    try {
      setLoading(true)
      // Format payload based on role
      const payload = { ...newUser }
      await axios.post('/auth/register', payload)
      // Auto-login after registration
      return await login({ email: newUser.email, password: newUser.password, role: newUser.role })
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await axios.get('/auth/logout')
    } catch (err) {
      console.warn('Backend logout failed', err)
    } finally {
      setUser(null)
      localStorage.removeItem('currentUser')
      // Redirect or clean up
    }
  }

  const value = { user, loading, login, register, logout, setUser, users }
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
