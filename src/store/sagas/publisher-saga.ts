import { getListPublishers } from '@/apiRequest/publisherApi'
import { handleErrorCode } from '@/lib/utils/common'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_PUBLISHERS } from '../action-saga/common'
import {
  setListPublishers,
  setLoading,
  setPageInfo,
} from '../slices/publisherSlice'

interface FetchListPublishers {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListPublishers(
  action: PayloadAction<FetchListPublishers['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListPublishers, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListPublishers(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* publisherSaga() {
  yield takeLatest(GET_LIST_PUBLISHERS, fetchListPublishers)
}
