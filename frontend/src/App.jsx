import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Events from './pages/Events'
import AlumniPage from './pages/Alumni'
import Opportunities from './pages/Opportunities'
import AuthPage from './pages/AuthPage'
import Profile from './pages/Profile'
import './App.css'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            <NavBar />
            <main style={{ flex: 1, width: '100%' }}>
              <Routes>
                {/* <Route path="/" element={<Navigate to="/about" replace />} /> */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/alumni" element={<AlumniPage />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/about" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
