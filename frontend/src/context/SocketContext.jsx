/* eslint-disable react-refresh/only-export-components */
// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    if (!token) return;

    const s = io(import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com', {
      auth: { token },
      withCredentials: true,
    });

    s.on('connect', () => console.log('✅ socket connected'));
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
