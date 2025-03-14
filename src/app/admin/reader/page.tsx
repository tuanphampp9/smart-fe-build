'use client'
import { StyledTextField } from '@/styles/commonStyle'
import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import { UserType } from '@/lib/types/userType'
import { handleErrorCode, showGender } from '@/lib/utils/common'
import { getListReaders, renewCard } from '@/apiRequest/userApi'
import { pageInfo } from '@/lib/types/commonType'
import { GridColDef } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { createCard } from '@/apiRequest/cardApi'
import LoadingButton from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import AddIcon from '@mui/icons-material/Add'
export interface IReaderProps {}

export default function Reader(props: IReaderProps) {
  const router = useRouter()
  const [identityCard, setIdentityCard] = React.useState<string>('')
  const [listReaders, setListReaders] = React.useState<UserType[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [loadingCreateCard, setLoadingCreateCard] = React.useState<string>('')
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const fetchListReaders = async (
    page: number,
    size: number,
    identityCard: string = '',
    cardNumber: string = ''
  ) => {
    try {
      let buildQuery = `role.name ! 'ADMIN'`
      if (identityCard) {
        buildQuery += ` and identityCardNumber like '%${identityCard}%'`
      }
      if (cardNumber) {
        buildQuery += ` and cardRead.cardId: '${cardNumber}'`
      }
      setLoading(true)
      const res = await getListReaders(page, size, buildQuery)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListReaders(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListReaders(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const handleRenewCard = async (cardId: string) => {
    try {
      const res = await renewCard(cardId)
      toast.success('Gia hạn thẻ thành công')
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListReaders(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListReaders(1, pageInfo.itemPerPage)
  }, [])

  const handleAcceptAccount = (row: UserType) => async () => {
    if (!row.cardRead) {
      try {
        setLoadingCreateCard(row.id ?? '')
        // call api create card
        const res = await createCard(row.email)
        // call api get list readers
        await fetchListReaders(pageInfo.page, pageInfo.itemPerPage)
        toast.success('Tạo thẻ thành công')
      } catch (error: any) {
        handleErrorCode(error)
      } finally {
        setLoadingCreateCard('')
      }
    } else {
      console.log('print card')
      window.open(`/print-card?readerId=${row.id}`, '_blank')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'identityCardNumber',
      headerName: 'Căn cước công dân',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'fullName',
      headerName: 'Họ và tên',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'gender',
      headerName: 'Giới tính',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return showGender[params.value as keyof typeof showGender]
      },
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div
            className={`${params.value ? 'text-green-500' : 'text-red-500'}`}
          >
            {params.value ? 'Đang hoạt động' : 'Chưa kích hoạt'}
          </div>
        )
      },
    },
    {
      field: 'edit',
      headerName: 'Sửa',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              router.push(`/admin/reader/detail?readerId=${params.row.id}`)
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <IconButton>
            <DeleteForeverIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'cardRead',
      headerName: 'Thẻ',
      headerAlign: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <LoadingButton
            variant='contained'
            color='primary'
            onClick={handleAcceptAccount(params.row)}
            loading={loadingCreateCard === params.row.id}
          >
            {params.value ? 'In thẻ' : 'Tạo thẻ'}
          </LoadingButton>
        )
      },
    },
    {
      field: 'renewCard',
      headerName: 'Gia hạn thẻ',
      headerAlign: 'left',
      minWidth: 150,
      renderCell: (params) => {
        if (params.row.cardRead) {
          return (
            <Tooltip title='Gia hạn thẻ cho bạn đọc'>
              <AddIcon
                onClick={() => handleRenewCard(params.row.cardRead.cardId)}
              />
            </Tooltip>
          )
        }
        return <div></div>
      },
    },
  ]
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <StyledTextField
            margin='normal'
            fullWidth
            type='text'
            placeholder='Nhập CCCD muốn tìm kiếm'
            className='!mt-1'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchListReaders(1, pageInfo.itemPerPage, identityCard)
              }
            }}
            sx={{
              maxWidth: '400px',
            }}
            value={identityCard}
            onChange={(e) => setIdentityCard(e.target.value)}
            slotProps={{
              input: {
                endAdornment: <SearchIcon />,
              },
            }}
          />
          <StyledTextField
            margin='normal'
            fullWidth
            type='text'
            placeholder='Nhập mã thẻ đọc muốn tìm kiếm'
            className='!mt-1'
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                fetchListReaders(1, pageInfo.itemPerPage, '', e.target.value)
              }
            }}
            sx={{
              maxWidth: '400px',
            }}
            slotProps={{
              input: {
                endAdornment: <SearchIcon />,
              },
            }}
          />
        </div>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/reader/detail')
          }}
        >
          Thêm bạn đọc
        </Button>
      </div>
      <div>
        <Box>
          <TableCustom
            rows={listReaders}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listReaders.length}
          />
        </Box>
      </div>
    </div>
  )
}
