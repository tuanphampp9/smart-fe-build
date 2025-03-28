'use client'
import { Box, IconButton, Popper } from '@mui/material'
import * as React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  getListNotificationsByUser,
  numberUnreadNotifications,
  readNotification,
} from '@/apiRequest/notificationApi'
import { NotificationType } from '@/lib/types/notificationType'
import { handleErrorCode, handleTimeAgo } from '@/lib/utils/common'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  lowerNumberUnread,
  setListNotifications,
  setNumberUnread,
} from '@/store/slices/notiSlice'
import { useRouter } from 'next/navigation'

export interface IListNotificationsProps {}

export default function ListNotifications(props: IListNotificationsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { user } = useSelector((state: RootState) => state.user)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const router = useRouter()
  const dispatch = useDispatch()
  const { listNotifications, numberUnread } = useSelector(
    (state: RootState) => state.notifications
  )
  const fetchNumberUnread = async () => {
    try {
      const res = await numberUnreadNotifications()
      dispatch(setNumberUnread(res.data))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListNotificationsByUser = async (
    page: number,
    itemPerPage: number,
    filter: string
  ) => {
    try {
      const res = await getListNotificationsByUser(page, itemPerPage, filter)
      dispatch(setListNotifications(res.data.result))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  React.useEffect(() => {
    if (user.fullName) {
      fetchListNotificationsByUser(1, 10, '')
      fetchNumberUnread()
    }
  }, [user, open])
  const handleReadNotification = async (item: NotificationType) => {
    try {
      await readNotification(item.id)
      router.push(`/${item.type}/${item.idDetail}`)
      setAnchorEl(null)
      dispatch(lowerNumberUnread())
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <div>
      <div className='relative'>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <NotificationsIcon className='cursor-pointer text-blue-500' />
        </IconButton>
        {numberUnread > 0 && (
          <div className='absolute w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center right-0 bottom-5'>
            {numberUnread}
          </div>
        )}
      </div>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        className='w-[360px] bg-white px-4 py-3'
      >
        <h2 className='font-semibold'>Thông báo</h2>
        {listNotifications.length > 0 ? (
          listNotifications.map((item) => (
            <div
              key={item.id}
              className='w-full cursor-pointer hover:bg-gray-200 p-4 relative'
              onClick={() => handleReadNotification(item)}
            >
              <h3 className='font-semibold'>{item.message}</h3>
              <p className='text-gray-500'>{handleTimeAgo(item.createdAt)}</p>
              {!item.read && (
                <div className='absolute w-3 h-3 rounded-full bg-blue-600 right-5 bottom-5'></div>
              )}
            </div>
          ))
        ) : (
          <div>không có thông báo nào</div>
        )}
      </Popper>
    </div>
  )
}
