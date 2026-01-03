import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import NavBar from './components/NavBar';
// Footer will be rendered inline to match the new layout shell
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import AlumniPage from './pages/Alumni';
import Opportunities from './pages/Opportunities';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import ChatPage from './pages/ChatPage';
import './index.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50">
              <NavBar />
              <main className="max-w-6xl mx-auto px-4 py-8">
                <Routes>
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

                  <Route
                    path="/chat"
                    element={
                      <PrivateRoute>
                        <ChatPage />
                      </PrivateRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/about" replace />} />
                </Routes>
              </main>

              <footer className="border-t border-slate-200 dark:border-slate-800 mt-8">
                <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                  © 2025 Alumni Connect. All rights reserved.
                </div>
              </footer>
            </div>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
