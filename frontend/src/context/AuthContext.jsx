import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com') + '/api'

axios.defaults.baseURL = API_BASE
axios.defaults.withCredentials = true

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axios.get('/users')
      setUsers(res.data || [])
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      //
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('currentUser')
        if (stored) {
          try {
            setUser(JSON.parse(stored))
          } catch {
            localStorage.removeItem('currentUser')
          }
        }

        const res = await axios.get('/auth/me').catch(() => null)

        if (res?.data) {
          const normalized = { ...res.data, _id: res.data._id || res.data.id };
          setUser(normalized)
          
          if (normalized.role === 'admin') {
            const usersRes = await axios.get('/users').catch(() => null)
            if (usersRes?.data) setUsers(usersRes.data)
          }
        } else {
          setUser(null)
          localStorage.removeItem('currentUser')
        }
      } catch (err) {
        setUser(null)
        localStorage.removeItem('currentUser')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [user])

  const login = useCallback(async ({ email, password}) => {
    try {
      setLoading(true)
      const res = await axios.post('/auth/login', { email, password })
      
      if (res.data?.user) {
        const normalized = { ...res.data.user, _id: res.data.user._id || res.data.user.id };
        setUser(normalized)
        return { ok: true }
      }
      throw new Error('Invalid response')
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      return { ok: false, error: message };
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
      const message = err.response?.data?.message || 'Registration failed';
      return { ok: false, error: message };
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      await axios.get('/auth/logout')
    } catch {
      //
    }
    setUser(null)
    localStorage.removeItem('currentUser')
  }, [])

  const value = { 
    user, 
    setUser,
    loading, 
    users, 
    setUsers, 
    fetchAllUsers,
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

