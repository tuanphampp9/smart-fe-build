import { pageInfo } from './../../lib/types/commonType'
import { TopicType } from '@/lib/types/topicType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface topicState {
  topic: TopicType | null
  listTopics: TopicType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: topicState = {
  topic: null,
  listTopics: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setListTopics: (state, action: PayloadAction<TopicType[]>) => {
      state.listTopics = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setTopicSelected: (state, action: PayloadAction<TopicType | null>) => {
      state.topic = action.payload
    },
  },
})

export const { setListTopics, setPageInfo, setLoading, setTopicSelected } =
  topicSlice.actions

export default topicSlice.reducer
