'use client'
import {
  acceptBorrowSlip,
  deleteBorrowSlip,
  getListBorrowSlips,
  returnBorrowSlip,
} from '@/apiRequest/borrowSlipApi'
import { getReader } from '@/apiRequest/userApi'
import Card from '@/components/Card'
import DialogCustom from '@/components/DialogCustom'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { BorrowSlipType } from '@/lib/types/BorrowSlipsType'
import { pageInfo } from '@/lib/types/commonType'
import { UserType } from '@/lib/types/userType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import PrintIcon from '@mui/icons-material/Print'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Popconfirm, Select } from 'antd'
import debounce from 'debounce'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
export interface IBorrowPublicationProps {}

export default function BorrowPublication(props: IBorrowPublicationProps) {
  const [reader, setReader] = React.useState<UserType>({} as UserType)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const [openModalViewDetail, setOpenModalViewDetail] =
    React.useState<boolean>(false)
  const [openModalCardReader, setOpenModalCardReader] =
    React.useState<boolean>(false)
  const router = useRouter()
  const [listBorrowSlips, setListBorrowSlips] = React.useState<
    BorrowSlipType[]
  >([])
  const [borrowSlipSelected, setBorrowSlipSelected] =
    React.useState<BorrowSlipType>({} as BorrowSlipType)
  const [note, setNote] = React.useState<string>('')
  const [registrationUniqueReturn, setRegistrationUniqueReturn] =
    React.useState<
      {
        registrationId: string
        status: string
      }[]
    >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [loadingBtnReturn, setLoadingBtnReturn] = React.useState<boolean>(false)
  const fetchListBorrowSlips = async (
    page: number,
    size: number,
    cardId: string = ''
  ) => {
    try {
      const filter = cardId ? `cardRead.cardId: '${cardId}'` : ''
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
    fetchListBorrowSlips(1, pageInfo.itemPerPage)
  }, [])

  const renderLabelStatus: Record<string, string> = {
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    OVER_DUE: 'Quá hạn',
    NOT_BORROWED: 'Chưa mượn',
  }
  const fetchReader = async (readerId: string) => {
    try {
      const res = await getReader(readerId)
      setReader(res.data)
      setOpenModalCardReader(true)
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
      field: 'cardId',
      headerName: 'Thẻ mượn',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <span
            className='cursor-pointer text-blue-500 hover:underline'
            onClick={() => fetchReader(params.row.cardRead.id)}
          >
            {params.row.cardRead.cardId}
          </span>
        )
      },
    },
    {
      field: 'ViewDetail',
      headerName: 'Xem chi tiết',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              setOpenModalViewDetail(true)
              setBorrowSlipSelected(params.row as BorrowSlipType)
              const dataRegistrationUniqueReturn =
                params.row.borrowSlipDetails.map((item: any) => {
                  return {
                    registrationId: item.registrationUnique.registrationId,
                    status: item.registrationUnique.status,
                  }
                })
              setRegistrationUniqueReturn(dataRegistrationUniqueReturn)
            }}
          >
            <VisibilityIcon />
          </IconButton>
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
      field: 'print-receipt',
      headerName: 'In phiếu mượn',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (['BORROWING', 'RETURNED'].includes(params.row.status))
          return (
            <PrintIcon
              className='cursor-pointer'
              onClick={() => {
                window.open(
                  `/print-borrowSlip?borrowSlipId=${params.row.id}`,
                  '_blank'
                )
              }}
            />
          )
      },
    },
    {
      field: 'accept',
      headerName: 'Kích hoạt',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (params.row.status === 'NOT_BORROWED')
          return (
            <Tooltip title='Người đọc đã tới lấy ấn phẩm?' arrow>
              <IconButton
                onClick={async () => {
                  await handleAcceptBorrowSlip(params.row.id)
                }}
              >
                <PanToolAltIcon />
              </IconButton>
            </Tooltip>
          )
      },
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
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

  const handleAcceptBorrowSlip = async (borrowSlipId: string) => {
    try {
      // handle accept borrow slip
      const res = await acceptBorrowSlip(borrowSlipId)
      toast.success('Kích hoạt phiếu mượn thành công')
      fetchListBorrowSlips(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListBorrowSlips(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListBorrowSlips(1, perPage)
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
      field: 'status',
      headerName: 'Trạng thái',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Select
            style={{ width: 120 }}
            defaultValue={params.row.registrationUnique.status}
            onChange={(value) =>
              handleChange(
                value as string,
                params.row.registrationUnique.registrationId
              )
            }
            disabled={borrowSlipSelected.status !== 'BORROWING'}
            options={[
              { value: 'AVAILABLE', label: 'Sẵn có' },
              { value: 'BORROWED', label: 'Đang mượn', disabled: true },
              { value: 'LOST', label: 'Thất lạc' },
            ]}
          />
        )
      },
    },
  ]
  const handleChange = (value: string, registrationUniqueId: string) => {
    console.log(`selected ${value}`, registrationUniqueId)
    const updateRegistrationUniqueReturn = registrationUniqueReturn.map(
      (item) => {
        if (item.registrationId === registrationUniqueId) {
          return {
            registrationId: item.registrationId,
            status: value,
          }
        }
        return item
      }
    )
    setRegistrationUniqueReturn(updateRegistrationUniqueReturn)
  }

  const handleDeleteBorrowSlip = async (borrowSlipId: string) => {
    try {
      await deleteBorrowSlip(borrowSlipId)
      toast.success('Xóa phiếu mượn thành công')
      fetchListBorrowSlips(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleReturnBorrowSlip = async () => {
    const isHasBorrowed = registrationUniqueReturn.some(
      (item) => item.status === 'BORROWED'
    )
    if (isHasBorrowed) {
      toast.warning('Vui lòng kiểm tra lại trạng thái của ấn phẩm')
      return
    }
    try {
      setLoadingBtnReturn(true)
      const res = await returnBorrowSlip({
        borrowSlipId: borrowSlipSelected.id,
        registrationUniqueStatuses: registrationUniqueReturn,
        note,
      })
      toast.success('Trả phiếu mượn thành công')
      fetchListBorrowSlips(pageInfo.page, pageInfo.itemPerPage)
      setOpenModalViewDetail(false)
      setNote('')
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoadingBtnReturn(false)
    }
  }
  const handleSearchReadCard = React.useCallback(
    debounce((cardId: string) => {
      fetchListBorrowSlips(1, pageInfo.itemPerPage, cardId)
    }, 500),
    []
  )
  return (
    <div>
      <div className='flex justify-between my-4'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập mã thẻ muốn tìm kiếm'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          onChange={(e) => {
            handleSearchReadCard(e.target.value)
          }}
        />
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/borrow-publications/detail')
          }}
        >
          Thêm phiếu mượn
        </Button>
      </div>
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
      {openModalCardReader && (
        <DialogCustom
          title={``}
          isModalOpen={openModalCardReader}
          setIsModalOpen={setOpenModalCardReader}
          children={
            <div>
              <Card reader={reader} />
            </div>
          }
        />
      )}
      {openModalViewDetail && (
        <DialogCustom
          title='Chi tiết phiếu mượn'
          isModalOpen={openModalViewDetail}
          setIsModalOpen={setOpenModalViewDetail}
          handleLogicCancel={() => setNote('')}
          width={800}
          children={
            <div>
              <TableCustom
                rows={borrowSlipSelected.borrowSlipDetails ?? []}
                columns={columnBorrowSlipDetails}
                checkboxSelection={false}
                isLoading={loading}
              />
              {borrowSlipSelected.status === 'BORROWING' && (
                <>
                  <Typography variant='body1' fontWeight={400}>
                    Ghi chú
                  </Typography>
                  <StyledTextField
                    margin='normal'
                    fullWidth
                    placeholder='Nhập ghi chú'
                    className='!mt-1'
                    value={note}
                    multiline
                    rows={4}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className='flex justify-end mt-4'>
                    <LoadingButton
                      variant='contained'
                      loading={loadingBtnReturn}
                      sx={{
                        py: 2,
                        px: 4,
                        '&.Mui-disabled': {
                          backgroundColor: 'gray', // Màu nền khi button bị disabled
                        },
                      }}
                      onClick={handleReturnBorrowSlip}
                    >
                      Xác nhận
                    </LoadingButton>
                  </div>
                </>
              )}
            </div>
          }
        />
      )}
    </div>
  )
}
