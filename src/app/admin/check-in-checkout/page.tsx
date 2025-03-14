'use client'
import { formatDate, formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, Button, Chip, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { StyledTextField } from '@/styles/commonStyle'
import {
  changeStatusCard,
  checkInCheckOut,
  getListCardReaders,
} from '@/apiRequest/cardApi'
import TableCustom from '@/components/TableCustom'
import { pageInfo } from '@/lib/types/commonType'
import { CardReaderType } from '@/lib/types/CardReaderType'
import PaginationCustom from '@/components/PaginationCustom'
import DialogCustom from '@/components/DialogCustom'
import { toast } from 'react-toastify'
export interface ICheckInCheckoutProps {}

export default function CheckInCheckout(props: ICheckInCheckoutProps) {
  const [cardId, setCardId] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [listCardReaders, setListCardReaders] = React.useState<
    CardReaderType[]
  >([])
  const [cardReaderSelected, setCardReaderSelected] =
    React.useState<CardReaderType>()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const columns: GridColDef[] = [
    {
      field: 'cardId',
      headerName: 'Mã thẻ',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'activeAt',
      headerName: 'Ngày hiệu lực',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => formatDate(params.value as string),
    },
    {
      field: 'expiredAt',
      headerName: 'Ngày hết hạn',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => formatDate(params.value as string),
    },
    {
      field: 'history',
      headerName: 'Lịch sử vào ra',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              setIsModalOpen(true)
              setCardReaderSelected(params.row as CardReaderType)
            }}
          >
            <VisibilityIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'locked',
      headerName: 'Trạng thái',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value ? 'Đã khóa' : 'Đang hoạt động'}
            variant='filled'
            color={params.value ? 'error' : 'primary'}
          />
        )
      },
    },
    {
      field: 'action',
      headerName: 'Hành động',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Button
            variant='contained'
            color={params.row.locked ? 'primary' : 'error'}
            onClick={() => handleChangeStatusCard(params.row.cardId as string)}
          >
            {params.row.locked ? 'Mở thẻ' : 'Khoá thẻ'}
          </Button>
        )
      },
    },
  ]
  const handleChangeStatusCard = async (cardId: string) => {
    try {
      const res = await changeStatusCard(cardId)
      console.log(res)
      toast.success(
        res.data.locked ? 'Khoá thẻ thành công' : 'Mở thẻ thành công'
      )
      await fetchListCardReaders(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const fetchListCardReaders = async (
    page: number,
    size: number,
    identityCard: string = ''
  ) => {
    try {
      setLoading(true)
      const res = await getListCardReaders(page, size, ``)
      console.log(res)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListCardReaders(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListCardReaders(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListCardReaders(1, perPage)
  }
  React.useEffect(() => {
    // call api get list card readers
    fetchListCardReaders(1, pageInfo.itemPerPage)
  }, [])

  const handleCheckInCheckOut = async (cardId: string) => {
    try {
      const res = await checkInCheckOut(cardId)
      console.log(res)
      toast.success(res.data.message)
      await fetchListCardReaders(pageInfo.page, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const columnServes: GridColDef[] = [
    {
      field: 'checkInTime',
      headerName: 'Thời gian vào',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => formatDateTime(params.value as string),
    },
    {
      field: 'checkOutTime',
      headerName: 'Thời gian ra',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
  ]
  return (
    <div>
      <div className='flex gap-4 items-center'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Check in/Check out'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleCheckInCheckOut(cardId)}
        >
          Check in/ Check out
        </Button>
      </div>
      <div className='mt-4'>
        <Box>
          <TableCustom
            rows={listCardReaders}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listCardReaders.length}
          />
        </Box>
      </div>
      {isModalOpen && (
        <DialogCustom
          title='Lịch sử vào ra'
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          children={
            <div>
              <TableCustom
                rows={cardReaderSelected?.serves ?? []}
                columns={columnServes}
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
