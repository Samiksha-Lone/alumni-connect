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
import './styles/common.css';
import Footer from './components/Footer';

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
            <div className="min-h-screen">
              <NavBar />
              <main className="max-w-6xl px-4 py-8 mx-auto">
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

              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
