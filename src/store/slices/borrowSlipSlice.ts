import { createSlice } from '@reduxjs/toolkit'

interface BorrowSlip {
  cardId: string
  registrationIds: string[]
}

const initialState: BorrowSlip = {
  cardId: '',
  registrationIds: [],
}

const borrowSlipSlice = createSlice({
  name: 'borrowSlip',
  initialState,
  reducers: {
    setCardId: (state, action) => {
      state.cardId = action.payload
    },
    setRegistrationIds: (state, action) => {
      state.registrationIds.push(action.payload)
    },
    setAllRegistrationIds: (state, action) => {
      state.registrationIds = action.payload
    },
    removeRegistrationIds: (state, action) => {
      state.registrationIds = state.registrationIds.filter(
        (id) => id !== action.payload
      )
    },
    removeAllRegistrationIds: (state) => {
      state.registrationIds = []
    },
  },
})

export const {
  setCardId,
  setRegistrationIds,
  setAllRegistrationIds,
  removeRegistrationIds,
  removeAllRegistrationIds,
} = borrowSlipSlice.actions

export default borrowSlipSlice.reducer
