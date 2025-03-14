import { handleErrorCode } from '@/lib/utils/common'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_LANGUAGES } from '../action-saga/common'
import {
  setListLanguages,
  setLoading,
  setPageInfo,
} from '../slices/languageSlice'
import { getListLanguages } from '@/apiRequest/languageApi'

interface FetchListLanguages {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListLanguages(
  action: PayloadAction<FetchListLanguages['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListLanguages, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListLanguages(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* languageSage() {
  yield takeLatest(GET_LIST_LANGUAGES, fetchListLanguages)
}
