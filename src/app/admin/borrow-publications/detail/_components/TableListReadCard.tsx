import { getListCardReaders } from '@/apiRequest/cardApi'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { CardReaderType } from '@/lib/types/CardReaderType'
import { pageInfo } from '@/lib/types/commonType'
import { formatDate, formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { setCardId } from '@/store/slices/borrowSlipSlice'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Radio } from 'antd'
import debounce from 'debounce'
import * as React from 'react'
import { useDispatch } from 'react-redux'

export interface ITableListReadCardProps {}

export default function TableListReadCard(props: ITableListReadCardProps) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [listCardReaders, setListCardReaders] = React.useState<
    CardReaderType[]
  >([])
  const [cardReaderSelected, setCardReaderSelected] =
    React.useState<CardReaderType>()
  const dispatch = useDispatch()
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const columns: GridColDef[] = [
    {
      field: 'select',
      headerName: 'Lựa chọn',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Radio
            disabled={params.row.locked}
            checked={cardReaderSelected?.id === params.row.id}
          />
        )
      },
    },
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
  ]

  const fetchListCardReaders = async (
    page: number,
    size: number,
    cardId: string = ''
  ) => {
    try {
      setLoading(true)
      const filter = cardId ? `cardId: '${cardId}'` : ''
      const res = await getListCardReaders(page, size, filter)
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

  const onRowClick = (params: any) => {
    console.log(params.row)
    setCardReaderSelected(params.row)
    dispatch(setCardId(params.row.cardId))
  }

  const handleSearchReadCard = React.useCallback(
    debounce((cardId: string) => {
      fetchListCardReaders(1, pageInfo.itemPerPage, cardId)
    }, 500),
    []
  )
  return (
    <div>
      <div className='flex gap-4 items-center'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập mã thẻ'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          onChange={(e) => {
            handleSearchReadCard(e.target.value)
          }}
        />
      </div>
      <div className='mt-4'>
        <Box>
          <TableCustom
            rows={listCardReaders}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
            onRowClick={onRowClick}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listCardReaders.length}
          />
        </Box>
      </div>
    </div>
  )
}
