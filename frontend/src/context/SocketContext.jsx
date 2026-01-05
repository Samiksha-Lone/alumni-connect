// /* eslint-disable react-refresh/only-export-components */
// // src/context/SocketContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const tokenCookie = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('token='));
//     const token = tokenCookie ? tokenCookie.split('=')[1] : null;
//     if (!token) return;

//     const s = io(import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com', {
//       auth: { token },
//       withCredentials: true,
//     });

//     s.on('connect', () => console.log('✅ socket connected'));
//     setSocket(s);

//     return () => {
//       s.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import your auth hook

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth(); // Listen for user login/logout

  useEffect(() => {
    // Only attempt connection if a user is actually logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // 1. Extract token using the robust regex we discussed for the backend
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    const token = match ? match[1] : null;

    // 2. Initialize connection
    const s = io(import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com', {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'] // Ensures compatibility
    });

    s.on('connect', () => {
      console.log('✅ Socket connected for user:', user.id);
    });

    s.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    setSocket(s);

    // 3. Cleanup: Disconnect when user logs out or component unmounts
    return () => {
      if (s) s.disconnect();
    };
  }, [user]); // Re-run this effect whenever 'user' state changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};