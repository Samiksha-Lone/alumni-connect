/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'
import { getSocketBase } from '../utils/api'

const SocketContext = createContext(null)
export const useSocket = () => useContext(SocketContext)

const SOCKET_URL = getSocketBase()

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const { user, loading } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    if (loading || !user?._id) {
      setSocket(null)
      return
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
    })
    
    newSocket.on('connect_error', () => {
    })
    
    newSocket.on('disconnect', () => {
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user?._id, loading])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

