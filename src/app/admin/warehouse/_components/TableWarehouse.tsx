import { deleteWarehouse } from '@/apiRequest/warehouseApi'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_WAREHOUSES } from '@/store/action-saga/common'
import { setWarehouseSelected } from '@/store/slices/warehouseSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Popconfirm } from 'antd'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
export interface ITableWarehouseProps {}

export default function TableWarehouse(props: ITableWarehouseProps) {
  const loading = useSelector((state: RootState) => state.warehouse.loading)
  const [name, setName] = React.useState<string>('')
  const listWarehouses = useSelector(
    (state: RootState) => state.warehouse.listWarehouses
  )
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.warehouse.pageInfo)
  const fetchListWarehouses = (
    page: number,
    size: number,
    name: string = ''
  ) => {
    dispatch({
      type: GET_LIST_WAREHOUSES,
      payload: { page, itemPerPage: size, filter: `name like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListWarehouses(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListWarehouses(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListWarehouses(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tên kho',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'type',
      headerName: 'Loại kho',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'numberOfPublications',
      headerName: 'Số ấn phẩm',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'edit',
      headerName: 'Sửa',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              dispatch(setWarehouseSelected(params.row))
            }}
          >
            <PanToolAltIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Popconfirm
            title='Thông báo'
            description={`Bạn có chắc chắn muốn xóa kho: ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeleteWarehouse(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeleteWarehouse = async (id: string) => {
    try {
      const res = await deleteWarehouse(id)
      fetchListWarehouses(pageInfo.page, pageInfo.itemPerPage)
      toast.success('Xóa thể loại thành công')
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  return (
    <div>
      <div className='flex justify-between items-center'>
        <StyledTextField
          margin='normal'
          fullWidth
          type='text'
          placeholder='Nhập tên kho cần tìm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListWarehouses(1, pageInfo.itemPerPage, name)
            }
          }}
          sx={{
            maxWidth: '400px',
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <SearchIcon />,
            },
          }}
        />
      </div>
      <div>
        <Box>
          <TableCustom
            rows={listWarehouses}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listWarehouses.length}
          />
        </Box>
      </div>
    </div>
  )
}
