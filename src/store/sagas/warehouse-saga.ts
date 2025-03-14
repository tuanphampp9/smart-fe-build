import { getListWarehouses } from '@/apiRequest/warehouseApi'
import { handleErrorCode } from '@/lib/utils/common'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_WAREHOUSES } from '../action-saga/common'
import {
  setListWarehouses,
  setLoading,
  setPageInfo,
} from '../slices/warehouseSlice'

interface FetchListWarehouses {
  type: string
  payload: {
    page: number
    itemPerPage: number
    filter: string
  }
}

function* fetchListWarehouses(
  action: PayloadAction<FetchListWarehouses['payload']>
): Generator<any, any, any> {
  try {
    yield put(setLoading(true))
    const { page, itemPerPage, filter } = action.payload
    const response = yield call(getListWarehouses, page, itemPerPage, filter)
    console.log(response)
    yield put(
      setPageInfo({
        page: response.data.meta.page,
        itemPerPage: response.data.meta.pageSize,
        totalItem: response.data.meta.total,
        totalPage: response.data.meta.pages,
      })
    )
    yield put(setListWarehouses(response.data.result))
  } catch (error: any) {
    handleErrorCode(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default function* warehouseSaga() {
  yield takeLatest(GET_LIST_WAREHOUSES, fetchListWarehouses)
}
