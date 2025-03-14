import { pageInfo } from './../../lib/types/commonType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublisherType } from '@/lib/types/publisherType'

interface PublisherState {
  publisher: PublisherType | null
  listPublishers: PublisherType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: PublisherState = {
  publisher: null,
  listPublishers: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const publisherSlice = createSlice({
  name: 'publisher',
  initialState,
  reducers: {
    setListPublishers: (state, action: PayloadAction<PublisherType[]>) => {
      state.listPublishers = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setPublisherSelected: (
      state,
      action: PayloadAction<PublisherType | null>
    ) => {
      state.publisher = action.payload
    },
  },
})

export const {
  setListPublishers,
  setPageInfo,
  setLoading,
  setPublisherSelected,
} = publisherSlice.actions

export default publisherSlice.reducer
