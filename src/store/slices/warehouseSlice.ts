import { WarehouseType } from '@/lib/types/warehouseType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pageInfo } from './../../lib/types/commonType'

interface WarehouseState {
  warehouse: WarehouseType | null
  listWarehouses: WarehouseType[]
  pageInfo: pageInfo
  loading: boolean
}

const initialState: WarehouseState = {
  warehouse: null,
  listWarehouses: [],
  pageInfo: {
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  },
  loading: false,
}

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    setListWarehouses: (state, action: PayloadAction<WarehouseType[]>) => {
      state.listWarehouses = action.payload
    },
    setPageInfo: (state, action: PayloadAction<pageInfo>) => {
      state.pageInfo = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setWarehouseSelected: (
      state,
      action: PayloadAction<WarehouseType | null>
    ) => {
      state.warehouse = action.payload
    },
  },
})

export const {
  setListWarehouses,
  setPageInfo,
  setLoading,
  setWarehouseSelected,
} = warehouseSlice.actions

export default warehouseSlice.reducer
