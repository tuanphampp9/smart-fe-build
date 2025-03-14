import * as React from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface IMenuHeaderProps {}

export default function MenuHeader(props: IMenuHeaderProps) {
  const pathName = usePathname()
  const listMenus = [
    {
      id: 1,
      name: 'Tra cứu',
      href: '/lookup',
    },
    {
      id: 2,
      name: 'Tin tức',
      href: '/posts',
    },
    {
      id: 3,
      name: 'Trang cá nhân',
      href: '/my-account',
    },
  ]
  return (
    <div className='flex items-center '>
      {listMenus.map((menu) => (
        <Link
          key={menu.id}
          href={menu.href}
          className={`px-2 py-4 hover:bg-red-800 hover:text-white cursor-pointer text-black text-xl ${pathName.includes(menu.href) ? 'bg-red-800 text-white' : ''}`}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  )
}
