/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    const el = document.documentElement
    if (theme === 'dark') el.classList.add('theme-dark')
    else el.classList.remove('theme-dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      console.warn('Failed to save theme to localStorage');
    }
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

