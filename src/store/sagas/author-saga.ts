import { handleErrorCode } from '@/lib/utils/common'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_AUTHORS } from '../action-saga/common'
import { setListAuthors, setLoading, setPageInfo } from '../slices/authorSlice'
import { getListAuthors } from '@/apiRequest/authorApi'

interface FetchListAuthors {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListAuthors(
  action: PayloadAction<FetchListAuthors['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListAuthors, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListAuthors(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* authorSaga() {
  yield takeLatest(GET_LIST_AUTHORS, fetchListAuthors)
}
