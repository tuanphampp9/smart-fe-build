'use client'
import { getPost, getPostForClient } from '@/apiRequest/postApi'
import { postType } from '@/lib/types/postType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, CircularProgress } from '@mui/material'
import * as React from 'react'
import 'react-quill-new/dist/quill.snow.css'
export interface IRenderDetailProps {
  postId: string
}

export default function RenderDetail(props: IRenderDetailProps) {
  const { postId } = props
  const [postDetail, setPostDetail] = React.useState<postType>({} as postType)
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await getPostForClient(postId)
        setPostDetail(res.data)
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (postId) fetchPostDetail()
  }, [])
  return (
    <div>
      {loading ? (
        <div className='flex justify-center items-center'>
          <Box className='flex justify-center items-center w-[310px] h-[200px]'>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <div className='ql-snow container mx-auto'>
          <h4 className='font-semibold'>
            Thời gian đăng: {formatDateTime(postDetail.createdAt)}
          </h4>
          <div
            className='ql-editor'
            dangerouslySetInnerHTML={{
              __html: postDetail?.content || '',
            }}
          ></div>
          <h4 className='font-semibold'>Lượt xem: {postDetail.viewCount}</h4>
        </div>
      )}
    </div>
  )
}
