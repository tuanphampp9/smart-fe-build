import { CategoryType } from '@/lib/types/categoryType'
import { pageInfo } from './../../lib/types/commonType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CategoryState {
  category: CategoryType | null
  listCategories: CategoryType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: CategoryState = {
  category: null,
  listCategories: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setListCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.listCategories = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCategorySelected: (
      state,
      action: PayloadAction<CategoryType | null>
    ) => {
      state.category = action.payload
    },
  },
})

export const {
  setListCategories,
  setPageInfo,
  setLoading,
  setCategorySelected,
} = categorySlice.actions

export default categorySlice.reducer
