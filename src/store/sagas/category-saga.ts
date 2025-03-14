import { handleErrorCode } from '@/lib/utils/common'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_CATEGORIES } from '../action-saga/common'
import {
  setListCategories,
  setLoading,
  setPageInfo,
} from '../slices/categorySlice'
import { getListCategories } from './../../apiRequest/categoryApi'

interface FetchListCategories {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListCategories(
  action: PayloadAction<FetchListCategories['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListCategories, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListCategories(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* categorySaga() {
  yield takeLatest(GET_LIST_CATEGORIES, fetchListCategories)
}
