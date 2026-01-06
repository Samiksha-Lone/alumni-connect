import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import AlumniPage from './pages/Alumni';
import Opportunities from './pages/Opportunities';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import ChatPage from './pages/ChatPage';

import './styles/common.css';

// ---- Axios global config ----
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'https://alumni-connect-backend-hrsc.onrender.com';

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow w-full max-w-6xl px-4 py-8 mx-auto">
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

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
