import { CartUserType, UserType } from '@/lib/types/userType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface userState {
  user: UserType
}

const initialState: userState = {
  user: {} as UserType,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfoUser: (state, action: PayloadAction<userState>) => {
      state.user = action.payload.user
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        cartId: string
        quantity: number
        method: string
      }>
    ) => {
      const cartUser = state.user.cartUsers?.find(
        (cart) => cart.id === action.payload.cartId
      )
      if (cartUser) {
        let quantity =
          action.payload.method === 'add'
            ? cartUser.quantity + 1
            : cartUser.quantity - 1
        cartUser.quantity = quantity
      }
    },
    deleteCart: (state, action: PayloadAction<string>) => {
      state.user.cartUsers = state.user.cartUsers?.filter(
        (cart) => cart.id !== action.payload
      )
    },
    addPublicationCart: (state, action: PayloadAction<CartUserType>) => {
      const cartUser = state.user.cartUsers?.find(
        (cart) => cart.id === action.payload.id
      )
      if (cartUser) {
        cartUser.quantity = cartUser.quantity + 1
        return
      }
      state.user.cartUsers?.push(action.payload)
    },
  },
})

export const { setInfoUser, updateQuantity, deleteCart, addPublicationCart } =
  userSlice.actions

export default userSlice.reducer
