'use client'
import { formatDate, showGender } from '@/lib/utils/common'
import { RootState } from '@/store/store'
import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

export interface IMyAccountProps {}

export default function MyAccount(props: IMyAccountProps) {
  const { user } = useSelector((state: RootState) => state.user)
  return (
    <Box>
      <Typography variant='h5' className='border-b-4 border-b-red-800 w-fit'>
        Thông tin cá nhân
      </Typography>
      <Box className='flex gap-2 mt-6'>
        <Typography className='!font-semibold !text-base'>
          Ảnh chân dung (ảnh thẻ):{' '}
        </Typography>
        <img className='w-72' src={user.portraitImg} />
      </Box>
      <Box className='flex gap-x-28 mt-4'>
        <Box className='left'>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Họ và tên:
            </Typography>
            <span>{user.fullName}</span>
          </Box>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Căn cước công dân:
            </Typography>
            <span>{user.identityCardNumber}</span>
          </Box>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Email:
            </Typography>
            <span>{user.email}</span>
          </Box>
        </Box>
        <Box className='right'>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Ngày sinh:
            </Typography>
            <span>{formatDate(user.dob)}</span>
          </Box>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Giới tính:
            </Typography>
            <span>{showGender[user.gender as keyof typeof showGender]}</span>
          </Box>
          <Box className='flex gap-2'>
            <Typography className='!font-semibold !text-base'>
              Số điện thoại:
            </Typography>
            <span>{user.phone}</span>
          </Box>
        </Box>
      </Box>
      <Box className='flex gap-2'>
        <Typography className='!font-semibold !text-base'>Địa chỉ:</Typography>
        <span>{user.address}</span>
      </Box>
    </Box>
  )
}
