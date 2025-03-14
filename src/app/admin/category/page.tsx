'use client'
import * as React from 'react'
import FormCategory from './_components/FormCategory'
import TableCategory from './_components/TableCategory'
import FormExcel from '@/components/FormExcel'
import { uploadExcel } from '@/apiRequest/categoryApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GET_LIST_CATEGORIES } from '@/store/action-saga/common'

export interface ICategoryProps {}

export default function Category(props: ICategoryProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.category.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_categories'
          linkDownload='https://drive.google.com/uc?id=1TOrt59Zxlu6cOzlUVVSPA2yEHts8rKsp&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_CATEGORIES,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormCategory />
      </div>
      <div className='w-2/3'>
        <TableCategory />
      </div>
    </div>
  )
}
