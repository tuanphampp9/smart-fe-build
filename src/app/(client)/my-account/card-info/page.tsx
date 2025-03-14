'use client'
import Card from '@/components/Card'
import { RootState } from '@/store/store'
import { Box, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'
import { useSelector } from 'react-redux'

export interface ICardInfoProps {}

export default function CardInfo(props: ICardInfoProps) {
  const { user } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = React.useState<boolean>(true)
  React.useEffect(() => {
    if (user.id) {
      setLoading(false)
    }
  }, [user])
  return (
    <Box>
      <Typography variant='h5' className='border-b-4 border-b-red-800 w-fit'>
        Thông tin thẻ của bạn
      </Typography>
      <Box className='mt-5'>
        {loading ? (
          <Box className='flex justify-center items-center w-[310px] h-[200px]'>
            <CircularProgress />
          </Box>
        ) : (
          <Card reader={user} />
        )}
      </Box>
    </Box>
  )
}
