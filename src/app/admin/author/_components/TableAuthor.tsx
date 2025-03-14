import { formatDate, handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_AUTHORS } from '@/store/action-saga/common'
import { setAuthorSelected } from '@/store/slices/authorSlice'
import { RootState } from '@/store/store'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import { Popconfirm } from 'antd'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { toast } from 'react-toastify'
import { deleteAuthor } from '@/apiRequest/authorApi'
import { StyledTextField } from '@/styles/commonStyle'
import SearchIcon from '@mui/icons-material/Search'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
export interface ITableAuthorProps {}

export default function TableAuthor(props: ITableAuthorProps) {
  const loading = useSelector((state: RootState) => state.author.loading)
  const [fullName, setFullName] = React.useState<string>('')
  const listAuthors = useSelector(
    (state: RootState) => state.author.listAuthors
  )
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.author.pageInfo)
  const fetchListAuthors = (page: number, size: number, name: string = '') => {
    dispatch({
      type: GET_LIST_AUTHORS,
      payload: { page, itemPerPage: size, filter: `fullName like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListAuthors(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListAuthors(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListAuthors(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Ảnh',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div className='p-2'>
            <img
              src={params.value}
              alt={params.row.fullName}
              className='w-20 object-cover'
            />
          </div>
        )
      },
    },
    {
      field: 'fullName',
      headerName: 'Họ và tên',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'penName',
      headerName: 'Bút danh',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'homeTown',
      headerName: 'Quê quán',
      headerAlign: 'left',
      align: 'left',
      minWidth: 200,
    },
    {
      field: 'introduction',
      headerName: 'Giới thiệu',
      headerAlign: 'left',
      align: 'left',
      minWidth: 350,
    },
    {
      field: 'dob',
      headerName: 'Ngày sinh',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return formatDate(params.value)
      },
    },
    {
      field: 'dod',
      headerName: 'Ngày mất',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return formatDate(params.value)
      },
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
              dispatch(setAuthorSelected(params.row))
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
            description={`Bạn có chắc chắn muốn xóa tác giả: ${params.row.fullName} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeleteAuthor(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeleteAuthor = async (id: string) => {
    try {
      const res = await deleteAuthor(id)
      fetchListAuthors(pageInfo.page, pageInfo.itemPerPage)
      toast.success('Xóa tác giả thành công')
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
          placeholder='Nhập tên tác giả cần tìm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListAuthors(1, pageInfo.itemPerPage, fullName)
            }
          }}
          sx={{
            maxWidth: '400px',
          }}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
            rows={listAuthors}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listAuthors.length}
          />
        </Box>
      </div>
    </div>
  )
}
