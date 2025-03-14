'use client'
import * as React from 'react'
import FormTopic from './_components/FormTopic'
import TableTopic from './_components/TableTopic'
import FormExcel from '../../../components/FormExcel'
import { uploadExcel } from '@/apiRequest/topicApi'
import { useDispatch, useSelector } from 'react-redux'
import { GET_LIST_TOPICS } from '@/store/action-saga/common'
import { RootState } from '@/store/store'
export interface ITopicProps {}

export default function Topic(props: ITopicProps) {
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.topic.pageInfo)
  return (
    <div className='flex gap-4'>
      <div className='w-1/3'>
        <FormExcel
          fileName='publication_topics'
          linkDownload='https://drive.google.com/uc?id=1NNxJtDAUeqgbye5iAHstLKRAF5tnYsRI&export=download'
          uploadExcelApi={uploadExcel}
          fetchList={() => {
            dispatch({
              type: GET_LIST_TOPICS,
              payload: {
                page: 1,
                itemPerPage: pageInfo.itemPerPage,
                filter: '',
              },
            })
          }}
        />
        <FormTopic />
      </div>
      <div className='w-2/3'>
        <TableTopic />
      </div>
    </div>
  )
}
