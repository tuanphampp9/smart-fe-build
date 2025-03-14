import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_TOPICS } from '../action-saga/common'
import { getListTopics } from '@/apiRequest/topicApi'
import { setListTopics, setLoading, setPageInfo } from '../slices/topicSlice'
import { handleErrorCode } from '@/lib/utils/common'

interface FetchListTopics {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListTopics(
  action: PayloadAction<FetchListTopics['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListTopics, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListTopics(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* topicSaga() {
  yield takeLatest(GET_LIST_TOPICS, fetchListTopics)
}
