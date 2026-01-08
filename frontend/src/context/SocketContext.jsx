/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

export function SocketProvider({ children }) {
  // ✅ ALL HOOKS FIRST - Never conditional
  const [socket, setSocket] = useState(null);
  const { user, loading } = useAuth();
  const socketRef = useRef(null);

  // ✅ Socket logic ALWAYS runs (safe guards inside)
  useEffect(() => {
    // Guard: Skip if still loading
    if (loading) return;

    // Disconnect existing
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Guard: No user = no socket
    if (!user?.id) {
      setSocket(null);
      return;
    }

    // Extract token from cookie
    const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    const newSocket = io(API_BASE, {
      auth: { token, userId: user.id },
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => console.log('✅ Socket:', user.id));
    newSocket.on('connect_error', (err) => console.error('❌ Socket:', err.message));

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, loading]);  // ✅ Dependencies include loading

  // ✅ Render logic AFTER all hooks
  if (loading) return null;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
