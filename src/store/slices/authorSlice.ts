import { CategoryType } from '@/lib/types/categoryType'
import { pageInfo } from './../../lib/types/commonType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthorType } from '@/lib/types/AuthorType'

interface AuthorState {
  author: AuthorType | null
  listAuthors: AuthorType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: AuthorState = {
  author: null,
  listAuthors: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    setListAuthors: (state, action: PayloadAction<AuthorType[]>) => {
      state.listAuthors = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setAuthorSelected: (state, action: PayloadAction<AuthorType | null>) => {
      state.author = action.payload
    },
  },
})

export const { setListAuthors, setPageInfo, setLoading, setAuthorSelected } =
  authorSlice.actions

export default authorSlice.reducer
