'use client'
import {
  deleteBorrowSlip,
  getListBorrowSlips,
  renewBorrowSlip,
} from '@/apiRequest/borrowSlipApi'
import { BorrowSlipType } from '@/lib/types/BorrowSlipsType'
import { pageInfo } from '@/lib/types/commonType'
import {
  convertSlugify,
  formatDateTime,
  handleErrorCode,
} from '@/lib/utils/common'
import { Box, Chip, Tooltip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Popconfirm, Select } from 'antd'
import { useRouter } from 'next/navigation'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import * as React from 'react'
import { toast } from 'react-toastify'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import RatingCustom from '@/components/RatingCustom'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import DialogCustom from '@/components/DialogCustom'
import { createRating } from '@/apiRequest/userApi'
import AddIcon from '@mui/icons-material/Add'

export interface IBorrowedHistoryProps {}

export default function BorrowedHistory(props: IBorrowedHistoryProps) {
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const user = useSelector((state: RootState) => state.user.user)
  const router = useRouter()
  const [listBorrowSlips, setListBorrowSlips] = React.useState<
    BorrowSlipType[]
  >([])
  const [openModalViewDetail, setOpenModalViewDetail] =
    React.useState<boolean>(false)
  const [borrowSlipSelected, setBorrowSlipSelected] =
    React.useState<BorrowSlipType>({} as BorrowSlipType)

  const [loading, setLoading] = React.useState<boolean>(false)
  const fetchListBorrowSlips = async (
    page: number,
    size: number,
    cardId: string = '',
    status: string = ''
  ) => {
    try {
      let filter = cardId ? `cardRead.cardId: '${cardId}'` : ''
      if (status) {
        filter += ` and status: '${status}'`
      }
      setLoading(true)
      const res = await getListBorrowSlips(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListBorrowSlips(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    if (user.id)
      fetchListBorrowSlips(1, pageInfo.itemPerPage, user.cardRead.cardId)
  }, [user.id])

  const renderLabelStatus: Record<string, string> = {
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    OVER_DUE: 'Quá hạn',
    NOT_BORROWED: 'Chưa mượn',
  }

  const handleRenewBorrowSlip = async (borrowSlip: BorrowSlipType) => {
    try {
      if (borrowSlip.renewDueDate >= 2) {
        toast.warning('Bạn chỉ được gia hạn phiếu mượn tối đa 2 lần!')
        return
      }
      await renewBorrowSlip(borrowSlip.id)
      toast.success('Gia hạn phiếu mượn thành công')
      fetchListBorrowSlips(
        pageInfo.page,
        pageInfo.itemPerPage,
        user.cardRead.cardId
      )
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'registerDate',
      headerName: 'Ngày đăng ký',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'expiredRegisterDate',
      headerName: 'Ngày hết hạn đăng ký',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'borrowDate',
      headerName: 'Ngày mượn',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'dueDate',
      headerName: 'Ngày hẹn trả',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'returnDate',
      headerName: 'Ngày trả',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'publications',
      headerName: 'Những ấn phẩm mượn',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div className='flex flex-col'>
            {params.row.borrowSlipDetails.map((item: any, index: number) => {
              return (
                <div
                  className='mt-1 text-blue-500 hover:underline cursor-pointer'
                  key={index}
                  onClick={() => {
                    window.open(
                      `/publication/${convertSlugify(item.nameBook)}-${item.publicationId}.html`,
                      '_blank'
                    )
                  }}
                >
                  {index + 1}. {item.nameBook} /{' '}
                  {item.registrationUnique.registrationId} /{' '}
                  {item.registrationUnique.status}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Chip
            label={renderLabelStatus[params.value as string]}
            variant='filled'
            color={'primary'}
          />
        )
      },
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.value
      },
    },
    {
      field: 'rating',
      headerName: 'Đánh giá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'RETURNED') {
          return (
            <PanToolAltIcon
              className='cursor-pointer'
              onClick={() => {
                setBorrowSlipSelected(params.row)
                setOpenModalViewDetail(true)
              }}
            />
          )
        }
      },
    },
    {
      field: 'renewBorrowSlip',
      headerName: 'Gia phiếu mượn',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'BORROWING') {
          return (
            <Tooltip title='Bạn có muốn gia hạn phiếu này không'>
              <AddIcon onClick={() => handleRenewBorrowSlip(params.row)} />
            </Tooltip>
          )
        }
      },
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'NOT_BORROWED')
          return (
            <Popconfirm
              title='Thông báo'
              description={`Bạn có chắc chắn muốn xóa phiếu mượn này không?`}
              okText='Có'
              cancelText='Không'
              overlayStyle={{
                maxWidth: '300px',
              }}
              onConfirm={() => handleDeleteBorrowSlip(params.row.id)}
            >
              <DeleteOutlineIcon className='cursor-pointer' color='error' />
            </Popconfirm>
          )
      },
    },
  ]

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListBorrowSlips(
        selected,
        pageInfo.itemPerPage,
        user.cardRead.cardId
      )
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListBorrowSlips(1, perPage, user.cardRead.cardId)
  }

  const handleDeleteBorrowSlip = async (borrowSlipId: string) => {
    try {
      await deleteBorrowSlip(borrowSlipId)
      toast.success('Xóa phiếu mượn thành công')
      fetchListBorrowSlips(
        pageInfo.page,
        pageInfo.itemPerPage,
        user.cardRead.cardId
      )
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const handleCreateRating = async (
    value: number | null,
    publicationId: string,
    returnDate: string,
    isRated: boolean,
    borrowSlipDetailId: string
  ) => {
    try {
      if (!isRated) {
        toast.warning('Bạn đã đánh giá rồi')
        return
      }
      //if returnDate + 3 day < now => can not rating
      const dateReturn = new Date(returnDate)
      const dateNow = new Date()
      dateReturn.setDate(dateReturn.getDate() + 3)
      if (dateNow > dateReturn) {
        toast.warning('Bạn chỉ có thể đánh giá trong vòng 3 ngày trả ấn phẩm')
        return
      }
      console.log('rating', value)
      const res = await createRating({
        userId: user.id ?? '',
        publicationId: publicationId,
        rating: value,
        borrowSlipDetailId,
      })
      // setRating(value)
      toast.success('Đánh giá thành công')
      console.log(res)
      setBorrowSlipSelected(res.data.data)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const columnBorrowSlipDetails: GridColDef[] = [
    {
      field: 'registrationId',
      headerName: 'ĐKKB',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.registrationUnique.registrationId
      },
    },
    {
      field: 'nameBook',
      headerName: 'Tên ấn phẩm',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      renderCell: (params) => {
        return params.value
      },
    },
    {
      field: 'rating',
      headerName: 'Đánh giá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <RatingCustom
            value={params.row?.publicationRating?.rating ?? 0}
            onchange={(newValue) => {
              handleCreateRating(
                newValue,
                params.row.publicationId,
                borrowSlipSelected.returnDate,
                !Boolean(params.row.publicationRating),
                params.row.id
              )
            }}
          />
        )
      },
    },
  ]
  return (
    <div>
      <Select
        style={{ width: 120 }}
        onChange={(value) =>
          fetchListBorrowSlips(
            1,
            pageInfo.itemPerPage,
            user.cardRead.cardId,
            value as string
          )
        }
        defaultValue={''}
        options={[
          { value: '', label: 'Tất cả' },
          { value: 'BORROWING', label: 'Đang mượn' },
          { value: 'RETURNED', label: 'Đã trả' },
          { value: 'OVERDUE', label: 'Qúa hạn' },
          { value: 'NOT_BORROWED', label: 'Chưa mượn' },
        ]}
      />
      <Box>
        <TableCustom
          rows={listBorrowSlips}
          columns={columns}
          checkboxSelection={false}
          isLoading={loading}
        />
        <PaginationCustom
          pageInfo={pageInfo}
          getPaginatedTableRows={getPaginatedTableRows}
          onChangePerPage={handleChangePerPage}
          lengthItem={listBorrowSlips.length}
        />
      </Box>
      {openModalViewDetail && (
        <DialogCustom
          title='Chi tiết phiếu mượn'
          isModalOpen={openModalViewDetail}
          setIsModalOpen={setOpenModalViewDetail}
          handleLogicCancel={() => console.log('cancel')}
          width={800}
          children={
            <div>
              <TableCustom
                rows={borrowSlipSelected.borrowSlipDetails ?? []}
                columns={columnBorrowSlipDetails}
                checkboxSelection={false}
                isLoading={loading}
              />
            </div>
          }
        />
      )}
    </div>
  )
}
