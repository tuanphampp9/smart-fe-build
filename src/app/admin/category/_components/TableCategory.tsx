import { handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_CATEGORIES } from '@/store/action-saga/common'
import { setCategorySelected } from '@/store/slices/categorySlice'
import { RootState } from '@/store/store'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import { Popconfirm } from 'antd'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { deleteCategory } from '@/apiRequest/categoryApi'
import { toast } from 'react-toastify'
import { StyledTextField } from '@/styles/commonStyle'
import SearchIcon from '@mui/icons-material/Search'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
export interface ITableCategoryProps {}

export default function TableCategory(props: ITableCategoryProps) {
  const loading = useSelector((state: RootState) => state.category.loading)
  const [name, setName] = React.useState<string>('')
  const listCategories = useSelector(
    (state: RootState) => state.category.listCategories
  )
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.category.pageInfo)
  const fetchListCategories = (
    page: number,
    size: number,
    name: string = ''
  ) => {
    dispatch({
      type: GET_LIST_CATEGORIES,
      payload: { page, itemPerPage: size, filter: `name like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListCategories(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListCategories(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListCategories(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tên Thể loại',
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
              dispatch(setCategorySelected(params.row))
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
            description={`Bạn có chắc chắn muốn xóa thể loại: ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeleteCategory(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await deleteCategory(id)
      fetchListCategories(pageInfo.page, pageInfo.itemPerPage)
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
          placeholder='Nhập tên thể loại cần tìm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListCategories(1, pageInfo.itemPerPage, name)
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
            rows={listCategories}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listCategories.length}
          />
        </Box>
      </div>
    </div>
  )
}
