'use client'
import { getListLiquidations } from '@/apiRequest/liquidationApi'
import DialogCustom from '@/components/DialogCustom'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { pageInfo } from '@/lib/types/commonType'
import { LiquidationType } from '@/lib/types/liquidationType'
import { formatDate, handleErrorCode } from '@/lib/utils/common'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Box, Button, Chip, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Select } from 'antd'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export interface ILiquidationPageProps {}

export default function LiquidationPage(props: ILiquidationPageProps) {
  const router = useRouter()
  const [filter, setFilter] = React.useState<{
    status: string
  }>({
    status: '',
  })
  const [openModalViewDetail, setOpenModalViewDetail] = React.useState(false)
  const [liquidationSelected, setLiquidationSelected] =
    React.useState<LiquidationType | null>(null)
  const [liquidations, setLiquidations] = React.useState<LiquidationType[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const buildQuery = () => {
    let query = ''
    // let query = title ? `title like '%${title}%'` : ''
    // let prefix = title ? ' and' : ''
    if (filter.status) {
      query += `status: '${filter.status}'`
    }
    return query
  }
  const fetchListLiquidations = async (
    page: number,
    size: number,
    filter: string
  ) => {
    try {
      setLoading(true)
      const res = await getListLiquidations(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setLiquidations(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListLiquidations(selected, pageInfo.itemPerPage, buildQuery())
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListLiquidations(1, perPage, buildQuery())
  }
  React.useEffect(() => {
    // call api get list posts
    fetchListLiquidations(1, pageInfo.itemPerPage, buildQuery())
  }, [filter])

  const renderType: Record<string, string> = {
    INTRODUCTION_PUBLICATION: 'Giới thiệu ấn phẩm',
    EVENTS: 'Sự kiện',
    NEWS: 'Tin tức',
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã phiếu',
      width: 120,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'createdAt',
      headerName: 'Ngày lập',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return formatDate(params.value)
      },
    },
    {
      field: 'receiverName',
      headerName: 'Tên tổ chức',
      minWidth: 230,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'receiverContact',
      headerName: 'Thông tin liên hệ',
      headerAlign: 'left',
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      minWidth: 250,
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      minWidth: 250,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Chip
            label={params.value === 'PENDING' ? 'Đang thanh lý' : 'Đã xong'}
            variant='filled'
            color={params.value === 'PENDING' ? 'primary' : 'secondary'}
          />
        )
      },
    },
    {
      field: 'detail',
      headerName: 'Chi tiết',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <RemoveRedEyeIcon
            onClick={() => {
              setOpenModalViewDetail(true)
              setLiquidationSelected(params.row as LiquidationType)
            }}
            className='cursor-pointer'
          />
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
              router.push(
                `/admin/liquidations/detail?liquidationId=${params.row.id}`
              )
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
  ]
  const renderLabelStatus: Record<string, string> = {
    DAMAGED: 'Hư hại',
    OBSOLETE: 'Lỗi thời',
    OTHER: 'Khác',
  }
  const columnLiquidationDetail: GridColDef[] = [
    {
      field: 'registrationId',
      headerName: 'Mã ĐKCB',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => params.row.registrationUnique.registrationId,
    },
    {
      field: 'conditionStatus',
      headerName: 'Điều kiện thanh lý',
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
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Select
            style={{ width: 300 }}
            onChange={(value) => {
              setFilter({ ...filter, status: value })
            }}
            defaultValue={''}
            options={[
              { value: '', label: 'Tất cả' },
              {
                value: 'PENDING',
                label: 'Đang thanh lý',
              },
              { value: 'DONE', label: 'Đã xong' },
            ]}
          />
        </div>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/liquidations/detail')
          }}
        >
          Thêm phiếu thanh lý
        </Button>
      </div>
      <div className='mt-5'>
        <Box>
          <TableCustom
            rows={liquidations}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={liquidations.length}
          />
        </Box>
      </div>
      {openModalViewDetail && (
        <DialogCustom
          title={'Chi tiết phiếu thanh lý'}
          isModalOpen={openModalViewDetail}
          setIsModalOpen={setOpenModalViewDetail}
          handleLogicCancel={() => console.log('cancel')}
          width={800}
          children={
            <TableCustom
              rows={liquidationSelected?.liquidationDetails ?? []}
              columns={columnLiquidationDetail}
              checkboxSelection={false}
              isLoading={loading}
            />
          }
        />
      )}
    </div>
  )
}
