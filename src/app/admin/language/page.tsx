'use client'
import * as React from 'react'
import FormLanguage from './_components/FormLanguage'
import TableLanguage from './_components/TableLanguage'
import FormExcel from '@/components/FormExcel'
import { uploadExcel } from '@/apiRequest/languageApi'
import { useDispatch, useSelector } from 'react-redux'
import { GET_LIST_LANGUAGES } from '@/store/action-saga/common'
import { RootState } from '@/store/store'

export interface ILanguageProps {}

export default function Language(props: ILanguageProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.language.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_languages'
          linkDownload='https://drive.google.com/uc?id=16u4v_yqcIZwwSwMr_KaVdOH_vD53jKWN&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_LANGUAGES,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormLanguage />
      </div>
      <div className='w-2/3'>
        <TableLanguage />
      </div>
    </div>
  )
}
