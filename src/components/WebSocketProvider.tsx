'use client'

import { useEffect, createContext, useRef, useContext, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { useDispatch } from 'react-redux'
import { addNotification, setStompClient } from '@/store/slices/notiSlice'
import { jwtDecode } from 'jwt-decode'
const WebSocketContext = createContext<Client | null>(null)
export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const stompClientRef = useRef<Client | null>(null)
  const dispatch = useDispatch()
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (!token) return
    // Cấu hình STOMP client
    const stompClient = new Client({
      brokerURL: 'http://localhost:8080/ws',
      reconnectDelay: 5000, // Tự động reconnect sau 5s nếu mất kết nối
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Truyền token vào header
      },
      onConnect: () => {
        console.log('Connected to WebSocket')
        console.log('su', stompClient.connected)
        setStompClient(stompClient)
        stompClient.subscribe('/topic/notifications', (message) => {
          console.log('Received message:', message.body)
          const data = JSON.parse(message.body)
          dispatch(addNotification(data)) // Lưu thông báo vào Redux
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      },
    })

    stompClient.activate() // Kết nối WebSocket
    console.log('Connecting to WebSocket...', stompClient)
    stompClientRef.current = stompClient

    return () => {
      stompClient.deactivate() // Đóng kết nối WebSocket khi component unmount
      console.log('Disconnected from WebSocket')
    }
  }, [dispatch, token])

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)
