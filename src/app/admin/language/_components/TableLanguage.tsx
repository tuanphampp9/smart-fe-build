import { deleteLanguage } from '@/apiRequest/languageApi'
import PaginationCustom from '@/components/PaginationCustom'
import TableCustom from '@/components/TableCustom'
import { handleErrorCode } from '@/lib/utils/common'
import { GET_LIST_LANGUAGES } from '@/store/action-saga/common'
import { setLanguageSelected } from '@/store/slices/languageSlice'
import { RootState } from '@/store/store'
import { StyledTextField } from '@/styles/commonStyle'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Popconfirm } from 'antd'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

export interface ITableLanguageProps {}

export default function TableLanguage(props: ITableLanguageProps) {
  const loading = useSelector((state: RootState) => state.language.loading)
  const [name, setName] = React.useState<string>('')
  const listLanguages = useSelector(
    (state: RootState) => state.language.listLanguages
  )
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.language.pageInfo)
  const fetchListLanguages = (
    page: number,
    size: number,
    name: string = ''
  ) => {
    dispatch({
      type: GET_LIST_LANGUAGES,
      payload: { page, itemPerPage: size, filter: `name like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListLanguages(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListLanguages(1, perPage)
  }
  React.useEffect(() => {
    // call api get list readers
    fetchListLanguages(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Ký hiệu ngôn ngữ',
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
              dispatch(setLanguageSelected(params.row))
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
            description={`Bạn có chắc chắn muốn xóa ngôn ngữ: ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeleteLanguage(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeleteLanguage = async (id: string) => {
    try {
      const res = await deleteLanguage(id)
      fetchListLanguages(pageInfo.page, pageInfo.itemPerPage)
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
          placeholder='Nhập ký hiệu ngôn ngữ muốn tìm kiếm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListLanguages(1, pageInfo.itemPerPage, name)
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
            rows={listLanguages}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listLanguages.length}
          />
        </Box>
      </div>
    </div>
  )
}
