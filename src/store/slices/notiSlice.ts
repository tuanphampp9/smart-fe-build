import { NotificationType } from '@/lib/types/notificationType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotiState {
  notification: {
    id: number
    title: string
    type: string
  }[]
  stompClient: any
  listNotifications: NotificationType[]
  numberUnread: number
}

const initialState: NotiState = {
  notification: [],
  stompClient: null,
  listNotifications: [],
  numberUnread: 0,
}

const notiSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notification.push(action.payload)
    },
    removeNotification: (state, action) => {
      state.notification = state.notification.filter(
        (news) => news.id !== action.payload
      )
    },
    setStompClient: (state, action) => {
      state.stompClient = action.payload
    },
    removeStompClient: (state) => {
      state.stompClient = null
    },
    setListNotifications: (
      state,
      action: PayloadAction<NotificationType[]>
    ) => {
      state.listNotifications = action.payload
    },
    setNumberUnread: (state, action: PayloadAction<number>) => {
      state.numberUnread = action.payload
    },
    upperNumberUnread: (state) => {
      state.numberUnread += 1
    },
    lowerNumberUnread: (state) => {
      state.numberUnread -= 1
    },
  },
})

export const {
  addNotification,
  removeNotification,
  setStompClient,
  removeStompClient,
  setListNotifications,
  setNumberUnread,
  upperNumberUnread,
  lowerNumberUnread,
} = notiSlice.actions

export default notiSlice.reducer
