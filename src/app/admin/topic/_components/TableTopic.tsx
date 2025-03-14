'use client'
import { handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton } from '@mui/material'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GET_LIST_TOPICS } from '@/store/action-saga/common'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import { setTopicSelected } from '@/store/slices/topicSlice'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Popconfirm } from 'antd'
import { deleteTopic } from '@/apiRequest/topicApi'
import { toast } from 'react-toastify'
export interface ITableTopicProps {}

export default function TableTopic(props: ITableTopicProps) {
  const loading = useSelector((state: RootState) => state.topic.loading)
  const [name, setName] = useState<string>('')
  const listTopics = useSelector((state: RootState) => state.topic.listTopics)
  const dispatch = useDispatch()
  const pageInfo = useSelector((state: RootState) => state.topic.pageInfo)
  const fetchListTopics = (page: number, size: number, name: string = '') => {
    dispatch({
      type: GET_LIST_TOPICS,
      payload: { page, itemPerPage: size, filter: `name like '%${name}%'` },
    })
  }

  const getPaginatedTableRows = (selected: number) => {
    try {
      fetchListTopics(selected, pageInfo.itemPerPage)
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = (perPage: number) => {
    fetchListTopics(1, perPage)
  }
  useEffect(() => {
    // call api get list readers
    fetchListTopics(1, pageInfo.itemPerPage)
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tên chủ đề',
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
              dispatch(setTopicSelected(params.row))
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
            description={`Bạn có chắc chắn muốn xóa chủ đề ${params.row.name} không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeleteTopic(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]
  const handleDeleteTopic = async (id: string) => {
    try {
      const res = await deleteTopic(id)
      fetchListTopics(pageInfo.page, pageInfo.itemPerPage)
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
          placeholder='Nhập tên chủ đề cần tìm'
          className='!mt-1'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchListTopics(1, pageInfo.itemPerPage, name)
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
            rows={listTopics}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listTopics.length}
          />
        </Box>
      </div>
    </div>
  )
}
