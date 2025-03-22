'use client'
import { RootState } from '@/store/store'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

export interface INotificationPopupProps {}

export default function NotificationPopup(props: INotificationPopupProps) {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notification
  )
  const router = useRouter()
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  React.useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token)
      if (decoded.user.roleName === 'ADMIN') return
    }
    if (notifications.length > 0) {
      const { title, id, type } = notifications[notifications.length - 1]
      toast.info(
        <div
          onClick={() => router.push(`/${type}/${id}`)}
          style={{ cursor: 'pointer' }}
        >
          <strong>{title}</strong>
          <p style={{ fontSize: '12px', color: '#888' }}>
            Nhấn để xem chi tiết
          </p>
        </div>,
        {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
    }
  }, [notifications, router])

  return (
    <ToastContainer
      position='top-right'
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
    />
  )
}
