'use client'
import * as React from 'react'
import FormPublisher from './_components/FormPublisher'
import TablePublisher from './_components/TablePublisher'
import FormExcel from '@/components/FormExcel'
import { uploadExcel } from '@/apiRequest/publisherApi'
import { useDispatch, useSelector } from 'react-redux'
import { GET_LIST_PUBLISHERS } from '@/store/action-saga/common'
import { RootState } from '@/store/store'

export interface IPublisherProps {}

export default function Publisher(props: IPublisherProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.publisher.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_publishers'
          linkDownload='https://drive.google.com/uc?id=1BkF2tLeZLVsKxL6Hx6HbNgsBO3U3DSom&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_PUBLISHERS,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormPublisher />
      </div>
      <div className='w-2/3'>
        <TablePublisher />
      </div>
    </div>
  )
}
