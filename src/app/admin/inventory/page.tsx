'use client'
import { getListInventory } from '@/apiRequest/inventoryApi'
import { pageInfo } from '@/lib/types/commonType'
import { InventoryType } from '@/lib/types/inventoryType'
import { formatDateTime, handleErrorCode } from '@/lib/utils/common'
import { Box, Button, Chip, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import EditIcon from '@mui/icons-material/Edit'
import { Select } from 'antd'
import AddIcon from '@mui/icons-material/Add'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import DialogCustom from '@/components/DialogCustom'
export interface IInventoryProps {}

export default function Inventory(props: IInventoryProps) {
  const router = useRouter()
  const [filter, setFilter] = React.useState<{
    status: string
  }>({
    status: '',
  })
  const [openModalViewDetail, setOpenModalViewDetail] = React.useState(false)
  const [inventorySelected, setInventorySelected] =
    React.useState<InventoryType | null>(null)
  const [inventories, setInventories] = React.useState<InventoryType[]>([])
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
  const fetchListInventories = async (
    page: number,
    size: number,
    filter: string
  ) => {
    try {
      setLoading(true)
      const res = await getListInventory(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setInventories(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListInventories(selected, pageInfo.itemPerPage, buildQuery())
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListInventories(1, perPage, buildQuery())
  }
  React.useEffect(() => {
    // call api get list posts
    fetchListInventories(1, pageInfo.itemPerPage, buildQuery())
  }, [filter])

  const renderStatus: Record<string, string> = {
    ONGOING: 'Đang kiểm kê',
    FINISHED: 'Đã hoàn thành',
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
        return formatDateTime(params.value)
      },
    },
    {
      field: 'warehouse',
      headerName: 'Tên kho',
      minWidth: 230,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.value.name
      },
    },
    {
      field: 'user',
      headerName: 'Người lập',
      headerAlign: 'left',
      align: 'left',
      minWidth: 250,
      renderCell: (params) => {
        return params.value.fullName
      },
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
            label={renderStatus[params.value as string]}
            variant='filled'
            color={params.value === 'ONGOING' ? 'primary' : 'secondary'}
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
              setInventorySelected(params.row as InventoryType)
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
                `/admin/inventory/detail?inventoryId=${params.row.id}`
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
    AVAILABLE: 'Sẵn có',
    BORROWED: 'Đang mượn',
    LOST: 'Thất lạc',
    DAMAGED: 'Hỏng',
    NEED_REPAIR: 'Cần sửa chữa',
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
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Chip
            label={
              renderLabelStatus[params.row.registrationUnique.status as string]
            }
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
                value: 'ONGOING',
                label: 'Đang kiểm kê',
              },
              { value: 'FINISHED', label: 'Đã hoàn thành' },
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
          Thêm phiếu kiểm kê
        </Button>
      </div>
      <div className='mt-5'>
        <Box>
          <TableCustom
            rows={inventories}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={inventories.length}
          />
        </Box>
      </div>
      {openModalViewDetail && (
        <DialogCustom
          title={'Chi tiết phiếu kiểm kê'}
          isModalOpen={openModalViewDetail}
          setIsModalOpen={setOpenModalViewDetail}
          handleLogicCancel={() => console.log('cancel')}
          width={800}
          children={
            <TableCustom
              rows={inventorySelected?.inventoryCheckDetails ?? []}
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
