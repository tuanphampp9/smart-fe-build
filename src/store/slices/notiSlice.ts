import { createSlice } from '@reduxjs/toolkit'

interface NotiState {
  notification: {
    id: number
    title: string
    type: string
  }[]
  stompClient: any
}

const initialState: NotiState = {
  notification: [],
  stompClient: null,
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
  },
})

export const {
  addNotification,
  removeNotification,
  setStompClient,
  removeStompClient,
} = notiSlice.actions

export default notiSlice.reducer
