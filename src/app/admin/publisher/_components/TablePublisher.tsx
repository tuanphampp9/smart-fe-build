import { handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_PUBLISHERS } from '@/store/action-saga/common'
import { setPublisherSelected } from '@/store/slices/publisherSlice'
import { RootState } from '@/store/store'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Popconfirm } from 'antd'
import { deletePublisher } from '@/apiRequest/publisherApi'
import { toast } from 'react-toastify'
import { StyledTextField } from '@/styles/commonStyle'
import SearchIcon from '@mui/icons-material/Search'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
export interface ITablePublisherProps {}

export default function TablePublisher(props: ITablePublisherProps) {
  const loading = useSelector((state: RootState) => state.publisher.loading)
  const [name, setName] = React.useState<string>('')
  const listPublishers = useSelector(
    (state: RootState) => state.publisher.listPublishers
  )
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.publisher.pageInfo)
  const fetchListPublishers = (
    page: number,
    size: number,
    name: string = ''
  ) => {
    dispatch({
      type: GET_LIST_PUBLISHERS,
      payload: { page, itemPerPage: size, filter: `name like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListPublishers(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListPublishers(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListPublishers(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tên nhà xuất bản',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
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
              dispatch(setPublisherSelected(params.row))
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
            description={`Bạn có chắc chắn muốn xóa nhà xuất bản: ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeletePublisher(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeletePublisher = async (id: string) => {
    try {
      const res = await deletePublisher(id)
      fetchListPublishers(pageInfo.page, pageInfo.itemPerPage)
      toast.success('Xóa chủ đề thành công')
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
          placeholder='Nhập tên nhà xuất bản'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListPublishers(1, pageInfo.itemPerPage, name)
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
            rows={listPublishers}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listPublishers.length}
          />
        </Box>
      </div>
    </div>
  )
}
