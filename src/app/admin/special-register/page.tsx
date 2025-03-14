'use client'
import { pageInfo } from '@/lib/types/commonType'
import { RegistrationUniqueResType } from '@/lib/types/RegistrationUniqueType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, Button, Chip, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility'
import * as React from 'react'
import { StyledTextField } from '@/styles/commonStyle'
import { getListRegistrationUniquesHasPublicationName } from '@/apiRequest/registrationUniqueApi'
import { toast } from 'react-toastify'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import DialogCustom from '@/components/DialogCustom'

export interface ISpecialRegisterProps {}

export default function SpecialRegister(props: ISpecialRegisterProps) {
  const [registrationId, setRegistrationId] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [listRegistrationUniques, setListRegistrationUniques] = React.useState<
    RegistrationUniqueResType[]
  >([])
  const [registrationSelected, setRegistrationSelected] =
    React.useState<RegistrationUniqueResType>({} as RegistrationUniqueResType)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })

  const renderLabelStatus: Record<string, string> = {
    AVAILABLE: 'Sẵn có',
    BORROWED: 'Đang mượn',
    LOST: 'Thất lạc',
  }
  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => formatDateTime(params.value as string),
    },
    {
      field: 'registrationId',
      headerName: 'Mã ĐKCB',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'publicationName',
      headerName: 'Tên ấn phẩm',
      headerAlign: 'left',
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
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
      field: 'history',
      headerName: 'Lịch sử mượn',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              setIsModalOpen(true)
              setRegistrationSelected(params.row as RegistrationUniqueResType)
            }}
          >
            <VisibilityIcon />
          </IconButton>
        )
      },
    },
  ]

  const fetchListRegistrationHasName = async (
    page: number,
    size: number,
    registrationId: string = ''
  ) => {
    try {
      setLoading(true)
      let filter = ''
      if (registrationId) {
        filter = `registrationId: '${registrationId}'`
      }
      const res = await getListRegistrationUniquesHasPublicationName(
        page,
        size,
        filter
      )
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListRegistrationUniques(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListRegistrationHasName(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListRegistrationHasName(1, perPage)
  }
  React.useEffect(() => {
    // call api get list card readers
    fetchListRegistrationHasName(1, pageInfo.itemPerPage)
  }, [])

  const handleScanRegistrationId = async (registrationId: string) => {
    try {
      const res = await fetchListRegistrationHasName(
        1,
        pageInfo.itemPerPage,
        registrationId
      )
      console.log(res)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const renderLabelBorrowSlipStatus: Record<string, string> = {
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    OVER_DUE: 'Quá hạn',
    NOT_BORROWED: 'Chưa mượn',
  }
  const columnHistoryBorrow: GridColDef[] = [
    {
      field: 'borrowDate',
      headerName: 'Ngày mượn',
      minWidth: 250,
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
      minWidth: 250,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        if (!params.value) return ''
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'borrowSlipStatus',
      headerName: 'Trạng thái phiếu mượn',
      flex: 1,
      minWidth: 250,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Chip
            label={renderLabelBorrowSlipStatus[params.value as string]}
            variant='filled'
            color={'primary'}
          />
        )
      },
    },
    {
      field: 'cardId',
      headerName: 'Mã thẻ',
      minWidth: 250,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      flex: 1,
      minWidth: 250,
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
          placeholder='Nhập mã ĐKCB'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          value={registrationId}
          onChange={(e) => setRegistrationId(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleScanRegistrationId(registrationId)}
        >
          Tra
        </Button>
      </div>
      <div className='mt-4'>
        <Box>
          <TableCustom
            rows={listRegistrationUniques}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listRegistrationUniques.length}
          />
        </Box>
      </div>
      {isModalOpen && (
        <DialogCustom
          title={`Lịch sử mượn của mã ĐKCB: ${registrationSelected.registrationId}`}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          width={1000}
          children={
            <div>
              <TableCustom
                rows={registrationSelected?.historyBorrows ?? []}
                columns={columnHistoryBorrow}
                checkboxSelection={false}
                isLoading={loading}
                getRowId={(row) => row.borrowSlipId}
              />
            </div>
          }
        />
      )}
    </div>
  )
}
