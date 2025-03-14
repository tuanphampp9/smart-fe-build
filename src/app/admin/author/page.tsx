'use client'
import * as React from 'react'
import FormAuthor from './_components/FormAuthor'
import TableAuthor from './_components/TableAuthor'
import FormExcel from '@/components/FormExcel'
import { uploadExcel } from '@/apiRequest/authorApi'
import { useDispatch, useSelector } from 'react-redux'
import { GET_LIST_AUTHORS } from '@/store/action-saga/common'
import { RootState } from '@/store/store'

export interface IAuthorProps {}

export default function Author(props: IAuthorProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.author.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_authors'
          linkDownload='https://drive.google.com/uc?id=1ye6YPtAkiPdvEpTOP6nExi93f0-1z0KX&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_AUTHORS,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormAuthor />
      </div>
      <div className='w-2/3'>
        <TableAuthor />
      </div>
    </div>
  )
}
