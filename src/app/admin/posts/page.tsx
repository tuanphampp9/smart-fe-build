'use client'
import { deletePost, getListPosts } from '@/apiRequest/postApi'
import { pageInfo } from '@/lib/types/commonType'
import { postType } from '@/lib/types/postType'
import { formatDate, handleErrorCode } from '@/lib/utils/common'
import { StyledTextField } from '@/styles/commonStyle'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableCustom from '@/components/TableCustom'
import PaginationCustom from '@/components/PaginationCustom'
import DialogCustom from '@/components/DialogCustom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Popconfirm, Select } from 'antd'
import EditIcon from '@mui/icons-material/Edit'
import { toast } from 'react-toastify'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import 'react-quill-new/dist/quill.snow.css'
import debounce from 'debounce'
export interface IListPostsProps {}

export default function ListPosts(props: IListPostsProps) {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [filter, setFilter] = React.useState<{
    postType: string
  }>({
    postType: '',
  })
  const [openModalViewContent, setOpenModalViewDetail] = React.useState(false)
  const [postSelected, setPostSelected] = React.useState<postType | null>(null)
  const [listPosts, setListPosts] = React.useState<postType[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [pageInfo, setPageInfo] = React.useState<pageInfo>({
    page: 1,
    itemPerPage: 5,
    totalItem: 0,
    totalPage: 0,
  })
  const buildQuery = (title: string) => {
    let query = title ? `title like '%${title}%'` : ''
    let prefix = title ? ' and' : ''
    if (filter.postType) {
      query += `${prefix} postType: '${filter.postType}'`
    }
    return query
  }
  const fetchListPosts = async (page: number, size: number, filter: string) => {
    try {
      setLoading(true)
      const res = await getListPosts(page, size, filter)
      setPageInfo({
        page: res.data.meta.page,
        itemPerPage: res.data.meta.pageSize,
        totalItem: res.data.meta.total,
        totalPage: res.data.meta.pages,
      })
      setListPosts(res.data.result)
    } catch (error: any) {
      handleErrorCode(error)
    } finally {
      setLoading(false)
    }
  }

  const getPaginatedTableRows = async (selected: number) => {
    try {
      await fetchListPosts(selected, pageInfo.itemPerPage, buildQuery(title))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }
  const handleChangePerPage = async (perPage: number) => {
    await fetchListPosts(1, perPage, buildQuery(title))
  }
  React.useEffect(() => {
    // call api get list posts
    fetchListPosts(1, pageInfo.itemPerPage, buildQuery(title))
  }, [filter])

  const renderType: Record<string, string> = {
    INTRODUCTION_PUBLICATION: 'Giới thiệu ấn phẩm',
    EVENTS: 'Sự kiện',
    NEWS: 'Tin tức',
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return formatDate(params.value as string)
      },
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'postType',
      headerName: 'Loại bài đăng',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return renderType[params.value as keyof typeof renderType]
      },
    },
    {
      field: 'content',
      headerName: 'Nội dung',
      headerAlign: 'left',
      align: 'left',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <RemoveRedEyeIcon
            onClick={() => {
              setOpenModalViewDetail(true)
              setPostSelected(params.row as postType)
            }}
            className='cursor-pointer'
          />
        )
      },
    },
    {
      field: 'viewCount',
      headerName: 'Lượt xem',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'edit',
      headerName: 'Sửa',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              router.push(`/admin/posts/detail?postId=${params.row.id}`)
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
    {
      field: 'delete',
      headerName: 'Xoá',
      headerAlign: 'left',
      renderCell: (params) => {
        return (
          <Popconfirm
            title='Thông báo'
            description={`Bạn có chắc chắn muốn xóa tin này không?`}
            okText='Có'
            cancelText='Không'
            overlayStyle={{
              maxWidth: '300px',
            }}
            onConfirm={() => handleDeletePost(params.row.id)}
          >
            <DeleteOutlineIcon className='cursor-pointer' color='error' />
          </Popconfirm>
        )
      },
    },
  ]

  const handleDeletePost = async (id: string) => {
    try {
      // call api delete publication
      const res = await deletePost(id)
      // show message delete success
      toast.success('Xóa tin tức thành công')
      // fetch list publications
      fetchListPosts(pageInfo.page, pageInfo.itemPerPage, buildQuery(title))
    } catch (error: any) {
      handleErrorCode(error)
    }
  }

  const handleSearchPost = React.useCallback(
    debounce((title: string) => {
      fetchListPosts(pageInfo.page, pageInfo.itemPerPage, buildQuery(title))
    }, 500),
    [filter]
  )
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <StyledTextField
            margin='normal'
            fullWidth
            type='text'
            placeholder='Nhập tiêu đề'
            className='!mt-1'
            sx={{
              maxWidth: '400px',
            }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              handleSearchPost(e.target.value)
            }}
            slotProps={{
              input: {
                endAdornment: <SearchIcon />,
              },
            }}
          />
          <Select
            style={{ width: 300 }}
            onChange={(value) => {
              setFilter({ ...filter, postType: value })
            }}
            defaultValue={''}
            options={[
              { value: '', label: 'Tất cả' },
              {
                value: 'INTRODUCTION_PUBLICATION',
                label: 'Giới thiệu ấn phẩm',
              },
              { value: 'EVENTS', label: 'Sự kiện' },
              { value: 'NEWS', label: 'Tin tức' },
            ]}
          />
        </div>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          onClick={() => {
            router.push('/admin/posts/detail')
          }}
        >
          Thêm tin
        </Button>
      </div>
      <div>
        <Box>
          <TableCustom
            rows={listPosts}
            columns={columns}
            checkboxSelection={false}
            isLoading={loading}
          />
          <PaginationCustom
            pageInfo={pageInfo}
            getPaginatedTableRows={getPaginatedTableRows}
            onChangePerPage={handleChangePerPage}
            lengthItem={listPosts.length}
          />
        </Box>
      </div>
      {openModalViewContent && (
        <DialogCustom
          title={'Nội dung bài viết'}
          isModalOpen={openModalViewContent}
          setIsModalOpen={setOpenModalViewDetail}
          handleLogicCancel={() => console.log('cancel')}
          width={800}
          children={
            <div className='ql-snow'>
              <div
                className='ql-editor'
                dangerouslySetInnerHTML={{
                  __html: postSelected?.content || '',
                }}
              ></div>
            </div>
          }
        />
      )}
    </div>
  )
}
