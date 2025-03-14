'use client'
import { getListRegistrationUniques } from '@/apiRequest/publicationApi'
import { getListRegistrationUniquesHasPublicationName } from '@/apiRequest/registrationUniqueApi'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { pageInfo } from '@/lib/types/commonType'
import { RegistrationUniqueResponseType } from '@/lib/types/ImportReceiptType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import {
  removeRegistrationIds,
  setRegistrationIds,
} from '@/store/slices/borrowSlipSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, Chip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from 'antd'
import debounce from 'debounce'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export interface ITableListRegistrationUniqueProps {
  onChangeRegistrationIds?: (registrationId: string, isCheck: boolean) => void
}

export default function TableListRegistrationUnique(
  props: ITableListRegistrationUniqueProps
) {
  const { onChangeRegistrationIds } = props
  const dispatch = useDispatch()
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const router = useRouter()
  const { registrationIds } = useSelector(
    (state: RootState) => state.borrowSlip
  )
  const [listRegistrationUniques, setListRegistrationUniques] = React.useState<
    RegistrationUniqueResponseType[]
  >([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const fetchListRegistrationUniques = async (
    page: number,
    size: number,
    registrationId: string = ''
  ) => {
    try {
      setLoading(true)
      const filter = registrationId ? `registrationId: '${registrationId}'` : ''
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
  React.useEffect(() => {
    fetchListRegistrationUniques(1, pageInfo.itemPerPage)
  }, [])

  const renderLabelStatus: Record<string, string> = {
    AVAILABLE: 'Sẵn có',
    BORROWED: 'Đang mượn',
    LOST: 'Thất lạc',
    DAMAGED: 'Hỏng',
    NEED_REPAIR: 'Cần sửa chữa',
    LIQUIDATED: 'Đã thanh lý',
  }

  const columns: GridColDef[] = [
    {
      field: 'selected',
      headerName: 'Lựa chọn',
      width: 80,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Checkbox
            disabled={params.row.status !== 'AVAILABLE'}
            checked={registrationIds.includes(
              params.row.registrationId as string
            )}
            onChange={(e) => {
              if (onChangeRegistrationIds)
                onChangeRegistrationIds?.(
                  params.row.registrationId as string,
                  e.target.checked
                )
              if (e.target.checked) {
                dispatch(
                  setRegistrationIds(params.row.registrationId as string)
                )
              } else {
                dispatch(
                  removeRegistrationIds(params.row.registrationId as string)
                )
              }
            }}
          />
        )
      },
    },
    {
      field: 'createdAt',
      headerName: 'Ngày nhập',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return formatDateTime(params.value as string)
      },
    },
    {
      field: 'registrationId',
      headerName: 'Mã ĐKCB',
      minWidth: 220,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'publicationName',
      headerName: 'Mã ĐKCB',
      minWidth: 220,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      minWidth: 200,
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
  ]

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListRegistrationUniques(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListRegistrationUniques(1, perPage)
  }
  const handleSearchRegistrationUnique = React.useCallback(
    debounce((registrationId: string) => {
      fetchListRegistrationUniques(
        1,
        pageInfo.itemPerPage,
        registrationId.trim()
      )
    }, 500),
    []
  )
  return (
    <div>
      <div>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập mã ĐKCB'
          sx={{
            maxWidth: '400px',
            m: 0,
          }}
          onChange={(e) => {
            handleSearchRegistrationUnique(e.target.value)
          }}
        />
      </div>
      <Box className='mt-4'>
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
  )
}
