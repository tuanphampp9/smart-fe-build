'use client'
import { logout } from '@/apiRequest/authApi'
import MenuHeader from '@/app/(client)/_components/MenuHeader'
import { RootState } from '@/store/store'
import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import DialogCustom from './DialogCustom'
import TableCustom from './TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Popconfirm } from 'antd'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { convertSlugify, handleErrorCode } from '@/lib/utils/common'
import {
  addPubToCart,
  deletePubFromCart,
  minusPubFromCart,
} from '@/apiRequest/userApi'
import { deleteCart, updateQuantity } from '@/store/slices/userSlice'
import LoadingButton from '@mui/lab/LoadingButton'
import { createBorrowSlipForClient } from '@/apiRequest/borrowSlipApi'
import ListNotifications from './ListNotifications'

export interface IHeaderProps {}

export default function Header(props: IHeaderProps) {
  const { user } = useSelector((state: RootState) => state.user)
  const [openModalCart, setOpenModalCart] = React.useState<boolean>(false)
  const handleLogout = async () => {
    localStorage.removeItem('token')
    await logout()
    toast.success('Đăng xuất thành công')
  }
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false)
  const [listCartIdSelected, setListCartIdSelected] = React.useState<string[]>(
    []
  )
  const dispatch = useDispatch()
  const columnCart: GridColDef[] = [
    {
      field: 'img',
      headerName: 'Ảnh bìa',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div className='p-2'>
            <img
              src={params.row.publication.bannerImg as string}
              alt={params.row.publication.name as string}
              className='w-16 h-16 object-contain'
            />
          </div>
        )
      },
    },
    {
      field: 'name',
      headerName: 'Tên ấn phẩm',
      flex: 1,
      minWidth: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.row.publication.name) return ''
        return (
          <a
            href={`/publication/${convertSlugify(params.row.publication.name)}-${params.row.publicationId}.html`}
            target='_blank'
          >
            {params.row.publication.name}
          </a>
        )
      },
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      minWidth: 150,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params) => {
        return (
          <div className='flex items-center gap-2 py-2'>
            <RemoveIcon
              className='cursor-pointer'
              onClick={() => handleMinusQuantity(params.row.id)}
            />
            <div className='px-2 border-x border-x-gray-600'>
              {params.row.quantity}
            </div>
            <AddIcon
              className='cursor-pointer'
              onClick={() =>
                handleAddPubToCart(
                  user.id ?? '',
                  params.row.publicationId,
                  1,
                  params.row.id
                )
              }
            />
          </div>
        )
      },
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      minWidth: 100,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Popconfirm
            title='Thông báo'
            description={`Bạn có chắc chắn muốn xóa ấn phẩm: ${params.row.publication.name} khỏi giỏ hàng không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeletePublicationFromCart(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeletePublicationFromCart = async (id: string) => {
    try {
      const res = await deletePubFromCart(id)
      toast.success('Xóa ấn phẩm khỏi giỏ hàng thành công')
      dispatch(deleteCart(id))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleCreateBorrowSlip = async () => {
    try {
      setLoadingSubmit(true)
      const res = await createBorrowSlipForClient({
        cardId: user.cardRead.cardId ?? '',
        cartIds: listCartIdSelected,
      })
      console.log(res)
      toast.success('Đặt mượn thành công')
      setListCartIdSelected([])
      setOpenModalCart(false)
      listCartIdSelected.forEach((id) => dispatch(deleteCart(id as string)))
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoadingSubmit(false)
    }
  }
  const handleAddPubToCart = async (
    userId: string,
    publicationId: number,
    quantity: number,
    cartId: string
  ) => {
    try {
      const res = await addPubToCart({
        userId,
        publicationId,
        quantity,
      })
      console.log(res)
      dispatch(
        updateQuantity({
          cartId,
          quantity,
          method: 'add',
        })
      )
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleMinusQuantity = async (cartId: string) => {
    try {
      const res = await minusPubFromCart(cartId)
      console.log(res)
      dispatch(
        updateQuantity({
          cartId,
          quantity: 1,
          method: 'minus',
        })
      )
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const onRowSelectionModelChange = (rowSelectionModel: any) => {
    console.log(rowSelectionModel)
    setListCartIdSelected(rowSelectionModel)
  }
  return (
    <div>
      <div className='flex justify-center bg-[#E7E9EF] py-2'>
        <div className='container flex justify-between'>
          {user.fullName ? (
            <>
              <div className='flex gap-1 items-center'>
                <span className='text-black'>Xin chào</span>
                <span className='text-blue-600'>{user.fullName}, </span>
                <Link
                  href='/login'
                  className='text-blue-600'
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Link>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className='relative cursor-pointer'
                  onClick={() => setOpenModalCart(true)}
                >
                  <span className='text-black mr-7'>Giỏ ấn phẩm </span>
                  <div className='absolute top-0 right-0 w-6 h-6 flex justify-center items-center bg-red-600 rounded-full text-white text-xs'>
                    {user.cartUsers !== null ? user.cartUsers?.length : 0}
                  </div>
                </div>
                <div>
                  <ListNotifications />
                </div>
              </div>
            </>
          ) : (
            <div className='flex gap-1 items-center text-black'>
              <Link href='/login'>Đăng nhập</Link>
              <span>/</span>
              <Link href='forget-password'>Quên mật khẩu</Link>
              <span>/</span>
              <Link href='/register'>Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-center bg-[#FEF6D3] py-4'>
        <div className='container'>
          <Typography variant='h4' className='uppercase'>
            Thư viện số TH
          </Typography>
        </div>
      </div>
      <Box className='flex justify-center'>
        <div className='container'>
          <MenuHeader />
        </div>
      </Box>
      {openModalCart && (
        <DialogCustom
          title={`Giỏ ấn phẩm của ${user.fullName}`}
          isModalOpen={openModalCart}
          setIsModalOpen={setOpenModalCart}
          children={
            <div>
              <TableCustom
                rows={user.cartUsers ?? []}
                columns={columnCart}
                onRowSelectionModelChange={onRowSelectionModelChange}
              />
              <div>
                <LoadingButton
                  fullWidth
                  variant='contained'
                  loading={loadingSubmit}
                  sx={{
                    my: 3,
                    py: 2,
                    '&.Mui-disabled': {
                      backgroundColor: 'gray', // Màu nền khi button bị disabled
                    },
                  }}
                  disabled={listCartIdSelected.length === 0}
                  onClick={handleCreateBorrowSlip}
                >
                  Đặt mượn
                </LoadingButton>
              </div>
            </div>
          }
          width={800}
        />
      )}
    </div>
  )
}
