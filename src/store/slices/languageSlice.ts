import { LanguageType } from '@/lib/types/languageType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pageInfo } from './../../lib/types/commonType'

interface LanguageState {
  language: LanguageType | null
  listLanguages: LanguageType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: LanguageState = {
  language: null,
  listLanguages: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setListLanguages: (state, action: PayloadAction<LanguageType[]>) => {
      state.listLanguages = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setLanguageSelected: (
      state,
      action: PayloadAction<LanguageType | null>
    ) => {
      state.language = action.payload
    },
  },
})

export const {
  setListLanguages,
  setPageInfo,
  setLoading,
  setLanguageSelected,
} = languageSlice.actions

export default languageSlice.reducer
