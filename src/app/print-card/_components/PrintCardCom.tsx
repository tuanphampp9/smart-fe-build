'use client'
import { getReader } from '@/apiRequest/userApi'
import Card from '@/components/Card'
import { UserType } from '@/lib/types/userType'
import { handleErrorCode } from '@/lib/utils/common'
import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
export interface IPrintCardComProps {}

export default function PrintCardCom(props: IPrintCardComProps) {
  const [reader, setReader] = React.useState<UserType>({} as UserType)
  const searchParam = useSearchParams()
  const params = new URLSearchParams(searchParam.toString())
  const readerId = params.get('readerId') ?? ''
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    const fetchReader = async () => {
      try {
        setLoading(true)
        const res = await getReader(readerId)
        console.log(res)
        setReader(res.data)
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoading(false)
      }
    }
    if (readerId) {
      fetchReader()
    }
  }, [readerId])

  return (
    <div className='flex h-screen w-screen justify-center items-center'>
      {loading ? (
        <Box className='flex justify-center items-center w-[310px] h-[200px]'>
          <CircularProgress />
        </Box>
      ) : (
        <Card reader={reader} />
      )}
    </div>
  )
}
