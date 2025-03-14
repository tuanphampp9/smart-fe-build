'use client'
import * as React from 'react'
import FormWarehouse from './_components/FormWarehouse'
import TableWarehouse from './_components/TableWarehouse'
import FormExcel from '@/components/FormExcel'
import { useDispatch, useSelector } from 'react-redux'
import { GET_LIST_WAREHOUSES } from '@/store/action-saga/common'
import { RootState } from '@/store/store'
import { uploadExcel } from '@/apiRequest/warehouseApi'

export interface IWarehouseProps {}

export default function Warehouse(props: IWarehouseProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.warehouse.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_languages'
          linkDownload='https://drive.google.com/uc?id=1oMni4bxlff4cQNf_JtHIDaaOX0iOLg1H&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_WAREHOUSES,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormWarehouse />
      </div>
      <div className='w-2/3'>
        <TableWarehouse />
      </div>
    </div>
  )
}
