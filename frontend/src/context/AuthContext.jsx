import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'
import { setAuthToken, clearAuthToken } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers()
      const allUsers = Array.isArray(response) ? response : response?.data || []
      setUsers(allUsers)
    } catch (err) {
      // ignore fetch errors
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

        const storedToken = localStorage.getItem('authToken')
        if (storedToken) {
          setAuthToken(storedToken)
        }

        const res = await authService.me().catch(() => null)
        if (res) {
          const normalized = { ...res, _id: res._id || res.id }
          setUser(normalized)

          if (normalized.role === 'admin') {
            const usersRes = await userService.getAllUsers().catch(() => null)
            if (usersRes) {
              setUsers(Array.isArray(usersRes) ? usersRes : usersRes?.data || [])
            }
          }
        } else {
          clearAuthToken()
          localStorage.removeItem('authToken')
          localStorage.removeItem('currentUser')
          setUser(null)
        }
      } catch (err) {
        // ignore auth initialization errors
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

  const login = useCallback(async ({ email, password }) => {
    try {
      setLoading(true)
      const res = await authService.login({ email, password })
      if (res?.user) {
        const normalized = { ...res.user, _id: res.user._id || res.user.id }
        if (res.token) {
          setAuthToken(res.token)
          localStorage.setItem('authToken', res.token)
        }
        setUser(normalized)
        return { ok: true }
      }
      throw new Error('Invalid response')
    } catch (err) {
      const message = err?.message || 'Login failed'
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (newUser) => {
    try {
      setLoading(true)
      await authService.register(newUser)
      return await login({ email: newUser.email, password: newUser.password })
    } catch (err) {
      const message = err?.message || 'Registration failed'
      return { ok: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore logout errors
    }
    clearAuthToken()
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
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
    logout,
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

