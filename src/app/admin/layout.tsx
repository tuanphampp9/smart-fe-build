import Sidebar from '@/components/Sidebar'
import { baseMenu } from '@/lib/types/commonType'
import * as React from 'react'

export interface ILayoutProps {
  children: React.ReactNode
}

const Menus: baseMenu[] = [
  {
    id: 1,
    title: 'Quản lý tài khoản',
    subMenuItems: [
      {
        id: 1,
        title: 'Bạn đọc',
        path: '/admin/reader',
      },
      {
        id: 2,
        title: 'Vào/ra thư viện',
        path: '/admin/check-in-checkout',
      },
    ],
  },
  {
    id: 2,
    title: 'Quản lý danh mục',
    subMenuItems: [
      {
        id: 1,
        title: 'Chủ đề',
        path: '/admin/topic',
      },
      {
        id: 2,
        title: 'Thể loại',
        path: '/admin/category',
      },
      {
        id: 3,
        title: 'Tác giả',
        path: '/admin/author',
      },
      {
        id: 4,
        title: 'Nhà xuất bản',
        path: '/admin/publisher',
      },
      {
        id: 5,
        title: 'Ngôn ngữ',
        path: '/admin/language',
      },
      {
        id: 6,
        title: 'Kho ấn phẩm',
        path: '/admin/warehouse',
      },
    ],
  },
  {
    id: 3,
    title: 'Quản lý ấn phẩm',
    subMenuItems: [
      {
        id: 1,
        title: 'Ấn phẩm',
        path: '/admin/publications',
      },
      {
        id: 2,
        title: 'Phiếu nhập ấn phẩm',
        path: '/admin/import-publications',
      },
      {
        id: 3,
        title: 'Phiếu mượn ấn phẩm',
        path: '/admin/borrow-publications',
      },
      {
        id: 4,
        title: 'Quản lý yêu cầu bổ sung tài liệu',
        path: '/admin/publication-request',
      },
    ],
  },
  {
    id: 4,
    title: 'Quản lý bài đăng',
    path: '/admin/posts',
  },
  {
    id: 5,
    title: 'Quản lý thanh lý',
    path: '/admin/liquidations',
  },
  {
    id: 6,
    title: 'Quản lý kiểm kê',
    path: '/admin/inventory',
  },
  {
    id: 7,
    title: 'Báo cáo thống kê',
    subMenuItems: [
      {
        id: 1,
        title: 'Bảng kê ấn phẩm',
        path: '/admin/publications-report',
      },
      {
        id: 2,
        title: 'Sổ đăng kí cá biệt',
        path: '/admin/special-register',
      },
      {
        id: 3,
        title: 'Sổ mượn trả',
        path: '/admin/borrow-return',
      },
    ],
  },
]

export default function Layout(props: ILayoutProps) {
  const { children } = props
  return (
    <div className='flex'>
      <div className='w-[15%]'>
        <Sidebar menu={Menus} />
      </div>
      <div className='w-[85%] p-4'>{children}</div>
    </div>
  )
}
