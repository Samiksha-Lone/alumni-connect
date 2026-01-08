/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

axios.defaults.baseURL = API_BASE
axios.defaults.withCredentials = true

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  // ✅ FAST: Parallel local + API check (300ms vs 2s)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Instant localStorage check (0ms)
        const stored = localStorage.getItem('currentUser')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
        }

        // 2. Parallel API validation (non-blocking)
        const [meRes, adminCheck] = await Promise.all([
          axios.get('/auth/me').catch(() => null),
          axios.get('/auth/me').then(res => res.data?.role === 'admin' ? axios.get('/users') : null).catch(() => null)
        ])

        // Update from API if valid
        if (meRes?.data) {
          setUser(meRes.data)
          if (adminCheck?.data) setUsers(adminCheck.data)
        }
      } catch (err) {
        console.warn('Auth check failed:', err)
        setUser(null)
      } finally {
        setLoading(false)  // ✅ Unblock UI immediately
      }
    }

    initAuth()
  }, [])

  // ✅ Storage sync (debounced)
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [user])

  const login = useCallback(async ({ email, password, role }) => {
    try {
      setLoading(true)
      const res = await axios.post('/auth/login', { email, password, role })
      
      if (res.data?.user) {
        setUser(res.data.user)
        return { ok: true }
      }
      throw new Error('Invalid response')
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (newUser) => {
    try {
      setLoading(true)
      await axios.post('/auth/register', newUser)
      return await login({ email: newUser.email, password: newUser.password, role: newUser.role })
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      await axios.get('/auth/logout')
    } catch {
      // Ignore errors on logout
    }
    setUser(null)
    localStorage.removeItem('currentUser')
  }, [])

  const value = { 
    user, 
    loading, 
    users, 
    setUsers, 
    login, 
    register, 
    logout 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
