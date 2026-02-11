/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)
export const useSocket = () => useContext(SocketContext)

// Socket should always connect to backend server, even in dev
const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3000' : import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com'

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const { user, loading } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    // Cleanup existing socket
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    // No user or still loading = no socket
    if (loading || !user?._id) {  // ✅ user._id not user.id
      setSocket(null)
      return
    }

    // ✅ NO MANUAL TOKEN - Backend reads cookie automatically
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,  // ✅ Backend reads auth cookie
      transports: ['websocket', 'polling'],
      // auth: { userId: user._id }  // Optional - backend verifies cookie
    })

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id, 'User:', user._id)
    })
    
    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket error:', err.message)
    })
    
    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected')
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    // Cleanup on unmount or user change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user?._id, loading])  // ✅ user._id (Mongoose _id)

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
