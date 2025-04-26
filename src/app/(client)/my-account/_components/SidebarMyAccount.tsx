'use client'
import { RootState } from '@/store/store'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useSelector } from 'react-redux'

export interface ISideBarMyAccountProps {}

const menus = [
  {
    id: 1,
    label: 'Thông tin cá nhân',
    href: '/my-account',
  },
  {
    id: 2,
    label: 'Xem thông tin thẻ đọc',
    href: '/my-account/card-info',
  },
  {
    id: 3,
    label: 'Yêu cầu bổ sung tài liệu',
    href: '/my-account/publication-request',
  },
  {
    id: 4,
    label: 'Lịch sử mượn trả',
    href: '/my-account/borrowed-history',
  },
  {
    id: 5,
    label: 'Sở thích',
    href: '/my-account/user-interest',
  },
  {
    id: 6,
    label: 'Đổi mật khẩu',
    href: '/my-account/change-password',
  },
]
export default function SideBarMyAccount(props: ISideBarMyAccountProps) {
  const { user } = useSelector((state: RootState) => state.user)
  const pathName = usePathname()
  return (
    <Box className='rounded-md shadow-md py-3'>
      <div className='flex items-end gap-1 pl-3'>
        <Typography variant='inherit'>Xin chào</Typography>
        <Typography className='!text-red-800 !font-semibold' variant='inherit'>
          {user.fullName}
        </Typography>
      </div>
      <div className='mt-4'>
        {menus.map((menu) => (
          <Link
            href={menu.href}
            key={menu.id}
            className={`font-semibold p-3 w-full block border-t-2 border-t-gray-200
              hover:border-l-4 border-l-red-700
              ${pathName === menu.href ? 'border-l-4 border-l-red-700' : ''}
               ${pathName === menu.href ? 'text-red-800' : 'text-black'}`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
    </Box>
  )
}
